import React from 'react';
import { Button, Typography, Space, Badge } from 'antd';
import { MenuOutlined, MessageOutlined, LogoutOutlined } from '@ant-design/icons';

import APP_TITLE from '../../constants/common';
import { AUTH_ACTIONS } from '../../constants/auth';

import './ChatHeader.scss';

const { Title, Text } = Typography;

interface ChatHeaderProps {
  currentUser: string;
  isConnected: boolean;
  isMobile: boolean;
  onMobileMenuToggle: () => void;
  onLogout: () => void;
}

const ChatHeader = React.memo((
  {
    currentUser,
    isConnected,
    isMobile,
    onMobileMenuToggle,
    onLogout,
  }: ChatHeaderProps
) => {
  return (
    <div className="header-content">
      <div className="header-left">
        {isMobile && (
          <Button type="text" icon={<MenuOutlined />} onClick={onMobileMenuToggle} className="mobile-menu-btn" />
        )}
        <div className="app-title-wrapper">
          <MessageOutlined />
          <Title level={4}>{APP_TITLE}</Title>
        </div>
      </div>
      <Space>
        <Text strong className="username-text">
          {currentUser}
        </Text>
        <Badge status={isConnected ? 'success' : 'error'} />
        <Button type="text" icon={<LogoutOutlined />} onClick={onLogout} className="logout-btn">
          {!isMobile && AUTH_ACTIONS.LOGOUT}
        </Button>
      </Space>
    </div>
  );
});

export default ChatHeader;
