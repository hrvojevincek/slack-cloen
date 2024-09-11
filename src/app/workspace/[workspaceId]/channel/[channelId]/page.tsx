"use client";

import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import { Loader, TriangleAlert } from "lucide-react";
import React from "react";
import Header from "./components/header";
import ChatInput from "./components/chat-input";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import MessageList from "@/components/message-list";

const ChannelIdPage = () => {
  const channelId = useChannelId();

  const { results, status, loadMore } = useGetMessages({ channelId });
  const { data: channel, isLoading: channelLoading } = useGetChannel({
    channelId,
  });

  if (channelLoading || status === "LoadingFirstPage")
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader className="animate-spin size-6 text-muted-foreground" />
      </div>
    );

  if (!channel)
    return (
      <div className="h-full flex-1 flex flex-col gap-y-2 items-center justify-center">
        <TriangleAlert className="size-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          This channel does not exist
        </span>
      </div>
    );

  return (
    <div className="flex flex-col h-full">
      <Header title={channel.name} />
      <MessageList
        variant="channel"
        channelName={channel.name}
        channelCreationTime={channel._creationTime}
        loadMore={loadMore}
        isLoading={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
        data={results}
      />
      <ChatInput placeholder={`Message #${channel.name}`} />
    </div>
  );
};

export default ChannelIdPage;
