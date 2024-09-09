"use client";

import Link from "next/link";
import VerificationInput from "react-verification-input";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import { useWorkspaceId } from "@/hooks/use-workspace";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import { useJoinWorkspace } from "@/features/workspaces/api/use-join-workspace";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useEffect, useMemo } from "react";

const JoinPage = () => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { data, isLoading } = useGetWorkspaceInfo(workspaceId);
  const { mutate, isPending } = useJoinWorkspace();

  const isMember = useMemo(() => {
    return data?.isMember;
  }, [data?.isMember]);

  useEffect(() => {
    if (isMember) {
      router.push(`/workspace/${workspaceId}`);
    }
  }, [isMember, router, workspaceId]);

  const handleComplete = (value: string) => {
    mutate(
      { workspaceId, joinCode: value },
      {
        onSuccess: () => {
          toast.success("Workspace joined successfully");
          router.replace(`/workspace/${workspaceId}`);
        },
        onError: (error) => {
          if (error.message === "Invalid join code") {
            toast.error("Invalid join code. Please check and try again.");
          } else {
            toast.error("Failed to join workspace: " + error.message);
          }
        },
      }
    );
  };

  if (isLoading)
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );

  return (
    <div className="h-screen flex flex-col space-y-8 items-center justify-center bg-white p-8 shadow-md rounded-lg z-0">
      <h1 className="text-6xl font-bold text-black tracking-tight text-center">
        -- WORKSPACE --
      </h1>
      <div className="flex flex-col gap-y-4 items-center justify-center max-w-md ">
        <div className="flex flex-col gap-y-2 items-center justify-center border-red-600">
          <h1 className="text-2xl font-bold text-black">Join {data?.name}</h1>
          <p className="text-md text-muted-foreground">
            Enter the workspace code to join.
          </p>
        </div>
        <VerificationInput
          onComplete={handleComplete}
          classNames={{
            container: cn(
              "flex gap-x-2",
              isPending && "opacity-50 cursor-not-allowed"
            ),
            character:
              "uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500",
            characterInactive: "bg-muted",
            characterSelected: "bg-white text-black",
            characterFilled: "bg-white text-black",
          }}
          autoFocus
          length={6}
        />
      </div>
      <div className="flex gap-4">
        <Button size="lg" variant="outline" asChild>
          <Link href="/" className="text-black">
            Back to home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default JoinPage;
