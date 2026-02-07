// src/pages/EditProfilePage.tsx - CORRECTED VERSION
import React, { useState, useRef } from 'react';
import { useMutation } from '@apollo/client';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { UPDATE_PROFILE } from '../graphql/mutations/userMutations';
import AvatarUpload from '../components/Profile/AvatarUpload';
import './EditProfilepage.css';

// Define types for upload response
interface UploadResponse {
  success: boolean;
  url: string;
  optimizedUrl?: string;
  publicId?: string;
  message?: string;
}

function EditProfilePage() {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    bio: (user as any)?.bio || '',
    location: (user as any)?.location || '',
    website: (user as any)?.website || '',
  });
  
  // Avatar state
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');
  
  // UI state
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update profile mutation
  const [updateProfile, { loading: isUpdating }] = useMutation(UPDATE_PROFILE, {
    onCompleted: (data: any) => {
      console.log('✅ Profile updated successfully:', data);
      
      if (data.updateProfile) {
        // Update auth context
        if (updateUserProfile) {
          updateUserProfile(data.updateProfile);
        }
        
        setSuccessMessage('Profile updated successfully! Redirecting...');
        
        // Update local state
        setFormData({
          name: data.updateProfile.name || '',
          username: data.updateProfile.username || '',
          bio: data.updateProfile.bio || '',
          location: data.updateProfile.location || '',
          website: data.updateProfile.website || '',
        });
        setAvatarPreview(data.updateProfile.avatar);
        setAvatarUrl(data.updateProfile.avatar);
        setAvatarFile(null);
        
        // Redirect to home after 1.5 seconds
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    },
    onError: (error) => {
      console.error('❌ Update profile error:', error);
      setErrorMessage(error.message || 'Failed to update profile');
      setIsUploading(false);
    }
  });
  
  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select an image file (JPEG, PNG, etc.)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size should be less than 5MB');
      return;
    }

    setAvatarFile(file);
    setErrorMessage('');
    
    // Create local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Upload image to server
  const uploadImageToServer = async (file: File): Promise<string> => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await fetch('http://localhost:4000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data: UploadResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Upload failed');
      }

      setIsUploading(false);
      setUploadProgress(100);
      
      return data.optimizedUrl || data.url;
      
    } catch (error) {
      setIsUploading(false);
      console.error('Upload error:', error);
      
      // Fallback: Convert to data URL (local preview only)
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setIsUploading(false);
          const dataUrl = reader.result as string;
          resolve(dataUrl);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    
    let finalAvatarUrl = avatarUrl;
    
    // If a new file was selected, upload it first
    if (avatarFile) {
      try {
        finalAvatarUrl = await uploadImageToServer(avatarFile);
        setAvatarUrl(finalAvatarUrl);
      } catch (error: any) {
        setErrorMessage(`Failed to upload image: ${error.message}`);
        console.error('Image upload failed:', error);
        return;
      }
    }

    try {
      console.log('🚀 Updating profile...');
      
      // Prepare the input data according to GraphQL schema
      const inputData = {
        name: formData.name.trim(),
        username: formData.username.trim(),
        bio: formData.bio?.trim() || '',
        location: formData.location?.trim() || '',
        website: formData.website?.trim() || '',
        avatar: finalAvatarUrl || user?.avatar || '',
      };

      console.log('📤 Sending profile data:', inputData);
      
      await updateProfile({
        variables: {
          input: inputData
        }
      });
      
    } catch (error: any) {
      console.error('💥 Failed to update profile:', error);
      setErrorMessage('Failed to update profile. Please try again.');
    }
  };

  // Trigger file input click
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Remove avatar and reset to original
  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(user?.avatar || '');
    setAvatarUrl(user?.avatar || '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Cancel editing and go back
  const handleCancel = () => {
    navigate('/profile');
  };

  if (!user) {
    return (
      <div className="edit-profile-container">
        <div className="login-prompt">
          <p>Please log in to edit your profile.</p>
          <button 
            onClick={() => navigate('/auth')}
            className="login-btn"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-profile-container">
      <h1>Edit Profile</h1>
      
      {errorMessage && (
        <div className="error-message">
          ❌ {errorMessage}
        </div>
      )}
      
      {successMessage && (
        <div className="success-message">
          ✅ {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Avatar Upload Section */}
        <div className="form-section">
          <h3>Profile Picture</h3>
          <AvatarUpload />
        </div>

        {/* Additional Avatar Controls (optional) */}
        <div className="form-section">
          <div 
            onClick={handleAvatarClick}
            className="avatar-container"
            style={{ cursor: 'pointer' }}
          >
            <div className="avatar-preview">
              {avatarPreview ? (
                <img 
                  src={avatarPreview} 
                  alt="Profile preview" 
                  className="avatar-image"
                />
              ) : (
                <div className="avatar-placeholder">
                  {formData.name.charAt(0).toUpperCase()}
                </div>
              )}
              
              {/* Upload overlay */}
              <div className="avatar-overlay">
                {isUploading ? 'Uploading...' : 'Click to change photo'}
              </div>
            </div>
            
            {/* Upload progress bar */}
            {isUploading && (
              <div className="upload-progress">
                <div 
                  className="progress-bar"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          </div>
          
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="file-input"
            style={{ display: 'none' }}
          />
          
          {/* File controls */}
          <div className="avatar-controls">
            <button
              type="button"
              onClick={handleAvatarClick}
              className="change-photo-btn"
              disabled={isUploading}
            >
              {avatarPreview !== user?.avatar ? 'Change Photo' : 'Upload Photo'}
            </button>
            
            {avatarPreview !== user?.avatar && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                className="reset-photo-btn"
                disabled={isUploading}
              >
                Reset to Current Photo
              </button>
            )}
            
            <div className="upload-info">
              {isUploading ? `Uploading... ${uploadProgress}%` : 'JPEG, PNG or GIF • Max 5MB'}
            </div>
          </div>
        </div>
        
        {/* Form fields */}
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Your full name"
              disabled={isUploading || isUpdating}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="username">Username *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              placeholder="username"
              disabled={isUploading || isUpdating}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              placeholder="Tell us about yourself"
              maxLength={160}
              disabled={isUploading || isUpdating}
              className="form-textarea"
            />
            <div className="character-count">
              {formData.bio.length}/160 characters
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="City, Country"
              disabled={isUploading || isUpdating}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="website">Website</label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="https://example.com"
              disabled={isUploading || isUpdating}
              className="form-input"
            />
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="form-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="cancel-btn"
            disabled={isUploading || isUpdating}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-btn"
            disabled={isUploading || isUpdating}
          >
            {isUploading ? 'Uploading...' : isUpdating ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfilePage;