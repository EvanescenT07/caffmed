"use client";

import { RelativeTimeStamp } from "@/hooks/relative-timestamp";
import { CHATBOT_PROPS } from "@/types/chatbot";
import { ChatMarkdown } from "@/components/chatbot/chatmarkdown";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ThumbsUp, ThumbsDown, Heart, Smile } from "lucide-react";

const MessageBubble = ({
  message,
  now,
  isNew,
  listEndRef,
  isDelivered = true,
  onReaction,
  reactions = [],
}: CHATBOT_PROPS) => {
  const isBot = message.role === "assistant";
  const timeText = RelativeTimeStamp(message.createdAt, now);
  const [displayed, setDisplayed] = useState(
    isBot && isNew ? "" : message.content
  );

  useEffect(() => {
    if (!isBot || !isNew) {
      setDisplayed(message.content);
      return;
    }
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(message.content.slice(0, i + 1));
      i++;
      if (listEndRef.current) {
        listEndRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        } as ScrollIntoViewOptions);
      }
      if (i >= message.content.length) {
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [isBot, isNew, message.content, listEndRef]);

  const reactionEmojis = [
    { emoji: "👍", icon: ThumbsUp },
    { emoji: "👎", icon: ThumbsDown },
    { emoji: "❤️", icon: Heart },
    { emoji: "😊", icon: Smile },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={`flex ${isBot ? "justify-start" : "justify-end"}`}
    >
      <div className={`max-w-[80%] ${isBot ? "order-1" : "order-2"}`}>
        <div
          className={`relative px-4 py-3 rounded-2xl text-sm shadow-sm ${
            isBot
              ? "bg-muted text-foreground rounded-bl-none"
              : "bg-sidebar-primary text-sidebar-primary-foreground rounded-br-none"
          }`}
        >
          <ChatMarkdown content={displayed} isBot={isBot} />

          <div className="flex items-center justify-between mt-1">
            <span
              className={`text-[10px] ${
                isBot
                  ? "text-muted-foreground"
                  : "text-sidebar-primary-foreground/80"
              }`}
            >
              {timeText}
            </span>
            {!isBot && (
              <span className="text-[8px] opacity-60">
                {isDelivered ? "✓✓" : "✓"}
              </span>
            )}
          </div>
        </div>

        {/* Reaction buttons for bot messages */}
        {isBot && onReaction && (
          <div className="flex gap-1 mt-2 ml-2">
            {reactionEmojis.map(({ emoji }) => (
              <motion.button
                key={emoji}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onReaction(message.createdAt, emoji)}
                className="text-xs hover:bg-accent/50 rounded-full px-2 py-1 transition-colors"
              >
                {emoji}
              </motion.button>
            ))}
          </div>
        )}

        {/* Display reactions */}
        {reactions.length > 0 && (
          <div className="flex gap-1 mt-1 ml-2">
            {reactions.map((reaction, idx) => (
              <span
                key={idx}
                className="text-xs bg-accent/30 rounded-full px-2 py-1"
              >
                {reaction}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MessageBubble;

