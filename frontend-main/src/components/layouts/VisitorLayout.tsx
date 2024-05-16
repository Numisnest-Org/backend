import { Box, Typography, useMediaQuery } from '@mui/material';
import Homeheader from '../headers/Homeheader';
import { ReactNode } from 'react';
import radialbg from 'src/assets/Image/radalbg.png';
import Image from '../Image';
import { color } from 'chart.js/helpers';
import Footer from '../Footer';
import { useLocation } from 'react-router-dom';

interface Props {
  children: ReactNode;
}
const VisitorLayout = ({ children }: Props) => {
  const isNotMobileScreens = useMediaQuery('(min-width:900px)');
  const { pathname } = useLocation();

  return (
    <Box sx={{ position: 'relative', zIndex: 2 }}>
      <Homeheader />
      <Box
        sx={{
          px: {
            xs: '1rem',
            sm: '1rem',
          },
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        {children}
      </Box>
      {isNotMobileScreens && (
        <Image
          src={radialbg}
          alt="bg"
          sx={{
            width: '30rem',
            height: '25rem',
            zIndex: -1,
            position: 'absolute',
            top: 400,
          }}
        />
      )}
      <Footer />
    </Box>
  );
};

export default VisitorLayout;
