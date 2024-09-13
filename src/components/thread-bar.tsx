import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { format, formatDistanceToNow } from "date-fns";
import { ChevronRight } from "lucide-react";

interface ThreadBarProps {
  count?: number;
  image?: string;
  timestamp?: number | undefined;
  onClick?: () => void;
  name?: string;
}

const ThreadBar = ({
  count,
  image,
  timestamp,
  onClick,
  name,
}: ThreadBarProps) => {
  if (!count && !timestamp) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className="p-1 rounded-md hover:bg-white border border-transparent flex items-center justify-start group/thread-bar transition max-w-[600px"
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <Avatar className="size-6 shrink-0">
          <AvatarImage src={image} />
          <AvatarFallback>{name?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="text-xs text-sky-700 hover:underline font-bold truncate">
          {count ?? 0} {(count ?? 0) > 1 ? "replies" : "reply"}
        </span>
        <span className="text-muted-foreground text-xs truncate group-hover/thread-bar:hidden block">
          Last reply{" "}
          {timestamp
            ? formatDistanceToNow(new Date(timestamp), { addSuffix: true })
            : ""}
        </span>
        <span className="text-muted-foreground text-xs truncate group-hover/thread-bar:block hidden">
          View thread
        </span>
      </div>
      <ChevronRight className="size-4 text-muted-foreground ml-auto opacity-0 group-hover/thread-bar:opacity-100 transition shrink-0" />
    </button>
  );
};

export default ThreadBar;
