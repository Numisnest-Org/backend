import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Image from 'src/components/Image';
import droup from 'src/assets/Image/Group 2.png';
import loginimg from 'src/assets/Image/AdminIcons/loginphoto.png';
const AuthWrapper = () => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
      }}
    >
      <Box
        sx={{
          width: '50%',
          backgroundColor: '#0047AB',
          position: 'relative',
          display: { xs: 'none', md: 'flex' },
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          src={droup}
          alt="group"
          sx={{ width: '5rem', position: 'absolute', top: 10, left: 10 }}
        />
        <Image
          src={droup}
          alt="group"
          sx={{ width: '5rem', position: 'absolute', bottom: 0, right: 10 }}
        />
        <Image src={loginimg} alt="s" sx={{ width: '30rem' }} />
      </Box>
      <Box
        sx={{
          width: { xs: '100%', md: '50%' },
          px: { xs: '1rem', md: 'unset' },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AuthWrapper;
