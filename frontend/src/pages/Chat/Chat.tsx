import { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'react-toastify';

import SocketContext from '../../contexts/SocketContext';
import ChatContent from '../../components/ChatContent';

import { Message } from '../../types/chat';
import { useUser } from '../../hooks/useUser';

import './Chat.scss';

const Chat = () => {
  const { socket } = useContext(SocketContext);
  const { currentUser } = useUser();

  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [friendTyping, setFriendTyping] = useState<string | null>(null);

  const [isMobile, setIsMobile] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Get friend from URL params
    const friendParam = searchParams.get('friend');
    if (friendParam) {
      setSelectedFriend(friendParam);
    }
  }, [searchParams, currentUser, navigate]);

  // Check if mobile and handle resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, selectedFriend]);

  // Handle mobile keyboard showing/hiding
  useEffect(() => {
    if (!isMobile) return;

    const handleVisualViewportChange = () => {
      if (messagesContainerRef.current) {
        setTimeout(() => {
          const container = messagesContainerRef.current;
          if (container) {
            container.scrollTop = container.scrollHeight;
          }
        }, 300);
      }
    };

    const visualViewport = window.visualViewport;
    if (visualViewport) {
      visualViewport.addEventListener('resize', handleVisualViewportChange);
      return () => {
        visualViewport.removeEventListener('resize', handleVisualViewportChange);
      };
    }
  }, [isMobile, selectedFriend]);

  // Socket event listeners
  useEffect(() => {
    if (!socket || !currentUser) return;

    // Message received
    const handleMessage = (message: Message) => {
      setMessages((prev) => [...prev, message]);
    };

    // Typing indicators
    const handleTyping = (data: { from: string; isTyping: boolean }) => {
      if (data.from === selectedFriend) {
        setFriendTyping(data.isTyping ? data.from : null);
      }
    };

    // Error handling
    const handleError = (error: string) => {
      toast.error(error, {
        position: 'top-right'
      });
      navigate('/login');
    };

    socket.on('receive_private_message', handleMessage);
    socket.on('user_typing', handleTyping);
    socket.on('error', handleError);

    return () => {
      socket.off('receive_private_message', handleMessage);
      socket.off('user_typing', handleTyping);
      socket.off('error', handleError);
    };
  }, [socket, currentUser, selectedFriend, navigate]);

  const handleSendMessage = () => {
    if (!socket || !selectedFriend || !messageInput.trim()) return;

    const messageData = {
      to: selectedFriend,
      content: messageInput.trim()
    };

    // Add message to local state immediately
    const localMessage: Message = {
      id: Date.now().toString(),
      from: currentUser!,
      to: selectedFriend,
      content: messageInput.trim(),
      timestamp: new Date(),
      delivered: false
    };

    setMessages((prev) => [...prev, localMessage]);
    socket.emit('send_private_message', messageData);
    setMessageInput('');

    // Focus input on mobile after sending
    if (isMobile && messageInputRef.current) {
      setTimeout(() => {
        messageInputRef?.current?.focus();
      }, 100);
    }
  };

  const handleTypingStart = () => {
    if (!socket || !selectedFriend || isTyping) return;
    setIsTyping(true);
    socket.emit('typing_start', selectedFriend);
  };

  const handleTypingStop = () => {
    if (!socket || !selectedFriend || !isTyping) return;
    setIsTyping(false);
    socket.emit('typing_stop', selectedFriend);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="chat-page">
      <ChatContent
        selectedFriend={selectedFriend}
        currentUser={currentUser!}
        messages={messages}
        messageInput={messageInput}
        friendTyping={friendTyping}
        isMobile={isMobile}
        messagesContainerRef={messagesContainerRef}
        messageInputRef={messageInputRef}
        onMessageInputChange={setMessageInput}
        onSendMessage={handleSendMessage}
        onTypingStart={handleTypingStart}
        onTypingStop={handleTypingStop}
        onBackClick={handleBackToHome}
      />
    </div>
  );
};

export default Chat;
