import {
  Box,
  Button,
  Divider,
  IconButton,
  Skeleton,
  Typography,
} from '@mui/material';
import {
  CloseOutlined,
  MoreVertOutlined,
  ReportProblemRounded,
} from '@mui/icons-material';
import React, { Fragment, useState } from 'react';
import Image from '../../Image';
import avater from 'src/assets/Image/numisnest avater.jpg';
import { textFromat } from 'src/utilities/constants/helpers';
import nora from 'src/assets/Image/nora.jpg';
import approvedicon from 'src/assets/Image/AdminIcons/approved.svg';
import notapprovedicon from 'src/assets/Image/AdminIcons/cancel.svg';
import { AnimatePresence, motion } from 'framer-motion';
import ConfirmationModal from 'src/components/Modal/are-you-sure';
import { useNavigate } from 'react-router-dom';
import pin from 'src/assets/Image/Pin.svg';
import useAdminPrivate from 'src/hooks/useAdminPrivate';
import { toast } from 'react-toastify';
interface Props {
  flag?: string;
  url?: string;
  name?: string;
  selling?: string;
  isFetching?: boolean;
  id?: string;
  approved?: boolean;
  pinned?: boolean;
  openModal?: () => void;
  setDisplayModal1?: (val: boolean) => void;
  setDisplayModal2?: (val: boolean) => void;
  setDisplayModal3?: (val: boolean) => void;
  setRefresh?: (val: any) => void;
}
const AdminSellerCard = ({
  flag,
  url,
  name,
  selling,
  isFetching,
  id,
  approved,
  pinned,
  openModal,
  setDisplayModal1,
  setDisplayModal2,
  setDisplayModal3,
  setRefresh,
}: Props) => {
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const [selectedId, setSelectedId] = useState<string | null | undefined>(null);
  const navigate = useNavigate();
  const adminPrivate = useAdminPrivate();
  const pinSeller = async () => {
    try {
      const response = await adminPrivate.put(
        `/admin/pinned/seller/${id}?pin=${!pinned}`
      );
      console.log(response);
      toast(pinned ? 'Seller Unpinned' : 'Seller Pinned', {
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
      typeof setRefresh !== 'undefined' && setRefresh((prev: boolean) => !prev);
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
  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          backgroundColor: 'white',
          width: '100%',
          height: {
            xs: '17.5rem',
            sm: '23rem',
            md: '23rem',
            lg: '23rem',
            xl: '23.7rem',
          },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          borderRadius: '0.6rem',
          transition: 'all 0.3s ease-in-out allow-discrete',
          '&:hover': {
            boxShadow: ' 3px 5px 10px 0.7px rgba(0, 0, 0, .2)',
            cursor: 'pointer',
          },
        }}
      >
        {pinned && (
          <IconButton sx={{ position: 'absolute', top: -20, left: -30 }}>
            <Image
              src={pin}
              alt="pin"
              sx={{
                width: '2.5rem',
              }}
            />
          </IconButton>
        )}

        <IconButton
          sx={{
            position: 'absolute',
            right: 5,
            top: 10,
          }}
          onClick={() => setShowDialog(true)}
        >
          <MoreVertOutlined sx={{ fontSize: '2rem', color: '#0047AB' }} />
        </IconButton>
        <AnimatePresence>
          {showDialog && (
            <Box
              sx={{
                width: '9rem',
                height: '11rem',
                position: 'absolute',
                bgcolor: '#F4F4F6',
                transformOrigin: 'top right',
                borderRadius: '0.3rem',
                right: 25,
                top: 22,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ when: 'beforeChildren', staggerChildren: 0.2 }}
              exit={{ scale: 0 }}
              component={motion.div}
            >
              <Box sx={{ position: 'relative', display: '' }}>
                <IconButton
                  sx={{
                    position: 'absolute',
                    right: -5,
                    top: -5,
                    color: '#0047AB',
                  }}
                  onClick={() => setShowDialog(false)}
                >
                  <CloseOutlined />
                </IconButton>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  mt: '1.5rem',
                }}
              >
                <Typography
                  component={motion.div}
                  sx={{ fontSize: '1rem' }}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 50, opacity: 0 }}
                  onClick={() =>
                    typeof setDisplayModal1 !== 'undefined' &&
                    setDisplayModal1(true)
                  }
                >
                  {' '}
                  Approve
                </Typography>
                <Divider />
                <Typography
                  component={motion.div}
                  sx={{ fontSize: '1rem' }}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 50, opacity: 0 }}
                  onClick={() =>
                    typeof setDisplayModal2 !== 'undefined' &&
                    setDisplayModal2(true)
                  }
                >
                  {' '}
                  Disapprove
                </Typography>
                <Divider />
                <Typography
                  component={motion.div}
                  sx={{ fontSize: '1rem' }}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 50, opacity: 0 }}
                  onClick={() =>
                    typeof setDisplayModal3 !== 'undefined' &&
                    setDisplayModal3(true)
                  }
                >
                  {' '}
                  Delete
                </Typography>
                <Typography
                  component={motion.div}
                  sx={{ fontSize: '1rem' }}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 50, opacity: 0 }}
                  mb={'0.5rem'}
                  onClick={pinSeller}
                >
                  {' '}
                  {pinned ? 'unpin' : 'pin'}
                </Typography>
              </Box>
            </Box>
          )}
        </AnimatePresence>
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
              fontSize: '1.7rem',
              position: 'absolute',
              left: 15,
              top: 10,
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
                  width: { xs: '10.5rem', sm: '10rem' },
                  height: { xs: '8.8rem', sm: '10rem' },
                  backgroundImage: `url(${url})`,
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  mt: '2.9rem',
                  borderRadius: '0.3rem',
                }}
              ></Box>
            ) : (
              <Image
                src={avater}
                alt="avater"
                sx={{
                  width: { xs: '10.5rem', sm: '10rem' },
                  height: { xs: '8.8rem', sm: '10rem' },
                  mt: '2.9rem',
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
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                sx={{
                  mt: '',
                  fontSize: { xs: '1.1rem', sm: '1.5rem' },
                  fontWeight: '',
                }}
                fontFamily={"'Noto Sans KR', sans-serif"}
              >
                {textFromat(name)}
              </Typography>
              <Image
                src={approved ? approvedicon : notapprovedicon}
                alt="approved "
                sx={{ width: '1.2rem' }}
              />
            </Box>
            <Typography
              sx={{
                mt: '0.5rem',
                textAlign: 'center',
                fontSize: { xs: '0.7rem', sm: '14px' },
                maxWidth: '200px',
                wordWrap: 'word-break',
                margin: '0 auto',
              }}
            >
              {textFromat(selling?.slice(0, 40))}
            </Typography>
          </Fragment>
        )}
        <Button
          sx={{
            backgroundColor: '#0047AB',
            color: 'white',
            padding: '0.5rem 3.8rem',
            borderRadius: '0.4rem',
            mt: 'auto',
            mb: '0.5rem',
          }}
          onClick={() => navigate(`/admineditSeller?seller_id=${id}`)}
        >
          Edit Profile
        </Button>
      </Box>
    </Box>
  );
};

export default AdminSellerCard;
