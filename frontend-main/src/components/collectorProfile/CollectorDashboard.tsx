import React from 'react';

import {
  Box,
  Button,
  Paper,
  Typography,
  useMediaQuery,
  Divider,
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';
import LINKS from 'src/utilities/links';
import phone from 'src/assets/Image/Phone Contact.png';
import settings from 'src/assets/Image/setting.png';
import padlock from 'src/assets/Image/padlock.png';
import deleteK from 'src/assets/Image/delete.png';
import eyes from 'src/assets/Image/eyes.png';
import personIcon from 'src/assets/Image/contact.svg';
import loveIcon from 'src/assets/Image/love.png';
import sellerIcon from 'src/assets/Image/seller.png';
import vIcon from 'src/assets/Image/visibility.png';
import contactCard from 'src/assets/Image/des.svg';
import { useState } from 'react';

interface Props {
  firstName?: string;
  lastName?: string;
  createdAt?: Date;
  about?: string;
  countryCode?: string;
  mobile?: string;
  deliveryOptions?: string;
  url?: string;
  country?: string;
  flag?: string;
}
const CollectorDashboard = ({
  firstName,
  lastName,
  createdAt,
  about,
  countryCode,
  mobile,
  deliveryOptions,
  url,
  country,
  flag,
}: Props) => {
  const navigate = useNavigate();
  const isNotMobileScreens = useMediaQuery('(min-width:600px)');
  const data = [
    {
      title: 'Edit profile',
      icon: personIcon,
      func: () => navigate(LINKS.editProfile),
    },
    {
      title: 'Change password',
      icon: padlock,
    },
    {
      title: 'Favourites',
      icon: loveIcon,
    },
    {
      title: 'Hidden',
      icon: eyes,
    },
    {
      title: 'Account visibility',
      icon: vIcon,
    },
    {
      title: 'Become a seller',
      icon: sellerIcon,
    },
    {
      title: 'Delete account',
      icon: deleteK,
    },
  ];
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: '1rem',
        mt: { xs: '1.5rem', md: '3rem' },
        px: { xs: '1rem', sm: 'unset' },
      }}
    >
      <Box sx={{ position: 'relative', width: { xs: '170px', md: '170px' } }}>
        <button
          className="blue-btn"
          style={{
            marginBottom: '1rem',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            color: '#fff',
          }}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          <img style={{ width: '20px' }} src={settings} alt="" /> Account
        </button>
        {isOpen && (
          <ul
            className="drop-down"
            style={{
              width: '100%',
              marginTop: '1.8rem',
              gap: '2.2rem',
              paddingBottom: '2rem',
              paddingTop: '1.2rem',
            }}
          >
            {data.map((item, i) => (
              <li
                key={i}
                style={{ fontSize: '12px' }}
                className="account-drop-down"
                onClick={() => typeof item.func !== 'undefined' && item.func()}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <img
                    style={{ width: '16px', height: '16px', aspectRatio: '1' }}
                    src={item.icon}
                    alt=""
                  />

                  {item.title}
                </Box>
              </li>
            ))}
          </ul>
        )}
      </Box>
      <Box
        sx={{
          backgroundColor: '#fff',
          position: 'relative',

          width: '100%',
          maxWidth: '1110px',
          marginLeft: 'auto',
          marginRight: 'auto',
          borderRadius: '24px',
          boxShadow: '1px 2px 2px #0000',
        }}
      >
        <Box
          sx={{
            paddingTop: { xs: '2rem', md: '3rem' },
            paddingRight: { xs: '20px', md: '40px' },
            paddingLeft: { xs: '20px', md: '40px' },
            paddingBottom: { xs: '1.8rem', md: '2.8rem' },
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: { xs: 'start', md: 'center' },
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: { xs: '1.6rem', md: '' },
            }}
          >
            <Box sx={{ display: 'flex', gap: { xs: '10px', md: '4rem' } }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'start',
                  gap: { xs: '1rem', md: '1.2rem' },
                }}
              >
                <Box
                  sx={{
                    width: { xs: '5rem', md: '10rem' },
                    aspectRatio: '1',
                    backgroundImage: `url(${url})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                  }}
                ></Box>
                <Box
                  className={`fi fi-${flag?.toLowerCase()}`}
                  sx={{
                    width: { xs: '30px', md: '50px' },
                    aspectRatio: '1',
                  }}
                ></Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginRight: 'auto',
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: '1.2rem', md: '1.8rem' },
                    fontWeight: '700',
                  }}
                >{`${_.upperFirst(firstName)} ${_.upperFirst(
                  lastName
                )}`}</Typography>
                <Typography sx={{ fontSize: { xs: '.9rem', md: '1.2rem' } }}>
                  {about}
                </Typography>
              </Box>
            </Box>

            <Button
              sx={{
                width: { xs: '80px', md: '110px' },
                backgroundColor: '#0047AB',
                color: 'white',
                padding: '0.5rem 2.5rem',
                fontWeight: '400',
                fontSize: { xs: '13px', md: '1rem' },
                borderRadius: '0.4rem',
                '&:hover': { color: '#fff', backgroundColor: '#1166dc' },
              }}
              onClick={() => navigate(LINKS.chatpage)}
            >
              Message
            </Button>
          </Box>

          <Box
            sx={{
              mt: '1.6rem',
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: '1rem', md: '1.6rem' },
            }}
          >
            <Box sx={{ marginLeft: { md: '8%' }, width: 'fit-content' }}>
              <Typography
                sx={{
                  fontWeight: '500',
                  fontSize: { md: '18px' },
                }}
              >
                Member Since {dayjs(createdAt).format('DD.MM.YYYY  ')}
              </Typography>
              <Box
                sx={{
                  width: '40%',
                  height: '2px',
                  marginTop: '10px',
                  backgroundColor: '#69696999',
                }}
              ></Box>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: { xs: '1rem', md: '2rem' },
              alignItems: 'center',
            }}
          >
            <img src={contactCard} alt="delivery" style={{ width: '50px' }} />
            <Box>
              <Typography sx={{ fontWeight: '500', fontSize: { md: '18px' } }}>
                {about}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CollectorDashboard;
