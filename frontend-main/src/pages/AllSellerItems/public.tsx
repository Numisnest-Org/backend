import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { axiosPublic } from 'src/axios/axios';
import AllSellerItems from 'src/components/AllSellerItems/SellerItems';
import SellerCard from 'src/components/cards/SellerCard';
import VisitorLayout from 'src/components/layouts/VisitorLayout';
import useScrollToTop from 'src/hooks/useScrolllToTop';
import { defaultItems, defaultSellerItems } from 'src/utilities/constants';
import {
  CollectionType,
  SellerItemType,
  SingleItemType,
  SingleSeller,
} from 'src/utilities/types';

const AllSellerItemsPublicPage = () => {
  useScrollToTop();
  const { id } = useParams();
  const [data, setData] = useState<SingleSeller | undefined>(undefined);
  const [sellerItem, setSellerItem] = useState<SingleItemType[] | null>(null);
  const [country, setCountry] = useState<string>('Everywhere');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const seralizedCategories = selectedCategories.join(',');
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [searchValue, setSearchValue] = useState<string>('');
  const [refresh, setRefresh] = useState<boolean>(false);
  useEffect(() => {
    const getsellerProfile = async () => {
      try {
        const reponse = await axiosPublic.get(`duo/collector/get-seller/${id}`);
        const { data: sellerProfile } = reponse.data;
        setData(sellerProfile);
      } catch (error) {
        console.log(error);
      }
    };
    getsellerProfile();
  }, []);
  useEffect(() => {
    const fetchSellerItems = async () => {
      try {
        const reponse = await axiosPublic.get(
          `duo/collector/seller-items/${id}?page=${page}&category=${seralizedCategories}&limit=48&country=${country}`
        );
        setTotalPage(parseInt(reponse.data.data.page.split('of')[1]));
        const { data: sellerItems } = reponse.data;
        setSellerItem(sellerItems.items);
      } catch (error) {}
    };
    fetchSellerItems();
  }, [country, page, selectedCategories, refresh]);
  console.log(searchValue);

  useEffect(() => {
    const search = async () => {
      try {
        const response = await axiosPublic.get(
          `duo/collector/seller-items/search/${id}?search=${searchValue}`
        );
        console.log(response);
        const { data: sellerItems } = response.data;
        setSellerItem(sellerItems.items);
      } catch (error) {}
    };
    if (searchValue !== '') {
      search();
    } else if (searchValue === '') {
      setRefresh(!refresh);
    }
  }, [searchValue]);

  return (
    <VisitorLayout>
      <Box
        sx={{ display: 'flex', justifyContent: 'end', mt: '2rem', px: '1rem' }}
      >
        <SellerCard
          flag={data?.iso_code}
          url={data?.photo.secure_url}
          name={`${data?.first_name} ${data?.last_name}`}
          selling={data?.about}
          id={data?._id}
          approved={data?.approved}
        />
      </Box>
      <AllSellerItems
        sellerName={data?.first_name}
        data={sellerItem}
        setCountry={setCountry}
        setPage={setPage}
        totalPage={totalPage}
        page={page}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        setSearchValue={setSearchValue}
      />
    </VisitorLayout>
  );
};

export default AllSellerItemsPublicPage;
