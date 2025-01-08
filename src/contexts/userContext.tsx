// src/contexts/UserContext.tsx
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

interface UserContextType {
  userId: string | undefined;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const auth = getAuth(); 

  useEffect(() => {
    onAuthStateChanged(auth, (user: User | null) => {
      console.log(user?.uid)
      if (user) {
        setUserId(user.uid); 
      } else {
        setUserId(undefined);
      }
    });
  }, [auth]);

  return (
    <UserContext.Provider value={{ userId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
