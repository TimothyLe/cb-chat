'use client'
import { useState, useRef, useEffect } from 'react'
import ChatMessage from './components/ChatMessage'
import ChatInput from './components/ChatInput'
import ModelSelector from './components/ModelSelector'
import type { Message, ChatAPIResponse, ChatAPIError } from '@/types/chat'
import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedModel, setSelectedModel] = useState<string>('hf.co/bartowski/Llama-3.2-1B-Instruct-GGUF')
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (message: string): Promise<void> => {
    const newUserMessage: Message = { 
      text: message, 
      isUser: true, 
      id: Date.now() 
    }
    setMessages(prev => [...prev, newUserMessage])
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          model: selectedModel,
        }),
      })

      const data: ChatAPIResponse | ChatAPIError = await response.json()

      if (!response.ok) {
        throw new Error((data as ChatAPIError).error || 'Failed to get response')
      }

      const responseData = data as ChatAPIResponse
      const assistantMessage: Message = {
        text: responseData.response,
        isUser: false,
        id: Date.now() + 1,
        model: responseData.model,
        created_at: responseData.created_at,
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      console.error('Error sending message:', err)
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      
      const errorMessageObj: Message = {
        text: `Error: ${errorMessage}. Please make sure Ollama is running and the model "${selectedModel}" is available.`,
        isUser: false,
        id: Date.now() + 1,
      }
      setMessages(prev => [...prev, errorMessageObj])
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = (): void => {
    setMessages([])
    setError(null)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">ContextBuddy Chat</h1>
          <button
            onClick={clearChat}
            type="button"
            className="px-4 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Clear Chat
          </button>
        </div>
      </header>

      {/* Model Selector */}
      <div className="max-w-4xl mx-auto w-full">
        <ModelSelector 
          selectedModel={selectedModel} 
          onModelChange={setSelectedModel}
        />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto max-w-4xl mx-auto w-full bg-white">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Welcome to ContextBuddy Chat</h2>
              <p>Start a conversation by typing a message below.</p>
              <p className="text-sm mt-2">Current model: <span className="font-mono">{selectedModel}</span></p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.text}
                isUser={message.isUser}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="max-w-4xl mx-auto w-full">
        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
      </div>

      {/* Error Display */}
      {error && (
        <div className="max-w-4xl mx-auto w-full p-4 bg-red-50 border-t border-red-200">
          <p className="text-red-800 text-sm">
            <strong>Connection Error:</strong> {error}
          </p>
        </div>
      )}
    </div>
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Assistant
        </h1>
        <ChatInterface />
      </div>
    </main>
  )
}
