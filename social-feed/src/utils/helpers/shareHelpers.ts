import { ShareOptions } from '../../types';

export const sharePost = async (postId: string, options: ShareOptions = {}): Promise<boolean> => {
  const url = options.url || `${window.location.origin}/post/${postId}`;
  const text = options.message || options.text || 'Check out this post!'; // Use message or text
  const title = options.title || 'Check this out!';

  // Try native share API first (mobile)
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url,
      });
      return true;
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Share failed:', err);
      }
      // Fall through to platform-specific sharing
    }
  }

  // Platform-specific sharing
  const platform = options.platform || 'copy';
  
  switch (platform) {
    case 'twitter':
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
      break;
    case 'facebook':
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
      break;
    case 'linkedin':
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
      break;
    case 'whatsapp':
      window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, '_blank');
      break;
    case 'telegram':
      window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
      break;
    case 'copy':
      await navigator.clipboard.writeText(`${text} ${url}`);
      alert('Link copied to clipboard!');
      break;
    default:
      console.warn('Unknown platform:', platform);
      return false;
  }

  return true;
};
export const generatePostUrl = (postId: string): string => {
  return `${window.location.origin}/post/${postId}`;
};
