import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

export const ChatMarkdown = ({
  content,
  isBot,
}: {
  content: string;
  isBot: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
    >
      <ReactMarkdown
        components={{
          strong: (props) => <span className="font-bold" {...props} />,
          p: (props) => <span {...props} />,
          ul: (props) => <ul className="list-disc ml-4" {...props} />,
          ol: (props) => <ol className="list-decimal ml-4" {...props} />,
          code: (props) => (
            <code
              className={`px-1 py-0.5 rounded-md border ${
                isBot ? "border-border bg-background" : "bg-card"
              }`}
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </motion.div>
  );
};
