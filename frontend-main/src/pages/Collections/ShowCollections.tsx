import { Box, Typography } from '@mui/material'

import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { axiosPublic } from 'src/axios/axios'
import VisitorLayout from 'src/components/layouts/VisitorLayout'
import { CollectionType } from 'src/utilities/types'
import _ from "lodash"
import Collectionscard from 'src/components/cards/collectioncard'
import { Spinner } from '../Item'
import LINKS from 'src/utilities/links'
const ShowCollectionsPage = () => {
  const {id,firstname}= useParams()
  const [collection ,setCollection]=useState<CollectionType[]|null>(null)
  const [isFetching,setIsFetching]= useState<boolean>(true)
  const navigate = useNavigate()
  
  useEffect(()=>{
    const fetchCollection = async ()=>{
      try {
        const response = await axiosPublic.get(
          `duo/collector/seller-collections/${id}`
        );
        const { data } = response.data;
        setCollection(data);
      } catch (error) {
        
      }finally{
        setIsFetching(false)
      }
      
    }
    fetchCollection()
  },[])

  return (
    <VisitorLayout>
      <Box>
        {isFetching ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: "3rem" }}>
            {" "}
            <Spinner />
          </Box>
        ) : (
          <Box sx={{  mt: "3rem" }}>
            <Typography
              sx={{ fontSize: "3rem", fontWeight: "700", textAlign: "center" }}
            >{`${_.upperFirst(firstname)}'s Collections`}</Typography>

            <Box
              sx={{
                display: "grid",
                mt:"2rem",
                gridTemplateColumns: {
                  xs: " 1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                  xl: "repeat(3, 1fr)",
                },
                justifyContent: "center",
                rowGap: "2rem",
              }}
            >
              {collection?.map((collection, index) => (
                <Box component={"div"} onClick={()=>navigate(`${LINKS.singleCollectionpublic}/${id}?coll_id=${collection._id}`)}>
                  <Collectionscard
                    key={index}
                    collectionName={collection.name}
                    collectionItems={collection.coll_list}
                    bgColor="white"
                    cardtype='public'
                  />
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </VisitorLayout>
  );
}

export default ShowCollectionsPage