import { ReactNode } from "react";

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
            <a href="/">
              <h1 className="text-base font-semibold">Tabifier</h1>
            </a>
          </div>
          {menu}
        </nav>
      </header>
      <main className="flex grow flex-col items-center overflow-hidden">
        {children}
      </main>
      <footer className="border-t hidden sm:block">
        <div className="container py-4 text-sm leading-loose">
          Built with ❤️ at Hack the North 2024. Powered by{" "}
          <FooterLink href="https://www.convex.dev/">Convex</FooterLink>,{" "}
          <FooterLink href="https://vitejs.dev">Vite</FooterLink>,{" "}
          <FooterLink href="https://react.dev/">React</FooterLink> and{" "}
          <FooterLink href="https://ui.shadcn.com/">shadcn/ui</FooterLink>.
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
