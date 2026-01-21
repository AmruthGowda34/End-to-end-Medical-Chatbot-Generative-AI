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
import { sendMessage } from "@/lib/api";

const Index = () => {
  const {
    chats,
    activeChat,
    activeChatId,
    setActiveChatId,
    createNewChat,
    deleteChat,
    addMessage,
    deleteMessage,
    searchChats,
  } = useChatStore();

  const { theme, toggleTheme } = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* ---------- auto scroll ---------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages, isLoading]);

  /* ---------- SEND MESSAGE (MATCHES BACKEND) ---------- */
  const handleSendMessage = async (content: string, file?: File) => {
    let chatId = activeChatId;

    if (!chatId) {
      chatId = createNewChat();
    }

    // 1️⃣ Add user message immediately
    addMessage(chatId, {
      id: crypto.randomUUID(),
      content,
      role: "user",
    });

    setIsLoading(true);

    try {
      // 2️⃣ Backend returns PLAIN STRING
      const answer = await sendMessage(content, file);

      if (!answer || !answer.trim()) {
        throw new Error("Empty response from backend");
      }

      // 3️⃣ Add assistant message
      addMessage(chatId, {
        id: crypto.randomUUID(),
        content: answer.trim(),
        role: "assistant",
      });
    } catch (error) {
      console.error("❌ Chat error:", error);

      addMessage(chatId, {
        id: crypto.randomUUID(),
        content:
          "⚠ The medical assistant could not generate a response. Please try rephrasing your question.",
        role: "assistant",
      });
    } finally {
      // 4️⃣ Always stop loader
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (text: string) => {
    handleSendMessage(text);
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
        onNewChat={() => {
          createNewChat();
          setSidebarOpen(false);
        }}
        onDeleteChat={deleteChat}
        onOpenSettings={() => setSettingsOpen(true)}
        searchChats={searchChats}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center gap-3 p-4 border-b border-border bg-background/50 backdrop-blur-xl">
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
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {!activeChat || activeChat.messages.length === 0 ? (
            <WelcomeScreen onSuggestionClick={handleSuggestionClick} />
          ) : (
            <div className="max-w-4xl mx-auto p-4 space-y-4">
              {activeChat.messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  onDelete={() =>
                    deleteMessage(activeChat.id, message.id)
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
