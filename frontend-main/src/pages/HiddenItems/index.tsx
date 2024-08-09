import React, { useEffect, useState } from 'react';
import HiddenItemsComponent from 'src/components/SellerProfileComponents/HiddenItems';
import VisitorLayout from 'src/components/layouts/VisitorLayout';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import useScrollToTop from 'src/hooks/useScrolllToTop';
import { GroupItems } from 'src/utilities/types';

const HiddenItems = () => {
  const axiosPrivate = useAxiosPrivate();
  const [sellerHiddenItems, setSellerHiddenItems] = useState<
    GroupItems[] | undefined
  >(undefined);
  useScrollToTop()
  const [refresh, setRefresh] = useState<boolean>(false);
  useEffect(() => {
    const fetchHiddenItems = async () => {
      try {
        const response = await axiosPrivate.get('seller/seller-items/hidden');
        console.log(response);
        const { data } = response.data;
        setSellerHiddenItems(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchHiddenItems();
  }, [refresh]);
  console.log(sellerHiddenItems);
  return (
    <VisitorLayout>
      <HiddenItemsComponent
        data={sellerHiddenItems}
        setRefresh={setRefresh}
        refresh={refresh}
      />
    </VisitorLayout>
  );
};

export default HiddenItems;
