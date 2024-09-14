"use client";

import { FormEvent, useEffect, useState } from "react";
import { LayoutList } from "@/Layouts/LayoutList";
import { Layout } from "@/Layouts/Layout";
import { Button } from "@/components/ui/button";

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const getRandomValue = () => Math.random();

    const newLayout = {
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

  const removeLayout = (id: string) => {
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

  return (
    <>
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
          <div className="flex items-center justify-center h-32 text-lg text-muted-foreground">
            Loading...
          </div>
        ) : (
          data.map((layout) => (
            <Layout
              key={layout._id}
              layout={layout.layout}
              title={layout.title}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              remove={() => removeLayout(layout._id)}
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
