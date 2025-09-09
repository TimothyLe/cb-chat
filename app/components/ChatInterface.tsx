'use client';

import React, { useState, useRef } from 'react';
import { apiClient, ChatMessage, ChatResponse } from '@/lib/api';

export default function ChatInterface() {
  const [messages, setMessages] = useState<Array<{
    type: 'user' | 'assistant';
    content: string;
    chunks?: string[];
  }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message to chat
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);

    try {
      const chatMessage: ChatMessage = {
        message: userMessage,
        conversation_id: conversationId || undefined,
      };

      const response: ChatResponse = await apiClient.sendMessage(chatMessage);
      
      // Update conversation ID
      if (!conversationId) {
        setConversationId(response.conversation_id);
      }

      // Add assistant response to chat
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: response.response,
        chunks: response.chunks_used,
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      await apiClient.uploadDocument({
        content,
        filename: file.name,
      });
      
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: `Document "${file.name}" uploaded and processed successfully!`,
      }]);
    } catch (error) {
      console.error('Upload error:', error);
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: 'Failed to upload document. Please try again.',
      }]);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <p>{message.content}</p>
              {message.chunks && message.chunks.length > 0 && (
                <details className="mt-2 text-xs opacity-70">
                  <summary>Sources used</summary>
                  <div className="mt-1 space-y-1">
                    {message.chunks.map((chunk, i) => (
                      <div key={i} className="p-1 bg-gray-100 rounded text-gray-600">
                        {chunk.substring(0, 100)}...
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
              <div className="animate-pulse">Thinking...</div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t pt-4">
        <div className="flex mb-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt,.md,.pdf"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200 text-sm"
          >
            Upload Document
          </button>
        </div>

        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your documents..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
