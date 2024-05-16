import { BarChart } from '@mui/icons-material';
import { Box, Typography } from '@mui/material'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Barchart from 'src/components/AdminComponents/DashboardComponents/Barchart';
import Doenutchart from 'src/components/AdminComponents/DashboardComponents/Doenutchart';
import Overview from 'src/components/AdminComponents/DashboardComponents/Overview';
import ContactusTable from 'src/components/AdminComponents/Table/ContactusTable';
import TopSellers from 'src/components/AdminComponents/Table/TopSellers';
import useAdminPrivate from 'src/hooks/useAdminPrivate';
import useAppContext from 'src/hooks/useAppContext'
import { Contactus, SellerType, WebsiteOverview } from 'src/utilities/types';


const AdminDashBoardPage = () => {
  const navigate = useNavigate()
  const {state} = useAppContext()
  const adminPrivate = useAdminPrivate()
  const [topSellers,setTopSellers]= useState<SellerType[]>()
  const [itemCategory,setItemCategory]= useState<any[]>([])
  const [websiteOverview,setWebsiteOverview] = useState<WebsiteOverview|undefined>(undefined)
  const [contactusMessages, setContactusMessages] = useState<
    Contactus[] | undefined
  >(undefined);
    const [isFetching, setIsFetching] = useState<boolean>(true);
  useEffect(() => {
    const fetchAll = async () => {
      try {
        

        const [adminOverviewResponse, topSellerResponse, itemcategoryResponse,allmesagesResponse] =
          await Promise.all([
            adminPrivate.get(`admin/overview`),
            adminPrivate.get(`admin/topsellers`),
            adminPrivate.get(`admin/itemspie`),
            adminPrivate.get("admin/contactus/messages")
          ]);
        const {data:overview} =adminOverviewResponse.data
        
        const {data :topseller}= topSellerResponse.data
        const {data:itemcateg} = itemcategoryResponse.data
        const {data:allmesages} = allmesagesResponse.data
        setWebsiteOverview(overview)
        setTopSellers(topseller)
        setItemCategory(itemcateg)
        setContactusMessages(allmesages)
        setIsFetching(false)
      //   setAllSellers(sellers);
      //   setAllItems(items);
      //   setIsFetching(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAll();
  }, []);
  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Box sx={{ display: "flex" }}>
        <Overview data={websiteOverview} />
      </Box>
      <Box sx={{ mt: "2rem", display: "flex" }}>
        <TopSellers data={topSellers} />
        {!isFetching && <Doenutchart data={itemCategory} />}
      </Box>

      <Box sx={{ mt: "2.5rem", mb: "2rem" }}>
        <Box sx={{display:"flex",justifyContent:"space-between"}}>
          <Typography
            sx={{
              color: "#0047AB",
              fontSize: "1.5rem",
              fontWeight: "bold",
             
            }}
            component={"div"}
           
          >
           Resent Messages
          </Typography>
          <Typography
            sx={{
              color: "#0047AB",
              fontSize: "1.5rem",
              fontWeight: "bold",
              ml: "0.5rem",
              "&:hover": {
                cursor: "pointer",
              },
            }}
            component={"div"}
            onClick={() => navigate("/admincontactus/table")}
          >
            See all{" "}
          </Typography>
        </Box>
        <ContactusTable data={contactusMessages} fin={3} />
      </Box>
    </Box>
  );
}

export default AdminDashBoardPage