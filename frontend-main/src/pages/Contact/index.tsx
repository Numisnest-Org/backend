import { Box, Typography, useMediaQuery } from '@mui/material';
import ContactusForm from 'src/components/forms/contactus-form';
import VisitorLayout from 'src/components/layouts/VisitorLayout';
const ContactusPage = () => {
  const isNotMobileScreens = useMediaQuery('(min-width:600px)');
  return (
    <VisitorLayout>
      <Box>
        <Typography
          variant="h1"
          sx={{
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: { xs: '1.4rem', md: '1.9rem' },
            paddingTop: '2.2rem',
          }}
        >
          Contact us
        </Typography>
        <Typography
          sx={{
            textAlign: 'center',
            mt: '1rem',
            fontSize: { md: '1.6rem' },
          }}
        >
          Any questions? Suggestions? We would love to hear!
        </Typography>
      </Box>
      <Box
        sx={{
          px: { xs: '0.5rem', sm: '2rem', md: '4rem', lg: '9.5rem' },
          mt: '2rem',
        }}
      >
        <ContactusForm />
      </Box>
    </VisitorLayout>
  );
};

export default ContactusPage;
