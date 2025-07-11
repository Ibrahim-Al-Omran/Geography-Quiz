import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const fetchUserProfile = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
      } else {
        // Create a default profile if none exists
        const defaultProfile = {
          username: user?.displayName || 'User',
          createdAt: new Date().toISOString(),
          bestScores: {}
        };
        await setDoc(doc(db, 'users', uid), defaultProfile);
        setUserProfile(defaultProfile);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Only update if there's an actual change or initial load
      if (!user || user?.uid !== currentUser?.uid) {
        setUser(currentUser);
        setIsAuthenticated(!!currentUser);
      }
      
      setAuthChecked(true);
      
      if (currentUser) {
        // Only fetch profile if we don't already have it
        if (!userProfile || userProfile.username !== currentUser.displayName) {
          fetchUserProfile(currentUser.uid);
        }
      } else {
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, [user, userProfile]);

  // Update updateUserWithProfile to be more robust
  const updateUserWithProfile = (userData) => {
    if (!userData) return;
    
    console.log('Updating user profile with:', userData.displayName);
    
    // Don't use the || 'User' fallback here - it should come from the registration
    const username = userData.displayName;
    
    if (!username) {
      console.warn('No username provided for user profile update');
      return; // Don't update if no username
    }
    
    // Update auth state with the user data
    setUser(userData);
    setIsAuthenticated(true);
    
    // Create a profile with the proper username
    const updatedProfile = {
      username: username, // Use the username directly, no fallback
      createdAt: new Date().toISOString(),
      bestScores: {}
    };
    
    // Set local state first for immediate UI update
    setUserProfile(updatedProfile);
    
    // Also save to Firestore
    try {
      setDoc(doc(db, 'users', userData.uid), updatedProfile, { merge: true });
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  const value = {
    user,
    setUser,
    userProfile,
    setUserProfile,
    isAuthenticated,
    setIsAuthenticated,
    authChecked,
    setAuthChecked,
    fetchUserProfile,
    updateUserWithProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}