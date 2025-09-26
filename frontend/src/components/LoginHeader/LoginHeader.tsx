import React from 'react';
import { Typography } from 'antd';
import { MessageOutlined } from '@ant-design/icons';

import { FORM_CONTENT } from '../../constants/auth';

import './LoginHeader.scss';

const { Title, Text } = Typography;

const LoginHeader = React.memo(() => (
  <div className="auth-card__header">
    <MessageOutlined className="app-icon" />
    <Title level={2}>{FORM_CONTENT.TITLE}</Title>
    <Text type="secondary">{FORM_CONTENT.SUBTITLE}</Text>
  </div>
));

export default LoginHeader;