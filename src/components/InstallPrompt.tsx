import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, X } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface InstallPromptProps {
  onInstall: () => void;
  language?: string;
}

export function InstallPrompt({ onInstall, language = 'en' }: InstallPromptProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  const translations = {
    en: {
      title: 'Install Weather Dashboard',
      description: 'Install this app on your device for quick access and offline use.',
      install: 'Install',
    },
    es: {
      title: 'Instalar Panel del Tiempo',
      description: 'Instala esta aplicación en tu dispositivo para un acceso rápido y uso sin conexión.',
      install: 'Instalar',
    },
    pt: {
      title: 'Instalar Painel do Tempo',
      description: 'Instale este aplicativo no seu dispositivo para acesso rápido e uso offline.',
      install: 'Instalar',
    },
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
      >
        <Card className="border-2 border-primary/20 shadow-xl backdrop-blur-sm bg-card/95">
          <div className="p-4 flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Download size={24} weight="bold" className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm mb-1">{t.title}</h3>
              <p className="text-xs text-muted-foreground mb-3">
                {t.description}
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={onInstall}
                  size="sm"
                  className="gap-2"
                >
                  <Download size={16} weight="bold" />
                  {t.install}
                </Button>
                <Button
                  onClick={() => setIsDismissed(true)}
                  size="sm"
                  variant="ghost"
                >
                  <X size={16} weight="bold" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
