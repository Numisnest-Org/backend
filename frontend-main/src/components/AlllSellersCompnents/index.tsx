import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';

import SelectComp from 'src/components/Select/SelectComp';
import Search from 'src/components/homeComponents/Search';
import { SellerType } from 'src/utilities/types';
import SellerCard from '../cards/SellerCard';
import Pagination from '../Pagination';
import useCountryName from 'src/hooks/useCountryName';
import useAppContext from 'src/hooks/useAppContext';

const SellersComponents = ({
  isFetching,
  data,
  totalPage,
  page,
  setPage,
  changeCountry,
  setSearchValue,
}: {
  isFetching?: boolean;
  data?: SellerType[];
  totalPage: number;
  changeCountry: (value: any) => void;
  setSearchValue: (value: any) => void;
  handleSearch?: () => void;
  page: number;
  setPage: (val: number) => void;
}) => {
  const theme = useTheme();
  const countryNames = useCountryName();
  const { state } = useAppContext();
  const { availableLocation } = state;
  const isNotMobileScreens = useMediaQuery('(min-width:600px)');
  return (
    <Box sx={{ pb: '8rem', pt: '2rem' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        <Typography sx={{ fontWeight: '600' }}>Showing sellers from</Typography>
        <SelectComp
          menuItems={['Everywhere', ...(availableLocation || [])]}
          sx={{ border: '0.79px solid rgba(0, 71, 171, 0.40)' }}
          handleChange={(value) => changeCountry(value)}
        />
      </Box>
      <Box sx={{ mt: '1rem' }}>
        <Typography
          variant={isNotMobileScreens ? 'h2' : 'h2'}
          sx={{ fontWeight: '800', mb: '1rem', ml: '.5rem' }}
        >
          All Sellers
        </Typography>
        <Box sx={{ width: '100%', maxWidth: '420px' }}>
          <Search setState={setSearchValue} />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          transform: { xs: 'scale(1)', sm: 'scale(1)' },
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: { xs: '1rem', md: '1.5rem', lg: '2rem' },
            width: '100%',

            position: 'relative',
            mt: '2rem',
            transformOrigin: 'top left',
          }}
        >
          {data?.map((item: SellerType, index: number) => (
            <SellerCard
              key={index}
              flag={item?.iso_code}
              url={item.photo?.secure_url}
              name={`${item.first_name} ${item.last_name}`}
              selling={item.about}
              isFetching={isFetching}
              id={item._id}
              approved={item.approved}
            />
          ))}
        </Box>
      </Box>

      <Pagination
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: { xs: '2rem', sm: '2rem', md: '4rem' },
          color: theme.palette.primary.light,
          '& .css-c8vooq-MuiButtonBase-root-MuiPaginationItem-root': {
            fontSize: '1.2rem',
            fontFamily: 'poppin',
          },
          '& .Mui-selected': {
            backgroundColor: 'rgba(0, 71, 171, 0.7)',
            color: 'white',
          },
        }}
        size={'large'}
        shape={'circular'}
        variant={'outlined'}
        count={totalPage}
        page={page}
        onChange={(event, value) => setPage(value)}
      />
    </Box>
  );
};

export default SellersComponents;
