import { ReactionType } from '../../types';

export const REACTIONS = [
  { type: ReactionType.LIKE, emoji: '👍', label: 'Like' },
  { type: ReactionType.LOVE, emoji: '❤️', label: 'Love' },
  { type: ReactionType.LAUGH, emoji: '😂', label: 'Haha' },
  { type: ReactionType.WOW, emoji: '😮', label: 'Wow' },
  { type: ReactionType.SAD, emoji: '😢', label: 'Sad' },
  { type: ReactionType.ANGRY, emoji: '😠', label: 'Angry' },
];

export const getReactionEmoji = (type: ReactionType): string => {
  const reaction = REACTIONS.find(r => r.type === type);
  return reaction?.emoji || '👍';
};

export const getReactionLabel = (type: ReactionType): string => {
  const reaction = REACTIONS.find(r => r.type === type);
  return reaction?.label || 'Like';
};