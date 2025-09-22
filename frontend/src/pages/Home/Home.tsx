import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';

import SocketContext from '../../contexts/SocketContext';
import ChatHeader from '../../components/ChatHeader';
import ChatList from '../../components/ChatList';

import { useUser } from '../../hooks/useUser';

import './Home.scss';

const Home = () => {
  const { socket, isConnected } = useContext(SocketContext);
  const { currentUser, setCurrentUser } = useUser();

  const [isMobile, setIsMobile] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
  }, [navigate, currentUser]);

  // Check if mobile and handle resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSelectFriend = (friendUsername: string) => {
    // Navigate to chat page with selected friend
    navigate(`/chat?friend=${friendUsername}`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    if (socket) {
      socket.disconnect();
    }
    navigate('/');
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home-page">
      <div className="home-header">
        <ChatHeader
          currentUser={currentUser}
          isConnected={isConnected}
          isMobile={isMobile}
          onMobileMenuToggle={() => {}}
          onLogout={handleLogout}
        />
      </div>

      <div className="chat-list-container">
        <ChatList selectedFriend={null} onSelectFriend={handleSelectFriend} />
      </div>
    </div>
  );
};

export default Home;
