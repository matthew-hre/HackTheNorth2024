import { ReactNode } from "react";

export function LayoutList({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap gap-8 p-8 w-full max-w-screen-lg overflow-y-auto">
      {children}
    </div>
  );
}
