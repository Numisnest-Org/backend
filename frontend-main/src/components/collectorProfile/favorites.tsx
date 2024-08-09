import { Box, Grid, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import useAppContext from 'src/hooks/useAppContext';
import useCollectorsAxiosPrivate from 'src/hooks/useCollectorsAxiosPrivate';
import { defaultFaves, defaultSellers } from 'src/utilities/constants';
import SellerCard from '../cards/SellerCard';
import { CollectorFav, SellerType } from 'src/utilities/types';

const FavoritesComponent = () => {
  const { state } = useAppContext();
  const { token } = state;
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [favoriteSeller, setFavoriteSeller] = useState<CollectorFav[] | null>(
    defaultFaves
  );
  const axiosCollectorsPrivate = useCollectorsAxiosPrivate();
  useEffect(() => {
    const fetchUserFavorites = async () => {
      try {
        const response = await axiosCollectorsPrivate.get(
          'duo/collector/get-fav'
        );
        const { data } = response?.data;
        console.log(data);
        setFavoriteSeller(data);
      } catch (error) {
      } finally {
        setIsFetching(false);
      }
    };
    fetchUserFavorites();
  }, []);
  return (
    <Box sx={{ mt: '4rem' }}>
      <Typography
        variant={'h5'}
        sx={{
          fontWeight: 700,
          mr: '2rem',
          mb: '0.5rem',
          fontSize: { xs: '18px', md: '28px' },
        }}
      >
        My favorites ❤️
      </Typography>
      <Box
        sx={{
          paddingRight: { xs: '12px', md: '40px' },
          paddingLeft: { xs: '12px', md: '40px' },
          paddingBottom: { xs: '1.8rem', md: '2.8rem' },
          pt: { xs: '1.5rem', sm: '2rem' },
          bgcolor: 'hsla(215, 100%, 92%, 1)',
          boxShadow: '1px 2px 2px #0000',
          borderRadius: '4px',
          overflow: { xs: 'scroll', lg: 'unset' },
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(6, 170px)',
              md: 'repeat(6, 1fr)',
            },
            gap: { xs: '0.6rem', sm: '1rem', md: '2rem' },
          }}
        >
          {favoriteSeller?.map((seller: CollectorFav, index) => (
            <SellerCard
              key={index}
              flag={seller.seller?.[0].iso_code}
              name={`${seller.seller?.[0].first_name} ${seller.seller?.[0].last_name}`}
              url={seller.seller?.[0].photo?.secure_url}
              selling={`${seller.seller?.[0].country_code}${seller.seller?.[0].mobile}`}
              isFetching={isFetching}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default FavoritesComponent;
