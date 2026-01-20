export const TypingIndicator = () => {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="chat-bubble-assistant flex items-center gap-1.5 py-4">
        <span className="w-2 h-2 rounded-full bg-muted-foreground animate-typing" style={{ animationDelay: '0s' }} />
        <span className="w-2 h-2 rounded-full bg-muted-foreground animate-typing" style={{ animationDelay: '0.2s' }} />
        <span className="w-2 h-2 rounded-full bg-muted-foreground animate-typing" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  );
};
