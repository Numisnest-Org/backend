import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Formik, FormikHelpers } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { ContactusFormType, FormValueRegister } from 'src/utilities/types';
import * as yup from 'yup';
import TextInput from '../form-components/textInput';
import { axiosPublic } from 'src/axios/axios';
import ReCAPTCHA from 'react-google-recaptcha';
import { toast } from 'react-toastify';
import ThankyouModal from '../Modal/thank-youmessage';
const ContactusForm = () => {
  const initialValueContactus: ContactusFormType = {
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    message: '',
  };
  const registerSchema = yup.object().shape({
    first_name: yup.string().required('required'),
    last_name: yup.string().required('required'),
    email: yup.string().required('required'),
    phone_number: yup.string(),
    message: yup.string().required('required'),
  });
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    values: ContactusFormType,
    onSubmitProps: FormikHelpers<ContactusFormType>
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent default form submission
      handleFormSubmit(values, onSubmitProps); // Manually trigger the form submission
    }
  };
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDisplayModal, setDisplayModal] = useState<boolean>(false);
  const isNotMobileScreens = useMediaQuery('(min-width:600px)');
  const handleFormSubmit = async (
    values: ContactusFormType,
    onSubmitProps: FormikHelpers<ContactusFormType>
  ) => {
    try {
      setIsSubmitting(true);
      const reponse = await axiosPublic.post(`duo/general/contactus`, values);
      toast('Message sent', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        isLoading: false,
        type: 'success',
        theme: 'light',
        style: {},
      });
      setDisplayModal(true);
      captcha.current.reset();
      setrecapchaChange(!recaptchachange);
    } catch (error: any) {
      console.log(error);
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
    } finally {
      setIsSubmitting(false);
      onSubmitProps.resetForm();
      captcha.current.reset();
      setrecapchaChange(!recaptchachange);
    }
  };

  const [recaptchachange, setrecapchaChange] = useState<boolean>(true);

  const onreccaptcahaChange = () => {
    setrecapchaChange(false);
  };
  const DEV_SITE_KEY = import.meta.env.VITE_RECAPTCHA_KEY;
  const captcha: any = useRef();
  return (
    <Paper
      sx={{
        borderRadius: isNotMobileScreens ? '3rem' : '1.5rem',
        pt: '2rem',
        pb: '2rem',
        px: {
          xs: '1rem',
          sm: '2rem',
          md: '3rem',
          lg: '3.5rem',
          xl: '4rem',
        },
      }}
    >
      {isDisplayModal && (
        <ThankyouModal
          contentWidth={'400px'}
          closeModal={() => setDisplayModal(false)}
        />
      )}
      <Formik
        onSubmit={(values, onSubmitProps) => {
          handleFormSubmit(values, onSubmitProps);
        }}
        initialValues={initialValueContactus}
        validationSchema={registerSchema}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
          resetForm,
        }) => (
          <form
            onSubmit={handleSubmit}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                handleSubmit();
              }
            }}
          >
            <Grid
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  lg: 'repeat(2, 1fr)',
                  xl: '',
                },
                columnGap: { xs: '1rem', lg: '1.5rem', xl: '2rem' },
              }}
            >
              <Box sx={{ mt: '1.5rem' }}>
                <Box component={'label'} sx={{ fontWeight: 700 }}>
                  First Name
                </Box>
                <TextInput
                  fullWidth
                  variant={'outlined'}
                  placeholder={'Enter First Name '}
                  name="first_name"
                  value={values.first_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    Boolean(touched.first_name) && Boolean(errors.first_name)
                  }
                  helperText={touched.first_name && errors.first_name}
                />
              </Box>
              <Box sx={{ mt: '1.5rem' }}>
                <Box component={'label'} sx={{ fontWeight: 700 }}>
                  Last Name
                </Box>
                <TextInput
                  fullWidth
                  variant={'outlined'}
                  placeholder={'Enter Last Name'}
                  name="last_name"
                  value={values.last_name}
                  onChange={handleChange}
                  error={
                    Boolean(touched.last_name) && Boolean(errors.last_name)
                  }
                  helperText={touched.last_name && errors.last_name}
                  onBlur={handleBlur}
                />
              </Box>
            </Grid>

            <Grid
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  lg: 'repeat(2, 1fr)',
                  xl: '',
                },
                columnGap: { xs: '1rem', lg: '1.5rem', xl: '2rem' },
              }}
            >
              <Box sx={{ mt: '1.5rem' }}>
                <Box component={'label'} sx={{ fontWeight: 700 }}>
                  Email
                </Box>
                <TextInput
                  fullWidth
                  variant={'outlined'}
                  placeholder={'Enter Email'}
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.email) && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
              </Box>
              <Box sx={{ mt: '1.5rem' }}>
                <Box component={'label'} sx={{ fontWeight: 700 }}>
                  Phone Number
                </Box>
                <TextInput
                  fullWidth
                  variant={'outlined'}
                  placeholder={'Enter Phone number'}
                  name="phone_number"
                  value={values.phone_number}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    Boolean(touched.phone_number) &&
                    Boolean(errors.phone_number)
                  }
                  helperText={touched.phone_number && errors.phone_number}
                />
              </Box>
            </Grid>

            <Box sx={{ mt: '1.5rem', mb: '1.5rem' }}>
              <Box component={'label'} sx={{ fontWeight: 700 }}>
                Message*
              </Box>
              <TextInput
                fullWidth
                multiline
                rows={4}
                variant={'outlined'}
                placeholder={'Enter Message'}
                name="message"
                value={values.message}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.message) && Boolean(errors.message)}
                helperText={touched.message && errors.message}
              />
            </Box>
            {/* <ReCAPTCHA
              sitekey={DEV_SITE_KEY}
              onChange={onreccaptcahaChange}
              ref={captcha}
            /> */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                sx={{
                  bgcolor: '#0047AB',
                  color: 'white',
                  fontSize: '1.2rem',
                  borderRadius: '1rem',
                  mt: '1.5rem',
                  mb: '1rem',
                  padding: '0.8rem 3.5rem',
                  '&:hover': {
                    backgroundColor: '#1166dc ', // Change hover background color
                  },
                }}
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <CircularProgress
                    size={'2rem'}
                    sx={{
                      // color: "white",
                      height: '1rem',
                      width: '1rem',
                    }}
                  />
                ) : (
                  'Send'
                )}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Paper>
  );
};

export default ContactusForm;
