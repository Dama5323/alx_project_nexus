import React from 'react';
import { ReactionType } from '../../types';
import { REACTIONS } from '../../utils/constants/reactionTypes';
import './ReactionPicker.css';

export interface ReactionPickerProps {
  onSelect: (type: ReactionType) => void;
  selectedReaction?: ReactionType;
}

export const ReactionPicker: React.FC<ReactionPickerProps> = ({
  onSelect,
  selectedReaction,
}) => {
  return (
    <div className="reaction-picker">
      {REACTIONS.map((reaction) => (
        <button
          key={reaction.type}
          className={`reaction-picker__button ${
            selectedReaction === reaction.type ? 'reaction-picker__button--selected' : ''
          }`}
          onClick={() => onSelect(reaction.type)}
          title={reaction.label}
        >
          <span className="reaction-picker__emoji">{reaction.emoji}</span>
        </button>
      ))}
    </div>
  );
};