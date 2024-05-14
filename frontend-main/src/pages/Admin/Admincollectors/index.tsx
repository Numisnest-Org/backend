import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import AdminAllCollectors from 'src/components/AdminComponents/AdminAllCollectors';
import AdminAllSellers from 'src/components/AdminComponents/AdminAllSellers';
import AdminPageheader from 'src/components/AdminComponents/AdminPageheader';
import useAdminPrivate from 'src/hooks/useAdminPrivate';
import { defaultSellers } from 'src/utilities/constants';

const AdminCollectorsPage = () => {
 const adminPrivate = useAdminPrivate()
  const [allCollectors, setAllcollectors] = useState<any[]>(defaultSellers);
  const [searchValue, setSearchValue] = useState<string>("");
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [country, setCountry] = useState<string>("Everywhere");
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  console.log(searchValue);
  
  useEffect(() => {
    const fetchAllSellers = async () => {
      try {
        
        const response = await adminPrivate.get(
          `admin/collectors?limit=4&page=${page}&country=${country}`
        );
        setTotalPage(parseInt(response.data.data.page.split("of")[1]));
        const { collectors } = response.data.data;
        console.log(collectors)
        setAllcollectors(collectors);
        setIsFetching(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllSellers();
  }, [country, refresh, page]);

  useEffect(() => {
    const search = async () => {
      try {
        const response = await adminPrivate.get(
          `admin/search/collectors?search=${searchValue}`
        );
        const { data } = response.data;
        
        setAllcollectors(data.collectors);
      } catch (error) {}
    };
    if (searchValue !== "") {
      search();
    } else if (searchValue === "") {
      setRefresh(!refresh);
    }
  }, [searchValue]);
  console.log(page)
  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <AdminPageheader setSearchValue={setSearchValue} changeCountry={setCountry} country={country} title={"All Collectors"} />
      <Box
        sx={{
          display: "flex",
          
        }}
      >
        <AdminAllCollectors data={allCollectors} page={page} setPage={setPage} totalPage={totalPage} isFetching={isFetching}   setRefresh={setRefresh}/>
      </Box>
    </Box> )
}

export default AdminCollectorsPage