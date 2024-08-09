import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton, useTheme } from "@mui/material";
import { Close } from "@mui/icons-material";
import ModalWrapper from "./ModalWrapper";
import EditItems from "../forms/edit-Item-form";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { SingleItemType } from "src/utilities/types";
import { Spinner } from "src/pages/Item";

type Props = {
  closeModal?: () => void;
  contentWidth?: string;
  itemId?: string | null;
  setRefresh?:(val:boolean)=>void 
  refresh?:boolean
};

const EditItemsModal = ({ closeModal, contentWidth, itemId,setRefresh,refresh }: Props) => {
  const theme = useTheme();
  const axiosPrivate = useAxiosPrivate();
  const [isFetching ,setIsFetching]=useState<boolean>(true)
  const [singleItem, setSingleItem] = useState<SingleItemType | undefined>(undefined);
  useEffect(() => {
    const getItem = async () => {
      try {
        const response = await axiosPrivate.get(`seller/seller-item/${itemId}`);
        const { data } = response?.data;
        setSingleItem(data?.[0]);
      } catch (error) {
        
      }finally{
        setIsFetching(false)
      }
      
    };
    getItem();
  }, []);

  return (
    <ModalWrapper contentWidth={contentWidth}>
      <IconButton
        onClick={() => typeof closeModal !== "undefined" && closeModal()}
        sx={{
          position: "absolute",
          right: "8px",
          top: "8px",
        }}
      >
        <Close />
      </IconButton>
      <Box sx={{}}>
        {isFetching ? (
          <Box>
            <Spinner />{" "}
          </Box>
        ) : (
          <EditItems data={singleItem} id={itemId} closeModal={closeModal} setRefresh={setRefresh} refresh= {refresh} />
        )}
      </Box>
    </ModalWrapper>
  );
};

export default EditItemsModal;
