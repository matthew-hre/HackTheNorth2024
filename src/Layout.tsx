import { ReactNode } from "react";
import { ThemeToggle } from "./components/ThemeToggle";
import { AppWindow } from "lucide-react";

export function Layout({
  menu,
  children,
}: {
  menu?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex min-h-20 border-b bg-background/80 backdrop-blur">
        <nav className="container w-full max-w-screen-lg justify-between flex flex-row items-center gap-6">
          <div className="flex items-center gap-6 md:gap-10">
            <a href="/" className="flex flex-row gap-2">
              <AppWindow className="h-6 w-6" />
              <h1 className="text-base font-semibold">Tabinator</h1>
            </a>
          </div>
          {menu}
        </nav>
      </header>
      <main className="flex grow flex-col items-center overflow-hidden">
        {children}
      </main>
      <footer className="border-t hidden sm:flex w-full justify-center">
        <div className="flex flex-row justify-between w-full max-w-screen-lg px-8 my-4">
          <div className="text-sm leading-loose">
            Built with ❤️ at Hack the North 2024. Powered by{" "}
            <FooterLink href="https://www.convex.dev/">Convex</FooterLink>,{" "}
            <FooterLink href="https://vitejs.dev">Vite</FooterLink>,{" "}
            <FooterLink href="https://react.dev/">React</FooterLink> and{" "}
            <FooterLink href="https://ui.shadcn.com/">shadcn/ui</FooterLink>.
          </div>
          <ThemeToggle />
        </div>
      </footer>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="underline underline-offset-4 hover:no-underline"
      target="_blank"
    >
      {children}
    </a>
  );
}
