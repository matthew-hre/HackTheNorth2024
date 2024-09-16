import { Pencil, Save, Trash, X } from "lucide-react";
import { useState } from "react";

export function Layout({
  layout,
  title,
  remove,
  onClick,
  selected,
  updateTitle,
}: {
  layout: {
    x: number;
    y: number;
    width: number; // percentage of screen width, 0-1
    height: number; // percentage of screen height, 0-1
    application: string;
  }[];
  title: string;
  remove: () => void;
  onClick: () => void;
  selected: boolean;
  updateTitle: (title: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [titleState, setTitle] = useState(title);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNewTitle(e.target.value);
  }

  return (
    <div
      className="flex flex-col flex-1 min-w-60 max-w-xs h-max p-4 border rounded-lg bg-background/80 backdrop-blur hover:cursor-pointer"
      onClick={onClick}
    >
      {selected && (
        <div className="absolute top-0 left-0 w-full h-full bg-primary/20 rounded-lg z-0" />
      )}
      <div className="flex justify-between items-center">
        {editing ? (
          <input
            type="text"
            value={newTitle}
            onChange={handleTitleChange}
            className="text-lg font-semibold bg-transparent border-b border-primary/50 text-primary/50 z-10"
          />
        ) : (
          <h2 className="text-lg font-semibold">{titleState}</h2>
        )}

        <div className="flex items-center gap-2">
          {editing ? (
            <>
              <button
                className="text-sm hover:text-foreground text-primary z-10"
                onClick={() => {
                  setEditing(false);
                  setTitle(newTitle);
                  updateTitle(newTitle);
                }}
              >
                <Save />
              </button>
              <button
                className="text-sm hover:text-foreground text-primary z-10"
                onClick={() => {
                  setEditing(!editing);
                  setTitle(title);
                }}
              >
                <X />
              </button>
            </>
          ) : (
            <>
              <button
                className="text-sm hover:text-foreground text-primary z-10"
                onClick={() => setEditing(!editing)}
              >
                <Pencil />
              </button>
              <button
                className="text-sm hover:text-foreground text-primary z-10"
                onClick={remove}
              >
                <Trash />
              </button>
            </>
          )}
        </div>
      </div>
      <div className="mt-2">
        <div className="relative aspect-video bg-muted/50 border border-muted rounded-lg overflow-hidden">
          {layout.map((item, index) => (
            <div
              key={index}
              className="absolute border border-primary bg-muted rounded-lg flex flex-col items-center justify-center"
              style={{
                top: `${item.y * 100}%`,
                left: `${item.x * 100}%`,
                width: `${item.width * 100}%`,
                height: `${item.height * 100}%`,
              }}
            >
              {item.application}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
