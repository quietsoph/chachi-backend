import { useState, useEffect, useContext, useRef, useCallback, useMemo } from 'react';
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
  const focusTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      // Clear messages when switching friends
      setMessages([]);
      setFriendTyping(null);
      setIsTyping(false);
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

    let timeoutId: NodeJS.Timeout;

    const handleVisualViewportChange = () => {
      if (messagesContainerRef.current) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
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
        clearTimeout(timeoutId);
        visualViewport.removeEventListener('resize', handleVisualViewportChange);
      };
    }
  }, [isMobile, selectedFriend]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Memoized socket event handlers to prevent re-creation
  const handleMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const handleTyping = useCallback((data: { from: string; isTyping: boolean }) => {
    if (data.from === selectedFriend) {
      setFriendTyping(data.isTyping ? data.from : null);
    }
  }, [selectedFriend]);

  const handleError = useCallback((error: string) => {
    toast.error(error, {
      position: 'top-right'
    });
    navigate('/login');
  }, [navigate]);

  // Socket event listeners - only depend on socket and currentUser
  useEffect(() => {
    if (!socket || !currentUser) return;

    socket.on('receive_private_message', handleMessage);
    socket.on('user_typing', handleTyping);
    socket.on('error', handleError);

    return () => {
      socket.off('receive_private_message', handleMessage);
      socket.off('user_typing', handleTyping);
      socket.off('error', handleError);
    };
  }, [socket, currentUser, handleMessage, handleTyping, handleError]);

  const handleSendMessage = useCallback(() => {
    if (!socket || !selectedFriend || !messageInput.trim() || !currentUser) return;

    const messageData = {
      to: selectedFriend,
      content: messageInput.trim()
    };

    // Add message to local state immediately
    const localMessage: Message = {
      id: Date.now().toString(),
      from: currentUser,
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
      // Clear any existing timeout
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
      }

      focusTimeoutRef.current = setTimeout(() => {
        messageInputRef?.current?.focus();
        focusTimeoutRef.current = null;
      }, 100);
    }
  }, [socket, selectedFriend, messageInput, currentUser, isMobile]);

  const handleTypingStop = () => {
    if (!socket || !selectedFriend || !isTyping) return;
    setIsTyping(false);
    socket.emit('typing_stop', selectedFriend);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  const handleTypingStart = () => {
    if (!socket || !selectedFriend || isTyping) return;
    setIsTyping(true);
    socket.emit('typing_start', selectedFriend);

    // Auto-stop typing after 3 seconds of inactivity
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      if (socket && selectedFriend) {
        setIsTyping(false);
        socket.emit('typing_stop', selectedFriend);
      }
    }, 3000);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  // Show loading state
  if (!currentUser) {
    return <div>Loading...</div>;
  }

  // Limit messages to prevent memory issues (keep last 1000)
  const limitedMessages = useMemo(() => {
    return messages.length > 1000 ? messages.slice(-1000) : messages;
  }, [messages]);

  return (
    <div className="chat-page">
      <ChatContent
        selectedFriend={selectedFriend}
        currentUser={currentUser!}
        messages={limitedMessages}
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
