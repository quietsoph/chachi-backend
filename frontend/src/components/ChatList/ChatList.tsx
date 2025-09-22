import { List, Avatar, Typography, Space, Badge } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import { CHAT_LIST_CONTENT } from '../../constants/home';

import { useUser } from '../../hooks/useUser';

import './ChatList.scss';

const { Title } = Typography;

interface ChatListProps {
  selectedFriend: string | null;
  onSelectFriend: (friendName: string) => void;
}

const ChatList = ({ selectedFriend, onSelectFriend }: ChatListProps) => {
  const { friends } = useUser();
  return (
    <div className="chats-list">
      <Title level={5}>
        {CHAT_LIST_CONTENT.TITLE} ({friends.length})
      </Title>
      <List
        dataSource={friends}
        renderItem={(friendName) => (
          <List.Item
            className={`chat-item ${selectedFriend === friendName ? 'selected' : ''}`}
            onClick={() => onSelectFriend(friendName)}
          >
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={
                <Space>
                  {friendName}
                  <Badge status="success" />
                </Space>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default ChatList;
