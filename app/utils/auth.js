// Clerk authentication utilities

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Get user profile from backend
export const getUserProfile = async (sessionToken) => {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get user profile failed:', error);
    return { success: false, message: 'Failed to get user profile' };
  }
};

// Verify session with backend
export const verifySession = async (sessionToken) => {
  try {
    const response = await fetch(`${API_URL}/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionToken }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Session verification failed:', error);
    return { success: false, message: 'Session verification failed' };
  }
};

// Update user profile
export const updateUserProfile = async (sessionToken, profileData) => {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Update profile failed:', error);
    return { success: false, message: 'Failed to update profile' };
  }
};

// Delete user account
export const deleteUserAccount = async (sessionToken) => {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Delete account failed:', error);
    return { success: false, message: 'Failed to delete account' };
  }
};