import { AddOutlined } from '@mui/icons-material';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { teal } from '@mui/material/colors';
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { axiosPublic } from 'src/axios/axios';
import ItemsCard from 'src/components/cards/ItemsCard';
import SellerCard from 'src/components/cards/SellerCard';
import VisitorLayout from 'src/components/layouts/VisitorLayout';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import LINKS from 'src/utilities/links';
import {
  CollectionType,
  SingleItemType,
  SingleSeller,
} from 'src/utilities/types';

const SingleCollectionPrivatePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const collectionId = queryParams.get('coll_id');
  const [data, setData] = useState<SingleSeller | undefined>(undefined);
  const [collectionData, setCollectionData] = useState<CollectionType | null>(
    null
  );
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
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
  const deleteCollection = async () => {
    try {
      setIsSubmitting(true);
      await axiosPrivate.delete(`seller/collection/drop/${collectionId}`);
      navigate(LINKS.sellerProfile);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <VisitorLayout>
      <Box
        sx={{
          display: 'flex',
          justifyContent: { xs: 'center', md: 'end ' },
          mt: '2rem',
        }}
      >
        <Button
          sx={{
            backgroundColor: '#D03531',
            color: 'white',
            padding: '0.5rem 1.8rem',
            borderRadius: '0.4rem',
            mt: '2rem',
          }}
          onClick={deleteCollection}
        >
          {isSubmitting ? (
            <CircularProgress
              size={'2rem'}
              sx={{
                color: 'white',
                height: '1rem',
                width: '1rem',
              }}
            />
          ) : (
            'Delete collection'
          )}
        </Button>
        {/* <SellerCard
          flag={data?.iso_code}
          url={data?.photo}
          name={`${data?.first_name} ${data?.last_name}`}
          selling={data?.about}
          id={data?._id}
        /> */}
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
        <Box>
          <Outlet />
        </Box>
      </Box>
    </VisitorLayout>
  );
};

export default SingleCollectionPrivatePage;
