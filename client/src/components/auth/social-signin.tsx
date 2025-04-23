import { Button } from "@/components/ui/button";

import { useGoogleLogin, CodeResponse } from "@react-oauth/google"; // Import CodeResponse type

export function SocialSignIn() {
  const login = useGoogleLogin({
    flow: "auth-code",
    // The redirect_uri should typically be 'postmessage' for SPAs
    // This tells Google to send the authorization code back to the calling window via postMessage
    redirect_uri: "postmessage", // Make sure this is configured in your Google Cloud Console
    // Optionally request offline access if you need refresh tokens
    // access_type: 'offline', // uncomment if needed

    onSuccess: async (codeResponse: CodeResponse) => {
      // Expect CodeResponse now
      console.log("Authorization Code Response:", codeResponse);
      // Send the 'code' to your backend
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/google-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: codeResponse.code, // Send the authorization code
          }),
        }
      );
      const data = await res.json();
      console.log("Backend Response:", data);
      // Handle successful login from your backend response (e.g., store JWT)
    },
    onError: (errorResponse) => {
      // Use errorResponse for more details
      console.error("Login Failed:", errorResponse);
    },
  });
  return (
    <div className="w-full">
      <Button variant="outline" onClick={() => login()} className="w-full">
        <svg
          className="mr-2 h-4 w-4"
          aria-hidden="true"
          focusable="false"
          data-prefix="fab"
          data-icon="google"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 488 512"
        >
          <path
            fill="currentColor"
            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
          ></path>
        </svg>
        Google
      </Button>
    </div>
  );
}
