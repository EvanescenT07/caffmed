"use client";

import { AutoScroll } from "@/hooks/auto-scroll";
import { CaffBotAPI } from "@/hooks/caffchatbot-api";
import { ChatMessage } from "@/types/chatbot";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Loader2, MessageCircle, Mic, MicOff, Send, X } from "lucide-react";
import { MessageBubble } from "./message-bubble";

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm CaffBot, an AI assistant specialized in brain tumor detection. How can I help you today?",
      createdAt: new Date().toISOString(),
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [now, setNow] = useState(new Date());

  const listEndRef = useRef<HTMLDivElement | null>(null);
  const { scrollToBottom } = AutoScroll(listEndRef);

  const {
    listening,
    browserSupportsSpeechRecognition,
    transcript,
    resetTranscript,
  } = useSpeechRecognition();

  const { sendChat } = CaffBotAPI("/api/chatbot");

  // Update user input from transcript
  useEffect(() => {
    if (transcript)
      setUserInput((prev) => (prev ? prev + " " : "") + transcript);
  }, [transcript]);

  // Speech recognition toggle
  const handleToogleListening = async () => {
    if (!browserSupportsSpeechRecognition) {
      toast.error("Browser does not support speech recognition");
      return;
    }
    try {
      if (!listening) {
        SpeechRecognition.startListening({
          continuous: true,
          language: "en-US",
        });
        toast.success("Listening...");
      } else {
        SpeechRecognition.stopListening();
        toast.success("Recognizing...");
      }
    } catch {
      toast.error("Error occurred while processing speech.");
    }
  };

  // Realtime clock for timestamps
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  const safeNow = now;

  // Send user input
  const handleSendInput = async () => {
    const text = userInput.trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: text,
      createdAt: safeNow.toISOString(),
    };

    setMessage((prev) => [...prev, userMessage]);
    setUserInput("");
    setIsLoading(true);

    try {
      const reply = await sendChat(
        [...message, userMessage].map(({ role, content }) => ({
          role,
          content,
        }))
      );
      const responseBotMessage: ChatMessage = {
        role: "assistant",
        content: reply,
        createdAt: safeNow.toISOString(),
      };
      setMessage((prev) => [...prev, responseBotMessage]);
      resetTranscript();
    } catch {
      toast.error("Failed to send message");
      setMessage((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Failed to send message",
          createdAt: safeNow.toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
      // Scroll to bottom after bot response
      setTimeout(scrollToBottom, 100);
    }
  };

  // Enter key handler
  const onEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendInput();
    }
  };

  // Scroll to bottom when chat is opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [message.length, isOpen, scrollToBottom]);

  // Scroll to bottom when messages change
  useEffect(() => {
    setTimeout(scrollToBottom, 100);
  }, [message.length, scrollToBottom]);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            key="chat"
            initial={{
              clipPath: "circle(0% at 95% 95%)",
              opacity: 0,
            }}
            animate={{
              clipPath: "circle(150% at 95% 95%)",
              opacity: 1,
            }}
            exit={{
              clipPath: "circle(0% at 95% 95%)",
              opacity: 0,
            }}
            transition={{
              duration: 0.45,
              ease: [0.4, 0.0, 0.2, 1],
            }}
            className="w-[360px] h-[560px] bg-card text-foreground border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col backdrop-blur-2xl supports-[backdrop-filter]:bg-card/90"
          >
            {/* Header */}
            <div className="relative p-4 border-b border-border bg-gradient-to-br from-secondary/60 to-accent/40">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-sidebar-primary text-sidebar-primary-foreground grid place-items-center font-bold">
                  CB
                </div>
                <div>
                  <h2 className="text-base font-semibold leading-tight">
                    CaffBot
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Brain Tumor Assistant
                  </p>
                </div>
              </div>
              <button
                title="Close chat"
                onClick={() => setIsOpen(false)}
                className="absolute right-3 top-3 p-2 rounded-xl hover:bg-muted/70 focus:outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <AnimatePresence initial={false}>
                {message.map((msg, idx) => {
                  // Typewriter only for the last assistant message after user input
                  const isLastBot =
                    idx === message.length - 1 &&
                    msg.role === "assistant" &&
                    !isLoading &&
                    message.length > 1 &&
                    message[message.length - 2].role === "user";
                  return (
                    <MessageBubble
                      key={`${msg.createdAt}-${idx}`}
                      message={msg}
                      now={safeNow}
                      isNew={isLastBot}
                      listEndRef={listEndRef}
                    />
                  );
                })}
                {isLoading && (
                  <motion.div
                    key="typing"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[80%] bg-muted text-foreground rounded-2xl rounded-bl-none px-4 py-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Thinking…
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={listEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border bg-background">
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={onEnter}
                    placeholder="Type a message… or use voice"
                    disabled={isLoading}
                    className="w-full placeholder:text-muted-foreground/70 text-sm rounded-2xl bg-input/60 border border-input focus:ring-2 focus:ring-ring/40 focus:outline-none px-4 py-3"
                  />
                </div>

                {/* Voice Button */}
                <button
                  type="button"
                  onClick={handleToogleListening}
                  title={listening ? "Stop voice" : "Start voice"}
                  className={`p-3 rounded-2xl border border-input hover:bg-accent/60 transition ${
                    listening ? "bg-accent" : "bg-card"
                  }`}
                >
                  {listening ? (
                    <Mic className="h-5 w-5" />
                  ) : (
                    <MicOff className="h-5 w-5" />
                  )}
                </button>

                {/* Send Button */}
                <button
                  type="button"
                  onClick={handleSendInput}
                  disabled={isLoading || !userInput.trim()}
                  title="Send"
                  className="p-3 rounded-2xl bg-sidebar-primary text-sidebar-primary-foreground hover:opacity-90 disabled:opacity-50"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="fab"
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1 }}
            onClick={() => setIsOpen(true)}
            title="Open chat"
            className="absolute bottom-0 right-0 p-4 rounded-full bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
          >
            <MessageCircle className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingChatbot;
