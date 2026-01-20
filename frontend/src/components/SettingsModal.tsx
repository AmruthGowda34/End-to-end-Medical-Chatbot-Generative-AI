// import { Moon, Sun, X } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Switch } from '@/components/ui/switch';
// import { Label } from '@/components/ui/label';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';

// interface SettingsModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   theme: 'dark' | 'light';
//   onToggleTheme: () => void;
// }

// export const SettingsModal = ({
//   isOpen,
//   onClose,
//   theme,
//   onToggleTheme,
// }: SettingsModalProps) => {
//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-md glass">
//         <DialogHeader>
//           <DialogTitle className="flex items-center justify-between">
//             Settings
//             <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
//               <X className="w-4 h-4" />
//             </Button>
//           </DialogTitle>
//         </DialogHeader>

//         <div className="space-y-6 py-4">
//           {/* Theme Toggle */}
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               {theme === 'dark' ? (
//                 <Moon className="w-5 h-5 text-primary" />
//               ) : (
//                 <Sun className="w-5 h-5 text-primary" />
//               )}
//               <div>
//                 <Label htmlFor="theme-toggle" className="text-sm font-medium">
//                   Appearance
//                 </Label>
//                 <p className="text-xs text-muted-foreground">
//                   {theme === 'dark' ? 'Dark mode' : 'Light mode'}
//                 </p>
//               </div>
//             </div>
//             <Switch
//               id="theme-toggle"
//               checked={theme === 'light'}
//               onCheckedChange={onToggleTheme}
//             />
//           </div>

//           {/* About Section */}
//           <div className="pt-4 border-t border-border">
//             <h3 className="text-sm font-medium mb-2">About</h3>
//             <p className="text-xs text-muted-foreground">
//               Medical Chatbot Assistant v1.0
//             </p>
//             <p className="text-xs text-muted-foreground mt-1">
//               An AI-powered assistant for medical information and health queries.
//             </p>
//           </div>

//           {/* Disclaimer */}
//           <div className="p-3 bg-secondary rounded-lg">
//             <p className="text-xs text-muted-foreground">
//               <strong className="text-foreground">Disclaimer:</strong> This chatbot provides 
//               general information only and is not a substitute for professional medical advice, 
//               diagnosis, or treatment.
//             </p>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };
import { Moon, Sun, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const SettingsModal = ({
  isOpen,
  onClose,
  theme,
  onToggleTheme,
}: SettingsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* 👇 hide default radix close button */}
      <DialogContent
        className="sm:max-w-md glass"
        hideCloseButton
      >
        {/* Header */}
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Settings</span>

            {/* ✅ SINGLE custom close button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-muted"
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* Content */}
        <div className="space-y-6 py-4">
          {/* Appearance */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-primary" />
              ) : (
                <Sun className="w-5 h-5 text-primary" />
              )}

              <div>
                <Label className="text-sm font-medium">
                  Appearance
                </Label>
                <p className="text-xs text-muted-foreground">
                  {theme === 'dark' ? 'Dark mode' : 'Light mode'}
                </p>
              </div>
            </div>

            <Switch
              checked={theme === 'light'}
              onCheckedChange={onToggleTheme}
            />
          </div>

          {/* About */}
          <div className="pt-4 border-t border-border">
            <h3 className="text-sm font-medium mb-1">About</h3>
            <p className="text-xs text-muted-foreground">
              Medical Chatbot Assistant v1.0
            </p>
            <p className="text-xs text-muted-foreground">
              An AI-powered assistant for medical information and health queries.
            </p>
          </div>

          {/* Disclaimer */}
          <div className="rounded-lg bg-muted p-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">
                Disclaimer:
              </span>{' '}
              This chatbot provides general information only and is not a
              substitute for professional medical advice, diagnosis, or
              treatment.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
