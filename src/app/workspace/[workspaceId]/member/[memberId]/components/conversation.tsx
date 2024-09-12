import MessageList from "@/components/message-list";
import { useGetMember } from "@/features/members/api/use-get-member";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { useMemberId } from "@/hooks/use-member-id";
import { Loader } from "lucide-react";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import ChatInput from "./chat-input-convo";
import HeaderConvo from "./header-convo";

type ConversationData = {
  _creationTime: number;
  _id: Id<"conversations">;
  memberOneId: Id<"members">;
  memberTwoId: Id<"members">;
  workspaceId: Id<"workspaces">;
} | null;

const Conversation = ({ data }: { data: ConversationData }) => {
  const memberId = useMemberId();
  const { data: member, isLoading: isMemberLoading } = useGetMember({
    memberId,
  });

  const { results, status, loadMore } = useGetMessages({
    conversationId: data?._id,
  });

  if (isMemberLoading || status === "LoadingFirstPage") {
    <div className="h-full flex items-center justify-center">
      <Loader className="size-6 animate-spin text-muted-foreground" />
    </div>;
  }

  return (
    <div className="flex flex-col h-full">
      <HeaderConvo
        memberName={member?.user?.name}
        memberImage={member?.user?.image}
        onClick={() => {}}
      />
      <MessageList
        data={results}
        variant="conversation"
        memberImage={member?.user?.image}
        memberName={member?.user?.name}
        loadMore={loadMore}
        isLoading={status === "LoadingFirstPage" || status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <ChatInput placeholder="Write a message" conversationId={data?._id} />
    </div>
  );
};

export default Conversation;
