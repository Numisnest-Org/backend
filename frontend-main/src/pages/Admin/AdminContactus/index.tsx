import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Admincontactusheader from 'src/components/AdminComponents/Admincontactusheader'
import ContactusTable from 'src/components/AdminComponents/Table/ContactusTable'
import useAdminPrivate from 'src/hooks/useAdminPrivate'
import { Contactus } from 'src/utilities/types'

const AdminContactusPage = () => {
  const adminPrivate = useAdminPrivate()
  const [contactusMessages ,setContactusMessages]= useState<Contactus[]|undefined>(undefined)
  
  useEffect(()=>{
    const fetchcontactmessages = async()=>{
      try {
        const response = await adminPrivate.get("admin/contactus/messages");
        console.log(response)
        const {data}= response.data
        setContactusMessages(data)
      } catch (error) {
        
      }
    }
    fetchcontactmessages()
  },[])
  return (
    <Box>
      <Admincontactusheader />
      <Box sx={{mt:"2rem"}}>
        <ContactusTable data={contactusMessages} />
      </Box>
    </Box>
  );
}

export default AdminContactusPage