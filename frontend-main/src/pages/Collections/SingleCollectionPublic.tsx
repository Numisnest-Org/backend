import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { axiosPublic } from 'src/axios/axios';
import ItemsCard from 'src/components/cards/ItemsCard';
import SellerCard from 'src/components/cards/SellerCard';
import VisitorLayout from 'src/components/layouts/VisitorLayout';
import {
  CollectionType,
  SingleItemType,
  SingleSeller,
} from 'src/utilities/types';

const SingleCollectionPublic = () => {
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const collectionId = queryParams.get('coll_id');
  const [data, setData] = useState<SingleSeller | undefined>(undefined);
  const [collectionData, setCollectionData] = useState<CollectionType | null>(
    null
  );

  useEffect(() => {
    const getsellerProfile = async () => {
      try {
        const reponse = await axiosPublic.get(`duo/collector/get-seller/${id}`);
        const { data: sellerProfile } = reponse.data;
        setData(sellerProfile);
      } catch (error) {
        console.log(error);
      }
    };
    getsellerProfile();
  }, []);

  useEffect(() => {
    const fetchCollectionItems = async () => {
      try {
        const response = await axiosPublic.get(
          `duo/collector/seller-collection/${id}?coll_id=${collectionId}`
        );
        const { data } = response.data;
        setCollectionData(data?.[0]);
      } catch (error) {}
    };
    fetchCollectionItems();
  }, []);

  return (
    <VisitorLayout>
      <Box
        sx={{
          display: 'flex',
          justifyContent: { xs: 'center', md: 'end ' },
          mt: '2rem',
        }}
      >
        <SellerCard
          flag={data?.iso_code}
          url={data?.photo.secure_url}
          name={`${data?.first_name} ${data?.last_name}`}
          selling={data?.about}
          id={data?._id}
        />
      </Box>

      <Box sx={{ mt: '2rem' }}>
        <Typography
          sx={{
            fontSize: { xs: '1.2rem', lg: '2rem' },
            fontWeight: '700',
            textAlign: 'center',
            mt: '0.5rem',
          }}
        >
          {collectionData?.name}
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(3, 1fr)',
              md: 'repeat(4, 1fr)',
              lg: 'repeat(6, 1fr)',
              xl: 'repeat(6, 1fr)',
            },
            columnGap: { xs: '0.5rem', lg: '0.9rem', xl: '2rem' },
            rowGap: '2rem',
            justifyItems: 'center',
            position: 'relative',
            pb: '1rem',
            mt: '2rem',
          }}
        >
          {collectionData?.coll_list?.map(
            (item: Partial<SingleItemType>, index: number) => (
              <ItemsCard
                key={index}
                url={item?.photos?.[0]?.secure_url}
                currency={item.convertedCurrency}
                selling={item.name}
                createdAt={item.updatedAt}
                amount={item.convertedPrice}
                height="15.5rem"
                xsheight="12.5rem"
                id={item._id}
              />
            )
          )}
        </Box>
      </Box>
    </VisitorLayout>
  );
};

export default SingleCollectionPublic;
