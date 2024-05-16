import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import React, { useState } from 'react';
import { CustomSwitchClone } from '../AddItemsComponents/toggleISwitch';
import { Widgets } from '@mui/icons-material';
import { AccountVisibilityType, BlockedDataType } from 'src/utilities/types';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import { toast } from 'react-toastify';
// import { MdBlockFlipped } from 'react-icons/md';

interface Props {
  data?: AccountVisibilityType;
  blockedUsers?: BlockedDataType;
}

const AccountVisibilityComp = ({ data, blockedUsers }: Props) => {
  const axiosPrivate = useAxiosPrivate();
  const [featuredVisible, setfeaturedVisible] = useState<boolean>(
    data?.featured ? data.featured : false
  );
  const [collectionVisible, setcollectionVisible] = useState<boolean>(
    data?.collections ? data.collections : false
  );
  const [itemsVisible, setitemsVisible] = useState<boolean>(
    data?.items ? data.items : false
  );
  const [messagingVisible, setmessagingVisible] = useState<boolean>(
    data?.messaging ? data.messaging : false
  );
  const [mydetailsVisible, setmydetailsVisible] = useState<boolean>(
    data?.details ? data.details : false
  );
  const [myprofileVisible, setmyprofileVisible] = useState<boolean>(
    data?.profile ? data.profile : false
  );
  const styles = {
    flexContainerFull: {
      display: 'flex',
      Width: '100%',
      justifyContent: 'space-between',
    },
    flexContainer: {
      display: 'flex',
    },
  };
  const handleVisibilityToggle = async (
    name: string,
    value: boolean
  ): Promise<void> => {
    try {
      await axiosPrivate.put('seller/visibility/edit', { [name]: value });
    } catch (error) {}
  };
  const unblockUser = async (userId: string) => {
    try {
      await axiosPrivate.delete(`seller/block-list/remove/${userId}`);
      toast('user unblocked', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        isLoading: false,
        type: 'success',
        theme: 'light',
        style: { width: '20rem', height: '7rem', fontSize: '1.3rem' },
      });
    } catch (error) {}
  };

  const isMobile = useMediaQuery('(max-width:500px)');

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        rowGap: isMobile ? '2rem' : '3rem',
        columnGap: isMobile ? '.5rem' : '3rem',
        px: isMobile ? '.5rem' : '2rem',
        py: '3rem',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '.4fr 1fr' : '.5fr 1fr',
          gap: isMobile ? '1rem' : '3rem',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: isMobile ? '1rem' : '3rem',
            borderBottom: '1px solid black',
            pb: '1.5rem',
          }}
        >
          <Typography
            sx={{ fontSize: isMobile ? '1rem' : '1.2rem', fontWeight: '500' }}
          >
            Featured
          </Typography>{' '}
          <Box sx={styles.flexContainer}>
            <CustomSwitchClone
              setState={setfeaturedVisible}
              state={featuredVisible}
              size="small"
              func={() => handleVisibilityToggle('featured', !featuredVisible)}
            />
          </Box>
        </Box>
        <Typography
          color={featuredVisible ? 'green' : 'red'}
          sx={{ fontWeight: '500', fontSize: isMobile ? '12px' : '1rem' }}
        >
          {featuredVisible
            ? 'Your Featured items are visible publicly'
            : 'Your featured items are hidden from others'}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '.4fr 1fr' : '.5fr 1fr',
          gap: isMobile ? '1rem' : '3rem',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: isMobile ? '1rem' : '3rem',
            borderBottom: '1px solid black',
            pb: '1.5rem',
          }}
        >
          <Typography
            sx={{ fontSize: isMobile ? '1rem' : '1.2rem', fontWeight: '500' }}
          >
            Collection
          </Typography>{' '}
          <Box sx={styles.flexContainer}>
            <CustomSwitchClone
              setState={setcollectionVisible}
              state={collectionVisible}
              size="small"
              func={() =>
                handleVisibilityToggle('collections', !collectionVisible)
              }
            />
          </Box>
        </Box>
        <Typography
          color={collectionVisible ? 'green' : 'red'}
          sx={{ fontWeight: '500', fontSize: isMobile ? '12px' : '1rem' }}
        >
          {collectionVisible
            ? 'Your collections are visible publicly'
            : 'Your collections are hidden from others'}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '.4fr 1fr' : '.5fr 1fr',
          gap: isMobile ? '1rem' : '3rem',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: isMobile ? '1rem' : '3rem',
            borderBottom: '1px solid black',
            pb: '1.5rem',
          }}
        >
          <Typography
            sx={{ fontSize: isMobile ? '1rem' : '1.2rem', fontWeight: '500' }}
          >
            Items
          </Typography>{' '}
          <Box sx={styles.flexContainer}>
            <CustomSwitchClone
              setState={setitemsVisible}
              state={itemsVisible}
              size="small"
              func={() => handleVisibilityToggle('items', !itemsVisible)}
            />
          </Box>
        </Box>
        <Typography
          color={itemsVisible ? 'green' : 'red'}
          sx={{
            fontWeight: '500',
            fontSize: isMobile ? '12px' : '1rem',
            maxWidth: '400px',
          }}
        >
          {itemsVisible
            ? 'Your items are visible publicly'
            : 'Your items are hidden from others. They will not be seen on the ‘home page’, your profile page and ‘all items’ page.'}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '.4fr 1fr' : '.5fr 1fr',
          gap: isMobile ? '1rem' : '3rem',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: isMobile ? '1rem' : '3rem',
            borderBottom: '1px solid black',
            pb: '1.5rem',
          }}
        >
          <Typography
            sx={{ fontSize: isMobile ? '1rem' : '1.2rem', fontWeight: '500' }}
          >
            Messaging
          </Typography>{' '}
          <Box sx={styles.flexContainer}>
            <CustomSwitchClone
              setState={setmessagingVisible}
              state={messagingVisible}
              size="small"
              func={() =>
                handleVisibilityToggle('messaging', !messagingVisible)
              }
            />
          </Box>
        </Box>
        <Typography
          color={messagingVisible ? 'green' : 'red'}
          sx={{ fontWeight: '500', fontSize: isMobile ? '12px' : '1rem' }}
        >
          {messagingVisible
            ? 'Other users can message you'
            : 'Other users can NOT message you'}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '.4fr 1fr' : '.5fr 1fr',
          gap: isMobile ? '1rem' : '3rem',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: isMobile ? '1rem' : '3rem',
            borderBottom: '1px solid black',
            pb: '1.5rem',
          }}
        >
          {' '}
          <Typography
            sx={{ fontSize: isMobile ? '1rem' : '1.2rem', fontWeight: '500' }}
          >
            My Details
          </Typography>{' '}
          <CustomSwitchClone
            setState={setmydetailsVisible}
            state={mydetailsVisible}
            size="small"
            func={() => handleVisibilityToggle('details', !mydetailsVisible)}
          />
        </Box>

        <Box sx={styles.flexContainer}>
          <Typography
            color={mydetailsVisible ? 'green' : 'red'}
            sx={{ fontWeight: '500', fontSize: isMobile ? '12px' : '1rem' }}
          >
            {mydetailsVisible
              ? 'Your Details are visible publicly'
              : 'Your Details are hidden from others'}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '.4fr 1fr' : '.5fr 1fr',
          gap: isMobile ? '1rem' : '3rem',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: isMobile ? '1rem' : '3rem',
            borderBottom: '1px solid black',
            pb: '1.5rem',
          }}
        >
          <Typography
            sx={{ fontSize: isMobile ? '1rem' : '1.2rem', fontWeight: '500' }}
          >
            My profile
          </Typography>{' '}
          <CustomSwitchClone
            setState={setmyprofileVisible}
            state={myprofileVisible}
            size="small"
            func={() => handleVisibilityToggle('profile', !myprofileVisible)}
          />
        </Box>

        <Box sx={styles.flexContainer}>
          <Typography
            color={myprofileVisible ? 'green' : 'red'}
            sx={{
              fontWeight: '500',
              fontSize: isMobile ? '12px' : '1rem',
              maxWidth: '400px',
            }}
          >
            {myprofileVisible
              ? 'Your Profile is visible publicly'
              : 'Your profile is hidden from others. It will not be seen on the ‘home’ page and on ‘all sellers’ page.'}
          </Typography>
        </Box>
      </Box>

      <Box>
        <Box sx={{ display: 'flex' }}>
          {/* <MdBlockFlipped /> */}
          <Typography sx={{ fontSize: isMobile ? '1.2rem' : '1.4rem' }}>
            Blocked users
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            pl: isMobile ? '' : '1rem',
            pt: '3rem',
            gap: '1rem',
          }}
        >
          <Box sx={{ display: 'grid', gap: '1rem' }}>
            {blockedUsers?.blocked_users.map((user) => (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '2rem',
                }}
              >
                <Typography>
                  {`-${user.first_name} ${user.last_name}`}
                </Typography>
                <button
                  style={{
                    paddingBlock: '.3rem',
                    paddingInline: '.8rem',
                    width: 'fit-content',
                    height: 'fit-content',
                    alignSelf: 'center',
                  }}
                  className="blue-btn "
                  onClick={() => unblockUser(user._id)}
                >
                  unblock
                </button>
              </Box>
            ))}
          </Box>
          <Box sx={{ maxWidth: '400px' }}>
            <Typography>
              These users cannot visit your profile page and they cannot message
              you. You cannot message them or visit their profile while they are
              blocked.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AccountVisibilityComp;
