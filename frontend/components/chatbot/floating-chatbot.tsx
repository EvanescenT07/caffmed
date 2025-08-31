"use client";

import { AutoScroll } from "@/hooks/auto-scroll";
import { CaffBotAPI } from "@/hooks/caffchatbot-api";
import { ChatMessageProps } from "@/types/chatbot";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import {
  MessageCircle,
  Mic,
  MicOff,
  Send,
  X,
  Search,
  Trash2,
} from "lucide-react";
import MessageBubble from "./message-bubble";
import { ConfirmationModal } from "@/hooks/confirmation-modal";
import ModalConfirmation from "../modal/modal_confirmation";

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<ChatMessageProps[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [now, setNow] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [reactions, setReactions] = useState<{ [messageId: string]: string[] }>(
    {}
  );
  const [retryCount, setRetryCount] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  const listEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const { scrollToBottom } = AutoScroll(listEndRef);

  const {
    isOpen: isModalOpen,
    modalProps,
    openModal,
    closeModal,
    handleConfirm,
  } = ConfirmationModal();

  const {
    listening,
    browserSupportsSpeechRecognition,
    transcript,
    resetTranscript,
  } = useSpeechRecognition();

  const { sendChat } = CaffBotAPI("/api/chatbot");

  // Quick reply suggestions
  const quickReplies = [
    "What types of brain tumors can you detect?",
    "How accurate is the detection?",
    "What should I do if I have symptoms?",
    "Tell me about MRI scans",
  ];

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("caffbot-messages");
    if (savedMessages) {
      setMessage(JSON.parse(savedMessages));
    } else {
      // Set initial message if no saved messages
      setMessage([
        {
          role: "assistant",
          content:
            "Hi! I'm CaffBot, an AI assistant specialized in brain tumor detection. How can I help you today?",
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    if (message.length > 0) {
      localStorage.setItem("caffbot-messages", JSON.stringify(message));
    }
  }, [message]);

  // Filter messages based on search
  const filteredMessages = useMemo(() => {
    if (!searchQuery) return message;
    return message.filter((msg) =>
      msg.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [message, searchQuery]);

  // Update user input from transcript
  useEffect(() => {
    if (transcript) {
      setUserInput((prev) => (prev ? prev + " " : "") + transcript);
    }
  }, [transcript]);

  // Speech recognition toggle
  const handleToggleListening = async () => {
    if (!browserSupportsSpeechRecognition) {
      toast.error("Browser does not support speech recognition");
      return;
    }
    try {
      if (!listening) {
        setIsRecording(true);
        SpeechRecognition.startListening({
          continuous: true,
          language: "en-US",
        });
        toast.success("Listening...");
      } else {
        setIsRecording(false);
        SpeechRecognition.stopListening();
        toast.success("Recognizing...");
      }
    } catch {
      toast.error("Error occurred while processing speech.");
    }
  };

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setUserInput(textarea.value);

    // Auto-resize
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
  };

  // Realtime clock for timestamps
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Send user input with retry mechanism
  const handleSendInput = async () => {
    const text = userInput.trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessageProps = {
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessage((prev) => [...prev, userMessage]);
    setUserInput("");
    setIsLoading(true);

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    try {
      const reply = await sendChat(
        [...message, userMessage].map(({ role, content }) => ({
          role,
          content,
        }))
      );
      const responseBotMessage: ChatMessageProps = {
        role: "assistant",
        content: reply,
        createdAt: new Date().toISOString(),
      };
      setMessage((prev) => [...prev, responseBotMessage]);
      resetTranscript();
      setRetryCount(0);
    } catch (error) {
      console.error("Error sending message:", error);

      // Retry mechanism
      if (retryCount < 3) {
        setRetryCount((prev) => prev + 1);
        toast.error(
          `Failed to send message. Retrying... (${retryCount + 1}/3)`
        );
        setTimeout(() => handleSendInput(), 2000 * (retryCount + 1));
      } else {
        toast.error("Failed to send message after multiple attempts");
        setMessage((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Sorry, I'm having trouble responding right now. Please try again later.",
            createdAt: new Date().toISOString(),
          },
        ]);
        setRetryCount(0);
      }
    } finally {
      setIsLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  // Enter key handler
  const onEnter = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendInput();
    }
  };

  // Handle reactions
  const handleReaction = (messageId: string, emoji: string) => {
    setReactions((prev) => {
      const currentReactions = prev[messageId] || [];

      // Check if reaction already exists
      if (currentReactions.includes(emoji)) {
        // Remove reaction if it already exists (toggle behavior)
        return {
          ...prev,
          [messageId]: currentReactions.filter(
            (reaction) => reaction !== emoji
          ),
        };
      } else {
        // Add reaction if it doesn't exist
        return {
          ...prev,
          [messageId]: [...currentReactions, emoji],
        };
      }
    });
  };

  // Clear chat
  const clearChat = () => {
    const userMessages = message.filter((msg) => msg.role === "user");
    if (userMessages.length === 0) {
      toast.error("No messages to clear! Start a conversation first.");
      return;
    }

    openModal({
      title: "Clear Chat History",
      message:
        "Are you sure to want to clear all messages? this action cannot be undone.",
      confirmText: "Clear All",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: () => {
        setMessage([
          {
            role: "assistant",
            content:
              "Hi! I'm CaffBot, an AI assistant specialized in brain tumor detection. How can I help you today?",
            createdAt: new Date().toISOString(),
          },
        ]);
        setReactions({});
        localStorage.removeItem("caffbot-messages");
        toast.success("✨ Chat cleared! Ready for a fresh start.");
      },
    });
  };

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Scroll to bottom when chat is opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [isOpen, scrollToBottom]);

  // Scroll to bottom when messages change
  useEffect(() => {
    setTimeout(scrollToBottom, 100);
  }, [message.length, scrollToBottom]);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {modalProps && (
        <ModalConfirmation
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirm={handleConfirm}
          title={modalProps.title}
          message={modalProps.message}
          confirmText={modalProps.confirmText}
          cancelText={modalProps.cancelText}
          type={modalProps.type}
          icon={
            modalProps.type === "danger" ? (
              <div className="p-2 rounded-full bg-red-100 text-red-600">
                <Trash2 className="h-5 w-5" />
              </div>
            ) : undefined
          }
        />
      )}
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
            className="w-[min(360px,90vw)] h-[min(560px,80vh)] md:w-[360px] md:h-[560px] bg-card text-foreground border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col backdrop-blur-2xl supports-[backdrop-filter]:bg-card/90"
          >
            {/* Header */}
            <div className="relative p-4 border-b border-border bg-gradient-to-br from-secondary/60 to-accent/40">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-sidebar-primary text-sidebar-primary-foreground grid place-items-center font-bold">
                  CB
                </div>
                <div className="flex-1">
                  <h2 className="text-base font-semibold leading-tight">
                    CaffBot
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Brain Tumor Assistant
                  </p>
                </div>

                {/* Header actions */}
                <div className="flex gap-1">
                  <button
                    title="Clear chat"
                    onClick={clearChat}
                    className="p-2 rounded-xl hover:bg-muted/70 focus:outline-none"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button
                    title="Close chat"
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-xl hover:bg-muted/70 focus:outline-none"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Search bar */}
              <div className="mt-3 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring/40"
                />
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-3"
              role="log"
              aria-live="polite"
              aria-label="Chat messages"
            >
              <AnimatePresence initial={false}>
                {filteredMessages.map((msg, idx) => {
                  // Typewriter only for the last assistant message after user input
                  const isLastBot =
                    idx === filteredMessages.length - 1 &&
                    msg.role === "assistant" &&
                    !isLoading &&
                    filteredMessages.length > 1 &&
                    filteredMessages[filteredMessages.length - 2].role ===
                      "user";

                  return (
                    <motion.div
                      key={`${msg.createdAt}-${idx}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{
                        duration: 0.3,
                        delay: idx * 0.05, // Stagger effect
                        ease: "easeOut",
                      }}
                    >
                      <MessageBubble
                        message={msg}
                        now={now}
                        isNew={isLastBot}
                        listEndRef={listEndRef}
                        onReaction={handleReaction}
                        reactions={reactions[msg.createdAt] || []}
                      />
                    </motion.div>
                  );
                })}

                {/* Enhanced loading indicator */}
                {isLoading && (
                  <motion.div
                    key="typing"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[80%] bg-muted text-foreground rounded-2xl rounded-bl-none px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          <motion.div
                            className="w-2 h-2 bg-muted-foreground/60 rounded-full"
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{
                              duration: 1.2,
                              repeat: Infinity,
                              delay: 0,
                            }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-muted-foreground/60 rounded-full"
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{
                              duration: 1.2,
                              repeat: Infinity,
                              delay: 0.2,
                            }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-muted-foreground/60 rounded-full"
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{
                              duration: 1.2,
                              repeat: Infinity,
                              delay: 0.4,
                            }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          CaffBot is typing...
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={listEndRef} />
            </div>

            {/* Quick replies */}
            {!isLoading && userInput.length === 0 && (
              <div className="px-4 pb-2">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {quickReplies.map((reply) => (
                    <motion.button
                      key={reply}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setUserInput(reply)}
                      className="text-xs bg-accent/50 hover:bg-accent rounded-full px-3 py-2 whitespace-nowrap transition-colors"
                    >
                      {reply}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-border bg-background">
              <div className="flex items-center justify-center gap-2">
                <textarea
                  ref={inputRef}
                  value={userInput}
                  onChange={handleInputChange}
                  onKeyDown={onEnter}
                  placeholder="Type a message or use voice"
                  disabled={isLoading}
                  rows={1}
                  className="w-full resize-none placeholder:text-muted-foreground/70 text-xs rounded-2xl bg-input/60 border border-input focus:ring-2 focus:ring-ring/40 focus:outline-none px-4 py-2 scrollbar-none"
                  style={{ maxHeight: "120px" }}
                />
                {userInput.length > 0 && (
                  <span className="absolute bottom-1 right-2 text-[10px] text-muted-foreground">
                    {userInput.length}/2000
                  </span>
                )}

                {/* Voice Button */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleToggleListening}
                  title={isRecording ? "Stop recording" : "Start recording"}
                  className={`p-3 rounded-2xl border border-input hover:bg-accent/60 transition ${
                    isRecording
                      ? "bg-red-100 border-red-300 dark:bg-red-900/20"
                      : "bg-card"
                  }`}
                >
                  {isRecording ? (
                    <Mic className="h-5 w-5 text-red-600" />
                  ) : (
                    <MicOff className="h-5 w-5" />
                  )}
                </motion.button>

                {/* Voice waveform animation */}
                {isRecording && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-primary rounded-full"
                        animate={{ height: [4, 12, 4] }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Send Button */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendInput}
                  disabled={isLoading || !userInput.trim()}
                  title="Send"
                  className="p-3 rounded-2xl bg-sidebar-primary text-sidebar-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  <Send className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="fab"
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            title="Open chat"
            className="absolute bottom-0 right-0 p-4 rounded-full bg-sidebar-primary text-sidebar-primary-foreground shadow-lg transition-transform"
          >
            <MessageCircle className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingChatbot;
