import { BrowserRouter, Routes as RouterRoutes, Route } from 'react-router';
import { ToastContainer } from 'react-toastify';

import SocketProvider from '../contextProviders/SocketProvider';
import UserProvider from '../contextProviders/UserProvider';

import 'react-toastify/dist/ReactToastify.css';

// Routes
import Login from './Login';
import Home from './Home';
import Chat from './Chat';

export default function Routes() {
  return (
    <SocketProvider>
      <UserProvider>
        <BrowserRouter>
          <RouterRoutes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Home />} />
              <Route path="/chat" element={<Chat />} />
          </RouterRoutes>
        </BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </UserProvider>
    </SocketProvider>
  );
}
