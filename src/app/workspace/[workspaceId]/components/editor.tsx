import Hint from "@/components/ui/hint";
import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { MdSend } from "react-icons/md";
import { PiTextAa } from "react-icons/pi";
import { ImageIcon, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";

import Quill, { QuillOptions } from "quill";
import { Delta, Op } from "quill/core";
import "quill/dist/quill.snow.css";
import { cn } from "@/lib/utils";

type EditorValue = {
  image: File | null;
  body: string;
};

interface EditorProps {
  onSubmit: (value: EditorValue) => void;
  onCancel?: () => void;
  placeholder?: string;
  defaultValue?: Delta | Op[];
  varient: "create" | "update";
  disabled?: boolean;
  innerRef?: MutableRefObject<Quill | null>;
}

const Editor = ({
  varient = "create",
  placeholder = "Write something...",
  defaultValue = [],
  disabled = false,
  innerRef,
  onSubmit,
}: EditorProps) => {
  const [text, setText] = useState("");
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);

  const submitRef = useRef(onSubmit);
  const placeholderRef = useRef(placeholder);
  const quillRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const containerRef = useRef<HTMLDivElement>(null);
  const disabledRef = useRef(disabled);

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    placeholderRef.current = placeholder;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
  }, [onSubmit, placeholder, innerRef, defaultValue, disabled]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );

    const options: QuillOptions = {
      theme: "snow",
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          ["link"],
          [{ list: "ordered" }, { list: "bullet" }],
        ],
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: () => {
                // submit form
                console.log("SUBMIT");
                return;
              },
            },
            shiftEnter: {
              key: "Enter",
              shiftKey: true,
              handler: () => {
                // create new line
                quill.insertText(quill.getSelection()?.index || 0, "\n");
              },
            },
          },
        },
      },
    };

    const quill = new Quill(editorContainer, options);
    quillRef.current = quill;
    quillRef.current.focus();

    if (innerRef) {
      innerRef.current = quill;
    }

    quill.setContents(defaultValueRef.current);
    setText(quill.getText());

    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    });

    return () => {
      quill.off(Quill.events.TEXT_CHANGE);
      if (container) {
        container.innerHTML = "";
      }
      if (quillRef.current) {
        quillRef.current = null;
      }
      if (innerRef) {
        innerRef.current = null;
      }
    };
  }, [innerRef]);

  //TODO:come back to this and double check
  // const isEmpty = text.replace(/<(.|\n)*?>/g, "").length === 0;
  const cleanText = text.replace(/[<>]/g, "").replace(/\n/g, " ").trim();
  const isEmpty = cleanText.length === 0;

  const toggleToolbar = () => {
    setIsToolbarVisible(!isToolbarVisible);
    const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");
    if (toolbarElement) {
      toolbarElement.classList.toggle("hidden");
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white">
        <div className="h-full ql-container" ref={containerRef} />
        <div className="flex pb-2 px-2 z-[5]">
          <Hint
            label={isToolbarVisible ? "Hide Formatting" : "Show Formatting"}
          >
            <Button
              disabled={disabled}
              variant="ghost"
              size="iconSm"
              onClick={toggleToolbar}
            >
              <PiTextAa className="size-4" />
            </Button>
          </Hint>
          <Hint label="Emoji">
            <Button
              disabled={disabled}
              variant="ghost"
              size="iconSm"
              onClick={() => {}}
            >
              <Smile className="size-4" />
            </Button>
          </Hint>
          {varient === "create" && (
            <Hint label="Image">
              <Button
                disabled={disabled}
                variant="ghost"
                size="iconSm"
                onClick={() => {}}
              >
                <ImageIcon className="size-4" />
              </Button>
            </Hint>
          )}
          {varient === "update" && (
            <div className="ml-auto flex items-center gap-x-2">
              <Button
                disabled={disabled}
                variant="outline"
                size="sm"
                onClick={() => {}}
              >
                Cancel
              </Button>
              <Button
                disabled={disabled || isEmpty}
                onClick={() => {}}
                size="sm"
                className="bg-[#007A5A] hover:bg-[#007A5A]/90"
              >
                Save
              </Button>
            </div>
          )}
          {varient === "create" && (
            <Button
              className={cn(
                "ml-auto",
                isEmpty
                  ? "bg-white hover:bg-white text-muted-foreground"
                  : "bg-[#007A5A] hover:bg-[#007A5A]/90"
              )}
              disabled={disabled || isEmpty}
              size="iconSm"
              onClick={() => {}}
            >
              <MdSend className="size-4" />
            </Button>
          )}
        </div>
      </div>
      <div className="flex text-muted-foreground p-2 text-[10px] justify-end">
        <p>
          <strong>Shift + Enter</strong> to create a new line
        </p>
      </div>
    </div>
  );
};

export default Editor;
