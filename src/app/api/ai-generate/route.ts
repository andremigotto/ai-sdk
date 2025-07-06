import { openrouter } from "@/lib/open-router";
import { generateObject } from "ai";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import z from "zod";

export async function GET(request: NextRequest) {
  const result = await generateObject({
    model: openrouter.chat('openai/gpt-4o-2024-11-20'),
    schema: z.object({
        en: z.string().describe('Tradução em inglês'),
        pt: z.string().describe('Tradução em português'),
        es: z.string().describe('Tradução em espanhol'),
    }),
    prompt: 'Traduza "Hello World" para diferentes idiomas!',
    system: 'Você é uma AI especializada em tradução, sempre retorne da maneira sucinta possível.'
  })

  return NextResponse.json({ message: result.object})
}