import React from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CopyIcon, RefreshCcw } from "lucide-react";
import { useWorkspaceId } from "@/hooks/use-workspace";
import { useNewJoinCodeWorkspace } from "@/features/workspaces/api/use-new-join-code-workspace";
import { useConfirm } from "@/hooks/use-confirm";
interface InviteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  joinCode: string;
}

const InviteModal = ({ open, setOpen, name, joinCode }: InviteModalProps) => {
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "This will deactivate the current invite code and generate a new one."
  );

  const workspaceId = useWorkspaceId();

  const { mutate, isPending } = useNewJoinCodeWorkspace();

  const handleNewCode = async () => {
    const confirmed = await confirm();

    if (!confirmed) return;

    mutate(
      { workspaceId },
      {
        onSuccess: () => {
          toast.success("New invite code generated");
        },
        onError: () => {
          toast.error("Failed to generate new invite code");
        },
      }
    );
  };

  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}/`;

    navigator.clipboard.writeText(inviteLink).then(() => {
      toast.success("Invite link copied to clipboard");
    });
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white text-black">
          <DialogHeader>
            <DialogTitle>Invite people to {name}</DialogTitle>
            <DialogDescription>
              Use the code below to invite people to your workspace
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-4 items-center justify-center py-10">
            <p className="text-4xl font-bold tracking-widest uppercase">
              {joinCode}
            </p>
            <Button onClick={handleCopy} variant="ghost" size="sm">
              Copy Link
              <CopyIcon className="size-4 ml-2" />
            </Button>
          </div>
          <div className="flex items-center justify-between w-full">
            <Button
              onClick={handleNewCode}
              disabled={isPending}
              variant="outline"
            >
              New Code
              <RefreshCcw className="size-4 ml-2" />
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InviteModal;
