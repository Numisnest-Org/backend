import { Box, Paper, Typography, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ItemsCard from 'src/components/cards/ItemsCard';
import Search from 'src/components/homeComponents/Search';
import VisitorLayout from 'src/components/layouts/VisitorLayout';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import useScrollToTop from 'src/hooks/useScrolllToTop';
import {
  GroupItems,
  SingleItemType,
  SingleSellerFeaturedItem,
} from 'src/utilities/types';

const FeaturedPage = () => {
  const axiosPrivate = useAxiosPrivate();
  useScrollToTop();
  const isNotMobileScreens = useMediaQuery('(min-width:600px)');
  const [refresh, setRefresh] = useState<boolean>(false);
  const [featured, setFeatured] = useState<SingleSellerFeaturedItem[] | null>(
    null
  );
  const [sellerItem, setSellerItem] = useState<GroupItems[] | null>(null);
  useEffect(() => {
    const fetchSellerFeatured = async () => {
      try {
        const response = await axiosPrivate.get(`seller/featured/fetch`);
        const { data }: { data: any } = response.data;
        setFeatured(data?.[0].featured_items);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSellerFeatured();
  }, [refresh]);
  useEffect(() => {
    const fetchSellerItems = async () => {
      try {
        const reponse = await axiosPrivate.get(`seller/seller-items`);
        const { data: sellerItems } = reponse.data;
        setSellerItem(sellerItems.items);
        console.log(sellerItems.items);
      } catch (error) {}
    };
    fetchSellerItems();
  }, []);
  return (
    <VisitorLayout>
      <Paper
        sx={{
          position: 'relative',
          mt: '3rem',
          pl: isNotMobileScreens ? '2rem' : '1rem',
          pb: '1rem',
          pt: '2rem',
        }}
      >
        <Box
          sx={{
            display: { sm: 'block', md: 'flex' },
            alignItems: 'center',
            justifyContent: 'space-between',
            pr: '1rem',
          }}
        >
        
          <Typography
            sx={{
              fontSize: { xs: '1.3rem', md: '1.6rem' },
              fontWeight: 700,
              mr: '2rem',
              mb: '0.5rem',
            }}
          >
            Featured
          </Typography>
        </Box>
        {featured ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(3, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
                lg: 'repeat(6, 1fr)',
                xl: 'repeat(6, 1fr)',
              },
              justifyItems: 'center',
              columnGap: { xs: '0.5rem', lg: '0.9rem', xl: '2rem' },
              rowGap: '2rem',
              ml: '-1.5rem',
              transform: 'scale(0.94)',
              pb: '1rem',
            }}
          >
            {featured?.map((item: SingleSellerFeaturedItem, index: number) => (
              <ItemsCard
                key={index}
                url={item?.photos?.[0].secure_url}
                selling={item.name}
                amount={item.price}
                currency={'usd'}
                bgColor="#F4F4F6"
                height="15.5rem"
                id={item._id}
                xsheight="12.5rem"
                featured
                setRefresh={setRefresh}
              />
            ))}
          </Box>
        ) : (
          <Typography
            textAlign={'center'}
            variant={isNotMobileScreens ? 'h2' : 'h3'}
          >
            You have not added features items
          </Typography>
        )}
      </Paper>

      <Box sx={{ mt: '3rem' }}>
        <Box
          sx={{
            // display: { sx: 'block', sm: 'flex' },
            // justifyContent: 'space-between',
            // alignItems: 'center',
            width: '100%',
            maxWidth: '500px',
          }}
        >
          <Search />
        </Box>

        <Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(3, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
                lg: 'repeat(6, 1fr)',
                xl: 'repeat(6, 1fr)',
              },
              columnGap: { xs: '0.5rem', lg: '0.9rem', xl: '2rem' },
              rowGap: '1rem',
              justifyItems: 'center',
              position: 'relative',
              pb: '1rem',
              ml: '0',
              mt: '1rem',
              transform: 'scale(0.98)',
            }}
          >
            {sellerItem?.map((item: any, index: number) => (
              <Box sx={{ width: '100%' }}>
                <ItemsCard
                  key={index}
                  url={item?.photos?.[0].secure_url}
                  currency={item.convertedCurrency}
                  selling={item.name}
                  createdAt={item.updatedAt}
                  amount={item.convertedPrice}
                  height="15.5rem"
                  bgColor="#FAF9F9"
                  id={item._id}
                  addFeatured
                  setRefresh={setRefresh}
                  xsheight="12.5rem"
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* <Pagination
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "5rem",
            color: theme.palette.primary.light,

            "& .css-c8vooq-MuiButtonBase-root-MuiPaginationItem-root": {
              fontSize: "1.2rem",
              fontFamily: "poppin",
            },
            "& .Mui-selected": {
              backgroundColor: "rgba(0, 71, 171, 0.7)",
              color: "white",
            },
          }}
          size={"large"}
          shape={"circular"}
          variant={"outlined"}
          count={5}
          page={pagenum}
          onChange={(event, value) => setPagenum(value)}
        /> */}
    </VisitorLayout>
  );
};

export default FeaturedPage;
