import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

type UserPayload = {
  id: string;
  email: string;
  name: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("token::", token);

  if (!token) {
    res.status(401).json({
      success: false,
      message: "No auth token provided",
    });
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    // console.log(payload);
    req.user = payload as UserPayload;
    next();
  } catch (error) {
    console.log("Error verifying token:", error);
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }
};
