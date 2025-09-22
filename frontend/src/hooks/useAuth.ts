import { useCallback, useContext, useState, useRef, useEffect } from 'react';

import SocketContext from '../contexts/SocketContext';

import { validateUsernameInput } from '../utils/username';

import { AUTH_ERRORS } from '../constants/home';
import { DEFAULT_TIMEOUT, TIMEOUT } from '../constants/auth';

import { AuthState, JoinChatOptions } from '../types/auth';

export const useAuth = () => {
  const { socket } = useContext(SocketContext);

  const [state, setState] = useState<AuthState>({
    currentUser: null,
    isLoading: false,
    error: null
  });

  // Refs for cleanup and preventing memory leaks
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isComponentMountedRef = useRef(true);

  // cleanup on unmount
  useEffect(() => {
    isComponentMountedRef.current = true;

    return () => {
      isComponentMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Safe state setter with better mount detection
  const safeSetState = useCallback((updates: Partial<AuthState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const clearError = useCallback(() => {
    safeSetState({ error: null });
  }, [safeSetState]);

  // Main authentication function
  const joinChat = useCallback(
    async ({ username, timeout = DEFAULT_TIMEOUT }: JoinChatOptions): Promise<boolean> => {
      const trimmedUsername = username.trim();

      // early validate username input
      const validationError = validateUsernameInput(username);
      if (validationError) {
        safeSetState({ error: validationError });
        return false;
      }

      // if no error, set loading state
      safeSetState({
        isLoading: true,
        error: null
      });

      return new Promise((resolve) => {
        let isResolved = false;

        // Cleanup function
        const cleanup = () => {
          if (socket) {
            socket.off('error', handleError);
            socket.off('auth_success', handleAuthSuccess);
          }
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
        };

        // prevent multiple resolutions
        const resolveOnce = (result: boolean) => {
          if (!isResolved && isComponentMountedRef.current) {
            isResolved = true;
            resolve(result);
          }
        };

        // Auth success handler
        const handleAuthSuccess = (username: string) => {
          if (!isComponentMountedRef.current) return;

          console.log('🎉 Authentication successful!', username);

          // Update state
          safeSetState({
            currentUser: trimmedUsername,
            isLoading: false,
            error: null
          });

          cleanup();
          resolveOnce(true);
        };

        // Error handler
        const handleError = (errorMessage: string) => {
          console.error('❌ Authentication failed:', errorMessage);

          safeSetState({
            error: errorMessage,
            isLoading: false
          });

          cleanup();
          resolveOnce(false);
        };

        // Set up event listeners
        if (socket) {
          socket.on('error', handleError);
          socket.on('auth_success', handleAuthSuccess);

          // Send join request
          socket.emit('user_join', { username: trimmedUsername });

          // Set up timeout. It may be a case that server crashes during authentication. This prevent indefinite loading.
          timeoutRef.current = setTimeout(() => {
            if (!isResolved && isComponentMountedRef.current) {
              console.warn('⏰ Authentication timeout');
              safeSetState({
                error: TIMEOUT,
                isLoading: false
              });
              cleanup();
              resolveOnce(false);
            }
          }, timeout);
        } else {
          // No socket available
          safeSetState({
            error: AUTH_ERRORS.NO_CONNECTION,
            isLoading: false
          });
          resolveOnce(false);
        }
      });
    },
    [socket, safeSetState]
  );

  // logout function
  const logout = useCallback(() => {
    safeSetState({
      currentUser: null,
      error: null,
      isLoading: false
    });
  }, [safeSetState]);

  return {
    currentUser: state.currentUser,
    isLoading: state.isLoading,
    error: state.error,
    logout,
    clearError,
    joinChat
  };
};
