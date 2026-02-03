import { client } from '../utils/api/graphqlClient';
import { ADD_COMMENT, UPDATE_COMMENT, DELETE_COMMENT } from '../graphql/mutations/commentMutations';
import { CreateCommentInput } from '../types';

export const commentService = {
  async addComment(input: CreateCommentInput) {
    const { data } = await client.mutate({
      mutation: ADD_COMMENT,
      variables: { input },
      refetchQueries: ['GetPost'],
    });
    return data.addComment;
  },

  async updateComment(commentId: string, content: string) {
    const { data } = await client.mutate({
      mutation: UPDATE_COMMENT,
      variables: { commentId, content },
    });
    return data.updateComment;
  },

  async deleteComment(commentId: string) {
    const { data } = await client.mutate({
      mutation: DELETE_COMMENT,
      variables: { commentId },
      refetchQueries: ['GetPost'],
    });
    return data.deleteComment;
  },
};