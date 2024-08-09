import { Box, Paper, Typography, useMediaQuery } from '@mui/material';
import { ItemType, SellerItemType } from 'src/utilities/types';
import ItemsCard from '../cards/ItemsCard';
import { defaultItems } from 'src/utilities/constants';
interface Props {
  data?: Partial<ItemType>[];
}
const SimilarItems = ({ data }: Props) => {
  const isNotMobileScreens = useMediaQuery('(min-width:500px)');
  console.log(data);
  return (
    <Box sx={{ mt: '70px' }}>
      <Typography
        sx={{
          fontSize: { xs: '22px', md: '26px', lg: '32px' },
          fontWeight: 700,
          mb: '8px',
        }}
      >
        Similar items
      </Typography>
      <Box
        sx={{
          p: { xs: '0px', md: '32px 47px' },
          background: { xs: 'none', md: '#D8E8FF' },
          borderRadius: '24px',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gap: '.8rem',
            gridTemplateColumns: { xs: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' },
          }}
        >
          {data?.slice(0, 10)?.map((item: Partial<ItemType>, index: number) => (
            <ItemsCard
              key={index}
              url={item.photos?.[0]?.secure_url}
              currency={item.currency}
              selling={item.name}
              createdAt={item.updatedAt}
              amount={item.price}
              bgColor="#fff"
              id={item._id}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default SimilarItems;
