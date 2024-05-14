import { Box, Button, FormControl, MenuItem, Paper, Select } from '@mui/material'
import React, { useEffect, useState } from 'react'
import TextInput from '../form-components/textInput';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import { SingleItemType } from 'src/utilities/types';
import { toast } from 'react-toastify';
import LINKS from 'src/utilities/links';
import { useNavigate } from 'react-router-dom';

const CreateCollectionForm = () => {
  const axiosPrivate = useAxiosPrivate()
  const [sellerItems,setSellerItems] =useState<SingleItemType []|null>(null)
  const [title,setTitle ] = useState<String>("")
  const [item,setItem ] = useState<String>("")
  const [isSubmitting,setIsSubmitting]=useState<boolean>(false)
  const navigate = useNavigate()
  
  useEffect (()=>{
    const fetchItems = async ()=>{
      
      try {
        
        const response = await axiosPrivate.get("seller/seller-items");
        const {data} = response.data
        setSellerItems(data.items)
      } catch (error) {
        
      }
      
    }
    fetchItems()
  },[])

  const createCollection =async()=>{
    try {
      setIsSubmitting(true);
      const response = await axiosPrivate.post("seller/collection/create",{name:title,item_id:item});
      console.log(response)
      toast("Collection Created", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        isLoading: false,
        type: "success",
        theme: "light",
        style: {},
      });
      navigate(LINKS.sellerProfile)
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
    }finally{
      setIsSubmitting(false);
    }
  }
  return (
    <Paper
      sx={{
        bgcolor: "white",
        py: "2rem",
        px: { xs: "1rem", sm: "2rem", md: "3rem", lg: "3.5rem", xl: "4rem" },
        mt: "4rem",
      }}
    >
      <Box sx={{ mt: "1.5rem" }}>
        <Box component={"label"}>Title of collection</Box>
        <TextInput
          fullWidth
          variant={"standard"}
          placeholder={"Enter collection title"}
          name="title"
          onChange={(e)=>setTitle(e.target.value )}
        />
      </Box>
      <Box sx={{display:"flex",justifyContent:"end",mt:"1rem"}}>
        <Button
          sx={{
            backgroundColor: "#0047AB",
            color: "white",
            padding: "0.5rem 3.8rem",
            borderRadius: "0.4rem",
            mt: "2rem",
          }}
          disabled= {isSubmitting}
          onClick={createCollection}
        >
          Create{" "}
        </Button>
      </Box>
    </Paper>
  );
}

export default CreateCollectionForm