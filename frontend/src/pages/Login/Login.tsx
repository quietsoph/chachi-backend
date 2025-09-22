import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, Input, Button, Alert, Typography, Space } from 'antd';
import { UserOutlined, MessageOutlined } from '@ant-design/icons';

import { useAuth } from '../../hooks/useAuth';
import { useUser } from '../../hooks/useUser';
import { FORM_CONTENT } from '../../constants/auth';

import './Login.scss';

const { Title, Text } = Typography;

const Login = () => {
  const [usernameInput, setUsernameInput] = useState('');

  const { isLoading, error, joinChat, clearError } = useAuth();
  const { setCurrentUser } = useUser();

  const navigate = useNavigate();

  const handleJoinChat = async () => {
    try {
      const success = await joinChat({ username: usernameInput });
      if (success) {
        // Set the current user globally
        setCurrentUser(usernameInput.trim());
        // Redirect to home page after successful authentication
        navigate('/');
      } else {
        console.error('Join failed');
      }
    } catch (err) {
      console.error('Join chat error:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameInput(e.target.value);
    // clear out the current error if any when input changes
    if (error) clearError();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleJoinChat();
    }
  };

  const buttonDisabled = usernameInput.trim().length < 5 || usernameInput.includes(' ');

  return (
    <div className="login-container">
      <Card className="auth-card">
        <div className="auth-card__header">
          <MessageOutlined className="app-icon" />
          <Title level={2}>{FORM_CONTENT.TITLE}</Title>
          <Text type="secondary">{FORM_CONTENT.SUBTITLE}</Text>
        </div>

        <Space direction="vertical" size="large" className="auth-card__form">
          <div>
            <Input
              size="large"
              placeholder={FORM_CONTENT.INPUT.PLACEHOLDER}
              prefix={<UserOutlined />}
              value={usernameInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              maxLength={30}
            />
            <Text type="secondary" className="input-hint">
              {FORM_CONTENT.INPUT.USERNAME_RULES}
            </Text>
          </div>

          {error && <Alert message={error} type="error" showIcon closable onClose={clearError} />}

          <Button
            type="primary"
            size="large"
            loading={isLoading}
            disabled={buttonDisabled}
            onClick={handleJoinChat}
            block
          >
            {isLoading ? FORM_CONTENT.BUTTON.LOADING : FORM_CONTENT.BUTTON.TEXT}
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default Login;
