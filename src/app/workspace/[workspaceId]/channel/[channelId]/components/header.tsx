import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRemoveChannel } from "@/features/channels/api/use-remove-channel";
import { useUpdateChannel } from "@/features/channels/api/use-update-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace";
import { ChevronDown, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  const router = useRouter();
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const [editOpen, setEditOpen] = useState(false);
  const [value, setValue] = useState(title);
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete this channel?",
    "This action cannot be undone."
  );

  const { mutate: removeChannel, isPending: isRemovingChannel } =
    useRemoveChannel();

  const { mutate: updateChannel, isPending: isUpdatingChannel } =
    useUpdateChannel();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //* replace all white space with - and make it lowercase
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setValue(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateChannel(
      { name: value, channelId },
      {
        onSuccess: () => {
          toast.success("Channel updated successfully");
          setEditOpen(false);
        },
        onError: () => {
          toast.error("Failed to update channel");
        },
      }
    );
  };

  const handleDelete = async () => {
    const ok = await confirm();

    if (!ok) return;

    removeChannel(
      { channelId },
      {
        onSuccess: () => {
          toast.success("Channel deleted successfully");
          router.push(`/workspace/${workspaceId}`);
        },
        onError: () => {
          toast.error("Failed to delete channel");
        },
      }
    );
  };

  return (
    <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
      <ConfirmDialog />
      <Dialog aria-describedby="channel-settings" aria-label="Channel settings">
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="text-lg font-semibold px-2 overflow-hidden w-auto"
            size="sm"
          >
            <span className="truncate"># {title}</span>
            <ChevronDown className="size-2.5 ml-2" />
          </Button>
        </DialogTrigger>
        <DialogContent
          aria-describedby="channel-settings"
          aria-label="Channel settings"
          className="p-0 bg-gray-50 overflow-hidden"
        >
          <DialogHeader className="bg-white border-b p-4">
            <DialogTitle>#{title}</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog
              aria-describedby="channel-settings"
              open={editOpen}
              onOpenChange={setEditOpen}
            >
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Channel name</p>
                    <p className="text-sm text-[#1254a3] hover:underline font-semibold">
                      Edit
                    </p>
                  </div>
                  <p className="text-sm"># title</p>
                </div>
              </DialogTrigger>
              <DialogContent
                aria-describedby="channel-name"
                aria-label="Rename channel"
              >
                <DialogHeader className="bg-white border-b p-4">
                  <DialogTitle>Renamet his channel</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    value={value}
                    disabled={isUpdatingChannel}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    onChange={handleChange}
                    placeholder="e.g. plan-budget"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        variant="outline"
                        disabled={isUpdatingChannel}
                        type="submit"
                      >
                        Cancle
                      </Button>
                    </DialogClose>
                    <Button disabled={isUpdatingChannel} type="submit">
                      Save
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <button
              onClick={handleDelete}
              disabled={isRemovingChannel}
              className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
            >
              <TrashIcon className="size-4" />
              <p className="text-sm font-semibold">Delete channel</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Header;
