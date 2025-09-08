import { NextRequest, NextResponse } from 'next/server'
import type { OllamaRequest, OllamaResponse, ChatAPIResponse, ChatAPIError } from '@/types/chat'

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434'

export async function POST(request: NextRequest): Promise<NextResponse<ChatAPIResponse | ChatAPIError>> {
  try {
    const { message, model = 'hf.co/bartowski/Llama-3.2-1B-Instruct-GGUF' }: OllamaRequest = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      )
    }

    const response = await fetch(`${OLLAMA_API_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        prompt: message,
        stream: false,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Ollama API error:', errorText)
      return NextResponse.json(
        { error: `Failed to get response from Ollama: ${response.statusText}` },
        { status: response.status }
      )
    }

    const data: OllamaResponse = await response.json()
    
    return NextResponse.json({
      response: data.response,
      model: data.model,
      created_at: data.created_at,
    })

  } catch (error) {
    console.error('Chat API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500 }
    )
  }
}
