import React from 'react';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import { useSharePost } from '../../hooks/useSharePost';
import { Dropdown, DropdownOption } from '../common/Dropdown';
import { generatePostUrl } from '../../utils/helpers/shareHelpers';
import './PostMenu.css';

export interface PostMenuProps {
  postId: string;
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const PostMenu: React.FC<PostMenuProps> = ({
  postId,
  isOwner = false,
  onEdit,
  onDelete,
}) => {
  const { copyToClipboard, copied } = useCopyToClipboard();
  const { sharePost } = useSharePost();

  const postUrl = generatePostUrl(postId);

  const handleCopyLink = () => {
    copyToClipboard(postUrl);
  };

  const handleShare = async (platform?: string) => {
    await sharePost(postId, { platform: platform as any });
  };

  const ownerOptions: DropdownOption[] = [
    { label: 'Edit post', value: 'edit', icon: '✏️' },
    { label: 'Delete post', value: 'delete', icon: '🗑️', danger: true },
    { label: 'Pin to profile', value: 'pin', icon: '📌' },
    { label: 'Copy link', value: 'copy', icon: copied ? '✅' : '🔗' },
  ];

  const viewerOptions: DropdownOption[] = [
    { label: 'Copy link', value: 'copy', icon: copied ? '✅' : '🔗' },
    { label: 'Share via...', value: 'share', icon: '📤' },
    { label: 'Bookmark', value: 'bookmark', icon: '🔖' },
    { label: 'Embed post', value: 'embed', icon: '📋' },
    { label: 'Report post', value: 'report', icon: '⚠️', danger: true },
  ];

  const handleSelect = (value: string) => {
    switch (value) {
      case 'edit':
        onEdit?.();
        break;
      case 'delete':
        onDelete?.();
        break;
      case 'copy':
        handleCopyLink();
        break;
      case 'share':
        handleShare();
        break;
      case 'pin':
        console.log('Pin post');
        break;
      case 'bookmark':
        console.log('Bookmark post');
        break;
      case 'embed':
        console.log('Embed post');
        break;
      case 'report':
        console.log('Report post');
        break;
    }
  };

  return (
    <div className="post-menu">
      <Dropdown
        trigger={
          <button className="post-menu__trigger" aria-label="More options">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path
                fill="currentColor"
                d="M12 8.5c.83 0 1.5-.67 1.5-1.5S12.83 5.5 12 5.5 10.5 6.17 10.5 7s.67 1.5 1.5 1.5zm0 7c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm0-3.5c.83 0 1.5-.67 1.5-1.5S12.83 9 12 9s-1.5.67-1.5 1.5.67 1.5 1.5 1.5z"
              />
            </svg>
          </button>
        }
        options={isOwner ? ownerOptions : viewerOptions}
        onSelect={handleSelect}
        position="right"
      />
    </div>
  );
};