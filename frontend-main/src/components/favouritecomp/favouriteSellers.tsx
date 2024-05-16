import { Box, Typography } from '@mui/material'
import React from 'react'
import { CollectorFav } from 'src/utilities/types'
import SellerCard from '../cards/SellerCard';

const FavouriteSellers = ({data,isFetching}:{data:CollectorFav[]|null,isFetching:boolean}) => {
  return (
    <Box>
      <Typography>Favourites</Typography>
      {data?.map((seller: CollectorFav, index) => (
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
  );
}

export default FavouriteSellers