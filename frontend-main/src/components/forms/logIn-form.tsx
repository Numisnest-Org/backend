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
import TextInput from '../form-components/textInput';

import { Link, useNavigate } from 'react-router-dom';
import LINKS from 'src/utilities/links';
import { axiosPublic } from 'src/axios/axios';
import useAppContext from 'src/hooks/useAppContext';
import { ActionType } from 'src/utilities/context/context';
import { toast } from 'react-toastify';
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import { useSocket } from 'src/utilities/context/socketContext';

const LoginForm = ({}) => {
  const theme = useTheme();
  const blue = theme.palette.primary.light;
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { state, dispatch } = useAppContext();
  const { navigateToUrl } = state;
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const socket = useSocket();
  useEffect(() => {
    const localemail = localStorage.getItem('email');
    const localpass = localStorage.getItem('password');
    localemail && setEmail(localemail);
    localpass && setPassword(localpass);
  }, []);
  const handleLogin = async () => {
    try {
      if (rememberMe) {
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
      }

      setIsSubmitting(true);
      const response = await axiosPublic.post('duo/general/signin', {
        email: email.toLocaleLowerCase(),
        password: password,
      });
      const { token, email: userEmail, role } = response.data.data;
      dispatch({ type: ActionType.setUserType, payload: role });
      dispatch({ type: ActionType.setLogin, payload: { token: token } });
      role === 'seller'
        ? navigate(navigateToUrl === '' ? LINKS.sellerProfile : navigateToUrl)
        : navigate(
            navigateToUrl === '' ? LINKS.collectorProfile : navigateToUrl
          );
      dispatch({ type: ActionType.SetNavigateToUrl, payload: '' });
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
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <Paper
      sx={{
        bgcolor: 'white',
        py: '1rem',
        px: { xs: '1rem', sm: '1.5rem', md: '2rem', lg: '2.5rem', xl: '3rem' },
        width: '100%',
        borderRadius: { xs: '8px', sm: '10px', md: '24px' },
      }}
      onKeyDown={handleKeyDown} // Add onKeyDown event listener
      tabIndex={0} // Add tabIndex to make the Paper element focusable
    >
      <Typography
        variant="h1"
        sx={{
          fontFamily: 'poppins',
          fontSize: { xs: '1.2rem', md: '2rem' }, // Responsive font size
          fontWeight: 700,
          lineHeight: { xs: '48px', sm: '40px', md: '40px' }, // Responsive line height
          letterSpacing: '0em',
          textAlign: 'center',
          width: '100%', // Make width 100% for responsiveness
          padding: 2,
        }}
      >
        Welcome Back
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontFamily: 'Poppins',
          fontSize: { xs: '13px', sm: '14px', md: '14px' }, // Responsive font size
          fontWeight: 500,
          lineHeight: { xs: '22px', sm: '26px', md: '30px' }, // Responsive line height
          letterSpacing: '0em',
          textAlign: 'center',
        }}
      >
        Welcome Back! Enter your details to sign in
      </Typography>
      <Box sx={{ mt: '1rem' }}>
        <Box component={'label'} sx={{ color: '#343434', fontWeight: '500' }}>
          Email
        </Box>
        <TextInput
          fullWidth
          placeholder={'Enter Email'}
          name="email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />
      </Box>
      <Box sx={{ mt: '1rem' }}>
        <Box component={'label'}>Password</Box>
        <TextInput
          fullWidth
          placeholder={'Enter password'}
          name="password"
          value={password}
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
                    <VisibilityOffOutlined />
                  ) : (
                    <VisibilityOutlined />
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
          justifyContent: 'space-between',
          mt: '0.2rem',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            sx={{
              px: '1px',
              outline: 'red',
            }}
          />
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: '14px',
              color: blue,
            }}
          >
            Remember me
          </Typography>
        </Box>

        <Typography
          sx={{
            fontWeight: 600,
            color: blue,
            fontSize: '14px',
            textDecoration: 'none',
          }}
          component={'a'}
          href={LINKS.forgotpassword}
        >
          Forgot password?
        </Typography>
      </Box>

      <Button
        fullWidth
        sx={{
          bgcolor: '#0047AB',
          color: 'white',
          fontSize: '1.2rem',
          borderRadius: '1rem',
          mt: '1.5rem',
          '&:hover': {
            backgroundColor: '#1166dc ', // Change hover background color
          },
        }}
        disabled={isSubmitting}
        onClick={handleLogin}
      >
        {isSubmitting ? (
          <CircularProgress
            size={'1.5rem'}
            sx={{
              color: 'white',
              height: '1rem',
              width: '1rem',
            }}
          />
        ) : (
          'Log in'
        )}
      </Button>
      <Typography
        sx={{
          fontSize: '0.8rem',
          color: 'black',
          textAlign: 'center',
          width: 'fullWidth',
          mt: 3,
          mb: 2,
        }}
      >
        Don't have an account?{' '}
        <Typography
          component={'span'}
          sx={{ fontSize: '0.8rem', color: '#0047AB', fontWeight: 700 }}
        >
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
          </Link>
        </Typography>
      </Typography>
      {/* <Typography
        sx={{
          fontSize: "0.8rem",
          color: "#343434",
          textAlign: "center",
          width: "fullWidth",
          mt: "0.5rem",
        }}
      >
        Try logging in to verify your email
      </Typography> */}
    </Paper>
  );
};

export default LoginForm;
