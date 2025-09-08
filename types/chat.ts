export interface Message {
  text: string;
  isUser: boolean;
  id: number;
  model?: string;
  created_at?: string;
}

export interface OllamaRequest {
  message: string;
  model: string;
}

export interface OllamaResponse {
  response: string;
  model: string;
  created_at: string;
  done?: boolean;
}

export interface ChatAPIResponse {
  response: string;
  model: string;
  created_at: string;
}

export interface ChatAPIError {
  error: string;
}
