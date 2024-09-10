import dynamic from "next/dynamic";
import Quill from "quill";

import React, { useRef } from "react";

const Editor = dynamic(() => import("../../../components/editor"), {
  ssr: false,
});

interface ChatInputProps {
  placeholder: string;
}

const ChatInput = ({ placeholder }: ChatInputProps) => {
  const editorRef = useRef<Quill | null>(null);

  return (
    <div className="px-5 w-full">
      <Editor
        varient="create"
        onSubmit={() => {}}
        disabled={false}
        innerRef={editorRef}
        placeholder={placeholder}
      />
    </div>
  );
};

export default ChatInput;
