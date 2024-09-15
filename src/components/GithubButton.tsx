import { useAuthActions } from "@convex-dev/auth/react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";

export default function SignInWithGitHub({ title }: { title?: string }) {
  const { signIn } = useAuthActions();
  return (
    <Button
      className="max-w-lg"
      // variant="outline"
      type="button"
      onClick={() => void signIn("github")}
    >
      <GitHubLogoIcon className="mr-2 h-4 w-4" /> {title}
    </Button>
  );
}
