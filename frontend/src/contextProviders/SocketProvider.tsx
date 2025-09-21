import { useEffect, useRef, useState, ReactNode } from "react";
import { io, Socket } from 'socket.io-client';

import config from "../config";

import SocketContext from "../contexts/SocketContext";

const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const socket = io(config.SOCKET_ENDPOINT, {
      transports: ['websocket', 'polling', 'flashsocket']
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      setError(null);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      setError(err.message);
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        isConnected,
        error
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;