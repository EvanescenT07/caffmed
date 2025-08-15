import { RelativeTimeStamp } from "@/hooks/relative-timestamp";
import { ChatMessage } from "@/types/chatbot";
import { motion } from "framer-motion";
import { ChatMarkdown } from "./chatmarkdown";
import { useEffect, useState } from "react";

export const MessageBubble = ({
  message,
  now,
  isNew = false,
  listEndRef,
}: {
  message: ChatMessage;
  now: Date;
  isNew?: boolean;
  listEndRef: React.RefObject<HTMLElement | null>;
}) => {
  const isBot = message.role === "assistant";
  const timeText = RelativeTimeStamp(message.createdAt, now);

  const [displayed, setDisplayed] = useState(isBot ? "" : message.content);

  useEffect(() => {
    if (!isBot || !isNew) {
      setDisplayed(message.content);
      return;
    }
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(message.content.slice(0, i + 1));
      i++;
      // Direct scroll for reliability
      if (listEndRef.current) {
        listEndRef.current.scrollIntoView({
          behavior: "smooth",
        } as ScrollIntoViewOptions);
      }
      if (i >= message.content.length) {
        clearInterval(interval);
      }
    }, 18);
    return () => clearInterval(interval);
  }, [isBot, isNew, message.content, listEndRef]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={`flex ${isBot ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm shadow-sm ${
          isBot
            ? "bg-muted text-foreground rounded-bl-none"
            : "bg-sidebar-primary text-sidebar-primary-foreground rounded-br-none"
        }`}
      >
        <ChatMarkdown content={displayed} isBot={isBot} />
        <div
          className={`mt-1 text-[10px] ${
            isBot
              ? "text-muted-foreground"
              : "text-sidebar-primary-foreground/80"
          }`}
        >
          {timeText}
        </div>
      </div>
    </motion.div>
  );
};
