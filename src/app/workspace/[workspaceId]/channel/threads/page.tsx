import React from "react";
import { TriangleAlert } from "lucide-react";

const ThreadsPage = () => {
  return (
    <div className="h-full flex flex-col gap-y-2 items-center justify-center">
      <TriangleAlert className="size-6 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">Under Construction</span>
    </div>
  );
};

export default ThreadsPage;
