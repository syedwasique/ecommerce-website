import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up with email and password
  const signup = (email, password) => {
    return auth.createUserWithEmailAndPassword(email, password);
  };

  // Login with email and password
  const login = async (email, password) => {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const fullUser = getUserData(userCredential.user);
    setCurrentUser(fullUser);
    return userCredential;
  };

  // Logout
  const logout = async () => {
    await auth.signOut();
    setCurrentUser(null);
  };

  // Update user profile
  const updateUserProfile = async (profileData) => {
    if (!currentUser) throw new Error('No user is signed in');
    
    try {
      // Update Firebase profile (displayName and photoURL)
      if (profileData.displayName || profileData.photoURL) {
        await currentUser.updateProfile({
          displayName: profileData.displayName || currentUser.displayName,
          photoURL: profileData.photoURL || currentUser.photoURL
        });
      }
      
      // Update custom fields in localStorage
      const updatedUser = {
        ...currentUser,
        displayName: profileData.displayName || currentUser.displayName,
        phone: profileData.phone || currentUser.phone,
        address: profileData.address || currentUser.address
      };
      
      // Save to localStorage
      localStorage.setItem(`user_${currentUser.uid}`, JSON.stringify(updatedUser));
      
      // Update state
      setCurrentUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  // Reset password
  const resetPassword = (email) => {
    return auth.sendPasswordResetEmail(email);
  };

  // Update email
  const updateEmail = (email) => {
    return currentUser.updateEmail(email);
  };

  // Update password
  const updatePassword = (password) => {
    return currentUser.updatePassword(password);
  };

  // Get user data with custom fields
  const getUserData = (user) => {
    if (!user) return null;
    
    // Retrieve custom data from localStorage
    const storedData = localStorage.getItem(`user_${user.uid}`);
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        return {
          ...user,
          displayName: parsedData.displayName || user.displayName,
          phone: parsedData.phone || null,
          address: parsedData.address || null
        };
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    
    return user;
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      const fullUser = getUserData(user);
      setCurrentUser(fullUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    updateUserProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}







// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { auth } from './firebase';

// const AuthContext = createContext();

// export function useAuth() {
//   return useContext(AuthContext);
// }

// export function AuthProvider({ children }) {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Sign up with email and password
//   const signup = (email, password) => {
//     return auth.createUserWithEmailAndPassword(email, password);
//   };

//   // Login with email and password
//   const login = (email, password) => {
//     return auth.signInWithEmailAndPassword(email, password);
//   };

//   // Logout
//   const logout = () => {
//     return auth.signOut();
//   };

//   // Update user profile
//   const updateUserProfile = async (profileData) => {
//     if (!currentUser) throw new Error('No user is signed in');
    
//     try {
//       // Update Firebase profile (displayName and photoURL)
//       if (profileData.displayName || profileData.photoURL) {
//         await currentUser.updateProfile({
//           displayName: profileData.displayName || currentUser.displayName,
//           photoURL: profileData.photoURL || currentUser.photoURL
//         });
//       }
      
//       // Update custom fields in localStorage
//       const updatedUser = {
//         ...currentUser,
//         displayName: profileData.displayName || currentUser.displayName,
//         phone: profileData.phone || currentUser.phone,
//         address: profileData.address || currentUser.address
//       };
      
//       // Save to localStorage
//       localStorage.setItem(`user_${currentUser.uid}`, JSON.stringify(updatedUser));
      
//       // Update state
//       setCurrentUser(updatedUser);
//       return updatedUser;
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       throw error;
//     }
//   };

//   // Reset password
//   const resetPassword = (email) => {
//     return auth.sendPasswordResetEmail(email);
//   };

//   // Update email
//   const updateEmail = (email) => {
//     return currentUser.updateEmail(email);
//   };

//   // Update password
//   const updatePassword = (password) => {
//     return currentUser.updatePassword(password);
//   };

//   // Get user data with custom fields
//   const getUserData = (user) => {
//     if (!user) return null;
    
//     // Retrieve custom data from localStorage
//     const storedData = localStorage.getItem(`user_${user.uid}`);
//     if (storedData) {
//       try {
//         const parsedData = JSON.parse(storedData);
//         return {
//           ...user,
//           displayName: parsedData.displayName || user.displayName,
//           phone: parsedData.phone || null,
//           address: parsedData.address || null
//         };
//       } catch (e) {
//         console.error('Error parsing user data:', e);
//       }
//     }
    
//     return user;
//   };

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged(user => {
//       const fullUser = getUserData(user);
//       setCurrentUser(fullUser);
//       setLoading(false);
//     });

//     return unsubscribe;
//   }, []);

//   const value = {
//     currentUser,
//     signup,
//     login,
//     logout,
//     resetPassword,
//     updateEmail,
//     updatePassword,
//     updateUserProfile,
//     loading
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// }