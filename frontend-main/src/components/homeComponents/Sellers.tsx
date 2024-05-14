import { Box, useMediaQuery } from '@mui/material';

import SellersHeader from '../headers/SellersHeader';
import SellerCard from 'src/components/cards/SellerCard';

import { SellerType } from 'src/utilities/types';
import LINKS from 'src/utilities/links';

const Sellers = ({
  isFetching,
  data,
  sellersWithScreen,
}: {
  isFetching?: boolean;
  data: any;
  sellersWithScreen: any;
}) => {
  return (
    <SellersHeader titleHead="Sellers" path={LINKS.Allsellers}>
      <Box
        sx={{
          display: 'grid',
          mt: '1.2rem',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          gap: { xs: '0.7rem', md: '1rem', lg: '1.3rem' },
          rowGap: { xs: '1rem', md: '1.3rem' },
          position: 'relative',
        }}
      >
        {data
          .slice(0, sellersWithScreen)
          .map((item: Partial<SellerType>, index: number) => (
            <SellerCard
              key={index}
              flag={item.iso_code}
              url={item.photo?.secure_url}
              name={`${item.first_name} ${item.last_name}`}
              selling={item.about}
              isFetching={isFetching}
              id={item._id}
              approved={item.approved}
            />
          ))}
      </Box>
    </SellersHeader>
  );
};

export default Sellers;
