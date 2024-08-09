import { Box, Pagination, useTheme } from "@mui/material";
import React, { useState } from "react";
import { HomeItemType, SellerType, SingleItemType } from "src/utilities/types";
import ItemsCard from "../cards/ItemsCard";
import Adminitemscard from "./AdminCards/Adminitemscard";
import ConfirmationModal from "../Modal/are-you-sure";
import { ReportProblemRounded } from "@mui/icons-material";
import useAdminPrivate from "src/hooks/useAdminPrivate";
import { toast } from "react-toastify";
import { boolean } from "yup";
const AdminAllItems = ({
  isFetching,
  data,
  totalPage,
  page,
  setPage,
  setRefresh
}: {
  isFetching?: boolean;
  data?: any[];
  totalPage: number;
  page: number;
  setPage: (val: number) => void;
  setRefresh:(val:any)=>void
}) => {
  const theme = useTheme();
  const [isDisplayModal, setDisplayModal] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null | undefined>(null);
  const adminPrivate = useAdminPrivate()
  const deleteItem = async (id: string | null | undefined) => {
   try {
    console.log(id)
    const response =await adminPrivate.delete(`admin/remove/item/${id}`);
    console.log(response);
    
   toast("Item deleted", {
     position: "top-right",
     autoClose: 5000,
     hideProgressBar: false,
     closeOnClick: true,
     pauseOnHover: true,
     isLoading: false,
     type: "success",
     theme: "light",
     style: {},
   });
   setRefresh((prev:boolean)=>!prev)
   setDisplayModal(false)
   } catch (error:any) {
    toast(`${error.response.data.message.split(":")[1]}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      isLoading: false,
      type: "error",
      theme: "light",
      style: {},
    });
   }
  };
  console.log(data)
  return (
    <Box>
      {isDisplayModal && (
        <ConfirmationModal
          contentWidth={"400px"}
          closeModal={() => setDisplayModal(false)}
          itemId={selectedId}
          text="delete item"
          handleItem={deleteItem}
          icon={<ReportProblemRounded sx={{ color: " #D03531 ",fontSize:"4.5rem" }} />}
        />
      )}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(3, 1fr)",
            sm: "repeat(3, 1fr)",
            md: "repeat(4, 1fr)",
            lg: "repeat(6, 1fr)",
            xl: "repeat(6, 1fr)",
          },
          columnGap: {
            xs: "0.3rem",
            sm: "0.4rem",
            md: "0.8rem",
            lg: "0.9rem",
            xl: "2rem",
          },
          rowGap: "2rem",
          justifyItems: "center",
          position: "relative",
          mt: { xs: "2rem", sm: "3rem", md: "5rem" },
        }}
      >
        {data?.map((item: SingleItemType, index: number) => (
          <Adminitemscard
            key={index}
            flag={item?.iso_code}
            url={item?.photos?.[0].secure_url}
            firstName={item?.seller_info?.[0].first_name}
            lastName={item?.seller_info?.[0].last_name}
            selling={item?.name}
            createdAt={item?.createdAt}
            amount={item?.convertedPrice}
            isFetching={isFetching}
            currency={item?.convertedCurrency}
            id={item?._id}
            cardtype="Private"
            openModal={() => setDisplayModal(true)}
            setItemId={setSelectedId}
            pinned={item.pinned}
            setRefresh={setRefresh}
          />
        ))}
      </Box>

      <Pagination
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: { xs: "2rem", sm: "2rem", md: "4rem" },
          color: theme.palette.primary.light,
          "& .css-c8vooq-MuiButtonBase-root-MuiPaginationItem-root": {
            fontSize: "1.2rem",
            fontFamily: "poppin",
          },
          "& .Mui-selected": {
            backgroundColor: "rgba(0, 71, 171, 0.7)",
            color: "white",
          },
        }}
        size={"large"}
        shape={"circular"}
        variant={"outlined"}
        count={totalPage}
        page={page}
        onChange={(event, value) => setPage(value)}
      />
    </Box>
  );
};

export default AdminAllItems;
