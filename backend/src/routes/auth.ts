import db from "../db";
import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const authRouter = Router();

authRouter.post("/login", async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  console.log("email", email);
  console.log("password", password);

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required.",
    });
  }

  const user = await db.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const passwordMatch = await bcrypt.compare(password, user.password as string);

  if (!passwordMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "30d",
  });

  return res.status(201).json({
    ...payload,
    token,
    success: true,
  });
});

authRouter.post(
  "/signup",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({
          success: false,
          message: "Email, password, and name are required.",
        });
      }

      const existingUser = await db.user.findFirst({
        where: { email },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "User with this email already exists.",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await db.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });

      const payload = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: "30d",
      });

      return res.status(201).json({
        success: true,
        message: "User created successfully.",
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        },
        token,
      });
    } catch (error) {
      console.error("Error in signup:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }
);

import { OAuth2Client } from "google-auth-library"; // Ensure this is imported

console.log(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);

// Configure the OAuth2Client with redirect_uri
const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage"
  // This redirect_uri MUST match the one you configured in your Google Cloud Console
  // for the "Web application" OAuth 2.0 Client ID, under "Authorized redirect URIs".
  // If you used 'postmessage' in the frontend, you might not need to explicitly set it here,
  // as the library can handle it, but it's good practice to be explicit if possible or
  // if you encounter issues. For SPAs with 'postmessage', the library often manages this.
  // Let's keep it simple first without explicit redirectUri here, as the library might infer.
  // If issues persist, check Google Cloud Console config and potentially add the redirectUri here.
);

// ... (Your existing /login and /signup routes) ...

authRouter.post(
  "/google-login",
  async (req: Request, res: Response): Promise<any> => {
    try {
      // Expect 'code' from the frontend
      const { code } = req.body;

      if (!code) {
        return res.status(400).json({
          success: false,
          message: "Authorization code is required.",
        });
      }

      // 1. Exchange the authorization code for tokens
      const { tokens } = await googleClient.getToken(code);
      // The 'tokens' object will contain id_token, access_token, expires_in, etc.
      console.log("Tokens received from Google:", tokens);

      // 2. Verify the ID Token
      // The ID token is what contains the user's identity information
      if (!tokens.id_token) {
        return res.status(500).json({
          success: false,
          message: "ID token not received from Google.",
        });
      }

      const ticket = await googleClient.verifyIdToken({
        idToken: tokens.id_token, // Verify the ID token
        audience: process.env.GOOGLE_CLIENT_ID, // Ensure audience matches your client ID
      });

      const payload = ticket.getPayload(); // Get the verified payload
      if (!payload) {
        return res.status(500).json({
          success: false,
          message: "Failed to get payload from ID token.",
        });
      }

      const email = payload.email;
      const name = payload.name || "";
      const googleId = payload.sub; // 'sub' is the unique Google User ID
      const picUrl = payload.picture;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email not found in Google ID token payload.",
        });
      }

      console.log("Verified ID Token Payload:", payload);

      // 3. Find or create user in your database
      let user = await db.user.findFirst({
        where: {
          email,
        },
      });

      if (!user) {
        // Create new user if they don't exist
        user = await db.user.create({
          data: {
            email,
            name: name || email.split("@")[0],
            avatar_url: picUrl || "",
            // Note: For social logins, you might not require a password.
            // If your schema requires it, handle it appropriately (e.g., set a flag, generate a random one).
            // Setting an empty string might violate database constraints or logic elsewhere.
            // Consider making the password field nullable in your schema for social logins.
            password: "", // Adjust based on your schema and requirements for social users
            // Maybe add a field like 'is_social: true' or 'login_method: "google"'
          },
        });
        console.log("New user created:", user);
      } else {
        console.log("Existing user found:", user);
        // Optional: Update user name from Google if it's empty or different
        // if (!user.name && name) {
        //     await db.user.update({
        //         where: { id: user.id },
        //         data: { name: name }
        //     });
        // }
      }

      // 4. Find or create identity provider record
      let identityProvider = await db.identityProvider.findFirst({
        where: {
          provider: "google",
          provider_id: googleId, // Use the 'sub' as provider_id
        },
      });

      if (!identityProvider) {
        identityProvider = await db.identityProvider.create({
          data: {
            user_id: user.id,
            provider: "google",
            provider_id: googleId,
            email: email, // Store the email from the ID token
            // Store the access_token and optionally refresh_token if needed for API calls
            access_token: tokens.access_token || "",
            refresh_token: tokens.refresh_token || null, // Only present if access_type: 'offline' was requested
            scopes: tokens.scope ? tokens.scope.split(" ") : [], // Store granted scopes
          },
        });
        console.log("New identity provider created:", identityProvider);
      } else {
        // Update access token and refresh token
        identityProvider = await db.identityProvider.update({
          where: {
            id: identityProvider.id,
          },
          data: {
            access_token: tokens.access_token || identityProvider.access_token, // Update if new token received
            refresh_token:
              tokens.refresh_token || identityProvider.refresh_token, // Update if new token received
            scopes: tokens.scope
              ? tokens.scope.split(" ")
              : identityProvider.scopes,
            // Also update email if needed? payload.email might be more reliable.
            email: email,
          },
        });
        console.log("Identity provider updated:", identityProvider);
      }

      // 5. Generate your own JWT for the authenticated user
      const jwtPayload = {
        id: user.id,
        email: user.email,
        name: user.name,
      };

      const jwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRET!, {
        expiresIn: "30d", // Token expires in 30 days
      });

      // 6. Send response to the frontend
      return res.status(200).json({
        ...jwtPayload,
        token: jwtToken, // Your application's JWT
        success: true,
      });
    } catch (error) {
      console.error("Error in Google login:", error);

      // Provide a more informative error message in production
      const errorMessage =
        process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.message
            : "Unknown error"
          : "Authentication failed";

      return res.status(500).json({
        success: false,
        message: `Internal server error: ${errorMessage}`, // Include error message in dev
      });
    }
  }
);

export default authRouter;
