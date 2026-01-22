import { useState, useRef, useEffect } from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { SettingsModal } from "@/components/SettingsModal";
import { TypingIndicator } from "@/components/TypingIndicator";

import { useChatStore } from "@/hooks/useChatStore";
import { useTheme } from "@/hooks/useTheme";
import { sendMessage, createChat } from "@/lib/api";

const Index = () => {
  const {
    chats,
    activeChat,
    activeChatId,
    setActiveChatId,
    deleteChat,
    deleteMessage,
    searchChats,
    setChatFromBackend,
  } = useChatStore();

  const { theme, toggleTheme } = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* ---------------- Auto scroll ---------------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages, isLoading]);

  /* ---------------- NEW CHAT ---------------- */
  const handleNewChat = async () => {
    try {
      const chat = await createChat();
      setChatFromBackend(chat);
      setSidebarOpen(false);
    } catch (err) {
      console.error("Failed to create new chat", err);
    }
  };

  /* ---------------- SEND MESSAGE (OPTIMISTIC) ---------------- */
  const handleSendMessage = async (content: string, file?: File) => {
    if (!content.trim() && !file) return;

    setIsLoading(true);
    let chatId = activeChatId;

    try {
      /* 1️⃣ Ensure chat exists */
      if (!chatId) {
        const newChat = await createChat();
        setChatFromBackend(newChat);
        chatId = newChat.id;
      }

      /* 2️⃣ INSTANT UI UPDATE (NO FREEZE) */
      setChatFromBackend({
        id: chatId,
        title: activeChat?.title || "New Chat",
        createdAt: activeChat?.createdAt || new Date(),
        updatedAt: new Date(),
        messages: [
          ...(activeChat?.messages || []),
          {
            id: crypto.randomUUID(),
            role: "user",
            content,
            timestamp: new Date(),
          },
        ],
      });

      /* 3️⃣ Backend call (slow part) */
      const response = await sendMessage(chatId, content, file);

      /* 4️⃣ Replace with backend truth */
      setChatFromBackend(response.chat);

    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- WELCOME CARD FIX ---------------- */
  const handleSuggestionClick = (text: string) => {
    handleSendMessage(`Medical question: ${text}`);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={(id) => {
          setActiveChatId(id);
          setSidebarOpen(false);
        }}
        onNewChat={handleNewChat}
        onDeleteChat={deleteChat}
        onOpenSettings={() => setSettingsOpen(true)}
        searchChats={searchChats}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center gap-3 p-4 border-b">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>

          <h1 className="text-lg font-semibold truncate">
            {activeChat?.title || "Medical Chatbot Assistant"}
          </h1>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {!activeChat || activeChat.messages.length === 0 ? (
            <WelcomeScreen onSuggestionClick={handleSuggestionClick} />
          ) : (
            <div className="max-w-4xl mx-auto p-4 space-y-4">
              {activeChat.messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  onDelete={() =>
                    deleteMessage(activeChat.id, msg.id)
                  }
                />
              ))}

              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </main>

      {/* Settings */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    </div>
  );
};

export default Index;
