import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import AdminEditsellerForm from 'src/components/AdminComponents/Forms/admin-edit-seller'
import useAdminPrivate from 'src/hooks/useAdminPrivate'
import { Spinner } from 'src/pages/Item'
import { SingleSeller, singleSellerWOFeatured } from 'src/utilities/types'

const AdminEditSeller = () => {
  const adminPrivate = useAdminPrivate()
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sellerId = queryParams.get("seller_id");
  const [data,setData]= useState<singleSellerWOFeatured|undefined>()
  const [isFetching,setIsFetching]= useState<boolean>(true)
  useEffect(()=>{
    const getSeller =async()=>{
      try {
        const response = await adminPrivate.get(
          `admin/seller/profile/${sellerId}`
        );
        console.log(response)
        const {data }= response.data
        setData(data)
      } catch (error) {
        
      }finally{
        setIsFetching(false)
      }
    }
    getSeller()
  },[])
  return (
    <Box>
      {isFetching ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: "4rem" }}>
          <Spinner />
        </Box>
      ) : (
        <AdminEditsellerForm data={data} SellerId={sellerId} />
      )}
    </Box>
  );
}

export default AdminEditSeller