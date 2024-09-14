import { Id } from "../../convex/_generated/dataModel";
export function Layout({
  layout,
  title,
  remove,
}: {
  viewer: Id<"users">;
  layout: {
    x: number;
    y: number;
    width: number; // percentage of screen width, 0-1
    height: number; // percentage of screen height, 0-1
    application: string;
  }[];
  title: string;
  remove: () => void;
}) {
  return (
    <div className="flex flex-col flex-1 min-w-80 max-w-[30rem] h-max p-4 border rounded-lg bg-background/80 backdrop-blur">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button className="text-sm text-primary" onClick={remove}>
          Delete
        </button>
      </div>
      <div className="mt-2">
        <div className="relative aspect-video bg-background/60 border border-muted rounded-lg overflow-hidden">
          {layout.map((item, index) => (
            <div
              key={index}
              className="absolute border border-primary bg-muted rounded-lg"
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
