import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Typography,
  useTheme,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import TextInput from 'src/components/form-components/textInput';

import { Link, useNavigate } from 'react-router-dom';
import LINKS from 'src/utilities/links';
import { axiosPublic } from 'src/axios/axios';
import useAppContext from 'src/hooks/useAppContext';
import { ActionType } from 'src/utilities/context/context';
import { toast } from 'react-toastify';
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import { useSocket } from 'src/utilities/context/socketContext';

const AdminLoginForm = ({}) => {
  const theme = useTheme();
  const blue = theme.palette.primary.light;
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { state, dispatch } = useAppContext();
  const { navigateToUrl } = state;
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const socket = useSocket();
  const handleLogin = async () => {
    try {
      setIsSubmitting(true);
      const response = await axiosPublic.post('admin/signin', {
        email: email,
        password: password,
      });
      response;
      const { token, email: userEmail, role } = response.data.data;
      dispatch({ type: ActionType.setUserType, payload: role });
      dispatch({ type: ActionType.setLogin, payload: { token: token } });
      navigate(LINKS.adminDashboard);
      setIsSubmitting(false);
      toast('Login successful', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        isLoading: false,
        type: 'success',
        theme: 'light',
        style: {},
      });
      localStorage.setItem('token', token);
      localStorage.setItem('userType', role);
      socket.emit('user connected', { token: token });
    } catch (error: any) {
      toast(`${error.response.data.message.split(':')[1]}`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        isLoading: false,
        type: 'error',
        theme: 'light',
        style: {},
      });
      if (
        error.response.data.message.split(':')[1] ===
        ' user email not verified, check your email for verification code'
      ) {
        navigate(`${LINKS.verifyEmail}/${email}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Paper
      sx={{
        width: '100%',
        maxWidth: { xs: '500px', md: 'unset' },
        margin: '0 auto',
        bgcolor: 'white',
        py: '2rem',
        px: { xs: '1rem', sm: '2rem', md: '3rem', lg: '3.5rem', xl: '4rem' },
      }}
    >
      <Typography
        sx={{
          fontSize: '2rem',
          fontWeight: 600,
          textAlign: 'center',
          width: 'fullWidth',
        }}
      >
        Welcome Back
      </Typography>
      <Typography
        sx={{ textAlign: 'center', width: 'fullWidth', mt: '1.5rem' }}
      >
        This is the admin page
      </Typography>
      <Box sx={{ mt: '1.5rem' }}>
        <Box component={'label'}>Email</Box>
        <TextInput
          fullWidth
          variant={'standard'}
          placeholder={'Enter email address '}
          name="email"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />
      </Box>
      <Box sx={{ mt: '1.5rem' }}>
        <Box component={'label'}>password</Box>
        <TextInput
          fullWidth
          variant={'standard'}
          placeholder={'Enter password'}
          name="password"
          type={showPassword ? 'text' : 'password'}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          InputProps={{
            endAdornment: (
              <InputAdornment
                position="end"
                sx={{ backgroundColor: '#F0F0F0' }}
              >
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <VisibilityOffOutlined
                      sx={{
                        fontSize: '2,5rem',
                      }}
                    />
                  ) : (
                    <VisibilityOutlined
                      sx={{
                        fontSize: '2,5rem',
                      }}
                    />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mt: '2rem',
        }}
      >
        <Typography
          sx={{ fontWeight: 600, color: blue }}
          component={'a'}
          href={LINKS.forgotpassword}
        >
          {' '}
          Forgot password?
        </Typography>
      </Box>

      <Button
        fullWidth
        sx={{
          bgcolor: '#0047AB',
          color: 'white',
          fontSize: '1.5rem',
          borderRadius: '1rem',
          mt: '1.5rem',
        }}
        disabled={isSubmitting}
        onClick={handleLogin}
      >
        {isSubmitting ? (
          <CircularProgress
            size={'2rem'}
            sx={{
              color: 'white',
              height: '1rem',
              width: '1rem',
            }}
          />
        ) : (
          'sign in'
        )}
      </Button>
      <Typography
        sx={{
          fontSize: '0.76rem',
          color: 'black',
          textAlign: 'center',
          width: 'fullWidth',
          mt: '.5rem',
        }}
      >
        Dont have an account?{' '}
        <Typography
          component={'span'}
          sx={{ fontSize: '0.76rem', color: '#0047AB', fontWeight: 700 }}
        >
          {' '}
          <Link
            to={LINKS.selectregister}
            style={{
              textDecoration: 'none',
              padding: '0',
              margin: '0',
              color: '#0047AB',
            }}
          >
            Sign Up
          </Link>{' '}
        </Typography>
      </Typography>
      <Typography
        sx={{
          fontSize: '0.76rem',
          color: 'black',
          textAlign: 'center',
          width: 'fullWidth',
          mt: '.5rem',
        }}
      >
        Try login in to verify your email
      </Typography>
    </Paper>
  );
};

export default AdminLoginForm;
