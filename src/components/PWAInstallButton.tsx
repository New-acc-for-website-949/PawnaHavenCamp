import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PWAInstallButtonProps {
  variant?: 'floating' | 'menu' | 'hero';
  className?: string;
}

export function PWAInstallButton({ variant = 'floating', className }: PWAInstallButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('App is already installed/running in standalone mode');
      setIsVisible(false);
      return;
    }

    window.addEventListener('beforeinstallprompt', handler);

    // Initial check for visibility
    if (window.location.search.includes('force-pwa')) {
      setIsVisible(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // If we don't have the prompt, check if it's already installed or if it's iOS
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      if (isIOS) {
        alert("To install: Tap the Share button (square with arrow) and select 'Add to Home Screen'.");
      } else {
        alert("Installation prompt not available. Please try refreshing or using a supported browser (Chrome, Edge).");
      }
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsVisible(false);
      }
    } catch (error) {
      console.error('PWA install error:', error);
    }
  };

  // Ensure the button is always rendered for debugging/manual installation
  return (
    <Button 
      onClick={handleInstallClick}
      className={cn(
        variant === 'hero' 
          ? "inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm hover:scale-105 active:scale-95 transition-all duration-300 group h-auto mb-4"
          : variant === 'menu'
          ? "w-full justify-start gap-3 h-12 px-4 rounded-xl font-bold text-primary hover:bg-primary/10 transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] border border-primary/20"
          : "fixed bottom-6 right-6 z-[9999] rounded-full shadow-[0_0_30px_rgba(212,175,55,0.5)] bg-gradient-to-r from-primary to-gold-light hover:scale-110 active:scale-95 transition-all duration-300 flex items-center gap-2 px-6 py-8 border-2 border-white/40 animate-pulse",
        className
      )}
    >
      <Download className={cn(variant === 'hero' ? "w-4 h-4" : "w-6 h-6", "text-primary animate-bounce group-hover:animate-none")} />
      <span className={cn(
        "font-bold uppercase tracking-wider",
        variant === 'hero' ? "text-sm text-primary" : "text-lg bg-gradient-to-r from-primary to-gold-light bg-clip-text text-transparent"
      )}>
        Install App
      </span>
    </Button>
  );
}
