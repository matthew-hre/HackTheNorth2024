import { Layouts } from "@/Layouts/Layouts";
import { Layout } from "@/Layout";
import { SignInForm } from "@/SignInForm";
import { UserMenu } from "@/components/UserMenu";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import SignInWithGitHub from "@/components/GithubButton";

export default function App() {
  const user = useQuery(api.users.viewer);
  return (
    <Layout
      menu={
        <>
          <Authenticated>
            <UserMenu userImage={user?.image || ""}>
              {user?.name ?? user?.email}
            </UserMenu>
          </Authenticated>
          <Unauthenticated>
            <SignInWithGitHub title={"Sign In"} />
          </Unauthenticated>
        </>
      }
    >
      <>
        <Authenticated>
          <Layouts viewer={(user ?? {})._id!} />
        </Authenticated>
        <Unauthenticated>
          <SignInForm />
        </Unauthenticated>
      </>
    </Layout>
  );
}
