import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import AllSellerItems from "src/components/AllSellerItems/SellerItems";
import SellerCard from "src/components/cards/SellerCard";
import VisitorLayout from "src/components/layouts/VisitorLayout";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import useScrollToTop from "src/hooks/useScrolllToTop";
import { SingleItemType, SingleSeller } from "src/utilities/types";

const AllSellerItemsPrivatePage = () => {
  useScrollToTop();
  const [data, setData] = useState<SingleSeller | undefined>(undefined);
  const [sellerItem, setSellerItem] = useState<SingleItemType[] | null>(null);
  const axiosPrivate = useAxiosPrivate()
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const seralizedCategories = selectedCategories.join(",");
   const [page, setPage] = useState<number>(1);
   const [totalPage, setTotalPage] = useState<number>(1);
   const [country, setCountry] = useState<string>("Everywhere");
   const [searchValue, setSearchValue] = useState<string>("");
   const [refresh, setRefresh] = useState<boolean>(false);
   console.log(totalPage)
  useEffect(() => {
    const getsellerProfile = async () => {
      try {
        const reponse = await axiosPrivate.get(`seller/profile/fetch`);
       
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
        const reponse = await axiosPrivate.get(
          `seller/seller-items?page=${page}&limit=48&category=${seralizedCategories}&country=${country}`
        );
         setTotalPage(parseInt(reponse.data.data.page.split("of")[1]));
        const { data: sellerItems } = reponse.data;
        setSellerItem(sellerItems.items);
      } catch (error) {}
    };
    fetchSellerItems();
  }, [page,selectedCategories,country,refresh]);

  useEffect(() => {
    const search = async () => {
      try {
        const response = await axiosPrivate.get(
          `seller/seller-items/search?search=${searchValue}`
        );
        console.log(response);
        const { data: sellerItems } = response.data;
        setSellerItem(sellerItems.items);
      } catch (error) {}
    };
    if (searchValue !== "") {
      search();
    } else if (searchValue === "") {
      setRefresh(!refresh);
    }
  }, [searchValue]);
  return (
    <VisitorLayout>
      <Box sx={{ display: "flex", justifyContent: "end", mt: "2rem" }}>
        <SellerCard
          flag={data?.iso_code}
          url={data?.photo.secure_url}
          name={`${data?.first_name} ${data?.last_name}`}
          selling={data?.about}
          id={data?._id}
          
        />
      </Box>
      <AllSellerItems sellerName={data?.first_name} data={sellerItem} type="Private" selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} page={page} setPage={setPage} totalPage={totalPage} setCountry={setCountry} countryValue={country} setSearchValue={setSearchValue} setRefresh={setRefresh} refresh={refresh}/>
    </VisitorLayout>
  );
};

export default AllSellerItemsPrivatePage;
