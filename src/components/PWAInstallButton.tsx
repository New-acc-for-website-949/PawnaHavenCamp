import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface PWAInstallButtonProps {
  variant?: 'floating' | 'menu' | 'hero';
  className?: string;
}

export function PWAInstallButton({ variant = 'floating', className }: PWAInstallButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
      return;
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    const handler = (e: any) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e);
      // Automatically trigger the prompt once it's ready if the user recently clicked
      const lastClick = localStorage.getItem('pwa_install_click_pending');
      if (lastClick && Date.now() - parseInt(lastClick) < 10000) {
        localStorage.removeItem('pwa_install_click_pending');
        e.prompt();
      }
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      toast.success("App installed successfully!");
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isInstalled) {
      toast.info("App is already installed!");
      return;
    }

    if (!deferredPrompt) {
      if (isIOS) {
        toast.info(
          "To install: Tap the 'Share' button in Safari and select 'Add to Home Screen' 📲",
          { duration: 6000 }
        );
      } else {
        // Set a flag to trigger the prompt as soon as it's ready
        localStorage.setItem('pwa_install_click_pending', Date.now().toString());
        toast.info("Preparing installation... If a prompt doesn't appear, please click again in a few seconds or use 'Add to Home Screen' from your browser menu.");
      }
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } catch (error) {
      console.error('PWA install error:', error);
      toast.error("Installation failed. Please try via your browser menu.");
    }
  };

  // One-click behavior: always show the button if not installed
  // We want it to be as "one-click" as possible, so we don't hide it
  // until we are absolutely sure it's installed or prompt is accepted.
  return (
    <Button 
      onClick={handleInstallClick}
      className={cn(
        variant === 'hero' 
          ? "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary to-gold-light hover:scale-105 active:scale-95 transition-all duration-300 group shadow-gold h-auto mb-4 border-2 border-white/20 sm:px-6 sm:py-3"
          : variant === 'menu'
          ? "w-full justify-start gap-3 h-12 px-4 rounded-xl font-bold text-primary bg-primary/10 hover:bg-primary/20 transition-all border border-primary/30 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
          : "fixed bottom-6 right-6 z-[9999] rounded-full shadow-[0_0_30px_rgba(212,175,55,0.5)] bg-gradient-to-r from-primary to-gold-light hover:scale-110 active:scale-95 transition-all duration-300 flex items-center gap-2 px-6 py-8 border-2 border-white/40 animate-pulse",
        className
      )}
    >
      {isIOS ? (
        <Info className={cn(
          variant === 'hero' ? "w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" : "w-6 h-6 text-primary"
        )} />
      ) : (
        <Download className={cn(
          variant === 'hero' ? "w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" : "w-6 h-6 text-primary", 
          "animate-bounce group-hover:animate-none"
        )} />
      )}
      <span className={cn(
        "font-bold uppercase tracking-wider",
        variant === 'hero' ? "text-xs sm:text-base text-white" : "text-lg bg-gradient-to-r from-primary to-gold-light bg-clip-text text-transparent"
      )}>
        {isInstalled ? "App Installed" : isIOS ? "How to Install" : "Install App"}
      </span>
    </Button>
  );
}
