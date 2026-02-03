import { User } from './user.types';

export enum ReactionType {
  LIKE = 'LIKE',
  LOVE = 'LOVE',
  LAUGH = 'LAUGH',
  WOW = 'WOW',
  SAD = 'SAD',
  ANGRY = 'ANGRY'
}

export interface Reaction {
  id: string;
  type: ReactionType;
  user: User;
  createdAt: string;
}

export interface ReactionSummary {
  type: ReactionType;
  count: number;
  users: User[];
  isUserReacted: boolean;
}

export const REACTION_EMOJIS: Record<ReactionType, string> = {
  [ReactionType.LIKE]: '👍',
  [ReactionType.LOVE]: '❤️',
  [ReactionType.LAUGH]: '😂',
  [ReactionType.WOW]: '😮',
  [ReactionType.SAD]: '😢',
  [ReactionType.ANGRY]: '😠',
};