import VisitorLayout from 'src/components/layouts/VisitorLayout';
import Image from 'src/components/Image';
import group2 from 'src/assets/Image/Group 2.png';
import ItemsComponets from 'src/components/AllItems';
import { useEffect, useState } from 'react';
import { axiosPublic } from 'src/axios/axios';
import { defaultItems } from 'src/utilities/constants';
import { Seller, SellerType } from 'src/utilities/types';
import useScrollToTop from 'src/hooks/useScrolllToTop';
import axios from 'axios';

const AllItems = ({}) => {
  useScrollToTop();
  const [allItems, setAllItems] = useState<any[]>(defaultItems);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [country, setCountry] = useState<string>('everywhere');
  const [currency, setCurrency] = useState<string>('');
  const [scountry, setScountry] = useState<string>('everywhere');
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const seralizedCategories = selectedCategories.join(',');
  const [refresh, setRefresh] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [startDate, setStartDate] = useState<any>();
  const [endDate, setEndDate] = useState<number>();
  const [formattedDate, setFormattedDate] = useState<string>();
  const [totalitems,setTotalItems] =useState<number>(0)
  useEffect(() => {
    const fetchAllsellers = async () => {
      try {
        setIsFetching(true);
        const response = await axiosPublic.get(
          `duo/collector/get-items?page=${page}&limit=60&country=${scountry}&category=${seralizedCategories}&currency=${currency}&scountry=${country}&year=${formattedDate}`
        );
          console.log(response)
        setTotalItems(response.data.data.counts)
        setTotalPage(parseInt(response.data.data.page.split('of')[1]));
        const { items } = response.data.data;
        setAllItems(items);
        setIsFetching(false);
      } catch (error) {
        console.log(error);
      } finally {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    fetchAllsellers();
    
  }, [
    country,
    selectedCategories,
    currency,
    refresh,
    page,
    scountry,
    formattedDate,
  ]);

  useEffect(() => {
    const search = async () => {
      try {
        const response = await axiosPublic.get(
          `duo/collector/search/items?search=${searchValue}`
        );
        const { data } = response.data;
        setAllItems(data.items);
      } catch (error) {}
    };
    if (searchValue !== '') {
      search();
    } else if (searchValue === '') {
      setRefresh(!refresh);
    }
  }, [searchValue]);
  console.log(formattedDate);
  
  return (
    <VisitorLayout>
      <ItemsComponets
      currency={currency}
        data={allItems}
        isFetching={isFetching}
        setCountry={setCountry}
        countryValue={country}
        setSearchValue={setSearchValue}
        setCurrency={setCurrency}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        page={page}
        setPage={setPage}
        totalPage={totalPage}
        scountry={scountry}
        setScountry={setScountry}
        setEndDate={setEndDate}
        setStartDate={setStartDate}
        startDate={startDate}
        endDate={endDate}
        setFormattedDate={setFormattedDate}
        totalItems={totalitems}
      />
      <Image
        src={group2}
        alt="group"
        sx={{
          width: '8rem',
          height: '8rem',
          position: 'absolute',
          zIndex: -1,
          right: 0,
          top: 300,
        }}
      />
      <Image
        src={group2}
        alt="group"
        sx={{
          width: '10rem',
          height: '10rem',
          position: 'absolute',
          zIndex: -1,
          left: 16,
          bottom: 50,
        }}
      />
    </VisitorLayout>
  );
};
export default AllItems;
