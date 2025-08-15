"use client";
import axios from "axios";

export function CaffBotAPI(endpoint: string) {
  const sendChat = async (
    payload: {
      role: "user" | "assistant";
      content: string;
    }[]
  ): Promise<string> => {
    const { data } = await axios.post(
      endpoint,
      { messages: payload },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (typeof data?.messages !== "string") {
      throw new Error("Invalid API response");
    }
    return data.messages as string;
  };

  return { sendChat };
}
