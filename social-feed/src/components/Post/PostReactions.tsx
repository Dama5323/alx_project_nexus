import React, { useState } from 'react';
import { useReactions } from '../../hooks/useReactions';
import { ReactionType } from '../../types';
import { ReactionPicker } from '../interactions/ReactionPicker';
import { ReactionsList } from '../interactions/ReactionsList';
import { getReactionEmoji } from '../../utils/constants/reactionTypes';
import { formatNumber } from '../../utils/helpers/formatNumbers';
import './PostReactions.css';

export interface PostReactionsProps {
  postId: string;
}

export const PostReactions: React.FC<PostReactionsProps> = ({ postId }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [showList, setShowList] = useState(false);
  const { reactions, userReaction, totalCount, addReaction, removeReaction, updateReaction } =
    useReactions(postId);

  const handleReactionClick = async (type: ReactionType) => {
    if (userReaction) {
      if (userReaction.type === type) {
        await removeReaction();
      } else {
        await updateReaction(type);
      }
    } else {
      await addReaction(type);
    }
    setShowPicker(false);
  };

  const topReactions = reactions
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  return (
    <div className="post-reactions">
      <div className="post-reactions__summary">
        {topReactions.length > 0 && (
          <button
            className="post-reactions__preview"
            onClick={() => setShowList(true)}
          >
            <div className="post-reactions__emojis">
              {topReactions.map((reaction) => (
                <span key={reaction.type} className="post-reactions__emoji">
                  {getReactionEmoji(reaction.type)}
                </span>
              ))}
            </div>
            {totalCount > 0 && (
              <span className="post-reactions__count">{formatNumber(totalCount)}</span>
            )}
          </button>
        )}
      </div>

      <div className="post-reactions__action">
        <button
          className={`post-reactions__button ${
            userReaction ? 'post-reactions__button--active' : ''
          }`}
          onClick={() => setShowPicker(!showPicker)}
          onMouseEnter={() => setShowPicker(true)}
          onMouseLeave={() => setTimeout(() => setShowPicker(false), 300)}
        >
          <span className="post-reactions__button-emoji">
            {userReaction ? getReactionEmoji(userReaction.type) : '👍'}
          </span>
          <span className="post-reactions__button-text">
            {userReaction ? 'Reacted' : 'React'}
          </span>
        </button>

        {showPicker && (
          <div
            className="post-reactions__picker-wrapper"
            onMouseEnter={() => setShowPicker(true)}
            onMouseLeave={() => setShowPicker(false)}
          >
            <ReactionPicker
              onSelect={handleReactionClick}
              selectedReaction={userReaction?.type}
            />
          </div>
        )}
      </div>

      {showList && (
        <ReactionsList
          postId={postId}
          reactions={reactions}
          onClose={() => setShowList(false)}
        />
      )}
    </div>
  );
};