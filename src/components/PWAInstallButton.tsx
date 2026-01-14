import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PWAInstallButtonProps {
  variant?: 'floating' | 'menu';
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
      // setIsVisible(false);
      // return;
    }

    window.addEventListener('beforeinstallprompt', handler);

    // For debugging: Force visibility if requested
    if (window.location.search.includes('force-pwa') || true) {
      setIsVisible(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // If we don't have the prompt, show instructions for iOS
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      if (isIOS) {
        alert("To install: Tap the Share button (square with arrow) and select 'Add to Home Screen'.");
      }
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  };

  if (!isVisible && !window.location.search.includes('force-pwa')) {
    console.log('PWA button hidden: isVisible is false');
    // For debugging: showing a small hint in the console
    return null;
  }

  if (variant === 'menu') {
    return (
      <Button 
        onClick={handleInstallClick}
        variant="ghost"
        className={cn("w-full justify-start gap-3 h-12 px-4 rounded-xl font-bold text-primary hover:bg-primary/10 transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] border border-primary/20", className)}
      >
        <Download className="w-5 h-5 text-primary animate-bounce" />
        <span className="bg-gradient-to-r from-primary to-gold-light bg-clip-text text-transparent">Install App</span>
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleInstallClick}
      className={cn(
        "fixed bottom-6 right-6 z-[9999] rounded-full shadow-[0_0_30px_rgba(212,175,55,0.5)] bg-gradient-to-r from-primary to-gold-light hover:scale-110 active:scale-95 transition-all duration-300 flex items-center gap-2 px-6 py-8 border-2 border-white/40 animate-pulse md:flex lg:flex",
        className
      )}
    >
      <Download className="w-8 h-8 text-white animate-bounce" />
      <span className="font-bold text-white text-lg">Install App</span>
    </Button>
  );
}
