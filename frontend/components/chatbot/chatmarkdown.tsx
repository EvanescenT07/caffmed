import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export const ChatMarkdown = ({
  content,
  isBot,
}: {
  content: string;
  isBot: boolean;
}) => {
  const [formattedContent, setFormattedContent] = useState("");

  useEffect(() => {
    // Simple markdown parsing for basic formatting
    const formatted = content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
      .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italic
      .replace(
        /`(.*?)`/g,
        '<code class="bg-accent/50 px-1 rounded text-xs">$1</code>'
      ) // Inline code
      .replace(/\n/g, "<br />"); // Line breaks

    setFormattedContent(formatted);
  }, [content]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      className={`prose prose-sm max-w-none ${
        isBot ? "prose-slate dark:prose-invert" : "prose-neutral"
      }`}
      dangerouslySetInnerHTML={{ __html: formattedContent }}
    />
  );
};
