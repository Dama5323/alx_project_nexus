// src/components/AvatarUpload.tsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import './AvatarUpload.css';

const AvatarUpload: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Image size should be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload the file
    uploadAvatar(file);
  };

  const uploadAvatar = async (file: File) => {
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await fetch('http://localhost:4000/api/avatar/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Update user in context/auth
        updateUserProfile({ avatar: data.url });
        alert('Avatar updated successfully!');
      } else {
        setError(data.error || 'Failed to upload avatar');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="avatar-upload">
      <div className="avatar-preview">
        <img 
          src={preview || user?.avatar || 'https://i.pravatar.cc/150'} 
          alt="Profile" 
          className="avatar-image"
        />
      </div>
      
      <label className="upload-button">
        {uploading ? 'Uploading...' : 'Change Avatar'}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          style={{ display: 'none' }}
        />
      </label>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="upload-hint">
        <small>Max file size: 5MB. Supported: JPG, PNG, GIF, WebP</small>
      </div>
    </div>
  );
};

export default AvatarUpload;