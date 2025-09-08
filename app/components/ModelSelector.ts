'use client'
import { useState } from 'react'

const COMMON_MODELS = [
  'llama2',
  'llama2:13b',
  'codellama',
  'mistral',
  'neural-chat',
  'starling-lm',
]

export default function ModelSelector({ selectedModel, onModelChange }) {
  const [customModel, setCustomModel] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)

  const handleModelSelect = (model) => {
    onModelChange(model)
    setShowCustomInput(false)
    setCustomModel('')
  }

  const handleCustomSubmit = (e) => {
    e.preventDefault()
    if (customModel.trim()) {
      onModelChange(customModel.trim())
      setShowCustomInput(false)
      setCustomModel('')
    }
  }

  return (
    <div className="border-b border-gray-200 p-4 bg-white">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-medium text-gray-700">Model:</span>
        
        {COMMON_MODELS.map((model) => (
          <button
            key={model}
            onClick={() => handleModelSelect(model)}
            className={`px-3 py-1 text-sm rounded-full border transition-colors ${
              selectedModel === model
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
            }`}
          >
            {model}
          </button>
        ))}
        
        <button
          onClick={() => setShowCustomInput(!showCustomInput)}
          className="px-3 py-1 text-sm rounded-full border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        >
          Custom
        </button>
      </div>
      
      {showCustomInput && (
        <form onSubmit={handleCustomSubmit} className="mt-3 flex gap-2">
          <input
            type="text"
            value={customModel}
            onChange={(e) => setCustomModel(e.target.value)}
            placeholder="Enter custom model name..."
            className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Use
          </button>
        </form>
      )}
    </div>
  )
}
