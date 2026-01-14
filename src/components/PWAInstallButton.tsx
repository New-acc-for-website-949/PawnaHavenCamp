import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, MessageCircle, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
      return;
    }

    window.addEventListener('beforeinstallprompt', handler);

    if (window.location.search.includes('force-pwa')) {
      setIsInstallable(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  const contactNumber = "918806092609";

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
      {/* Install App Button */}
      {isInstallable && (
        <Button 
          onClick={handleInstallClick}
          className="h-11 w-11 sm:h-12 sm:w-auto rounded-full shadow-2xl bg-primary hover:bg-primary/90 flex items-center justify-center gap-2 sm:px-4 border-2 border-white/20 animate-bounce transition-all scale-90"
          title="Install App"
        >
          <Download className="w-5 h-5" />
          <span className="hidden sm:inline font-bold text-sm">Install App</span>
        </Button>
      )}

      {/* WhatsApp Button */}
      <Button 
        onClick={() => window.open(`https://api.whatsapp.com/send?phone=${contactNumber}`, '_blank')}
        className="h-11 w-11 sm:h-12 sm:w-auto rounded-full shadow-2xl bg-[#25D366] hover:bg-[#25D366]/90 flex items-center justify-center gap-2 sm:px-4 border-2 border-white/20 transition-all scale-90"
        title="WhatsApp Us"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="hidden sm:inline font-bold text-sm">WhatsApp</span>
      </Button>

      {/* Call Button */}
      <Button 
        onClick={() => window.open(`tel:+${contactNumber}`, '_self')}
        className="h-11 w-11 sm:h-12 sm:w-auto rounded-full shadow-2xl bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2 sm:px-4 border-2 border-white/20 transition-all scale-90"
        title="Call Us"
      >
        <Phone className="w-5 h-5" />
        <span className="hidden sm:inline font-bold text-sm">Call Now</span>
      </Button>
    </div>
  );
}
