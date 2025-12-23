import {
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ID, Query } from 'react-native-appwrite';
import { APPWRITE_CONFIG, databases } from '../config/appwriteConfig';
import { auth } from '../config/firebaseConfig';

interface User {
  id: string;
  email: string;
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, fullName: string, pass: string) => Promise<void>;
  updateUser: (fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          fullName: firebaseUser.displayName || '',
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      console.error("Login Error:", error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, fullName: string, pass: string) => {
    setIsLoading(true);
    try {
      // 1. Create Firebase User
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const firebaseUser = userCredential.user;

      // 2. Set Firebase Display Name
      await updateProfile(firebaseUser, { displayName: fullName });

      // 3. Create Document in Appwrite
      try {
        await databases.createDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.usersCollectionId,
          ID.unique(),
          {
            userId: firebaseUser.uid,
            email: email,
            fullName: fullName,
            $createdAt: new Date().toISOString(),
          }
        );
      } catch (appwriteError) {
        console.error("Appwrite DB Error (Signup):", appwriteError);
        // Note: We don't throw here if Firebase succeeded, but in a real app you might want to rollback.
      }

      setUser({
        id: firebaseUser.uid,
        email: email,
        fullName: fullName,
      });
    } catch (error: any) {
      console.error("Signup Error:", error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (fullName: string) => {
    if (!auth.currentUser) return;
    
    try {
      // 1. Update Firebase Profile
      await updateProfile(auth.currentUser, { displayName: fullName });
      
      // 2. Update Appwrite Document
      try {
        const userId = auth.currentUser.uid;
        const response = await databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.usersCollectionId,
          [Query.equal('userId', userId)]
        );

        if (response.documents.length > 0) {
          await databases.updateDocument(
            APPWRITE_CONFIG.databaseId,
            APPWRITE_CONFIG.usersCollectionId,
            response.documents[0].$id,
            { fullName: fullName }
          );
        }
      } catch (appwriteError) {
        console.error("Appwrite DB Error (Update):", appwriteError);
      }
      
      setUser(prev => prev ? { ...prev, fullName } : null);
    } catch (error: any) {
      console.error("Update Profile Error:", error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      console.error("Logout Error:", error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, updateUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
