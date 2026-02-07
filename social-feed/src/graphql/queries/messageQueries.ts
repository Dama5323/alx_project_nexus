import { gql } from '@apollo/client';

export const GET_USER_CONVERSATIONS = gql`
  query GetUserConversations($userId: ID!) {
    userConversations(userId: $userId) {
      id
      participant {
        id
        name
        username
        avatar
      }
      lastMessage
      lastMessageTime
      unreadCount
      messages {
        id
        content
        senderId
        time
        isRead
      }
    }
  }
`;

export const GET_CONVERSATION = gql`
  query GetConversation($conversationId: ID!) {
    conversation(id: $conversationId) {
      id
      participants {
        id
        name
        username
        avatar
      }
      messages {
        id
        content
        sender {
          id
          name
          avatar
        }
        createdAt
        isRead
      }
    }
  }
`;