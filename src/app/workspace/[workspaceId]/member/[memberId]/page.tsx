"use client";

import { useCreateOrGetConversation } from "@/features/conversations/api/use-create-or-get-conversation";
import { useMemberId } from "@/hooks/use-member-id";
import { useWorkspaceId } from "@/hooks/use-workspace";
import { Loader, TriangleAlert } from "lucide-react";
import { useEffect } from "react";
import Conversation from "./components/conversation";

const MemberIdPage = () => {
  const workspaceId = useWorkspaceId();
  const memberId = useMemberId();

  const { data, mutate, isPending } = useCreateOrGetConversation();

  useEffect(() => {
    if (workspaceId && memberId) {
      mutate({ workspaceId, memberId });
    }
  }, [workspaceId, memberId, mutate]);

  if (isPending) {
    <div className="h-full flex items-center justify-center">
      <Loader className="size-6 animate-spin text-muted-foreground" />
    </div>;
  }

  if (!data) {
    <div className="h-full flex flex-col gap-y-2 items-center justify-center">
      <TriangleAlert className="size-6 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">
        Conversation not found
      </span>
    </div>;
  }
  console.log(data);

  return <Conversation data={data} />;
};

export default MemberIdPage;
