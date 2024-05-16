import { Box, Divider, Typography, useMediaQuery } from '@mui/material';
import { ReactNode } from 'react';
import { ArrowForwardIosOutlined } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const SellersHeader = ({
  children,
  titleHead,
  path,
}: {
  children: ReactNode;
  titleHead: string;
  path: string;
}) => {
  const navigate = useNavigate();
  const isNotMobileScreens = useMediaQuery('(min-width:600px)');

  const style = {
    link: {
      textDecoration: 'none',
      color: 'black',
    },
  };
  return (
    <Box sx={{ mt: { xs: '1.2rem', md: '2rem' } }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          textAlign: 'center',
          flexDirection: 'row',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontFamily: 'Poppins',
            fontSize: { xs: '1.2rem', md: '2rem' },
            fontWeight: 700,
            letterSpacing: '0em',
          }}
        >
          {titleHead}
        </Typography>
        <Divider
          orientation="vertical"
          flexItem={true}
          sx={{
            width: 2, // Adjust the width as needed
            marginLeft: 1, // Optional: Add margin for spacing
            marginRight: 1, // Optional: Add margin for spacing
            borderColor: 'black',
          }}
        />
        <div onClick={() => navigate(path)}>
          <Typography
            sx={{
              display: 'flex',
              alignItems: 'center',
              fontFamily: 'Poppins',
              fontSize: { xs: '1rem', md: '1.2rem' },
              fontWeight: 600,
              letterSpacing: '0em',
              color: '#0047AB',
              '&:hover': {
                cursor: 'pointer',
              },
            }}
          >
            <Link to={path} style={style.link}>
              See all
            </Link>
          </Typography>
        </div>
      </Box>
      {children}
    </Box>
  );
};

export default SellersHeader;
