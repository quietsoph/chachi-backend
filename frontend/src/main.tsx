import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@ant-design/v5-patch-for-react-19'; // use compatibility package for react 19. Reference https://ant.design/docs/react/v5-for-19

import Routes from './pages';

import './_index.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Routes />
  </StrictMode>
);
