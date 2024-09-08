"use client";

import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace";
import React from "react";

const WorkspaceIdPage = () => {
  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useGetWorkspace(workspaceId);

  return <div>DATA: {JSON.stringify(data)}</div>;
};

export default WorkspaceIdPage;
