import { MessageSquareText, Pencil, Smile, Trash } from "lucide-react";
import EmojiPopover from "./emoji-popover";
import { Button } from "./ui/button";
import Hint from "./ui/hint";

interface ToolbarProps {
  isAuthor: boolean;
  isPending: boolean;
  handleEdit: () => void;
  handleThread: () => void;
  handleDelete: () => void;
  handleReaction: (value: string) => void;
  hideThreadButton?: boolean;
}

const Toolbar = ({
  isAuthor,
  isPending,
  handleEdit,
  handleReaction,
  handleThread,
  handleDelete,
  hideThreadButton,
}: ToolbarProps) => {
  return (
    <div className="absolute top-0 right-5">
      <div className="group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounded-md shadow-sm">
        <EmojiPopover
          hint="Add Reaction"
          onEmojiSelect={(emoji) => handleReaction(emoji.native)}
        >
          <Button variant="ghost" size="iconSm" disabled={isPending}>
            <Smile className="size-4" />
          </Button>
        </EmojiPopover>
        {!hideThreadButton && (
          <Hint label="Reply">
            <Button
              variant="ghost"
              size="iconSm"
              disabled={isPending}
              onClick={handleThread}
            >
              <MessageSquareText className="size-4" />
            </Button>
          </Hint>
        )}

        {isAuthor && (
          <>
            <Hint label="Edit">
              <Button
                variant="ghost"
                size="iconSm"
                disabled={isPending}
                onClick={handleEdit}
              >
                <Pencil className="size-4" />
              </Button>
            </Hint>

            <Hint label="Delete">
              <Button
                variant="ghost"
                size="iconSm"
                disabled={isPending}
                onClick={handleDelete}
              >
                <Trash className="size-4" />
              </Button>
            </Hint>
          </>
        )}
      </div>
    </div>
  );
};

export default Toolbar;
