import { useState, ReactNode, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import UserContext, { UserContextType } from '../contexts/UserContext';
import SocketContext from '../contexts/SocketContext';

interface UserProviderProps {
  children: ReactNode;
}

const UserProvider = ({ children }: UserProviderProps) => {
  const { socket } = useContext(SocketContext);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [friends, setFriends] = useState<string[]>([]);

  // Handle socket events
  useEffect(() => {
    if (!socket || !currentUser) return;

    // Handle when a new user joins
    const handleUserJoined = (data: { username: string; onlineUsers: string[] }) => {
      const { username, onlineUsers } = data;

      const friends = onlineUsers.filter((user) => user !== currentUser);
      setFriends(friends);

      // Show notification to all other online users
      if (username !== currentUser) {
        toast.success(`${username} joined the chat!`, {
          position: 'top-right',
          autoClose: 3000
        });
      }
    };

    socket.on('user_joined', handleUserJoined);

    return () => {
      socket.off('user_joined', handleUserJoined);
    };
  }, [socket, currentUser]);

  const contextValue: UserContextType = {
    currentUser,
    friends,
    setCurrentUser,
    setFriends
  };

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

export default UserProvider;
