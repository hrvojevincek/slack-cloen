"use client";

import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

import { Loader } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function Home() {
  const router = useRouter();
  const [open, setOpen] = useCreateWorkspaceModal();
  const { data, isLoading } = useGetWorkspaces();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const workspaceId = useMemo(() => data?.[0]?._id, [data]);

  useEffect(() => {
    if (isAuthLoading || isLoading) return;

    if (!isAuthenticated) {
      router.replace("/auth");
    } else if (workspaceId) {
      router.replace(`/workspace/${workspaceId}`);
    } else if (!open) {
      setOpen(true);
    }
  }, [
    isAuthLoading,
    isLoading,
    isAuthenticated,
    workspaceId,
    open,
    setOpen,
    router,
  ]);

  if (isAuthLoading || isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="animate-spin size-6 text-muted-foreground" />
      </div>
    );
  }

  return <div></div>;
}
