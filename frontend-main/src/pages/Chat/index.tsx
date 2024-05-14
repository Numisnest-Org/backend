import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import React, { useState } from 'react';
import TabButton from 'src/components/Buttons/TabButton';
import ChatComponent from 'src/components/chatComponent/ChatComponent ';
import ChatList from 'src/components/chatComponent/ChatList';
import VisitorLayout from 'src/components/layouts/VisitorLayout';
import { Photo } from 'src/utilities/types';
export interface ActiveChatType {
  senderId: string;
  roomId: string;
  photo?: any;
  firstname?: string;
  lastname?: string;
}
const ChatPage = () => {
  const [activeChat, setActiveChat] = useState<ActiveChatType>({
    senderId: '',
    roomId: '',
    photo: undefined,
    lastname: '',
    firstname: '',
  });
  const isNotMobileScreens = useMediaQuery('(min-width:600px)');
  const isMobileScreen = useMediaQuery('(max-width: 600px)');
  const [activeTab, setActiveTab] = React.useState('ChatList');

  return (
    <VisitorLayout>
      <Typography
        sx={{
          fontSize: { xs: '1.2rem', md: '1.6rem' },
          fontWeight: 700,
          py: '2rem',
        }}
      >
        Messages
      </Typography>
      {/* {!isNotMobileScreens && (
        <Box sx={{ display: 'flex', gap: '1rem', mb: '1rem' }}>
          <TabButton
            active={activeTab === 'ChatList'}
            onClick={() => setActiveTab('ChatList')}
          >
            ChatList
          </TabButton>
          <TabButton
            active={activeTab === 'Messages'}
            onClick={() => setActiveTab('Messages')}
          >
            Messages
          </TabButton>
        </Box>
      )} */}
      <Box sx={{ display: 'flex', gap: '2rem' }}>
        {(isMobileScreen && activeTab === 'ChatList') || !isMobileScreen ? (
          <ChatList
            setActiveChat={setActiveChat}
            activeChat={activeChat}
            setActiveTab={setActiveTab}
          />
        ) : null}
        {(isMobileScreen && activeTab === 'Messages') || !isMobileScreen ? (
          <ChatComponent activeChat={activeChat} />
        ) : null}
      </Box>
    </VisitorLayout>
  );
};

export default ChatPage;
