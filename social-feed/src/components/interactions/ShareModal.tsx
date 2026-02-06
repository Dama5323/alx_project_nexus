import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import { useSharePost } from '../../hooks/useSharePost';
import { generatePostUrl } from '../../utils/helpers/shareHelpers';
import './ShareModal.css';

export interface ShareModalProps {
  postId: string;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ postId, onClose }) => {
  const [message, setMessage] = useState('');
  const { copyToClipboard, copied } = useCopyToClipboard();
  const { sharePost, loading } = useSharePost();

  const postUrl = generatePostUrl(postId);

  const handleCopyLink = async () => {
    await copyToClipboard(postUrl);
    await sharePost(postId, { platform: 'copy' });
  };

  const handleShare = async (platform: string) => {
    await sharePost(postId, { 
    platform: platform as any, 
    message,
    text: message 
});
    onClose();
  };

  const shareOptions = [
    {
      platform: 'twitter',
      label: 'Share to Twitter',
      icon: '𝕏',
      color: '#000000',
    },
    {
      platform: 'facebook',
      label: 'Share to Facebook',
      icon: '📘',
      color: '#1877F2',
    },
    {
      platform: 'linkedin',
      label: 'Share to LinkedIn',
      icon: '💼',
      color: '#0A66C2',
    },
    {
      platform: 'whatsapp',
      label: 'Share to WhatsApp',
      icon: '💬',
      color: '#25D366',
    },
  ];

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Share Post"
      size="md"
    >
      <div className="share-modal">
        <div className="share-modal__input-section">
          <textarea
            className="share-modal__message"
            placeholder="Add a message (optional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
          />
        </div>

        <div className="share-modal__options">
          {shareOptions.map((option) => (
            <button
              key={option.platform}
              className="share-modal__option"
              onClick={() => handleShare(option.platform)}
              disabled={loading}
              style={{ borderColor: option.color }}
            >
              <span className="share-modal__option-icon">{option.icon}</span>
              <span className="share-modal__option-label">{option.label}</span>
            </button>
          ))}
        </div>

        <div className="share-modal__divider">
          <span>or</span>
        </div>

        <div className="share-modal__link-section">
          <div className="share-modal__link-container">
            <input
              type="text"
              className="share-modal__link-input"
              value={postUrl}
              readOnly
            />
            <Button
              variant={copied ? 'secondary' : 'primary'}
              size="sm"
              onClick={handleCopyLink}
            >
              {copied ? '✓ Copied' : 'Copy'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};