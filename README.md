## 📋 <a name="table">Slack Clone Website</a>

LIVE AT : [Slack Clone @ Vercel](https://slack-clone-iota-three.vercel.app/)

. ⚙️ [Tech Stack](#tech-stack)
. 🔋 [Features](#features)
. 🤸 [Quick Start](#quick-start)
. 🕸️ [Snippets](#snippets)

## <a name="introduction">🤖 Introduction</a>

Next.js 14 end-to-end fullstack and real-time slack clone, with Convex Auth, workspaces, channels, 1:1 conversations, threads, reactions, editing and deleting messages as well as member roles.

## <a name="tech-stack">⚙️ Tech Stack</a>

- Node.js
- Next.js
- TailwindCSS
- TypeScript
- Shadcn
- Convex DB
- Jotai state managment
- Convex Auth

## <a name="features">🔋 Features</a>

- **Authentication (CRUD) with Convex Auth:** User management through Convex, ensuring secure and efficient authentication.

- **Slack (CRUD):** Comprehensive functionality for creating, reading, updating, and deleting workspaces, threads, channels and conversations.

- **Search & Filter:** Empowering users with a search and filter system, enabling them to easily find channels, threads and users.

## <a name="snippets">🕸️ Some of snippets</a>


<details>
<summary><code>Convex setup</code></summary>

```typescript
convex/auth.ts

import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { DataModel } from "./_generated/dataModel";

const CustomPassword = Password<DataModel>({
  profile(params) {
    return {
      email: params.email as string,
      name: params.name as string,
    };
  },
});

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [GitHub, Google, CustomPassword],
});

- NextJS/convex Middleware -

import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isPublicPage = createRouteMatcher(["/auth"]);

export default convexAuthNextjsMiddleware((request) => {
  if (!isPublicPage(request) && !isAuthenticatedNextjs()) {
    return nextjsMiddlewareRedirect(request, "/auth");
  }

  if (isPublicPage(request) && isAuthenticatedNextjs()) {
    return nextjsMiddlewareRedirect(request, "/");
  }
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};


```

</details>

<details>
<summary><code>schema.ts</code></summary>

```typescript
import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  workspaces: defineTable({
    name: v.string(),
    userId: v.id("users"),
    joinCode: v.string(),
  }),
  members: defineTable({
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("member")),
  })
    .index("by_user_id", ["userId"])
    .index("by_workspace_id", ["workspaceId"])
    .index("by_workspace_id_user_id", ["workspaceId", "userId"]),
  channels: defineTable({
    workspaceId: v.id("workspaces"),
    name: v.string(),
  }).index("by_workspace_id", ["workspaceId"]),
  conversations: defineTable({
    workspaceId: v.id("workspaces"),
    memberOneId: v.id("members"),
    memberTwoId: v.id("members"),
  }).index("by_workspace_id", ["workspaceId"]),
  messages: defineTable({
    body: v.string(),
    image: v.optional(v.id("_storage")),
    memberId: v.id("members"),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    parentMessageId: v.optional(v.id("messages")),
    updatedAt: v.optional(v.number()),
    conversationId: v.optional(v.id("conversations")),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_member_id", ["memberId"])
    .index("by_channel_id", ["channelId"])
    .index("by_conversation_id", ["conversationId"])
    .index("by_parent_message_id", ["parentMessageId"])
    .index("by_channel_id_parent_message_id_conversation_id", [
      "channelId",
      "parentMessageId",
      "conversationId",
    ]),
  reactions: defineTable({
    value: v.string(),
    memberId: v.id("members"),
    messageId: v.id("messages"),
    workspaceId: v.id("workspaces"),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_message_id", ["messageId"])
    .index("by_member_id", ["memberId"]),
});

export default schema;


```

</details>

<details>
<summary><code>user.ts</code></summary>
  
```typescript
import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});


````

</details>

<details>
<summary><code>FileUploader.tsx</code></summary>

```typescript
'use client'

import { useCallback, Dispatch, SetStateAction } from 'react'
import type { FileWithPath } from '@uploadthing/react'
import { useDropzone } from '@uploadthing/react/hooks'
import { generateClientDropzoneAccept } from 'uploadthing/client'

import { Button } from '@/components/ui/button'
import { convertFileToUrl } from '@/lib/utils'

type FileUploaderProps = {
  onFieldChange: (url: string) => void
  imageUrl: string
  setFiles: Dispatch<SetStateAction<File[]>>
}

export function FileUploader({ imageUrl, onFieldChange, setFiles }: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setFiles(acceptedFiles)
    onFieldChange(convertFileToUrl(acceptedFiles[0]))
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*' ? generateClientDropzoneAccept(['image/*']) : undefined,
  })

  return (
    <div
      {...getRootProps()}
      className="flex-center bg-dark-3 flex h-72 cursor-pointer flex-col overflow-hidden rounded-xl bg-grey-50">
      <input {...getInputProps()} className="cursor-pointer" />

      {imageUrl ? (
        <div className="flex h-full w-full flex-1 justify-center ">
          <img
            src={imageUrl}
            alt="image"
            width={250}
            height={250}
            className="w-full object-cover object-center"
          />
        </div>
      ) : (
        <div className="flex-center flex-col py-5 text-grey-500">
          <img src="/assets/icons/upload.svg" width={77} height={77} alt="file upload" />
          <h3 className="mb-2 mt-2">Drag photo here</h3>
          <p className="p-medium-12 mb-4">SVG, PNG, JPG</p>
          <Button type="button" className="rounded-full">
            Select from computer
          </Button>
        </div>
      )}
    </div>
  )
}
````

</details>

<details>
<summary><code>workspaces.ts</code></summary>

```typescript
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

const generateCode = () => {
  const code = Array.from(
    { length: 6 },
    () => "0123456789abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 36)]
  ).join("");
  return code;
};

// return all workspaces
export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const members = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();

    const workspaceIds = members.map((member) => member.workspaceId);

    const workspaces = [];

    for (const workspaceId of workspaceIds) {
      const workspace = await ctx.db.get(workspaceId);
      if (workspace) {
        workspaces.push(workspace);
      }
    }

    return workspaces;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const joinCode = generateCode();

    const workspaceId = await ctx.db.insert("workspaces", {
      name: args.name,
      userId,
      joinCode,
    });

    await ctx.db.insert("members", {
      workspaceId,
      userId,
      role: "admin",
    });

    await ctx.db.insert("channels", {
      workspaceId,
      name: "general",
    });

    return workspaceId;
  },
});

export const getById = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member) {
      return null;
    }

    return await ctx.db.get(args.workspaceId);
  },
});

export const update = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member || member.role !== "admin") {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.workspaceId, {
      name: args.name,
    });

    return args.workspaceId;
  },
});

export const remove = mutation({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member || member.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const [members, channels, conversations, messages, reactions] =
      await Promise.all([
        ctx.db
          .query("members")
          .withIndex("by_workspace_id", (q) =>
            q.eq("workspaceId", args.workspaceId)
          )
          .collect(),
        ctx.db
          .query("channels")
          .withIndex("by_workspace_id", (q) =>
            q.eq("workspaceId", args.workspaceId)
          )
          .collect(),
        ctx.db
          .query("conversations")
          .withIndex("by_workspace_id", (q) =>
            q.eq("workspaceId", args.workspaceId)
          )
          .collect(),
        ctx.db
          .query("messages")
          .withIndex("by_workspace_id", (q) =>
            q.eq("workspaceId", args.workspaceId)
          )
          .collect(),
        ctx.db
          .query("reactions")
          .withIndex("by_workspace_id", (q) =>
            q.eq("workspaceId", args.workspaceId)
          )
          .collect(),
      ]);

    for (const member of members) {
      await ctx.db.delete(member._id);
    }

    for (const channel of channels) {
      await ctx.db.delete(channel._id);
    }

    for (const conversation of conversations) {
      await ctx.db.delete(conversation._id);
    }
    for (const message of messages) {
      await ctx.db.delete(message._id);
    }
    for (const reaction of reactions) {
      await ctx.db.delete(reaction._id);
    }

    await ctx.db.delete(args.workspaceId);

    return args.workspaceId;
  },
});

export const newJoinCode = mutation({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member || member.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const joinCode = generateCode();

    await ctx.db.patch(args.workspaceId, {
      joinCode,
    });

    return args.workspaceId;
  },
});

export const join = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    joinCode: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const workspace = await ctx.db.get(args.workspaceId);

    if (!workspace) {
      throw new Error("Workspace not found");
    }

    if (workspace.joinCode !== args.joinCode.toLowerCase()) {
      throw new Error("Invalid join code");
    }

    const existingMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    if (existingMember) {
      throw new Error("You are already a member of this workspace");
    }

    await ctx.db.insert("members", {
      workspaceId: args.workspaceId,
      userId,
      role: "member",
    });

    return args.workspaceId;
  },
});

// get inforamtion withput authorization
export const getInfoById = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    const workspace = await ctx.db.get(args.workspaceId);

    return {
      name: workspace?.name,
      isMember: !!member,
    };
  },
});

```

</details>

<details>
<summary><code>api/use-create-workspace.ts API</code></summary>

```typescript
import { useMutation } from "convex/react";
import { useCallback, useMemo, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

type RequestType = { name: string };
type ResponseType = Id<"workspaces"> | null;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const useCreateWorkspace = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "settled" | "pending" | "success" | "error" | null
  >(null);

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status !== null, [status]);

  const mutation = useMutation(api.workspaces.create);

  const mutate = useCallback(
    async (values: RequestType, options: Options) => {
      try {
        setData(null);
        setError(null);

        setStatus("pending");

        const response = await mutation(values);
        options?.onSuccess?.(response);
        return response;
      } catch (error) {
        setStatus("error");
        if (options?.throwError) {
          throw error;
        }
      } finally {
        setStatus("settled");
        options?.onSettled?.();
      }
    },
    [mutation]
  );
  return { mutate, data, error, isPending, isSuccess, isError, isSettled };
};

```

</details>

<details>
  
<summary><code>create-workspace-modal.ts</code></summary>

```typescript
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { useCreateWorkspace } from "../api/use-create-workspace";
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal";
import { useState } from "react";

const CreateWorkspaceModal = () => {
  const [open, setOpen] = useCreateWorkspaceModal();
  const [name, setName] = useState("");
  const router = useRouter();
  const { mutate, isPending, isError, isSuccess } = useCreateWorkspace();

  const handleClose = () => {
    setOpen(false);
    setName("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(
      { name },
      {
        onSuccess(id) {
          router.push(`/workspace/${id}`);
          handleClose();
          toast.success("Workspace created successfully");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a workspace</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
            required
            autoFocus
            minLength={3}
            placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
          />
          <div className="flex justify-end">
            <Button disabled={isPending} type="submit">
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkspaceModal;

```

</details>

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
git clone https://github.com/hrvojevincek/slack-clone
cd your-project
```

**Installation**

Install the project dependencies using npm:

```bash
bun install
```

**Set Up Environment Variables**

Create a new file named `.env` in the root of your project and add the following content:

```env
# Deployment used by `npx convex dev`
CONVEX_DEPLOYMENT=

NEXT_PUBLIC_CONVEX_URL=

```

Replace the placeholder values with your actual credentials

**Running the Project**

```bash for localhost
bun run dev
```

```bash for starting convex db
bunx convex dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.
