"use client";

import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { FormEvent } from "react";
import { api } from "../../convex/_generated/api";
import { LayoutList } from "@/Layouts/LayoutList";
import { Layout } from "@/Layouts/Layout";
import { Id } from "../../convex/_generated/dataModel";

export function Layouts({ viewer }: { viewer: Id<"users"> }) {
  const layouts = useQuery(api.layouts.list);
  const addLayout = useMutation(api.layouts.create);

  const removeLayout = useMutation(api.layouts.remove);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const getRandomValue = () => Math.random();

    addLayout({
      layout: [
        {
          x: getRandomValue(),
          y: getRandomValue(),
          width: getRandomValue(),
          height: getRandomValue(),
          application: "Code",
        },
        {
          x: getRandomValue(),
          y: getRandomValue(),
          width: getRandomValue(),
          height: getRandomValue(),
          application: "Chrome",
        },
      ],
    }).catch((error) => {
      console.error("Failed to create layout:", error);
    });
  };

  return (
    <>
      <LayoutList>
        {!layouts || layouts.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-lg text-muted-foreground">
            No layouts yet. Create one!
          </div>
        ) : (
          layouts.map((layout) => (
            <Layout
              key={layout._id}
              viewer={viewer}
              layout={layout.layout}
              title={layout.title}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              remove={() => removeLayout({ id: layout._id })}
            />
          ))
        )}
      </LayoutList>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-screen-lg px-8 mt-auto mb-8"
      >
        <Button type="submit">Create a new layout</Button>
      </form>
    </>
  );
}
