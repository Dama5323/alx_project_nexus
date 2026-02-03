import React from 'react';
import { Avatar } from '../common/Avatar';
import { Dropdown, DropdownOption } from '../common/Dropdown';
import { User } from '../../types';
import { formatPostDate } from '../../utils/helpers/dateFormatter';
import './PostHeader.css';

export interface PostHeaderProps {
  author: User;
  createdAt: string;
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onReport?: () => void;
}

export const PostHeader: React.FC<PostHeaderProps> = ({
  author,
  createdAt,
  isOwner = false,
  onEdit,
  onDelete,
  onReport,
}) => {
  const menuOptions: DropdownOption[] = isOwner
    ? [
        { label: 'Edit post', value: 'edit', icon: '✏️' },
        { label: 'Delete post', value: 'delete', icon: '🗑️', danger: true },
      ]
    : [
        { label: 'Report post', value: 'report', icon: '⚠️', danger: true },
        { label: 'Mute @' + author.username, value: 'mute', icon: '🔇' },
        { label: 'Block @' + author.username, value: 'block', icon: '🚫', danger: true },
      ];

  const handleMenuSelect = (value: string) => {
    switch (value) {
      case 'edit':
        onEdit?.();
        break;
      case 'delete':
        onDelete?.();
        break;
      case 'report':
        onReport?.();
        break;
      case 'mute':
        console.log('Mute user');
        break;
      case 'block':
        console.log('Block user');
        break;
    }
  };

  return (
    <div className="post-header">
      <Avatar
        src={author.avatar}
        alt={author.name}
        size="md"
        verified={author.verified}
        fallback={author.name}
      />
      <div className="post-header__info">
        <div className="post-header__user">
          <span className="post-header__name">{author.name}</span>
          {author.verified && (
            <svg className="post-header__verified" viewBox="0 0 24 24" width="20" height="20">
              <path
                fill="#1DA1F2"
                d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"
              />
            </svg>
          )}
        </div>
        <div className="post-header__meta">
          <span className="post-header__username">@{author.username}</span>
          <span className="post-header__separator">·</span>
          <span className="post-header__time">{formatPostDate(createdAt)}</span>
        </div>
      </div>
      <div className="post-header__actions">
        <Dropdown
          trigger={
            <button className="post-header__menu-button" aria-label="More options">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path
                  fill="currentColor"
                  d="M12 8.5c.83 0 1.5-.67 1.5-1.5S12.83 5.5 12 5.5 10.5 6.17 10.5 7s.67 1.5 1.5 1.5zm0 7c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm0-3.5c.83 0 1.5-.67 1.5-1.5S12.83 9 12 9s-1.5.67-1.5 1.5.67 1.5 1.5 1.5z"
                />
              </svg>
            </button>
          }
          options={menuOptions}
          onSelect={handleMenuSelect}
          position="right"
        />
      </div>
    </div>
  );
};