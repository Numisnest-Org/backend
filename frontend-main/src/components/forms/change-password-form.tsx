import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Typography,
} from '@mui/material';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import TextInput from '../form-components/textInput';
import {
  VisibilityOffOutlined,
  VisibilityOutlined,
  CheckOutlined,
  ErrorOutlined,
  Password,
} from '@mui/icons-material';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import useCollectorsAxiosPrivate from 'src/hooks/useCollectorsAxiosPrivate';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import LINKS from 'src/utilities/links';

const ChangePasswordForm = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const axiosCollectorsPrivate = useCollectorsAxiosPrivate();
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] =
    useState<boolean>(false);
  const [upperValidated, setUpperValidated] = useState<boolean>(false);
  const [lowerValidated, setLowerValidated] = useState<boolean>(false);
  const [numberValidated, setNumberValidated] = useState<boolean>(false);
  const [specialValidated, setSpecialValidated] = useState<boolean>(false);
  const [lenghtValidated, setLengthValidated] = useState<boolean>(false);
  const [passwordSimilar, setPasswordSimilar] = useState<boolean>(false);
  const [submitButtonDisabled, setSubmitButtonDisabled] =
    useState<boolean>(true);
  const handleconfirmChange = (value: string) => {
    setConfirmNewPassword(value);
    setPasswordSimilar(value === newPassword);
    setSubmitButtonDisabled(
      !(
        value === newPassword &&
        upperValidated &&
        lowerValidated &&
        numberValidated &&
        specialValidated &&
        lenghtValidated
      )
    );
  };
  const handleChange = (value: string) => {
    const lower = new RegExp('(?=.*[a-z])');
    const upper = new RegExp('(?=.*[A-Z])');
    const number = new RegExp('(?=.*[0-9])');
    const special = new RegExp('(?=.*[!@#$%^&*])');
    const length = new RegExp('(?=.{6,})');
    setNewPassword(value);
    if (lower.test(value)) {
      setLowerValidated(true);
    } else {
      setLowerValidated(false);
    }
    if (upper.test(value)) {
      setUpperValidated(true);
    } else {
      setUpperValidated(false);
    }
    if (number.test(value)) {
      setNumberValidated(true);
    } else {
      setNumberValidated(false);
    }
    if (special.test(value)) {
      setSpecialValidated(true);
    } else {
      setSpecialValidated(false);
    }
    if (length.test(value)) {
      setLengthValidated(true);
    } else {
      setLengthValidated(false);
    }
  };
  const sellerSubmit = async () => {
    try {
      const response = axiosPrivate.put('seller/seller-pass/change', {
        old_password: oldPassword,
        password: newPassword,
        cpassword: confirmNewPassword,
      });
      toast('Password Changed successful', {
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
      navigate(LINKS.sellerProfile);
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
    }
  };
  const CollectorSubmit = async () => {
    try {
      const response = axiosPrivate.put('seller/seller-pass/change', {
        old_password: oldPassword,
        password: newPassword,
        cpassword: confirmNewPassword,
      });
    } catch (error) {}
  };
  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await sellerSubmit();
  };
  return (
    <Box
      sx={{
        padding: { xs: '1rem', md: '2rem' },
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row-reverse' },
        gap: '1rem',
        justifyContent: 'space-around',
        alignItems: { xs: 'start', md: 'center' },
      }}
    >
      <Box
        sx={{
          boxShadow: '2px 3px 10px 1px #c0c0c0',
          p: { xs: '1rem', md: '2rem' },
          borderRadius: '20px',
          width: { xs: '100%', md: 'unset' },
        }}
      >
        <Box component={'form'} onSubmit={handleFormSubmit}>
          <Box sx={{ mt: '1rem' }}>
            <Box component={'label'}> Old Password</Box>
            <TextInput
              fullWidth
              placeholder={'Enter password'}
              name="password"
              value={oldPassword}
              type={showOldPassword ? 'text' : 'password'}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setOldPassword(e.target.value)
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position="end"
                    sx={{ backgroundColor: '#F0F0F0' }}
                  >
                    <IconButton
                      onClick={() => setShowOldPassword(!showOldPassword)}
                    >
                      {showOldPassword ? (
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
          <Box sx={{ mt: '1rem' }}>
            <Box component={'label'}> New Password</Box>
            <TextInput
              fullWidth
              placeholder={'Enter password'}
              name="password"
              value={newPassword}
              type={showNewPassword ? 'text' : 'password'}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange(e.target.value)
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position="end"
                    sx={{ backgroundColor: '#F0F0F0' }}
                  >
                    <IconButton
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
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
          <Box sx={{ mt: '1rem' }}>
            <Box component={'label'}> Confirm New Password</Box>
            <TextInput
              fullWidth
              placeholder={'Enter password'}
              name="password"
              value={confirmNewPassword}
              type={showConfirmNewPassword ? 'text' : 'password'}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleconfirmChange(e.target.value)
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position="end"
                    sx={{ backgroundColor: '#F0F0F0' }}
                  >
                    <IconButton
                      onClick={() =>
                        setShowConfirmNewPassword(!showConfirmNewPassword)
                      }
                    >
                      {showConfirmNewPassword ? (
                        <VisibilityOffOutlined />
                      ) : (
                        <VisibilityOutlined />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Typography
              variant="body3"
              component={'div'}
              fontStyle={'italic'}
              color={'red'}
            >
              {' '}
              {passwordSimilar ? null : '* Passwords do not match'}
            </Typography>
          </Box>

          <button
            disabled={submitButtonDisabled}
            className="form-submit"
            style={{
              backgroundColor: '#0047AB',
              color: '#fff',
              padding: '0.8rem 2.8rem',
              marginTop: '1rem',
              fontWeight: '400',
              borderRadius: '0.4rem',
              width: '100%',
            }}
            type="submit"
            // onClick={messageSeller}
          >
            Change password
          </button>
        </Box>
      </Box>

      <Box sx={{ mt: '1rem' }}>
        <Typography
          variant="h5"
          sx={{
            fontSize: { xs: '14px', md: '1.1rem' },
            fontWeight: '500',
            mb: '.7rem',
          }}
        >
          Password Requirements
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontSize: { xs: '14px', md: '1rem', pt: '10px' } }}
        >
          Password must contain:
        </Typography>
        <Typography
          sx={{ display: 'flex', alignItems: 'center', gap: '5px', mt: '5px' }}
        >
          <div>{lenghtValidated ? <CheckOutlined /> : <ErrorOutlined />}</div>{' '}
          atleast 6 characters
        </Typography>
        <Typography sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          {' '}
          <div>{upperValidated ? <CheckOutlined /> : <ErrorOutlined />}</div>
          at least 1 uppercase letter (A-Z)
        </Typography>
        <Typography sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          {' '}
          <div> {lowerValidated ? <CheckOutlined /> : <ErrorOutlined />}</div>
          at least 1 lowercase letter (a-z)
        </Typography>
        <Typography sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div> {numberValidated ? <CheckOutlined /> : <ErrorOutlined />}</div>{' '}
          at least 1 number (0-9)
        </Typography>
        <Typography sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div> {specialValidated ? <CheckOutlined /> : <ErrorOutlined />}</div>{' '}
          at least 1 symbol (e.g @)
        </Typography>
      </Box>
    </Box>
  );
};

export default ChangePasswordForm;
