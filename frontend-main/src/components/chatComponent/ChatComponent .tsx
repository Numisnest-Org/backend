import {
  Box,
  Divider,
  IconButton,
  InputBase,
  Paper,
  Typography,
  useMediaQuery,
} from '@mui/material';
import _ from 'lodash';
import sendbtn from 'src/assets/Image/send.png';
import useAppContext from 'src/hooks/useAppContext';
import TextInput from '../form-components/textInput';
import Image from '../Image';
import { UploadFileOutlined } from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';
import { ActiveChatType } from 'src/pages/Chat';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import useCollectorsAxiosPrivate from 'src/hooks/useCollectorsAxiosPrivate';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { useTheme } from '@emotion/react';
import { useSocket } from 'src/utilities/context/socketContext';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en';
import { Spinner } from 'src/pages/Item';
dayjs.extend(relativeTime);
import avatar from '../../assets/Image/numisnest avater.jpg';
interface Props {
  activeChat: ActiveChatType;
}
import addIcon from '../../assets/Image/add-file.png';

const ChatComponent = ({ activeChat }: Props) => {
  const { state } = useAppContext();
  const { userType, user, onlineUsers } = state;
  const theme = useTheme();
  const styles = useStyles(theme);
  const axiosPrivate = useAxiosPrivate();
  const axiosCollectorPrivate = useCollectorsAxiosPrivate();
  const socket = useSocket();
  const [currentMessage, SetCurrentMessage] = useState<string>();
  const [Messages, setMessages] = useState<any[]>([]);
  const scroll: any = useRef();
  const isMobileScreen = useMediaQuery('(max-width: 600px)');
  const [isFetching, setIsFetching] = useState<boolean>(false);

  console.log(activeChat);
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsFetching(true);
        if (userType === 'seller') {
          const response = await axiosPrivate.get(
            `seller/chat/messages/${activeChat.roomId}`
          );
          const { data } = response.data;
          setMessages(data);
        } else if (userType === 'collector') {
          const response = await axiosPrivate.get(
            `duo/collector/chat/messages/${activeChat.roomId}`
          );
          const { data } = response.data;
          setMessages(data);
        }
      } catch (error) {
      } finally {
        setIsFetching(false);
      }
    };

    fetchMessages();
  }, [activeChat]);

  useEffect(() => {
    if (socket === null) return;
    socket.on('new message', (data) => {
      setMessages((prev) => [...prev, data.message]);
    });
    return () => {
      socket.off('new message');
    };
  }, [socket]);

  useEffect(() => {
    scroll?.current?.scrollIntoView({ behaviour: 'smooth' });
  }, [Messages]);

  const sendMessage = () => {
    console.log(currentMessage);
    if (currentMessage === '' || null || undefined) return;
    const newMessage = {
      sender_id: user._id,
      receiver_id: activeChat.senderId,
      room_id: activeChat.roomId,
      message: currentMessage,
    };
    socket.emit('new message', newMessage);
    SetCurrentMessage('');
  };

  return (
    <Paper
      sx={{
        width: isMobileScreen ? '100%' : '80%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'F5F5F5',
        mb: '1rem',
        borderRadius: '1rem',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: '7rem',
          py: '1rem',
          px: '1.5rem',
          boxShadow: '1px 2px 4px #ededed',
          backgroundColor: '#ffff',
        }}
      >
        <Box
          sx={{
            width: '5rem',
            aspectRatio: '1',
            background: `url(${
              activeChat?.photo?.secure_url === ''
                ? avatar
                : activeChat?.photo?.secure_url
            })`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderTopLeftRadius: '0.5rem',
            overflow: 'hidden',
          }}
        ></Box>
        <Typography
          sx={{
            fontSize: { sx: '1.2rem', md: '1.3rem' },
            fontWeight: 600,
            ml: '1.5rem',
          }}
        >
          {`${_.upperFirst(activeChat?.firstname)} ${_.upperFirst(
            activeChat?.lastname
          )}`}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, height: '83%', position: 'relative' }}>
        {isFetching ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            {' '}
            <Spinner />{' '}
          </Box>
        ) : (
          <Box
            sx={{
              height: '85.5%',
            }}
          >
            {activeChat.roomId ? (
              <Box
                sx={{
                  height: '100%',
                }}
              >
                <SimpleBar style={{ height: '98%' }}>
                  <Box
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      paddingX: '1.5rem',
                      gap: '0.7rem',
                      pt: '2rem',
                    }}
                  >
                    {Messages?.map((message, index) => (
                      <Box
                        sx={
                          user?._id === message.sender_id
                            ? { alignSelf: 'flex-end' }
                            : { alignSelf: 'flex-start' }
                        }
                        ref={scroll}
                      >
                        <Typography sx={{ fontSize: '12px' }}>
                          {dayjs(message.updatedAt).diff(dayjs(), 'days') >= 0
                            ? dayjs(message.updatedAt).fromNow()
                            : dayjs(message.updatedAt)
                                .format('DD/MM/YYYY hh:mmA')
                                .slice(-7)}
                        </Typography>
                        <Box
                          sx={
                            user?._id === message.sender_id
                              ? styles.sent
                              : styles.receive
                          }
                        >
                          <Typography key={index} sx={{ fontWeight: '500' }}>
                            {message.message}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </SimpleBar>
              </Box>
            ) : (
              <Box
                sx={{
                  height: '88.5%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: '1rem', md: '1.2rem' },
                    fontWeight: '500',
                    color: '#C0C4C4',
                  }}
                >
                  {' '}
                  Select a user from chat List
                </Typography>
              </Box>
            )}{' '}
          </Box>
        )}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            // position: 'absolute',
            // bottom: 0,
            // left: 0,
            // right: 0,
            padding: '0.5rem',
            py: '1rem',
            gap: '1rem',
            backgroundColor: 'white',
          }}
        >
          <Box sx={{ cursor: 'pointer' }}>
            <img src={addIcon} style={{ width: '90%' }} alt="add icon" />
          </Box>
          <InputBase
            fullWidth
            sx={{
              bgcolor: '#E6E7EA',
              height: '2.5rem',
              borderRadius: '10rem',
              padding: '1.4rem',
            }}
            value={currentMessage}
            placeholder="Write your message here"
            onChange={(e) => SetCurrentMessage(e.target.value)}
          />
          <IconButton onClick={sendMessage}>
            <Image
              src={sendbtn}
              alt="send"
              sx={{ width: { xs: '35px', md: '40px' }, ml: '1rem' }}
            />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

const useStyles = (theme: any) => ({
  sent: {
    backgroundColor: '#9CC6E2',
    color: 'black',
    borderRadius: '1rem 1rem 0rem 1rem',
    padding: '10px',
    marginBottom: '8px',
    alignSelf: 'flex-end',
    width: '10rem',
  },
  receive: {
    backgroundColor: '#febc08cf',
    color: 'black',
    borderRadius: '1rem 1rem 1rem 0rem',
    padding: '10px',
    marginBottom: '8px',
    alignSelf: 'flex-start',
    width: '10rem',
  },
});

export default ChatComponent;
