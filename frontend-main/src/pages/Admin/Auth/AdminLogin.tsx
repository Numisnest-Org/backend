import { Box } from '@mui/material';
import React from 'react';
import AdminLoginForm from 'src/components/AdminComponents/Forms/admin-login-form';

const AdminLoginPage = () => {
  return (
    <Box
      sx={{
        px: { md: '6rem' },
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        width: '100%',
      }}
    >
      <AdminLoginForm />
    </Box>
  );
};

export default AdminLoginPage;
