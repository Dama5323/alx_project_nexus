// types/profile.ts
export interface UserProfile {
  name: string;
  username: string;
  bio: string;
  location: string;
  website: string;
  joinDate: string;
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
}

export interface UpdateProfileData {
  name?: string;
  username?: string;
  bio?: string;
  location?: string;
  website?: string;
  postsCount?: number;
  followers?: number;
  following?: number;
}

// Remove ALL duplicate declarations below and keep only this single version:

export const getCurrentUserProfile = async (): Promise<UserProfile> => {
  try {
    // Get from your backend API or localStorage
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    // Return user-specific profile
    return {
      name: user.name || 'New User',
      username: user.username || '@newuser',
      bio: user.bio || 'Welcome to my profile!',
      location: user.location || 'Earth',
      website: user.website || '',
      joinDate: user.joinDate || new Date().toISOString(),
      stats: {
        posts: user.postsCount || 0,
        followers: user.followers || 0,
        following: user.following || 0,
      }
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    // Return default profile on error
    return {
      name: 'New User',
      username: '@newuser',
      bio: 'Welcome to my profile!',
      location: 'Earth',
      website: '',
      joinDate: new Date().toISOString(),
      stats: {
        posts: 0,
        followers: 0,
        following: 0,
      }
    };
  }
};

export const updateProfile = async (profileData: UpdateProfileData): Promise<UserProfile> => {
  try {
    // Get existing user data
    const existingUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    // Merge with new data
    const updatedUser = {
      ...existingUser,
      ...profileData,
      stats: {
        posts: profileData.postsCount || existingUser.postsCount || 0,
        followers: profileData.followers || existingUser.followers || 0,
        following: profileData.following || existingUser.following || 0,
      }
    };
    
    // Remove postsCount from the final object if it exists
    delete updatedUser.postsCount;
    
    // Save to your backend or localStorage
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    return getCurrentUserProfile();
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// Additional helper functions if needed
export const generateSampleProfile = (name: string, username: string): UserProfile => {
  return {
    name,
    username,
    bio: `Hello! I'm ${name}. Welcome to my profile!`,
    location: 'Nairobi, Kenya',
    website: `https://github.com/${username.replace('@', '')}`,
    joinDate: new Date().toISOString(),
    stats: {
      posts: 0,
      followers: 0,
      following: 0,
    }
  };
};