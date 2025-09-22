import { createContext } from 'react';

export interface UserContextType {
  currentUser: string | null;
  friends: string[];
  setCurrentUser: (user: string | null) => void;
  setFriends: (friends: string[]) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export default UserContext;
