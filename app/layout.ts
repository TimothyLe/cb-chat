import './globals.css'

export const metadata = {
  title: 'Ollama Chatbot',
  description: 'A simple chatbot using Ollama API',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

