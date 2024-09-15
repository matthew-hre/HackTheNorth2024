import { Button } from "@/components/ui/button";
import { Highlight } from "./components/ui/hero-highlight";
import SignInWithGitHub from "@/components/GithubButton";

import { Globe, Repeat, Scale3D } from "lucide-react";

export function SignInForm() {
  return (
    <div className="flex flex-col mt-24 gap-6">
      <div className="flex flex-col items-center space-y-4 pt-24">
        <div className="flex flex-col text-3xl lg:text-5xl leading-[2rem] mx-auto w-full max-w-2xl items-center sm:block sm:text-left">
          <div className="mb-3">Time to pick up</div>
          <Highlight className="mt-4">right where you left off.</Highlight>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl text-center sm:text-left">
          Seamlessly save and restore your window states across all your
          devices. No more losing your place when switching between computers.
        </p>
        <div className="flex flex-row sm:justify-start justify-center gap-4 max-w-2xl w-full pb-10">
          <SignInWithGitHub title={"Get started with GitHub"} />
          <Button variant="secondary">
            <a href="#">Learn More</a>
          </Button>
        </div>
        <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
      </div>
      <div className="mx-auto flex flex-col w-full my-auto gap-4 pb-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-4 items-center">
            <Scale3D className="text-2xl" />
            <div className="flex flex-col">
              <div className="text-lg font-semibold">Context</div>
              <div className="text-muted-foreground">
                Save not just your tabs, but your entire window state.
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-4 items-center">
            <Repeat className="text-2xl" />
            <div className="flex flex-col">
              <div className="text-lg font-semibold">Sync</div>
              <div className="text-muted-foreground">
                Seamlessly sync your window states across all your devices.
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-4 items-center">
            <Globe className="text-2xl" />
            <div className="flex flex-col">
              <div className="text-lg font-semibold">Cross-Platform</div>
              <div className="text-muted-foreground">
                Works on Windows, Mac, and Linux.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
