import {
  Box,
  Button,
  ClickAwayListener,
  IconButton,
  ListItem,
  Typography,
  useMediaQuery,
} from '@mui/material';

import LINKS from 'src/utilities/links';
import Image from '../Image';
import Logo from 'src/assets/Image/Logo.svg';
import NavLinks from '../NavComponensts/NavLinks';
import { Link, useNavigate } from 'react-router-dom';
import {
  Close,
  Login,
  Logout,
  MenuOutlined,
  Person,
} from '@mui/icons-material';
import home from 'src/assets/Image/home.svg';
import about from 'src/assets/Image/about.svg';
import contact from 'src/assets/Image/contact.svg';
import { Fragment, useState } from 'react';
import useAppContext from 'src/hooks/useAppContext';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import useCollectorsAxiosPrivate from 'src/hooks/useCollectorsAxiosPrivate';
import { useSocket } from 'src/utilities/context/socketContext';
const Homeheader = ({}) => {
  const navigate = useNavigate();
  const isNotMobileScreens = useMediaQuery('(min-width:900px)');
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const axiosCollectorPrivate = useCollectorsAxiosPrivate();
  const { state } = useAppContext();
  const { token, userType } = state;
  const socket = useSocket();
  const logout = async () => {
    try {
      navigate(LINKS.Login);
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      localStorage.removeItem("currency");
      if (userType === 'seller') {
        await axiosPrivate.post('duo/general/logout');
      } else {
        await axiosCollectorPrivate.post('duo/general/logout');
      }
      socket.disconnect();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {isNotMobileScreens ? (
        <Box
          sx={{
            display: 'flex',
            height: '100px',
            justifyContent: 'space-between',
            px: '2rem',
            alignItems: 'center',
            borderBottom: '1px solid #E6E9F9',
            background: '#fff',
          }}
        >
          <Box
            sx={{ display: 'flex', alignItems: 'center', px: { lg: '.8rem' } }}
          >
            <Box sx={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Image src={Logo} alt="logo" width={'232px'} />
              </Box>
              <NavLinks title="Home" path="" link={LINKS.Home} />
              {/* <NavLinks title="About" path="lorem" link="" /> */}
              <NavLinks
                title="Contact Us "
                path="contactus"
                link={LINKS.contactus}
              />
              <NavLinks
                title="Useful Information"
                path="usefulinfo"
                link={LINKS.Usefulinfo}
              />
            </Box>
          </Box>
          <Box sx={{ marginTop: '' }}>
            <Box sx={{ display: 'flex', gap: '2rem' }}>
              {token ? (
                <Fragment>
                  <Button
                    startIcon={<Logout />}
                    sx={{
                      border: '2px solid #0047AB',
                      color: '#0047AB',
                      fontWeight: 600,
                      borderRadius: '.7rem',
                      padding: '0.5rem 1rem',
                    }}
                    onClick={logout}
                  >
                    {' '}
                    Log out
                  </Button>
                  <Button
                    startIcon={<Person />}
                    sx={{
                      border: '2px solid #0047AB',
                      color: '#FFF',
                      backgroundColor: '#0047AB',
                      fontWeight: 600,
                      borderRadius: '.7rem',
                      padding: '0.5rem 1rem',
                      '&:hover': {
                        color: '#0047AB',
                      },
                    }}
                    onClick={() => {
                      userType === 'seller'
                        ? navigate(LINKS.sellerProfile)
                        : navigate(LINKS.collectorProfile);
                    }}
                  >
                    {' '}
                    Profile
                  </Button>
                </Fragment>
              ) : (
                <Fragment>
                  <Button
                    startIcon={<Login />}
                    sx={{
                      border: '2px solid #0047AB',
                      color: '#0047AB',
                      fontWeight: 600,
                      borderRadius: '.7rem',
                      padding: '0.5rem 1rem',
                    }}
                    onClick={() => navigate(LINKS.Login)}
                  >
                    {' '}
                    Log in
                  </Button>
                  <Button
                    sx={{
                      border: '2px solid #0047AB',
                      color: '#FFF',
                      backgroundColor: '#0047AB',
                      fontWeight: 600,
                      borderRadius: '.7rem',
                      padding: '0.5rem 1rem',
                      '&:hover': {
                        color: '#0047AB',
                      },
                    }}
                    onClick={() => navigate(LINKS.selectregister)}
                  >
                    Sign up
                  </Button>
                </Fragment>
              )}
            </Box>
          </Box>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: { xs: '1rem', sm: '1.5rem', md: '2rem' },
              py: '1rem',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mt: '.5rem' }}>
              <Image src={Logo} alt="logo" width={'150px'} />
            </Box>
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <MenuOutlined sx={{ fontSize: '2rem' }} />
            </IconButton>
            {isMobileMenuToggled && (
              <ClickAwayListener
                onClickAway={() => setIsMobileMenuToggled(false)}
              >
                <Box
                  position="fixed"
                  right="0"
                  top="0"
                  height="400px"
                  zIndex="10"
                  maxWidth="450px"
                  minWidth="200px"
                  sx={{ bgcolor: '#FFFFFF' }}
                >
                  <Box display="flex" justifyContent="flex-end" p="1rem">
                    <IconButton
                      onClick={() =>
                        setIsMobileMenuToggled(!isMobileMenuToggled)
                      }
                    >
                      <Close />
                    </IconButton>
                  </Box>
                  <Box sx={{}}>
                    <Link
                      to={'/'}
                      style={{
                        textDecoration: 'none',
                        fontSize: '1rem',
                        color: '#0047AB',
                      }}
                    >
                      <Box className="navflow">
                        <Image src={home} alt="home" />
                        <ListItem className="navItem">Home</ListItem>
                      </Box>
                    </Link>
                    {/* <Link
                    to={"/about"}
                    style={{
                      textDecoration: "none",
                      fontSize: "1rem",
                      color: "#0047AB",
                    }}
                  >
                    <Box className="navflow">
                      <Image src={about} alt="about" />
                      <ListItem className="navItem">About </ListItem>
                    </Box>
                  </Link> */}
                    <Link
                      to={'/contactus'}
                      style={{
                        textDecoration: 'none',
                        fontSize: '1rem',
                        color: '#0047AB',
                      }}
                    >
                      <Box className="navflow">
                        <Image src={contact} alt="contact" />
                        <ListItem className="navItem">Contact Us</ListItem>
                      </Box>
                    </Link>
                    <Link
                      to={'/usefulinfo'}
                      style={{
                        textDecoration: 'none',
                        fontSize: '1rem',
                        color: '#0047AB',
                      }}
                    >
                      <Box className="navflow">
                        <Image src={contact} alt="contact" />
                        <ListItem className="navItem">
                          Useful Information
                        </ListItem>
                      </Box>
                    </Link>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      {token ? (
                        <Fragment>
                          <Button
                            sx={{
                              border: '1px solid #0047AB',
                              fontSize: '1.1rem',
                              fontWeight: 400,
                              borderRadius: '1rem',
                              width: '10rem',
                              ml: '1rem',
                              padding: ' 0.4375rem 1rem',
                              bgcolor: '#0047AB',
                              color: '#F9FAFA',
                            }}
                            onClick={logout}
                          >
                            Log out
                          </Button>
                          <Button
                            sx={{
                              border: '1px solid #0047AB',
                              fontSize: '1.1rem',
                              fontWeight: 400,
                              borderRadius: '1rem',
                              width: '10rem',
                              ml: '1rem',
                              padding: ' 0.4375rem 1rem',
                              bgcolor: '#0047AB',
                              color: '#F9FAFA',
                              mt: '2rem',
                            }}
                            onClick={() => {
                              userType === 'seller'
                                ? navigate(LINKS.sellerProfile)
                                : navigate(LINKS.collectorProfile);
                            }}
                          >
                            Profile
                          </Button>
                        </Fragment>
                      ) : (
                        <Fragment>
                          <Button
                            sx={{
                              border: '1px solid #0047AB',
                              fontSize: '1.1rem',
                              fontWeight: 400,
                              borderRadius: '1rem',
                              width: '10rem',
                              ml: '1rem',
                              padding: ' 0.4375rem 1rem',
                              bgcolor: '#0047AB',
                              color: '#F9FAFA',
                            }}
                            onClick={() => navigate(LINKS.Login)}
                          >
                            Log in
                          </Button>

                          <Button
                            sx={{
                              border: '1px solid #0047AB',
                              fontSize: '1.1rem',
                              fontWeight: 400,
                              borderRadius: '1rem',
                              width: '10rem',
                              ml: '1rem',
                              padding: ' 0.4375rem 1rem',
                              bgcolor: '#0047AB',
                              color: '#F9FAFA',
                              mt: '1rem',
                            }}
                            onClick={() => navigate(LINKS.selectregister)}
                          >
                            Sign up
                          </Button>
                        </Fragment>
                      )}
                    </Box>
                  </Box>
                </Box>
              </ClickAwayListener>
            )}
          </Box>{' '}
        </>
      )}
    </>
  );
};

export default Homeheader;
