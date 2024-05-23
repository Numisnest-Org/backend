import { Box } from '@mui/material';
import LINKS from 'src/utilities/links';
import { HomeItemType } from 'src/utilities/types';
import ItemsCard from '../cards/ItemsCard';
import SellersHeader from '../headers/SellersHeader';
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
            xs: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: { xs: '0.6rem', sm: '1rem' },
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
