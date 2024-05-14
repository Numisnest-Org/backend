import { Box, Divider, Paper, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ChatAvater from './ChatAvater';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import useAppContext from 'src/hooks/useAppContext';
import useCollectorsAxiosPrivate from 'src/hooks/useCollectorsAxiosPrivate';
import { MessagesList } from 'src/utilities/types';
import { ActiveChatType } from 'src/pages/Chat';
import { useSocket } from 'src/utilities/context/socketContext';
import SimpleBar from 'simplebar-react';
import Search from '../homeComponents/Search';
import avatar from '../../assets/Image/numisnest avater.jpg';

interface Props {
  setActiveChat: (val: ActiveChatType) => void;
  activeChat: ActiveChatType;
  setActiveTab: (val: string) => void;
}
const ChatList = ({ setActiveChat, activeChat, setActiveTab }: Props) => {
  const { state } = useAppContext();
  const { userType, user, Messageid } = state;
  const axiosPrivate = useAxiosPrivate();
  const axiosCollectorPrivate = useCollectorsAxiosPrivate();
  const [chatList, setChatList] = useState<MessagesList[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const socket = useSocket();
  const tosecid = '657e365063d77d45cbf79478';

  useEffect(() => {
    const FetchSellerChatList = async () => {
      try {
        const response = await axiosPrivate.get(`seller/chat/list`);

        setChatList(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    const FetchCollectorChatList = async () => {
      try {
        const response = await axiosCollectorPrivate.get(
          `duo/collector/chat/list`
        );
        setChatList(response.data.data);
      } catch (error) {
        console.log(`chai:${error}`);
      }
    };

    if (userType === 'seller') {
      FetchSellerChatList();
    } else {
      FetchCollectorChatList();
    }
  }, []);
  useEffect(() => {
    if (chatList?.[0]) {
      const item = chatList.find((chat) => chat.receiver_id === Messageid);
      console.log(item);
      if (tosecid)
        setActiveChat({
          senderId: item ? item?.sender_id : '',
          roomId: item ? item?.room_id : '',
          photo: item?.user_details?.[0].photo.secure_url,
          firstname: item?.user_details?.[0]?.first_name,
          lastname: item?.user_details?.[0]?.last_name,
        });
    }
  }, [chatList]);


  const isMobileScreen = useMediaQuery('(max-width: 600px)');
  return (
    <Box
      sx={{
        height: '100vh',
        width: isMobileScreen ? '100%' : '30%',
        pt: !isMobileScreen ? '1.5rem' : '',
        boxShadow: '1px 2px 4px #ddddd',
        bgcolor: '#fff',
        borderRadius: '20px',
        px: !isMobileScreen ? '1.5rem' : 'unset',
      }}
    >
      <Box
        sx={{
          py: '1.2rem',
          mt: !isMobileScreen ? '2rem' : 'unset',
          px: '1rem',
          pt: isMobileScreen ? '3rem' : 'unset',
          width: '100%',
          maxWidth: '500px',
          boxShadow: '1px 2px 4px #cccccc',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        <Search setState={setSearchValue} />
      </Box>
      <SimpleBar
        style={{
          height:"75%",// simple bar is not an mui componnet
          backgroundColor: 'white',
          padding: '0.5rem',
          boxShadow: '1px 2px 4px #cccccc',
          marginTop: '2rem',
          borderRadius: '10px',
        }}
      >
        {chatList.map((item) => (
          <Box
            sx={{ mb: '0.5rem' }}
            component={'div'}
            onClick={() => {
              setActiveChat({
                senderId: item.sender_id,
                roomId: item.room_id,
                photo: item.user_details?.[0].photo?.secure_url,
                firstname: item.user_details?.[0]?.first_name,
                lastname: item.user_details?.[0]?.last_name,
              });
              setActiveTab('Messages');
              const read = {
                time_seen: new Date(),
                user_id: user._id,
                room_id: item.room_id,
              };
              socket.emit('seen status', read);
            }}
          >
            {item.user_details?.[0] && (
              <Box>
                <ChatAvater
                  first_name={item.user_details?.[0]?.first_name}
                  last_name={item.user_details?.[0]?.last_name}
                  url={
                    item.user_details?.[0]?.photo?.secure_url === ''
                      ? avatar
                      : item.user_details?.[0]?.photo?.secure_url
                  }
                  isOnline={item.user_details?.[0]?.online}
                  unreadCount={item.unread_msg?.[0]?.counts}
                />
                <Divider sx={{ borderBottom: '1px solid #c7c7c7' }} />{' '}
              </Box>
            )}
          </Box>
        ))}
      </SimpleBar>
    </Box>
  );
};

export default ChatList;
