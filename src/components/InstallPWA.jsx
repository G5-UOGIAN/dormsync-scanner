import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from './ui/button';

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Save the event so it can be triggered later
      setDeferredPrompt(e);
      // Show install button
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowInstall(false);
  };

  const handleDismiss = () => {
    setShowInstall(false);
    // Remember dismissal for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already dismissed in this session
  useEffect(() => {
    const dismissed = sessionStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      setShowInstall(false);
    }
  }, []);

  if (!showInstall) {
    return null;
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 left-3 right-3 md:left-auto md:right-6 md:max-w-sm z-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-4">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
      >
        <X size={16} className="text-slate-500" />
      </button>
      
      <div className="flex items-start gap-3">
        <div className="p-2 bg-cyan-100 dark:bg-cyan-950 rounded-lg">
          <Download className="w-5 h-5 text-cyan-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
            Install Scanner Dashboard
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
            Install this app on your device for quick access and offline use.
          </p>
          <Button onClick={handleInstallClick} size="sm" className="w-full">
            Install App
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InstallPWA;
