import { useState, useEffect } from "react";
import { Copy, Trash2, Volume2, VolumeX, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

/* ---------- Language Detection ---------- */
const detectLang = (text: string): string => {
  if (/[\u0C80-\u0CFF]/.test(text)) return "kn-IN"; // Kannada
  if (/[\u0900-\u097F]/.test(text)) return "hi-IN"; // Hindi
  if (/[\u0B80-\u0BFF]/.test(text)) return "ta-IN"; // Tamil
  if (/[\u0C00-\u0C7F]/.test(text)) return "te-IN"; // Telugu
  if (/[\u0D00-\u0D7F]/.test(text)) return "ml-IN"; // Malayalam
  if (/[\u0A80-\u0AFF]/.test(text)) return "gu-IN"; // Gujarati
  if (/[\u0A00-\u0A7F]/.test(text)) return "pa-IN"; // Punjabi
  if (/[\u0B00-\u0B7F]/.test(text)) return "or-IN"; // Odia
  if (/[\u0980-\u09FF]/.test(text)) return "bn-IN"; // Bengali
  if (/[\u0A80-\u0AFF]/.test(text)) return "mr-IN"; // Marathi

  // International
  if (/[\u0400-\u04FF]/.test(text)) return "ru-RU"; // Russian (Cyrillic)
  if (/[\u0370-\u03FF]/.test(text)) return "el-GR"; // Greek
  if (/[\u0600-\u06FF]/.test(text)) return "ar-SA"; // Arabic
  if (/[\u4E00-\u9FFF]/.test(text)) return "zh-CN"; // Chinese
  if (/[\u3040-\u30FF]/.test(text)) return "ja-JP"; // Japanese
  if (/[\uAC00-\uD7AF]/.test(text)) return "ko-KR"; // Korean
  return "en-US";
};

interface ChatMessageProps {
  message: Message;
  onDelete: () => void;
}

export const ChatMessage = ({ message, onDelete }: ChatMessageProps) => {
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  /* 🔑 VERY IMPORTANT: Load voices once (Chrome bug fix) */
  useEffect(() => {
    window.speechSynthesis.getVoices();
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Message copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  /* ---------- FIXED MULTI-LANGUAGE TTS ---------- */
  const handleSpeak = () => {
    if (!window.speechSynthesis) {
      toast({ title: "Text-to-Speech not supported" });
      return;
    }

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const lang = detectLang(message.content);
    const voices = window.speechSynthesis.getVoices();

    const voice =
      voices.find(v => v.lang === lang) ||
      voices.find(v => v.lang.startsWith(lang.split("-")[0])) ||
      voices.find(v => v.lang.startsWith("en"));

    if (!voice) {
      toast({
        title: "Voice not available",
        description: `No TTS voice found for ${lang}`,
      });
      return;
    }

    const utterance = new SpeechSynthesisUtterance(message.content);
    utterance.voice = voice;
    utterance.lang = voice.lang;

    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.cancel(); // 🔑 cancel previous
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 animate-fade-in group",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] lg:max-w-[70%]",
          isUser ? "order-2" : "order-1"
        )}
      >
        <div className={cn(isUser ? "chat-bubble-user" : "chat-bubble-assistant")}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>

        {/* Actions */}
        <div
          className={cn(
            "flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity",
            isUser ? "justify-end" : "justify-start"
          )}
        >
          <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 w-7 p-0">
            {copied ? (
              <Check className="w-3 h-3 text-primary" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </Button>

          <Button variant="ghost" size="sm" onClick={handleSpeak} className="h-7 w-7 p-0">
            {speaking ? (
              <VolumeX className="w-3 h-3 text-primary" />
            ) : (
              <Volume2 className="w-3 h-3" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-7 w-7 p-0"
          >
            <Trash2 className="w-3 h-3 text-destructive" />
          </Button>
        </div>
      </div>
    </div>
  );
};
