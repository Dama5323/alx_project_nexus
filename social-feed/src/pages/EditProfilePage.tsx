// src/pages/EditProfilePage.tsx - CORRECTED VERSION
import { useState, useRef } from 'react';
import { useMutation } from '@apollo/client';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { UPDATE_PROFILE } from '../graphql/mutations/userMutations';

// Define types for Cloudinary response
interface CloudinaryUploadResponse {
  success: boolean;
  url: string;
  optimizedUrl?: string;
  publicId?: string;
}

function EditProfilePage() {
  const { user, updateUserProfile } = useAuth(); // Get both user and updateUserProfile
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Initialize with user data
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState((user as any)?.bio || '');
  const [username, setUsername] = useState((user as any)?.username || '');
  
  // Avatar state
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');
  
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Added success message state
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Use UPDATE_PROFILE mutation
  const [updateProfile, { loading }] = useMutation(UPDATE_PROFILE, {
    onCompleted: (data: any) => {
      console.log('✅ Profile updated successfully:', data);
      if (data.updateProfile) {
        // Update auth context
        if (updateUserProfile) {
          updateUserProfile(data.updateProfile);
        }
        
        setSuccessMessage('Profile updated successfully! Redirecting...');
        
        // Update local state
        setName(data.updateProfile.name);
        setUsername(data.updateProfile.username);
        setBio(data.updateProfile.bio || '');
        setAvatarPreview(data.updateProfile.avatar);
        setAvatarUrl(data.updateProfile.avatar);
        setAvatarFile(null);
        
        // ⭐⭐⭐ ADD THIS - REDIRECT TO HOME AFTER 1.5 SECONDS ⭐⭐⭐
        setTimeout(() => {
          navigate('/'); // Redirect to home page
          // OR navigate('/dashboard'); // If your home route is different
        }, 1500);
      }
    },
    onError: (error) => {
      console.error('❌ Update profile error:', error);
      setErrorMessage(error.message || 'Failed to update profile');
      setIsUploading(false);
    }
  });
  
  // Upload image
  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const xhr = new XMLHttpRequest();
      
      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded * 100) / event.total);
            setUploadProgress(progress);
          }
        });
        
        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            const response: CloudinaryUploadResponse = JSON.parse(xhr.responseText);
            setIsUploading(false);
            setUploadProgress(100);
            resolve(response.optimizedUrl || response.url);
          } else {
            reject(new Error('Upload failed'));
          }
        });
        
        xhr.addEventListener('error', () => {
          reject(new Error('Network error'));
        });
        
        xhr.open('POST', 'http://localhost:4000/api/upload');
        xhr.send(formData);
      });
      
    } catch (error) {
      setIsUploading(false);
      console.error('Upload error:', error);
      
      // Fallback: Convert to data URL
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setIsUploading(false);
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select an image file (JPEG, PNG, etc.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size should be less than 5MB');
      return;
    }

    setAvatarFile(file);
    
    // Create local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    
    let finalAvatarUrl = avatarUrl;
    
    // If a new file was selected, upload it
    if (avatarFile) {
      try {
        finalAvatarUrl = await uploadImage(avatarFile);
        setAvatarUrl(finalAvatarUrl);
      } catch (error) {
        setErrorMessage('Failed to upload image. Please try again.');
        console.error('Image upload failed:', error);
        return;
      }
    }

    try {
      console.log('🚀 Updating profile...');
      
      await updateProfile({
        variables: {
          input: {
            name,
            bio,
            avatar: finalAvatarUrl,
            username
          }
        }
      });
      
    } catch (error) {
      console.error('💥 Failed to update profile:', error);
      setErrorMessage('Failed to update profile. Please try again.');
    }
  };

  // Trigger file input click
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Remove avatar
  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(user?.avatar || '');
    setAvatarUrl(user?.avatar || '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!user) {
    return (
      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
        <p>Please log in to edit your profile.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <h1>Edit Profile</h1>
      
      {errorMessage && (
        <div style={{
          padding: '10px',
          background: '#ffebee',
          color: '#c62828',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {errorMessage}
        </div>
      )}
      
      {successMessage && (
        <div style={{
          padding: '10px',
          background: '#e8f5e9',
          color: '#2e7d32',
          borderRadius: '4px',
          marginBottom: '20px',
          border: '1px solid #c8e6c9'
        }}>
          ✅ {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Avatar Upload Section */}
        <div style={{ 
          marginBottom: '30px', 
          textAlign: 'center',
          position: 'relative'
        }}>
          <div 
            onClick={handleAvatarClick}
            style={{ 
              cursor: 'pointer',
              display: 'inline-block',
              position: 'relative'
            }}
          >
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              overflow: 'hidden',
              margin: '0 auto 15px',
              border: '3px solid #e0e0e0',
              position: 'relative'
            }}>
              {avatarPreview ? (
                <img 
                  src={avatarPreview} 
                  alt="Profile preview" 
                  style={{ 
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px',
                  color: '#999'
                }}>
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
              
              {/* Upload overlay */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                transition: 'opacity 0.2s',
                color: 'white',
                fontSize: '14px',
                textAlign: 'center',
                padding: '10px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0';
              }}
              >
                {isUploading ? 'Uploading...' : 'Click to change photo'}
              </div>
            </div>
            
            {/* Upload progress bar */}
            {isUploading && (
              <div style={{
                position: 'absolute',
                bottom: '-10px',
                left: '10%',
                right: '10%',
                height: '4px',
                background: '#e0e0e0',
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${uploadProgress}%`,
                  height: '100%',
                  background: '#1d9bf0',
                  transition: 'width 0.3s'
                }}></div>
              </div>
            )}
          </div>
          
          {/* File input (hidden) */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            style={{ display: 'none' }}
          />
          
          {/* File info and controls */}
          <div style={{ 
            marginTop: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            alignItems: 'center'
          }}>
            <button
              type="button"
              onClick={handleAvatarClick}
              style={{
                padding: '6px 16px',
                background: '#f0f0f0',
                color: '#333',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
              disabled={isUploading}
            >
              {avatarPreview !== user?.avatar ? 'Change Photo' : 'Upload Photo'}
            </button>
            
            {avatarPreview !== user?.avatar && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                style={{
                  padding: '4px 12px',
                  background: 'transparent',
                  color: '#ff4444',
                  border: '1px solid #ff4444',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
                disabled={isUploading}
              >
                Reset to Current Photo
              </button>
            )}
            
            <div style={{ fontSize: '12px', color: '#666' }}>
              {isUploading ? `Uploading... ${uploadProgress}%` : 'JPEG, PNG or GIF • Max 5MB'}
            </div>
          </div>
        </div>
        
        {/* Form fields */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px',
            fontWeight: '500',
            color: '#333'
          }}>
            Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            required
            placeholder="Your full name"
            disabled={isUploading}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px',
            fontWeight: '500',
            color: '#333'
          }}>
            Username *
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            required
            placeholder="username"
            disabled={isUploading}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px',
            fontWeight: '500',
            color: '#333'
          }}>
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
            placeholder="Tell us about yourself"
            maxLength={160}
            disabled={isUploading}
          />
          <div style={{ 
            fontSize: '14px', 
            color: '#666', 
            textAlign: 'right',
            marginTop: '5px'
          }}>
            {bio.length}/160 characters
          </div>
        </div>
        
        {/* Action buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '15px',
          justifyContent: 'flex-end',
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '1px solid #eee'
        }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              padding: '12px 24px',
              background: '#f5f5f5',
              color: '#333',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              minWidth: '100px'
            }}
            disabled={loading || isUploading}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              padding: '12px 24px',
              background: '#1d9bf0',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              minWidth: '150px',
              opacity: (loading || isUploading) ? 0.7 : 1
            }}
            disabled={loading || isUploading}
          >
            {isUploading ? 'Uploading...' : loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfilePage;