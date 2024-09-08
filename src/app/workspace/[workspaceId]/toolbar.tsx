"use client";

import { Button } from "@/components/ui/button";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace";
import { Info, SearchIcon } from "lucide-react";
import React from "react";

const Toolbar = () => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkspace(workspaceId);

  return (
    <nav className="bg-[#481349] flex items-center justify-between h-10 p-1.5 w-full">
      <div className="flex-1 " />
      <div className="min-w-[280px] max-[642px] grow-[2] shrink">
        <Button
          className="bg-accent/25 hover:bg-accent-25 w-full justify-start h-7 px-2"
          size="sm"
        >
          <SearchIcon className="size-4 text-white mr-2" />
          <span className="text-white text-sm">Search {data?.name}</span>
        </Button>
      </div>
      <div className="ml-auto flex-1 items-center justify-end">
        <Button variant="transparent" size="iconSm">
          <Info className="size-5 text-white" />
        </Button>
      </div>
    </nav>
  );
};

export default Toolbar;
