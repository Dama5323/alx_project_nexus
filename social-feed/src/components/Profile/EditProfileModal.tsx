// src/components/Profile/EditProfileModal.tsx
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_USER_PROFILE } from '../../graphql/queries/userQueries';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';

interface EditProfileModalProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedUser: any) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    username: user.username || '',
    bio: user.bio || '',
    website: user.website || '',
    location: user.location || '',
    avatar: user.avatar || ''
  });

  const [avatarPreview, setAvatarPreview] = useState(user.avatar);
  const [updateProfile, { loading, error }] = useMutation(UPDATE_USER_PROFILE);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data } = await updateProfile({
        variables: {
          input: formData
        }
      });

      if (data.updateProfile) {
        onSuccess(data.updateProfile);
        onClose();
      }
    } catch (err) {
      console.error('Update profile failed:', err);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        setFormData(prev => ({ ...prev, avatar: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Profile</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="avatar-upload-section">
            <Avatar 
              src={avatarPreview} 
              alt={formData.name}
              size="xl"
            />
            <div className="avatar-upload-controls">
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="avatar-upload" className="upload-button">
                Change Avatar
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setAvatarPreview(`https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`);
                  setFormData(prev => ({ 
                    ...prev, 
                    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`
                  }));
                }}
              >
                Use Default
              </Button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              maxLength={50}
              placeholder="Your name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              maxLength={30}
              placeholder="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              maxLength={160}
              placeholder="Tell us about yourself"
              rows={4}
            />
            <div className="character-count">
              {formData.bio.length}/160
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
              placeholder="https://example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Your location"
            />
          </div>

          {error && (
            <div className="error-message">
              {error.message}
            </div>
          )}

          <div className="modal-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};