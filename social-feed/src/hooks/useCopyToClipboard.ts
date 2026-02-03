import { useState, useCallback } from 'react';

interface UseCopyToClipboardResult {
  copied: boolean;
  copyToClipboard: (text: string) => Promise<boolean>;
  reset: () => void;
}

export const useCopyToClipboard = (timeout: number = 2000): UseCopyToClipboardResult => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), timeout);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }, [timeout]);

  const reset = useCallback(() => {
    setCopied(false);
  }, []);

  return {
    copied,
    copyToClipboard,
    reset,
  };
};