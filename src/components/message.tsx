import React from "react";

import dynamic from "next/dynamic";
import { format, isToday, isYesterday } from "date-fns";
import Hint from "@/components/ui/hint";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Thumbnail from "@/app/workspace/[workspaceId]/components/thumbnail";
import { Doc, Id } from "../../convex/_generated/dataModel";
import Toolbar from "./toolbar";
import { useUpdateMessage } from "@/features/messages/api/use-update-message";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { EditorValue } from "@/components/editor";
import { useDeleteMessage } from "@/features/messages/api/use-delete-message";
import { useConfirm } from "@/hooks/use-confirm";

const Renderer = dynamic(() => import("@/components/renderer"), { ssr: false });
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface MessageProps {
  id: Id<"messages">;
  memberId: Id<"members">;
  authorImage?: string;
  authorName?: string;
  isAuthor: boolean;
  reactions: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
    }
  >;
  body: Doc<"messages">["body"];
  image: string | null | undefined;
  createdAt: Doc<"messages">["_creationTime"];
  updatedAt: Doc<"messages">["updatedAt"];
  isEditing: boolean;
  isCompact?: boolean;
  setEditingId: (id: Id<"messages"> | null) => void;
  hideThreadButton?: boolean;
  threadCount?: number;
  threadImage?: string;
  threadTimestamp?: number;
}

const formatFullTime = (date: Date) => {
  return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "h:mm:ss")}`;
};

const Message = ({
  id,
  memberId,
  authorImage,
  authorName = "Member",
  isAuthor,
  reactions,
  body,
  image,
  createdAt,
  updatedAt,
  isEditing,
  isCompact,
  setEditingId,
  hideThreadButton,
  threadCount,
  threadImage,
}: MessageProps) => {
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure you want to delete this message?",
    "This action cannot be undone."
  );

  const { mutate: updateMessage, isPending: isUpdatingMessage } =
    useUpdateMessage();

  const { mutate: deleteMessage, isPending: isDeletingMessage } =
    useDeleteMessage();

  const isPending = isUpdatingMessage;

  const handleUpdateMessage = (body: string) => {
    updateMessage(
      { messageId: id, body },
      {
        onSuccess: () => {
          toast.success("Message updated");
          setEditingId(null);
        },
        onError: () => {
          toast.error("Failed to update message");
        },
      }
    );
  };

  const handleDeleteMessage = async (id: Id<"messages">) => {
    const ok = await confirm();

    if (!ok) return;

    deleteMessage(
      { messageId: id },
      {
        onSuccess: () => {
          console.log("okkkk");

          toast.success("Message deleted");
        },
        onError: () => {
          console.log("onotokok");

          toast.error("Failed to delete message");
        },
      }
    );
  };

  if (isCompact) {
    return (
      <>
        <ConfirmDialog />
        <div
          className={cn(
            "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
            isEditing && "bg-[#F2C74433] hover:bg-[#F2C74433]"
          )}
        >
          <div className="flex item-start gap-2">
            <Hint label={formatFullTime(new Date(createdAt))}>
              <button className="text-muted-foreground text-xs opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
                {format(new Date(createdAt), "hh:mm")}
              </button>
            </Hint>
            {isEditing ? (
              <div className="w-full h-full">
                <Editor
                  onSubmit={({ body, image }) => handleUpdateMessage(body)}
                  disabled={isPending}
                  defaultValue={JSON.parse(body)}
                  onCancel={() => setEditingId(null)}
                  varient="update"
                />
              </div>
            ) : (
              <div className="flex flex-col w-full">
                <Renderer value={body} />;
                <Thumbnail url={image} />
                {updatedAt ? (
                  <span className="text-muted-foreground text-xs">Edited</span>
                ) : null}
              </div>
            )}
          </div>
          {!isEditing && (
            <Toolbar
              isAuthor={isAuthor}
              isPending={isPending}
              handleEdit={() => setEditingId(id)}
              handleThread={() => {}}
              handleDelete={() => handleDeleteMessage(id)}
              handleReaction={() => {}}
              hideThreadButton={hideThreadButton}
            />
          )}
        </div>
      </>
    );
  }

  const avatarFallback = authorName.charAt(0).toUpperCase();

  return (
    <>
      <ConfirmDialog />
      <div
        className={cn(
          "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
          isEditing && "bg-[#F2C74433] hover:bg-[#F2C74433]"
        )}
      >
        <div className="flex items-start gap-2">
          <button>
            <Avatar>
              <AvatarImage src={authorImage} />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
          </button>
          {isEditing ? (
            <div className="w-full h-full">
              <Editor
                onSubmit={({ body, image }) => handleUpdateMessage(body)}
                disabled={isPending}
                defaultValue={JSON.parse(body)}
                onCancel={() => setEditingId(null)}
                varient="update"
              />
            </div>
          ) : (
            <div className="flex flex-col w-full overflow-hidden">
              <div className="text-sm font-medium">
                <button
                  onClick={() => {}}
                  className="font-bold text-primary hover:underline"
                >
                  {authorName}
                </button>
                <span>&nbsp;•&nbsp;</span>
                <Hint label={formatFullTime(new Date(createdAt))}>
                  <button className="text-muted-foreground text-xs hover:underline">
                    {format(new Date(createdAt), "hh:mm")}
                  </button>
                </Hint>
              </div>
              <Renderer value={body} />
              <Thumbnail url={image} />
              {updatedAt ? (
                <span className="text-muted-foreground text-xs">Edited</span>
              ) : null}
            </div>
          )}
        </div>
        {!isEditing && (
          <Toolbar
            isAuthor={isAuthor}
            isPending={isPending}
            handleEdit={() => setEditingId(id)}
            handleThread={() => {}}
            handleDelete={() => handleDeleteMessage(id)}
            handleReaction={() => {}}
            hideThreadButton={hideThreadButton}
          />
        )}
      </div>
    </>
  );
};

export default Message;
