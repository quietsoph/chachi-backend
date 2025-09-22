import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as IOServer } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

import CONFIG from './config';
import { Message, PrivateMessageData, User, UserJoinData } from './types/chat';
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from './types/socket';

import { hasSpaces } from './utils/string';

const app = express();
const router = express.Router();

const httpServer = http.createServer(app);
const io = new IOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const connectedUsers = new Map<string, User>(); // a collection of connected users with [user name - user data] pairs
const socketsToUsers = new Map<string, string>(); // [socket id - user name] pairs

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(router);

io.on('connection', (socket) => {
  // handle a new user joins the chat app
  socket.on('user_join', (data: UserJoinData) => {
    const { username } = data;
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      socket.emit('error', 'Username is required');
      return;
    }

    if (hasSpaces(trimmedUsername)) {
      socket.emit('error', 'Username cannot have any spaces');
    }

    if (trimmedUsername.length < 5) {
      socket.emit('error', 'Username must have at least 5 characters');
      return;
    }

    if (connectedUsers.has(trimmedUsername)) {
      socket.emit('error', 'Username already taken');
      return;
    }

    //otherwise, store users
    const userData: User = {
      username: trimmedUsername,
      socketId: socket.id,
      joinedAt: new Date()
    };

    connectedUsers.set(trimmedUsername, userData);
    socketsToUsers.set(socket.id, trimmedUsername);

    // confirm authentication success to the joining user only
    socket.emit('auth_success', trimmedUsername);

    // broadcast to everyone about user_joined together with the updated list of online users.
    const onlineUsers = Array.from(connectedUsers.keys());

    io.emit('user_joined', {
      username: trimmedUsername,
      onlineUsers
    });
  });

  // handle one user send messages to another
  socket.on('send_private_message', (data: PrivateMessageData) => {
    const senderUsername = socketsToUsers.get(socket.id);

    // validate sender's username
    if (!senderUsername) {
      socket.emit('error', 'You must join to chat');
      return;
    }

    const { to, content } = data;

    if (!content || content.trim().length === 0) {
      socket.emit('error', 'Message cannot be empty');
      return;
    }

    if (!connectedUsers.has(to)) {
      socket.emit('error', 'Users not found or offline');
      return;
    }

    const message: Message = {
      id: uuidv4(),
      from: senderUsername,
      to,
      content: content.trim(),
      timestamp: new Date(),
      delivered: false
    };

    const recipient = connectedUsers.get(to);
    if (recipient) {
      const recipientSocket = io.sockets.sockets.get(recipient.socketId);
      if (recipientSocket) {
        recipientSocket.emit('receive_private_message', {
          ...message,
          delivered: true
        });
      }
    }
  });

  // handle typing start indicator
  socket.on('typing_start', (targetUser: string) => {
    const senderUsername = socketsToUsers.get(socket.id);
    if (!senderUsername || !connectedUsers.has(targetUser)) return;

    const recipient = connectedUsers.get(targetUser);
    if (!recipient) return;

    const recipientSocket = io.sockets.sockets.get(recipient.socketId);
    if (!recipientSocket) return;

    recipientSocket.emit('user_typing', {
      from: senderUsername,
      isTyping: true
    });
  });

  // handle typing stop indicator
  socket.on('typing_stop', (targetUser: string) => {
    const senderUsername = socketsToUsers.get(socket.id);
    if (!senderUsername || !connectedUsers.has(targetUser)) return;

    const recipient = connectedUsers.get(targetUser);
    if (!recipient) return;

    const recipientSocket = io.sockets.sockets.get(recipient.socketId);
    if (!recipientSocket) return;

    recipientSocket.emit('user_typing', {
      from: senderUsername,
      isTyping: false
    });
  });

  // handle disconnect
  socket.on('disconnect', () => {
    const username = socketsToUsers.get(socket.id);
    if (username) {
      connectedUsers.delete(username);
      socketsToUsers.delete(socket.id);
    }
  });
});

httpServer.listen(CONFIG.PORT, () => {
  console.log(`Server listening on *:${CONFIG.PORT} 🚀`);
});
