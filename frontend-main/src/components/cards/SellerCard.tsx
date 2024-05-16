import {
  Box,
  Typography,
  Skeleton,
  useMediaQuery,
  Button,
} from '@mui/material';
import '/node_modules/flag-icons/css/flag-icons.min.css';
import { useNavigate } from 'react-router-dom';
import { Fragment } from 'react';
import { Person3Outlined } from '@mui/icons-material';
import avater from 'src/assets/Image/numisnest avater.jpg';
import Image from '../Image';
import { textFromat } from 'src/utilities/constants/helpers';
import approvedicon from 'src/assets/Image/AdminIcons/approved.svg';
import notapprovedicon from 'src/assets/Image/AdminIcons/cancel.svg';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import { toast } from 'react-toastify';
interface Props {
  flag?: string;
  url?: string;
  name?: string;
  selling?: string;
  isFetching?: boolean;
  id?: string;
  approved?: boolean;
  blockuser?: boolean;
}

const SellerCard = ({
  flag,
  url,
  name,
  selling,
  isFetching,
  id,
  approved,
  blockuser,
}: Props) => {
  const naviagte = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const isMobile = useMediaQuery('(max-width:500px)');

  return (
    <Box
    sx={{height: 'auto'}}
    
      onClick={() => (id ? naviagte(isFetching ? '' : `/seller/${id}`) : '')}
    >
      <Box
        sx={{
          height: '100%',
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: { xs: '0.5rem', md: '1rem' },
          paddingLeft: { xs: '0.5rem', md: '1rem' },
          paddingRight: { xs: '0.5rem', md: '1rem' },
          paddingBottom: '1.6rem',
          position: 'relative',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          transition: 'all 0.3s ease-in-out allow-discrete',
          '&:hover': {
            boxShadow: '0px 0px 10px -2px rgba(0, 0, 0, .2)',
          },
        }}
      >
        {blockuser && (
          <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
            <button
              className="blue-btn"
              style={{
                paddingBlock: '8px',
                marginTop: '1rem',
                marginRight: '1rem',
              }}
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                try {
                  const response = axiosPrivate.post(
                    `seller/block-list/add/${id}`
                  );
                  toast('user blocked', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    isLoading: false,
                    type: 'success',
                    theme: 'light',
                    style: {
                      width: '20rem',
                      height: '7rem',
                      fontSize: '1.3rem',
                    },
                  });
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
                    style: {
                      width: '20rem',
                      height: '7rem',
                      fontSize: '1.3rem',
                    },
                  });
                }
              }}
            >
              Block user
            </button>
          </Box>
        )}
        {isFetching ? (
          <Skeleton
            variant="circular"
            sx={{
              width: '2.5rem',
              height: '2.5rem',
              position: 'absolute',
              left: 15,
              top: 10,
            }}
          ></Skeleton>
        ) : (
          <span
            className={`fi fi-${flag?.toLowerCase()}`}
            style={{
              fontSize: '1.2rem',
              borderRadius: '0.25rem',
              alignSelf: 'start',
            }}
          ></span>
        )}

        {isFetching ? (
          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{ width: '12rem', height: '12rem', mt: '2.9rem' }}
          ></Skeleton>
        ) : (
          <Box>
            {url ? (
              <Box
                sx={{
                  width: { xs: '8rem', md: '10rem', lg: '12rem' },
                  height: '10rem',
                  my: '1rem',
                  backgroundImage: `url(${url})`,
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                }}
              ></Box>
            ) : (
              <Image
                src={avater}
                alt="avater"
                sx={{
                  width: '8rem',
                  height: '10rem',
                  my: '1rem',
                  objectFit: 'cover',
                  borderRadius: '100%',
                }}
              />
            )}
          </Box>
        )}
        {isFetching ? (
          <Fragment>
            <Skeleton
              animation="wave"
              height={30}
              width="80%"
              sx={{ mt: '0.75rem' }}
            />
            <Skeleton
              animation="wave"
              height={30}
              width="80%"
              sx={{ mt: '0.75rem' }}
            />
          </Fragment>
        ) : (
          <Fragment>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                fontWeight: '700',
                fontSize: { xs: '15px', md: '1.2rem' },
              }}
            >
              {isMobile
                ? textFromat(name).length <= 18
                  ? textFromat(name)
                  : `${textFromat(name).slice(1, 16)}...`
                : ''}
              {!isMobile && (
                <Typography fontWeight="700">{textFromat(name)}</Typography>
              )}

              <Image
                src={approved ? approvedicon : notapprovedicon}
                alt="approved "
                sx={{ width: '1.2rem', display: 'flex' }}
              />
            </Box>
            <Typography
              sx={{
                fontSize: { xs: '0.7rem', sm: '1rem' },
                wordBreak: 'break-word',
              }}
            >
              {selling?.slice(0, 15)}
            </Typography>
          </Fragment>
        )}
      </Box>
    </Box>
  );
};

export default SellerCard;
