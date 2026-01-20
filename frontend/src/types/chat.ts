export type Role = "user" | "assistant";

export interface Message {
  id: string;
  content: string;
  role: Role;
  timestamp: string; // keep string (ISO from backend)
  imageUrl?: string | null;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
}


export interface ChatState {
  chats: Chat[];
  activeChat: string | null;
  searchQuery: string;
}
