export type Role = "user" | "assistant";

export interface ChatMessage {
  role: Role;
  content: string;
  createdAt: string;
}

export interface  SYSTEM_MESSAGE_PROPS {
  role: "system";
  content: string;
}