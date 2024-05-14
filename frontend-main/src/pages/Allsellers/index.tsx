import SellersComponents from "src/components/AlllSellersCompnents";
import VisitorLayout from "src/components/layouts/VisitorLayout";
import Image from "src/components/Image";
import group2 from "src/assets/Image/Group 2.png";
import { useCallback, useEffect, useState } from "react";
import { axiosPublic } from "src/axios/axios";
import { defaultSellers } from "src/utilities/constants";
import { Seller, SellerType } from "src/utilities/types";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

const AllSellers = ({}) => {
  const [allSellers, setAllSellers] =
    useState<any[]>(defaultSellers);
  const [searchValue, setSearchValue] = useState<string>("");
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [country, setCountry] = useState<string>("Everywhere");
  const navigate = useNavigate()
  const [refresh ,setRefresh ]= useState<boolean>(false)
  const [page,setPage]=useState<number>(1)
  const [totalPage,setTotalPage]= useState<number>(1)
  useEffect(() => {
    const fetchAllsellers = async () => {
      try {
        setIsFetching(true);
        console.log("working...");
        const response = await axiosPublic.get(
          `duo/collector/get-sellers?page=${page}&limit=24&country=${country}`
        );
       
        setTotalPage(parseInt(response.data.data.page.split("of")[1]));
        const { sellers } = response.data.data;
        console.log(sellers);
        
        setAllSellers(sellers);
        setIsFetching(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllsellers();
     
  }, [country,refresh,page]);

  console.log(page )
  useEffect(()=>{
    const search= async()=>{
      try {
         const response = await axiosPublic.get(
           `duo/collector/search/sellers?search=${searchValue}`
         );
         const {data}= response.data
         setAllSellers(data)
      } catch (error) {
        
      }
    }
    if (searchValue !== ""){
      search();
    }else if (searchValue === ""){
      setRefresh(!refresh)
    }
    
  },[searchValue])
 
  

  return (
    <VisitorLayout>
      <SellersComponents
        isFetching={isFetching}
        data={allSellers}
        changeCountry={setCountry}
        setSearchValue={setSearchValue}
        totalPage={totalPage}
        page={page}
        setPage={setPage}
      />
      <Image
        src={group2}
        alt="group"
        sx={{
          width: "8rem",
          height: "8rem",
          position: "absolute",
          zIndex: -1,
          right: 0,
          top: 300,
        }}
      />
      <Image
        src={group2}
        alt="group"
        sx={{
          width: "10rem",
          height: "10rem",
          position: "absolute",
          zIndex: -1,
          left: 16,
          bottom: 50,
        }}
      />
    </VisitorLayout>
  );
};
export default AllSellers;
