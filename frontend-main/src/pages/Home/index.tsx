import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { axiosPublic } from 'src/axios/axios';
import ModalWrapper from 'src/components/Modal/ModalWrapper';
import SelectComp from 'src/components/Select/SelectComp';
import Items from 'src/components/homeComponents/Items';
import Search from 'src/components/homeComponents/Search';
import Sellers from 'src/components/homeComponents/Sellers';
import VisitorLayout from 'src/components/layouts/VisitorLayout';
import useAppContext from 'src/hooks/useAppContext';
import useCountryName from 'src/hooks/useCountryName';
import { defaultItems, defaultSellers } from 'src/utilities/constants';
import { ActionType } from 'src/utilities/context/context';

const HomePage = () => {
  const [allItems, setAllItems] = useState<any[]>(defaultItems);
  const [allSellers, setAllSellers] = useState<any[]>(defaultSellers);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [country, setCountry] = useState<string>('everywhere');
  const countryNames = useCountryName();
  const { state, dispatch } = useAppContext();
  const { token, availableLocation } = state;
  const mobileScreen = useMediaQuery('(max-width:600px)');
  const [searchValue, setSearchValue] = useState<string>('');
  const [refresh, setRefresh] = useState<boolean>(false);
  const [pinnedItems, setPinnedItems] = useState<any[]>(defaultItems);
  const [pinnedSellers, setPinnedSeller] = useState<any[]>(defaultSellers);
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.between('xs', 'md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const calculateItemsWithScreen = () => {
    if (isMobile) {
      return 15;
    } else if (isTablet) {
      return 20;
    } else if (isDesktop) {
      return 30;
    } else {
      return allItems.length > 0 ? allItems.length : 30;
    }
  };

  const calculateSellersWithScreen = () => {
    if (isMobile) {
      return 4;
    } else if (isTablet) {
      return 6;
    } else if (isDesktop) {
      return 8;
    } else {
      return allSellers.length > 0 ? allSellers.length : 8;
    }
  };

  const itemsWithScreen = calculateItemsWithScreen();
  const sellersWithScreen = calculateSellersWithScreen();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setIsFetching(true);

        const [sellersResponse, itemsResponse] = await Promise.all([
          mobileScreen
            ? axiosPublic.get(
                `duo/collector/get-sellers?page=1&limit=4&country=${country}`
              )
            : axiosPublic.get(
                `duo/collector/get-sellers?page=1&limit=10&country=${country}`
              ),
          mobileScreen
            ? axiosPublic.get(
                `duo/collector/get-home-items?page=1&limit=18&country=${country}&category=banknote`
              )
            : axiosPublic.get(
                `duo/collector/get-home-items?page=1&limit=36&country=${country}&category=banknote`
              ),
        ]);

        const { sellers } = sellersResponse.data.data;
        const { items } = itemsResponse.data.data;

        setAllSellers(sellers);
        setAllItems(items);
        setIsFetching(false);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchPinnedItems = async () => {
      try {
        const response = await axiosPublic.get('duo/collector/pinned/items');
        const { data } = response.data;
        setPinnedItems(data);
      } catch (error) {}
    };
    const fetchPinnedSellers = async () => {
      try {
        const response = await axiosPublic.get('duo/collector/pinned/sellers');
        const { data } = response.data;
        setPinnedSeller(data);
      } catch (error) {}
    };
    fetchPinnedItems();
    fetchPinnedSellers();
    fetchAll();
  }, [country, refresh]);
  useEffect(() => {
    const searchSellerandItems = async () => {
      try {
        const response = await axiosPublic.get(
          `duo//collector/search/selleranditems?search=${searchValue}`
        );
        const { items } = response?.data?.data;
        const { seller } = response?.data?.data;
        setAllItems(items);
        setAllSellers(seller);
      } catch (error) {}
    };
    if (searchValue !== '') {
      searchSellerandItems();
    } else if (searchValue === '') {
      setRefresh(!refresh);
    }
  }, [searchValue]);

  useEffect(() => {
    const fetchAvailableCountries = async () => {
      try {
        const response = await axiosPublic.get('duo/general/countries');
        const { data } = response.data;
        dispatch({ type: ActionType.setAvailableLocation, payload: data });
      } catch (error) {
        console.log(error);
      }
    };
    fetchAvailableCountries();
  }, []);
  return (
    <VisitorLayout>
      {/* <Box
        sx={{
          mt: "4rem",
          display: "flex",
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "column", md: "row" }, // Adjust flex direction based on breakpoints
        }}
      >
        <Box
          sx={{
            position: "absolute",
            bgcolor: "blue",
            width: "10rem",
            height: "10rem",
            bottom: 100,
            right: 0,
            zIndex: -1,
            transform: "rotate(90deg)",
            clipPath: "ellipse(50% 50% at 50% 0%)",
            overflow: "hidden",
          }}
        ></Box>
        <SelectComp
          selectLabel="Showing sellers and items  located in "
          menuItems={["Everywhere", ...(availableLocation || [])]}
          handleChange={(value) => setCountry(value)}
          value={country}
        />
      </Box> */}
      <Box
        sx={{ pt: '2rem', width: '80%', maxWidth: '500px', margin: '0 auto' }}
      >
        <Search setState={setSearchValue} />
      </Box>

      <Items
        data={[...pinnedItems, ...allItems]}
        isFetching={isFetching}
        itemsWithScreen={itemsWithScreen}
      />

      <Sellers
        data={[...pinnedSellers, ...allSellers]}
        isFetching={isFetching}
        sellersWithScreen={sellersWithScreen}
      />
    </VisitorLayout>
  );
};

export default HomePage;
