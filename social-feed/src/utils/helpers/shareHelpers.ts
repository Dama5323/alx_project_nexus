import { ShareOptions } from '../../types';

export const sharePost = async (postId: string, options: ShareOptions = {}): Promise<boolean> => {
  const url = options.url || `${window.location.origin}/post/${postId}`;
  const text = options.message || 'Check out this post!';

  // Try native share API first (mobile)
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Social Feed Post',
        text,
        url,
      });
      return true;
    } catch (error) {
      console.log('Native share cancelled or failed');
    }
  }

  // Fallback to platform-specific sharing
  if (options.platform) {
    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
    };

    const shareUrl = shareUrls[options.platform];
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      return true;
    }
  }

  // Copy to clipboard as last resort
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch (error) {
    console.error('Failed to copy link:', error);
    return false;
  }
};

export const generatePostUrl = (postId: string): string => {
  return `${window.location.origin}/post/${postId}`;
};