import { Stethoscope, Heart, Brain, Pill, Activity } from 'lucide-react';

const suggestions = [
  { icon: Heart, text: "What are the symptoms of high blood pressure?" },
  { icon: Brain, text: "How can I improve my mental health?" },
  { icon: Pill, text: "What are common medication interactions?" },
  { icon: Activity, text: "Tips for maintaining a healthy lifestyle" },
];

interface WelcomeScreenProps {
  onSuggestionClick: (text: string) => void;
}

export const WelcomeScreen = ({ onSuggestionClick }: WelcomeScreenProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mb-6 glow">
        <Stethoscope className="w-10 h-10 text-primary-foreground" />
      </div>

      <h1 className="text-3xl lg:text-4xl font-bold text-center mb-3">
        Welcome to Medical Chatbot
      </h1>
      <h2 className="text-xl text-primary font-medium mb-2">Assistant</h2>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        Your AI-powered health companion. Ask me anything about symptoms, 
        medications, wellness tips, and more.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion.text)}
            className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50 hover:bg-secondary border border-border/50 hover:border-primary/50 transition-all duration-200 text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
              <suggestion.icon className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-foreground">{suggestion.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
