import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import EditCollection from 'src/components/SellerProfileComponents/EditCollection'
import VisitorLayout from 'src/components/layouts/VisitorLayout'
import useAxiosPrivate from 'src/hooks/useAxiosPrivate'
import useScrollToTop from 'src/hooks/useScrolllToTop'
import { CollectionType } from 'src/utilities/types'

const EditCollectionPage = () => {
  useScrollToTop()
  const axiosPrivate =useAxiosPrivate()
  const [collectionData, setCollectionData] = useState<CollectionType[]|null>();
 
  useEffect (()=>{
    const fetchCollections = async ()=>{
      try {
        const response = await axiosPrivate.get(`seller/collection/fetch`);
        const {data}= response?.data
        setCollectionData(data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchCollections()
  },[])
  return (
    <VisitorLayout>
      <EditCollection  data={collectionData}  sellerId={collectionData?.[0].seller_id} />
    </VisitorLayout>
  )
}

export default EditCollectionPage