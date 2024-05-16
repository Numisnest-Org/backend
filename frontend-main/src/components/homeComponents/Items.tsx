import { Box, useMediaQuery, useTheme } from '@mui/material';
import SellersHeader from '../headers/SellersHeader';
import ItemsCard from '../cards/ItemsCard';
import { HomeItemType, ItemType, item } from 'src/utilities/types';
import LINKS from 'src/utilities/links';
const Items = ({
  isFetching,
  data,
  itemsWithScreen,
}: {
  isFetching?: boolean;
  data: any;
  itemsWithScreen: any;
}) => {
  return (
    <SellersHeader titleHead="Items" path={LINKS.Allitems}>
      <Box
        sx={{
          display: 'grid',
          mt: '2rem',
          gridTemplateColumns: {
            xs: 'repeat(3, 1fr)',
            md: 'repeat(4, 1fr)',
            lg: 'repeat(6, 1fr)',
          },
          gap: { xs: '0.4rem', sm: '1rem' },
          position: 'relative',
          height: '100%',
        }}
      >
        {data
          .slice(0, itemsWithScreen)
          .map((item: HomeItemType, index: number) => (
            <ItemsCard
              key={index}
              flag={item?.item?.iso_code}
              url={item?.item?.photos[0].secure_url}
              firstName={item?.item?.seller_info?.[0].first_name}
              lastName={item?.item?.seller_info?.[0].last_name}
              selling={item?.item?.name}
              createdAt={item?.item?.updatedAt}
              amount={item?.item?.convertedPrice}
              isFetching={isFetching}
              currency={item?.item?.convertedCurrency}
              id={item?.item?._id}
            />
          ))}
      </Box>
    </SellersHeader>
  );
};

export default Items;
