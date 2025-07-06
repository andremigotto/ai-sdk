import { openrouter } from "@/lib/open-router";
import { generateText, tool } from "ai";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import z from "zod";

export async function GET(request: NextRequest) {
  const result = await generateText({
    model: openrouter.chat('openai/gpt-4o-2024-11-20'),
    tools: {
        profileAndUrls: tool({
            description: 'Essa ferramenta serve para buscar dados do perfil de um usuário do github ou acessar URLS da API para outras informações de um usuario, como lista de organizações, repositórios, eventos, seguidores, seguindo, etc.',
            parameters: z.object({
                username: z.string().describe('Nome do usuário do github'),
            }),
            execute: async ({ username }) => {
                const response = await fetch(`https://api.github.com/users/${username}`);
                const data = await response.text();

                return (data)
            }
        }),

        fetchHTTP: tool({
            description: 'Essa ferramenta serve para realizar uma requisição HTTP em uma URL especificada e acessar a sua resposta',
            parameters: z.object({
                url: z.string().url().describe('URL para acessar'),
            }),
            execute: async ({ url }) => {
                const response = await fetch(url);
                const data = await response.text();

                return (data)
            }
        })
    },
    prompt: 'Me da uma lista de usuario que o andremigotto segue no github e quais usuario seguem o andremigotto',
    maxSteps: 5,

    onStepFinish({ toolResults }) {
        console.log('Tool results:', toolResults);
    }
  })


  return NextResponse.json({ message: result.text })
}