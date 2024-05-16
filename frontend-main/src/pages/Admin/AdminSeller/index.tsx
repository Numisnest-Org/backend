import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import AdminPageheader from "src/components/AdminComponents/AdminPageheader";
import AdminSellerCard from "src/components/AdminComponents/AdminCards/AdminSellerCard";
import AdminWrapper from "src/components/AdminComponents/Wrapper/AdminWrapper";
import useAdminPrivate from "src/hooks/useAdminPrivate";
import { defaultSellers } from "src/utilities/constants";
import { useNavigate } from "react-router-dom";
import AdminAllSellers from "src/components/AdminComponents/AdminAllSellers";
import { axiosPublic } from "src/axios/axios";

const AdminSellerPage = () => {
  const adminPrivate = useAdminPrivate()
  const [allSellers, setAllSellers] = useState<any[]>(defaultSellers);
  const [searchValue, setSearchValue] = useState<string>("");
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [country, setCountry] = useState<string>("Everywhere");
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  
  useEffect(() => {
    const fetchAllSellers = async () => {
      try {
        const response = await adminPrivate.get(
          `admin/sellers?limit=20&page=${page}&country=${country}`
        );
        setTotalPage(parseInt(response.data.data.page.split("of")[1]));
        const { sellers } = response.data.data;
          console.log(sellers)
        setAllSellers(sellers);
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
          `admin/search/sellers?search=${searchValue}`
        );
        const { data } = response.data;
        console.log(data)
        setAllSellers(data.sellers);
      } catch (error) {}
    };
    if (searchValue !== "") {
      search();
    } else if (searchValue === "") {
      setRefresh(!refresh);
    }
  }, [searchValue]);
  return (
    <Box >
      <AdminPageheader setSearchValue={setSearchValue} changeCountry={setCountry} country={country} title={"All Sellers"} />
      <Box
        sx={{
          display: "flex"
        }}
      >
        <AdminAllSellers data={allSellers} page={page} setPage={setPage} totalPage={totalPage} isFetching={isFetching} setRefresh={setRefresh} />
      </Box>
    </Box>
  );
};

export default AdminSellerPage;
