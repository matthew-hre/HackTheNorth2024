import { ReactNode } from "react";

export function LayoutList({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-8 p-8 w-full max-w-screen-lg overflow-y-auto mb-12 z-1">
      {children}
    </div>
  );
}
