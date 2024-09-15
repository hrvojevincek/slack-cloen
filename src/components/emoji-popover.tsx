import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

interface EmojiPopoverProps {
  children: React.ReactNode;
  hint?: string;
  onEmojiSelect: (emoji: any) => void;
}

const EmojiPopover = ({
  children,
  hint = "Emoji",
  onEmojiSelect,
}: EmojiPopoverProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const onSelect = (emoji: any) => {
    onEmojiSelect(emoji);
    setPopoverOpen(false);

    setTimeout(() => {
      setTooltipOpen(false);
    }, 500);
  };

  return (
    <TooltipProvider>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <Tooltip
          open={tooltipOpen}
          onOpenChange={setTooltipOpen}
          delayDuration={50}
        >
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent className="text-white border-white/5 z-50">
            <p className="text-xs font-medium">{hint}</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent className="p-0 w-full border-none shadow-none bg-white">
          <Picker
            data={data}
            onEmojiSelect={onSelect}
            theme="light"
            navPosition="top"
            previewPosition="none"
            searchPosition="sticky"
            skinTonePosition="none"
          />
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};

export default EmojiPopover;
