import { useState, useCallback, useEffect } from 'react';
import { Chat, Message } from '@/types/chat';

const STORAGE_KEY = 'medical-chatbot-history';

export const useChatStore = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const restoredChats = parsed.map((chat: any) => ({
          ...chat,
          createdAt: new Date(chat.createdAt),
          updatedAt: new Date(chat.updatedAt),
          messages: chat.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }));
        setChats(restoredChats);
        if (restoredChats.length > 0) {
          setActiveChatId(restoredChats[0].id);
        }
      } catch (e) {
        console.error('Failed to parse chat history:', e);
      }
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  }, [chats]);

  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  const createNewChat = useCallback(() => {
    const newChat: Chat = {
      id: crypto.randomUUID(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    return newChat.id;
  }, []);

  const deleteChat = useCallback((chatId: string) => {
    setChats((prev) => prev.filter((c) => c.id !== chatId));
    if (activeChatId === chatId) {
      setActiveChatId((prev) => {
        const remaining = chats.filter((c) => c.id !== chatId);
        return remaining.length > 0 ? remaining[0].id : null;
      });
    }
  }, [activeChatId, chats]);

  const addMessage = useCallback((chatId: string, message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === chatId) {
          const updatedMessages = [...chat.messages, newMessage];
          const title = chat.messages.length === 0 && message.role === 'user' 
            ? message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '')
            : chat.title;
          return {
            ...chat,
            title,
            messages: updatedMessages,
            updatedAt: new Date(),
          };
        }
        return chat;
      })
    );

    return newMessage;
  }, []);

  const deleteMessage = useCallback((chatId: string, messageId: string) => {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: chat.messages.filter((m) => m.id !== messageId),
            updatedAt: new Date(),
          };
        }
        return chat;
      })
    );
  }, []);

  const searchChats = useCallback((query: string) => {
    if (!query.trim()) return chats;
    const lowerQuery = query.toLowerCase();
    return chats.filter(
      (chat) =>
        chat.title.toLowerCase().includes(lowerQuery) ||
        chat.messages.some((m) => m.content.toLowerCase().includes(lowerQuery))
    );
  }, [chats]);

  return {
    chats,
    activeChat,
    activeChatId,
    setActiveChatId,
    createNewChat,
    deleteChat,
    addMessage,
    deleteMessage,
    searchChats,
  };
};
