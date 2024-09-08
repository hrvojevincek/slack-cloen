"use client";

import CreateWorkspaceModal from "@/features/workspaces/components/create-workspace-modal";
import { useState, useEffect } from "react";

export const Modals = () => {
  const [mounted, setMounted] = useState(false);

  //   prevent potential hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {mounted && (
        <>
          <CreateWorkspaceModal />
        </>
      )}
    </>
  );
};
