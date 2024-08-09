import { AddOutlined } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { axiosPublic } from 'src/axios/axios';
import ItemsCard from 'src/components/cards/ItemsCard';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import LINKS from 'src/utilities/links';
import { CollectionType, SingleItemType } from 'src/utilities/types';

const PrivateCollectionDisplayPage = () => {
  const [collectionData, setCollectionData] = useState<CollectionType | null>(
    null
  );
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const collectionId = queryParams.get('coll_id');
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState<boolean>(true);
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
  }, [refresh]);

  return (
    <Box>
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', mt: '2rem' }}
      >
        {' '}
        <Typography> Add Items to your collection</Typography>{' '}
        <Typography
          component={'div'}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            color: '#0047AB',
            '&:hover': {
              cursor: 'pointer',
            },
          }}
          onClick={() =>
            navigate(
              `${LINKS.singleCollectionPrivate}/${id}/add?coll_id=${collectionId}`
            )
          }
        >
          Add Item <AddOutlined />
          {}
        </Typography>
      </Box>
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
            <Box
              sx={{ width: '100%' }}
              component={'div'}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              key={index}
            >
              <ItemsCard
                key={index}
                url={item?.photos?.[0]?.secure_url}
                currency={item.convertedCurrency}
                selling={item.name}
                createdAt={item.updatedAt}
                amount={item.convertedPrice}
                height="15.5rem"
                cardtype="Private"
                xsheight="12.5rem"
                remCollection={async () => {
                  try {
                    const response = await axiosPrivate.post(
                      `seller/collection/rem-item/${collectionId}`,
                      { item_id: item._id }
                    );
                    setRefresh(!refresh);
                    console.log(response);
                  } catch (error) {}
                }}
              />
            </Box>
          )
        )}
      </Box>
    </Box>
  );
};

export default PrivateCollectionDisplayPage;
