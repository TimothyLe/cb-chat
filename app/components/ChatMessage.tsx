import { User, Bot } from 'lucide-react'

interface ChatMessageProps {
  message: string;
  isUser: boolean;
}

export default function ChatMessage({ message, isUser }: ChatMessageProps) {
  return (
    <div className={`flex gap-3 p-4 chat-message ${isUser ? 'bg-blue-50' : 'bg-gray-50'}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'
      }`}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 mb-1">
          {isUser ? 'You' : 'Assistant'}
        </p>
        <p className="text-gray-800 whitespace-pre-wrap break-words">
          {message}
        </p>
      </div>
    </div>
  )
}
