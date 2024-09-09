"use client";

import CreateWorkspaceModal from "@/features/workspaces/components/create-workspace-modal";
import CreateChannelModal from "@/features/channels/components/create-channel-modal";
import { useState, useEffect } from "react";

export const Modals = () => {
  const [mounted, setMounted] = useState(false);

  // * component to prevent potential hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {mounted && (
        <>
          <CreateChannelModal />
          <CreateWorkspaceModal />
        </>
      )}
    </>
  );
};
