import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Avatar } from '../common/Avatar';
import { ReactionSummary, ReactionType } from '../../types';
import { REACTIONS } from '../../utils/constants/reactionTypes';
import { formatNumber } from '../../utils/helpers/formatNumbers';
// import './ReactionsList.css';

export interface ReactionsListProps {
  postId: string;
  reactions: ReactionSummary[];
  onClose: () => void;
}

export const ReactionsList: React.FC<ReactionsListProps> = ({
  postId,
  reactions,
  onClose,
}) => {
  const [selectedTab, setSelectedTab] = useState<ReactionType | 'all'>('all');

  const totalCount = reactions.reduce((sum, r) => sum + r.count, 0);

  const filteredReactions =
    selectedTab === 'all'
      ? reactions.flatMap((r) => r.users.map((u) => ({ ...u, reactionType: r.type })))
      : reactions.find((r) => r.type === selectedTab)?.users.map((u) => ({ 
          ...u, 
          reactionType: selectedTab 
        })) || [];

  return (
    <Modal isOpen={true} onClose={onClose} title="Reactions" size="md">
      <div className="reactions-list">
        <div className="reactions-list__tabs">
          <button
            className={`reactions-list__tab ${
              selectedTab === 'all' ? 'reactions-list__tab--active' : ''
            }`}
            onClick={() => setSelectedTab('all')}
          >
            <span className="reactions-list__tab-label">All</span>
            <span className="reactions-list__tab-count">{formatNumber(totalCount)}</span>
          </button>

          {reactions
            .filter((r) => r.count > 0)
            .map((reaction) => {
              const reactionConfig = REACTIONS.find((r) => r.type === reaction.type);
              return (
                <button
                  key={reaction.type}
                  className={`reactions-list__tab ${
                    selectedTab === reaction.type ? 'reactions-list__tab--active' : ''
                  }`}
                  onClick={() => setSelectedTab(reaction.type)}
                >
                  <span className="reactions-list__tab-emoji">{reactionConfig?.emoji}</span>
                  <span className="reactions-list__tab-count">
                    {formatNumber(reaction.count)}
                  </span>
                </button>
              );
            })}
        </div>

        <div className="reactions-list__content">
          {filteredReactions.length === 0 ? (
            <div className="reactions-list__empty">
              <p>No reactions yet</p>
            </div>
          ) : (
            <div className="reactions-list__users">
              {filteredReactions.map((user: any) => {
                const reactionConfig = REACTIONS.find((r) => r.type === user.reactionType);
                return (
                  <div key={user.id} className="reactions-list__user">
                    <Avatar
                      src={user.avatar}
                      alt={user.name}
                      size="md"
                      verified={user.verified}
                      fallback={user.name}
                    />
                    <div className="reactions-list__user-info">
                      <div className="reactions-list__user-name">
                        {user.name}
                        {user.verified && (
                          <svg viewBox="0 0 24 24" width="16" height="16">
                            <path
                              fill="#1DA1F2"
                              d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="reactions-list__user-username">@{user.username}</div>
                    </div>
                    <span className="reactions-list__user-reaction">{reactionConfig?.emoji}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};