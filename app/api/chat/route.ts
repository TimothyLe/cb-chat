import { NextResponse } from 'next/server'

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434'

export async function POST(request) {
  try {
    const { message, model = 'llama2' } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
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
        { error: 'Failed to get response from Ollama' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    return NextResponse.json({
      response: data.response,
      model: data.model,
      created_at: data.created_at,
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
