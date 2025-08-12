import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleTransition, setGoogleTransition] = useTransition();
  const [githubTransition, setGithubTransition] = useTransition();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    field: keyof typeof formData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setFormErrors((prev) => {
      const updated = { ...prev };
      delete updated[field as string];
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    let errors: Record<string, string> = {};
    if (!formData.email) {
      errors.email = "Email is required";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    }
    setFormErrors(errors);
    if (Object.values(errors).length > 0) {
      toast.error(Object.values(errors)[0]);
      return;
    }

    setLoading(true);
    try {
      // Call your login API here
      await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        callbackURL: "/home",
        // fetchOptions: {
        //   onSuccess: () => {
        //     toast.success("Login successful!");
        //     router.push("/home");
        //   },
        //   onError: (error: any) => {
        //     toast.error(error?.message || "Failed to login.");
        //   }
        // }
      });
    } catch (error: any) {
      toast.error(error?.message || "Failed to login.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginWithGoogle = async () => {
    setGoogleTransition(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/home",
        fetchOptions: {
          onSuccess: () => router.push("/home"),
          onError: (error) => {
             toast.error("internal server error");
          }
        },
      });
    });
  };

  const handleLoginWithGitHub = async () => {
    setGithubTransition(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/home",
        fetchOptions: {
          onSuccess: () => router.push("/home"),
          onError: (error) => {
              toast.error("internal server error");
          }
        },
      });
    });
  };

  return (
    <form
      className={cn(
        "w-full max-w-md flex flex-col gap-6 bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-md",
        className
      )}
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold ">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          login into your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            disabled={loading}
          />
          {formErrors.email && (
            <span className="text-red-500 text-xs">{formErrors.email}</span>
          )}
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            disabled={loading}
          />
          {formErrors.password && (
            <span className="text-red-500 text-xs">{formErrors.password}</span>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <div className="grid gap-3">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            type="button"
            onClick={handleLoginWithGoogle}
            disabled={googleTransition}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
            {googleTransition ? "Signing in with Google..." : "Sign in with Google"}
          </Button>

          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            type="button"
            onClick={handleLoginWithGitHub}
            disabled={githubTransition}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-5 h-5"
              fill="currentColor"
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            {githubTransition ? "Signing in with GitHub..." : "Sign in with GitHub"}
          </Button>
        </div>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="/register" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </form>
  );
}