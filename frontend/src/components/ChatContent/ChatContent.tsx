import { Layout, Input, Button, Typography } from 'antd';
import { MessageOutlined, UserOutlined, ArrowLeftOutlined } from '@ant-design/icons';

import { Message } from '../../types/chat';
import { CHAT_CONTENT, CHAT_STYLES } from '../../constants/chat';

import './ChatContent.scss';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

interface ChatContentProps {
  selectedFriend: string | null;
  currentUser: string;
  messages: Message[];
  messageInput: string;
  friendTyping: string | null;
  isMobile: boolean;
  messagesContainerRef: React.RefObject<HTMLDivElement | null>;
  messageInputRef: React.RefObject<HTMLTextAreaElement | null>;
  onMessageInputChange: (value: string) => void;
  onSendMessage: () => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
  onBackClick: () => void;
}

const ChatContent = ({
  selectedFriend,
  currentUser,
  messages,
  messageInput,
  friendTyping,
  isMobile,
  messagesContainerRef,
  messageInputRef,
  onMessageInputChange,
  onSendMessage,
  onTypingStart,
  onTypingStop,
  onBackClick
}: ChatContentProps) => {
  return (
    <Content className="chat-content">
      {selectedFriend ? (
        <div className="chat-container">
          <div className="chat-header-info">
            <div className="chat-header-content">
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={onBackClick}
                className="back-btn"
              />
              <Title level={5} className="friend-title">
                <UserOutlined /> {selectedFriend}
                {friendTyping && <Text type="secondary">{CHAT_CONTENT.TYPING.INDICATOR}</Text>}
              </Title>
            </div>
          </div>

          <div className="messages-container" ref={messagesContainerRef}>
            {messages
              .filter(msg =>
                (msg.from === currentUser && msg.to === selectedFriend) ||
                (msg.from === selectedFriend && msg.to === currentUser)
              )
              .map(message => (
                <div
                  key={message.id}
                  className={`message ${message.from === currentUser ? 'own' : 'other'}`}
                >
                  <div className="message-content">
                    {message.content}
                  </div>
                  <div className="message-time">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
          </div>

          <div className="message-input">
            <TextArea
              ref={messageInputRef}
              placeholder={CHAT_CONTENT.INPUT.PLACEHOLDER}
              value={messageInput}
              onChange={(e) => {
                onMessageInputChange(e.target.value);
                if (e.target.value) {
                  onTypingStart();
                } else {
                  onTypingStop();
                }
              }}
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault();
                  onSendMessage();
                  onTypingStop();
                }
              }}
              autoSize={{
                minRows: CHAT_STYLES.TEXTAREA.MIN_ROWS,
                maxRows: isMobile ? CHAT_STYLES.TEXTAREA.MAX_ROWS.MOBILE : CHAT_STYLES.TEXTAREA.MAX_ROWS.DESKTOP
              }}
              style={{
                fontSize: isMobile ? CHAT_STYLES.TEXTAREA.FONT_SIZE.MOBILE : CHAT_STYLES.TEXTAREA.FONT_SIZE.DESKTOP,
                touchAction: CHAT_STYLES.TEXTAREA.TOUCH_ACTION
              }}
            />
            <Button
              type="primary"
              onClick={() => {
                onSendMessage();
                onTypingStop();
              }}
              disabled={!messageInput.trim()}
            >
              {CHAT_CONTENT.BUTTON.SEND}
            </Button>
          </div>
        </div>
      ) : (
        <div className="no-chat-selected">
          <MessageOutlined
            style={{
              fontSize: isMobile ? CHAT_STYLES.ICON_SIZE.MOBILE : CHAT_STYLES.ICON_SIZE.DESKTOP,
              color: CHAT_STYLES.ICON_COLOR
            }} />
          <Title level={isMobile ? 5 : 4} type="secondary">
            {isMobile ? CHAT_CONTENT.NO_CHAT_SELECTED.MOBILE : CHAT_CONTENT.NO_CHAT_SELECTED.DESKTOP}
          </Title>
        </div>
      )}
    </Content>
  );
};

export default ChatContent;