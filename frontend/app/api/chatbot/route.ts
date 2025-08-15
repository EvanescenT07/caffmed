import { SYSTEM_MESSAGE_PROPS } from "@/types/chatbot";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_MESSAGE: SYSTEM_MESSAGE_PROPS = {
  role: "system",
  content:
    "You are CaffBot, a helpful AI assistant specialized in brain tumor detection and medical imaging. You can provide information about brain tumors, MRI scans, and the detection process. Keep responses concise and medical-focused. If the user need please hesitate give answer to contact medical professional, but before that you can ask user location and give the best nearest hospital or medical professional. And do not answer the question outside from the medical context.",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (
      !body.messages ||
      !Array.isArray(body.messages) ||
      body.messages.length === 0
    ) {
      return NextResponse.json(
        {
          error: "Invalid request format: 'messages' must be a non-empty array",
        },
        { status: 400 }
      );
    }

    const messages = [SYSTEM_MESSAGE, ...body.messages];

    const responses = await openai.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: messages,
    });

    return NextResponse.json({
      messages: responses.choices[0].message.content,
      status: 200,
    });
  } catch (error) {
    console.error("Error processing chat:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
