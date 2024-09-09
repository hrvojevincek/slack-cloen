import { Button } from "@/components/ui/button";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Id } from "../../../../../convex/_generated/dataModel";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useWorkspaceId } from "@/hooks/use-workspace";

interface UserItemProps {
  id: Id<"members">;
  label?: string;
  image?: string;
  variant?: VariantProps<typeof userItemVariants>["variant"];
}
const userItemVariants = cva(
  "flex items-center gap-1.5 justify-start h-7 px-[18px] text-sm overflow-hidden cursor-pointer",
  {
    variants: {
      variant: {
        default: "text-[#f9edffcc]",
        active: "text-[#481349] bg-white/90 hover:bg-white/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const UserItem = ({ id, label = "Member", image, variant }: UserItemProps) => {
  const workspaceId = useWorkspaceId();
  const avatarFallback = label?.charAt(0).toUpperCase();

  return (
    <Button
      variant="transparent"
      className={cn(userItemVariants({ variant }))}
      asChild
    >
      <Link href={`/workspace/${workspaceId}/members/${id}`}>
        <Avatar className="size-5 rounded-md mr-1">
          <AvatarImage src={image} className="rounded-md" />
          <AvatarFallback className="rounded-md bg-sky-500 text-white">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <span className="truncate text-sm">{label}</span>
      </Link>
    </Button>
  );
};

export default UserItem;
