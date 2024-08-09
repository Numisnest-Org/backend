import { Box, Typography } from '@mui/material';
import _ from 'lodash';
import jenny from 'src/assets/Image/jenny.jpg';
interface Props {
  url?: string;
  first_name: string;
  last_name: string;
  isOnline: boolean;
  unreadCount: number;
}
const ChatAvater = ({
  url,
  first_name,
  last_name,
  isOnline,
  unreadCount,
}: Props) => {
  return (
    <Box
      sx={{
        padding: '0.2rem',

        '&:hover': {
          cursor: 'pointer',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            ml: '1rem',
            py: '1rem',
          }}
        >
          <Box
            sx={{
              background: url ? `url(${url})` : 'blue',
              width: '3rem',
              aspectRatio: '1',
              borderRadius: '50%',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                width: '1rem',
                height: '1rem',
                borderRadius: '50%',
                position: 'absolute',
                bgcolor: isOnline ? '	#5FD39F' : '#B4BBBB',
                bottom: 5,
                right: 3,
              }}
            ></Box>
          </Box>
          <Typography sx={{ ml: '1rem', fontSize: '1rem', fontWeight: '600' }}>
            {_.upperFirst(first_name)}{' '}
            {_.upperFirst(`${last_name.slice(0, 1)}.`)}
          </Typography>
        </Box>
        {unreadCount && (
          <Box
            sx={{
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',
              bgcolor: 'blue',
              color: 'white',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: 'bold',
            }}
          >
            {unreadCount ? unreadCount : 0}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChatAvater;
// rgba(186, 211, 245, 0.4);
