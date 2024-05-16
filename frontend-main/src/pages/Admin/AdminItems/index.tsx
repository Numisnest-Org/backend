import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AdminAllItems from 'src/components/AdminComponents/AdminAllItems'
import Adminitemscard from 'src/components/AdminComponents/AdminCards/Adminitemscard'
import AdminItemsheader from 'src/components/AdminComponents/AdminItemsheader'
import useAdminPrivate from 'src/hooks/useAdminPrivate'
import { defaultItems } from 'src/utilities/constants'

const AdminItemsPage = () => {
   const [country, setCountry] = useState<string>("Everywhere");
   const [searchValue, setSearchValue] = useState<string>("");
   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
   const [currency, setCurrency] = useState<string>("NGN");
   const [allItems, setAllItems] = useState<any[]>(defaultItems);
   const seralizedCategories = selectedCategories.join(",");
   const [refresh, setRefresh] = useState<boolean>(false);
   const [page, setPage] = useState<number>(1);
   const [totalPage, setTotalPage] = useState<number>(1);
   const [isFetching, setIsFetching] = useState<boolean>(true);
  const adminPrivate= useAdminPrivate()
  useEffect(()=>{
    const fetchAllItems = async()=>{
      try {

        const response = await adminPrivate.get(
          `admin/items?limit=12&page=${page}&country=${country}&currency=${currency}&category=${seralizedCategories}`
        );
          setTotalPage(parseInt(response.data.data.page.split("of")[1]));
          const { items } = response.data.data;
          setAllItems(items);
          setIsFetching(false);
      } catch (error) {
        
      }
    }
    fetchAllItems()
  },[page ,refresh,country,currency,selectedCategories])
  

  useEffect(() => {
    const search = async () => {
      try {
        const response = await adminPrivate.get(
          `admin/search/items?search=${searchValue}`
        );
        const { items} = response.data.data
        console.log(items)
        setAllItems(items);
      } catch (error) {}
    };
    if (searchValue !== "") {
      search();
    } else if (searchValue === "") {
      setRefresh(!refresh);
    }
  }, [searchValue]);
  
  return (
    <Box>
      <AdminItemsheader
        country={country}
        changeCountry={setCountry}
        setSearchValue={setSearchValue}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        setCurrency={setCurrency}
        currency={currency}
        
      />
      <Box sx={{ display: "flex" }}>
        <AdminAllItems data={allItems} totalPage={totalPage} page={page} setPage={setPage} isFetching={isFetching} setRefresh={setRefresh}/>
      </Box>
    </Box>
  );
}

export default AdminItemsPage