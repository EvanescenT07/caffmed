export type Role = "user" | "assistant";

export interface ChatMessageProps {
  id?: string;
  role: Role;
  content: string;
  createdAt: string;
  metadata?: {
    reactions?: string[];
    isDelivered?: boolean;
    isRead?: boolean;
  };
}

export interface CHATBOT_PROPS {
  message: ChatMessageProps;
  now: Date;
  isNew?: boolean;
  listEndRef: React.RefObject<HTMLElement | null>;
  isDelivered?: boolean;
  onReaction?: (messageId: string, emoji: string) => void;
  reactions?: string[];
}

export interface SYSTEM_MESSAGE_PROPS {
  role: "system";
  content: string;
}
