import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SocialSignIn } from "./social-signin";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

interface AuthFormProps {
  type: "login" | "signup";
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onGoogleSignIn: () => void;
  onGithubSignIn: () => void;
  error?: string;
  isLoading: boolean;
}

export function AuthForm({
  type,
  onSubmit,
  onGoogleSignIn,
  onGithubSignIn,
  error,
  isLoading,
}: AuthFormProps) {
  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        {type === "signup" && (
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" type="text" required />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" name="email" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" name="password" required />
        </div>
        {type === "signup" && (
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              name="confirm-password"
              type="password"
              required
            />
          </div>
        )}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Loading..." : type === "login" ? "Log in" : "Sign up"}
        </Button>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-muted" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          console.log(credentialResponse);
          const res = await fetch("/auth/google-login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: credentialResponse.credential,
            }),
          });
          const data = await res.json();
          console.log(data);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />

      <SocialSignIn
        onGoogleSignIn={onGoogleSignIn}
        onGithubSignIn={onGithubSignIn}
      />
    </div>
  );
}
