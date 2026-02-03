//import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_REACTION, REMOVE_REACTION, UPDATE_REACTION } from '../graphql/mutations/reactionMutations';
import { GET_POST_REACTIONS } from '../graphql/queries/reactionQueries';
import { ReactionType, ReactionSummary, Reaction } from '../types';

interface UseReactionsResult {
  reactions: ReactionSummary[];
  userReaction: Reaction | null;
  totalCount: number;
  loading: boolean;
  addReaction: (type: ReactionType) => Promise<void>;
  removeReaction: () => Promise<void>;
  updateReaction: (type: ReactionType) => Promise<void>;
}

export const useReactions = (postId: string): UseReactionsResult => {
  const { data, loading } = useQuery(GET_POST_REACTIONS, {
    variables: { postId },
  });

  const [addReactionMutation] = useMutation(ADD_REACTION);
  const [removeReactionMutation] = useMutation(REMOVE_REACTION);
  const [updateReactionMutation] = useMutation(UPDATE_REACTION);

  const reactions = data?.postReactions || [];
  const userReaction = reactions.find((r: ReactionSummary) => r.isUserReacted);
  const totalCount = reactions.reduce((sum: number, r: ReactionSummary) => sum + r.count, 0);

  const addReaction = async (type: ReactionType) => {
    try {
      await addReactionMutation({
        variables: { postId, type },
        optimisticResponse: {
          addReaction: {
            __typename: 'Reaction',
            id: `temp-${Date.now()}`,
            type,
            user: {
              __typename: 'User',
              id: 'current-user',
              name: 'You',
              username: 'you',
              avatar: null,
            },
            createdAt: new Date().toISOString(),
          },
        },
        refetchQueries: [{ query: GET_POST_REACTIONS, variables: { postId } }],
      });
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const removeReaction = async () => {
    try {
      await removeReactionMutation({
        variables: { postId },
        refetchQueries: [{ query: GET_POST_REACTIONS, variables: { postId } }],
      });
    } catch (error) {
      console.error('Error removing reaction:', error);
    }
  };

  const updateReaction = async (type: ReactionType) => {
    try {
      await updateReactionMutation({
        variables: { postId, type },
        refetchQueries: [{ query: GET_POST_REACTIONS, variables: { postId } }],
      });
    } catch (error) {
      console.error('Error updating reaction:', error);
    }
  };

  return {
    reactions,
    userReaction: userReaction || null,
    totalCount,
    loading,
    addReaction,
    removeReaction,
    updateReaction,
  };
};