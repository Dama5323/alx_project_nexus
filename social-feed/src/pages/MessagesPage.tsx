import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_CONVERSATIONS } from '../graphql/queries/messageQueries';
import { useAuth } from '../hooks/useAuth';
import './MessagesPage.css';

const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const { loading, error, data } = useQuery(GET_USER_CONVERSATIONS, {
    variables: { userId: user?.id },
    skip: !user?.id
  });

  if (!user) {
    return (
      <div className="messages-page">
        <div className="messages-error">
          <h2>Please log in to view messages</h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="messages-page">
        <div className="messages-loading">
          <div className="loading-spinner"></div>
          <p>Loading conversations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="messages-page">
        <div className="messages-error">
          <h2>Error loading messages</h2>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  const conversations = data?.userConversations || [];
  const selectedConv = conversations.find((c: any) => c.id === selectedConversation);

  return (
    <div className="messages-page">
      <div className="messages-header">
        <h1>Messages</h1>
        <button className="new-message-btn">
          <span>+</span> New Message
        </button>
      </div>

      <div className="messages-container">
        {/* Conversations sidebar */}
        <div className="conversations-sidebar">
          <div className="conversations-search">
            <input 
              type="text" 
              placeholder="Search conversations..."
              className="search-input"
            />
          </div>
          
          <div className="conversations-list">
            {conversations.length === 0 ? (
              <div className="no-conversations">
                <p>No conversations yet</p>
              </div>
            ) : (
              conversations.map((conversation: any) => (
                <div 
                  key={conversation.id}
                  className={`conversation-item ${selectedConversation === conversation.id ? 'active' : ''}`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="conversation-avatar">
                    <img src={conversation.participant.avatar} alt={conversation.participant.name} />
                  </div>
                  <div className="conversation-details">
                    <div className="conversation-header">
                      <span className="conversation-name">{conversation.participant.name}</span>
                      <span className="conversation-time">{conversation.lastMessageTime}</span>
                    </div>
                    <p className="conversation-preview">{conversation.lastMessage}</p>
                    {conversation.unreadCount > 0 && (
                      <span className="unread-badge">{conversation.unreadCount}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="chat-area">
          {selectedConv ? (
            <>
              <div className="chat-header">
                <div className="chat-user">
                  <img src={selectedConv.participant.avatar} alt={selectedConv.participant.name} />
                  <div>
                    <h3>{selectedConv.participant.name}</h3>
                    <p className="user-status">Online</p>
                  </div>
                </div>
                <div className="chat-actions">
                  <button className="action-btn">📞</button>
                  <button className="action-btn">🎥</button>
                  <button className="action-btn">⋯</button>
                </div>
              </div>

              <div className="messages-list">
                {selectedConv.messages.map((message: any) => (
                  <div 
                    key={message.id}
                    className={`message ${message.senderId === user.id ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">
                      <p>{message.content}</p>
                      <span className="message-time">{message.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="message-input-area">
                <div className="input-actions">
                  <button className="input-action-btn">😊</button>
                  <button className="input-action-btn">📎</button>
                  <button className="input-action-btn">📷</button>
                </div>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="message-input"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newMessage.trim()) {
                      // Send message
                      setNewMessage('');
                    }
                  }}
                />
                <button 
                  className="send-btn"
                  disabled={!newMessage.trim()}
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="no-chat-selected">
              <div className="welcome-illustration">💬</div>
              <h2>Select a conversation</h2>
              <p>Choose a conversation from the sidebar to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;