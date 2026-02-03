import { client } from '../utils/api/graphqlClient';
import { CREATE_POST, UPDATE_POST, DELETE_POST } from '../graphql/mutations/postMutations';
import { GET_POST, GET_USER_POSTS } from '../graphql/queries/postQueries';
import { CreatePostInput, UpdatePostInput } from '../types';

export const postService = {
  async createPost(input: CreatePostInput) {
    const { data } = await client.mutate({
      mutation: CREATE_POST,
      variables: { input },
      refetchQueries: ['GetFeed'],
    });
    return (data as any)?.createPost;
  },

  async updatePost(input: UpdatePostInput) {
    const { data } = await client.mutate({
      mutation: UPDATE_POST,
      variables: { input },
    });
    return (data as any)?.updatePost;
  },

  async deletePost(postId: string) {
    const { data } = await client.mutate({
      mutation: DELETE_POST,
      variables: { postId },
      refetchQueries: ['GetFeed'],
    });
    return (data as any)?.deletePost;
  },

  async getPost(postId: string) {
    const { data } = await client.query({
      query: GET_POST,
      variables: { postId },
    });
    return (data as any)?.post;
  },

  async getUserPosts(userId: string, first: number = 10) {
    const { data } = await client.query({
      query: GET_USER_POSTS,
      variables: { userId, first },
    });
    return (data as any)?.userPosts;
  },
};