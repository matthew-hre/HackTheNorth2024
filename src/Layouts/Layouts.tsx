"use client";

import { FormEvent, useEffect, useState } from "react";
import { LayoutList } from "@/Layouts/LayoutList";
import { Layout } from "@/Layouts/Layout";
import { Button } from "@/components/ui/button";
import { Download, Plus, RefreshCcw, Save } from "lucide-react";
import { Command } from "@tauri-apps/api/shell";

type LayoutType = {
  _id: string;
  layout: {
    x: number;
    y: number;
    width: number;
    height: number;
    application: string;
  }[];
  title: string;
};

const authHeader = {
  Authorization: `Bearer ${"eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJqeDcza2ZnODg2YTNlMHA1a3RweXdwNW45aDcwczh6MHxqaDc1Z3dxMnhneXhqNWU2aHRmMGRoODg2eDcwc3lzeiIsImlhdCI6MTcyNjM1MjA3OCwiaXNzIjoiaHR0cHM6Ly91dG1vc3Qtb3dsLTkyMS5jb252ZXguc2l0ZSIsImF1ZCI6ImNvbnZleCIsImV4cCI6MTcyNjUyNDg3OH0.eZXoiSKuhDFamggq8xgzAB_JOlairxU1CgGF7StnkIyOqNyiJUy6pST9ihgrUqTzulmts0YPfpiI_N5i6aw224p4nkfHZ36cZUGf-KowebihYh_v1lHkGKLdgChezGSN4jRpFe9egxBlJz-NlonCKD3RyAnNmyKRlWVnWRn1SNsviFv1JssAhZBbGwVmn9CF-8EbYs_Z55skteZS8QjRrSBI5qUtUkHE0EoMZKY2Dc5W9YQCMgAl8jAIUoWNB2j2uvGWWMnxLK_Ogg8UPS1GHhSGXeBVRo1xZYh60yOpkcYYkMXQAFTDGAQffq_gQ8AS-9zGs2Tj45zG93j86JuEyw"}`,
};

export function Layouts() {
  const [data, setData] = useState<LayoutType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const url = "https://utmost-owl-921.convex.cloud/api/query";
    const request = { path: "layouts:list", args: {}, format: "json" };

    // Fetch data from an API
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
      },
      body: JSON.stringify(request),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setData(data.value);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const addWindowLayout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const command = Command.sidecar(`sidecar/getWindowLayouts`);

    const child = await command.execute();

    const result = child.stdout;

    const newLayout = {
      layout: JSON.parse(result),
    };

    const url = "https://utmost-owl-921.convex.cloud/api/mutation";
    const request = {
      path: "layouts:create",
      args: newLayout,
      format: "json",
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
      },
      body: JSON.stringify(request),
    })
      .then(() => {
        const newLayoutWithId: LayoutType = {
          _id: Math.random().toString(36).substr(2, 9), // Generate a random ID, we'll discard this later
          layout: newLayout.layout,
          title: "New Layout",
        };
        setData([...data, newLayoutWithId]);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  const removeWindowLayout = (id: string) => {
    const url = "https://utmost-owl-921.convex.cloud/api/mutation";
    const request = {
      path: "layouts:remove",
      args: { id },
      format: "json",
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
      },
      body: JSON.stringify(request),
    })
      .then(() => {
        // Update state without reloading
        setData((prevData) => prevData.filter((layout) => layout._id !== id));
      })
      .catch((error) => setError(error.message));
  };

  const updateWindowLayout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selected) return;

    const command = Command.sidecar(`sidecar/getWindowLayouts`);
    const child = await command.execute();

    const result = child.stdout;
    const temp = JSON.parse(result);

    console.log(temp);

    const newLayout = {
      layout: JSON.stringify(temp),
    };

    const url = "https://utmost-owl-921.convex.cloud/api/mutation";
    const request = {
      path: "layouts:updateLayout",
      args: { id: selected, layout: newLayout.layout },
      format: "json",
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
      },
      body: JSON.stringify(request),
    })
      .then(() => {
        setData((prevData) =>
          prevData.map((layout) =>
            layout._id === selected
              ? { ...layout, layout: JSON.parse(newLayout.layout) }
              : layout,
          ),
        );
      })
      .catch(
        (error) => setError(error.message)
      );
  };

  const loadWindowLayout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selected) return;

    const layout = data.find((layout) => layout._id === selected);

    if (!layout) return;

    const layoutString = JSON.stringify(layout["layout"])
    console.log("LAYOUT STRING")
    console.log(layoutString)
    const command = Command.sidecar(`sidecar/setWindowLayouts`,
      layoutString
    );
    console.log(command)

    const child = await command.execute();
    console.log(child)
    console.log(child.stderr)
    console.log(child.stdout)
  };

  const updateTitle = (id: string, title: string) => {
    const url = "https://utmost-owl-921.convex.cloud/api/mutation";
    const request = {
      path: "layouts:updateTitle",
      args: { id, title },
      format: "json",
    };

    console.log(JSON.stringify(request));

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
      },
      body: JSON.stringify(request),
    })
      .then(() => {
        console.log("Updated title");
        setData((prevData) =>
          prevData.map((layout) =>
            layout._id === selected ? { ...layout, title } : layout,
          ),
        );
      })
      .catch((error) => setError(error.message));
  };

  return (
    <>
      <div
        className="absolute top-0 left-0 w-full h-full rounded-lg z-0"
        onClick={() => {
          setSelected(null);
        }}
      />
      <LayoutList>
        {!loading && data.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-lg text-muted-foreground">
            No layouts yet. Create one!
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-32 text-lg text-muted-foreground">
            Error: {error}
          </div>
        ) : loading ? (
          <div className="absolute left-0 top-48 flex items-center justify-center h-32 w-full text-lg text-muted-foreground">
            <RefreshCcw className="animate-spin h-6 w-6 mr-2" />
            Loading...
          </div>
        ) : (
          data.map((layout) => (
            <Layout
              key={layout._id}
              layout={layout.layout}
              title={layout.title}
              onClick={() => setSelected(layout._id)}
              selected={selected === layout._id}
              updateTitle={(title) => {
                updateTitle(selected || "", title);
              }}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              remove={() => removeWindowLayout(layout._id)}
            />
          ))
        )}
      </LayoutList>
      <div className="fixed bottom-0 w-full bg-background/80 backdrop-blur p-4 flex flex-row space-between gap-4">
        <form onSubmit={addWindowLayout} className="flex-1">
          <Button type="submit" className="w-full">
            <Plus className="h-6 w-6 mr-2" />
            Create layout
          </Button>
        </form>
        <form onSubmit={updateWindowLayout} className="flex-1">
          <Button type="submit" className="w-full">
            <Save className="h-6 w-6 mr-2" />
            Update Layout
          </Button>
        </form>
        <form onSubmit={loadWindowLayout} className="flex-1">
          <Button type="submit" className="w-full" disabled={!selected}>
            <Download className="h-6 w-6 mr-2" />
            Import layout
          </Button>
        </form>
        <Button
          onClick={() => {
            window.location.reload();
          }}
          className="z-10 w-min h-min p-2 rounded-full backdrop-blur hover:bg-primary/90"
        >
          <RefreshCcw className="h-5 w-5" />
        </Button>
      </div>
    </>
  );
}
