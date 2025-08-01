"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { googleProvider, auth } from "@/lib/firebase";
import { githubProvider } from "@/lib/firebase";
import { signInWithRedirect } from "firebase/auth"; // Import for GitHub login
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { saveUserToFirestore } from "@/lib/firestore-helpers"; // 👈 Add this
import Loader from "@/components/loader"; // Import the Loader component

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // 👈 Add this line
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      localStorage.setItem("token", token);

      // ✅ Save user to Firestore
      const { uid, displayName, email } = result.user;
      if (email && displayName) {
        await saveUserToFirestore(uid, displayName, email);
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const githubProvider = new GithubAuthProvider();
  githubProvider.setCustomParameters({
    allow_signup: "false", // optional, prevent new account creation
    prompt: "consent", // 👈 forces popup every time
  });

  const handleGitHubLogin = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const token = await result.user.getIdToken();
      localStorage.setItem("token", token);

      const { uid, email } = result.user;
      let displayName = result.user.displayName;

      // ⬇️ Fetch full GitHub profile name using access token
      const credential = GithubAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken;

      if (accessToken) {
        const response = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: `token ${accessToken}`,
          },
        });
        const githubData = await response.json();

        // If GitHub name exists, use it instead of fallback
        if (githubData?.name) {
          displayName = githubData.name;
        }
      }

      // ✅ Save correct name & email to Firestore
      if (email && displayName) {
        await saveUserToFirestore(uid, displayName, email);
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("GitHub login error:", error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // ✅ Get Firebase token
      const token = await userCredential.user.getIdToken();

      // ✅ Store token in localStorage
      localStorage.setItem("token", token);

      // ✅ Redirect to dashboard
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        setError(err.message); // Or a custom message like: "Invalid email or password"
      } else {
        console.error("Unknown error", err);
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="grid gap-6">
                <div className="flex flex-col gap-4">
                  {error && (
                    <p className="text-sm text-red-500 text-center">{error}</p>
                  )}
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center"></div>
                  <div className="grid gap-3">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-3">
                    <div className="flex items-center"></div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password" // Placeholder text for password input, can be adjusted as
                        required
                        className="pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Link
                    href="/forgot"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>

                  <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                    <span className="bg-card text-muted-foreground relative z-10 px-2">
                      Or continue with
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleLogin}
                  >
                    {/* Google logo */}
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 533.5 544.3"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="#4285F4"
                        d="M533.5 278.4c0-18.5-1.5-37-4.7-54.7H272v103.6h146.9c-6.3 34.3-25.5 63.4-54.5 83.1v68h88.3c51.6-47.5 80.8-117.5 80.8-200z"
                      />
                      <path
                        fill="#34A853"
                        d="M272 544.3c73.8 0 135.7-24.5 181-66.7l-88.3-68c-24.5 16.3-56 25.8-92.7 25.8-71.2 0-131.6-48-153.2-112.3H27.8v70.6C73.7 478 166.3 544.3 272 544.3z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M118.8 322.9c-10.6-31.5-10.6-65.3 0-96.8V155.5H27.8c-36 71.6-36 157.4 0 229l91-61.6z"
                      />
                      <path
                        fill="#EA4335"
                        d="M272 107.4c39.9 0 75.8 13.7 104 40.6l78-78C406.7 24.5 344.8 0 272 0 166.3 0 73.7 66.2 27.8 155.5l91 70.6C140.4 155.4 200.8 107.4 272 107.4z"
                      />
                    </svg>
                    Login with Google
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleGitHubLogin}
                  >
                    {/* GitHub logo */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 fill-black dark:fill-white"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303
  3.438 9.8 8.205 11.387.6.113.82-.258.82-.577
  0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61
  -.546-1.387-1.333-1.757-1.333-1.757-1.087-.744.084-.729.084-.729
  1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.305 3.495.998
  .108-.776.418-1.305.762-1.605-2.665-.3-5.466-1.335-5.466-5.93
  0-1.31.47-2.38 1.236-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322
  3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3
  .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176
  .765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475
  5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015
  3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592
  24 12.297c0-6.627-5.373-12-12-12"
                      />
                    </svg>
                    Login with GitHub
                  </Button>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </div>

                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="underline underline-offset-4">
                    Sign up
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
}
