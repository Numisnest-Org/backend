import { Box, Paper, Typography } from '@mui/material';
import React from 'react';
import { CollectionType } from 'src/utilities/types';
import Collectionscard from '../cards/collectioncard';
import { AddOutlined } from '@mui/icons-material';
import LINKS from 'src/utilities/links';
import { useNavigate } from 'react-router-dom';
interface Props {
  data?: CollectionType[] | null;
  sellerId?: string;
}
const EditCollection = ({ data, sellerId }: Props) => {
  const navigate = useNavigate();
  return (
    <Box sx={{ mt: '4rem' }}>
      <Typography
        sx={{
          fontSize: '3rem',
          fontWeight: 700,
          mr: '2rem',
          mb: '0.5rem',
          color: '#0047AB',
        }}
      >
        Collections
      </Typography>
      <Box
        sx={{
          display: 'grid',

          gridTemplateColumns: {
            xs: ' 1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
            xl: 'repeat(3, 1fr)',
          },
          justifyContent: 'center',
          rowGap: '2.5rem',
          position: 'relative',
        }}
      >
        {data?.map((collection, index) => (
          <Box
            component={'div'}
            onClick={() =>
              navigate(
                `${LINKS.singleCollectionPrivate}/${sellerId}/display?coll_id=${collection._id}`
              )
            }
          >
            <Collectionscard
              key={index}
              collectionName={collection.name}
              collectionItems={collection.coll_list}
              collectionId={collection._id}
              hidden={collection.hidden}
              bgColor="white"
            />
          </Box>
        ))}
        <Box
          sx={{ display: 'flex', alignItems: 'end', justifyContent: 'center' }}
        >
          <Box
            component={'div'}
            onClick={() => navigate(LINKS.createCollection)}
            sx={{
              backgroundColor: 'white',
              width: { xs: '18rem', lg: '18rem', xl: '23rem' },
              height: '15rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              border: '4px solid black',
              justifyContent: 'center',
              px: '0.7rem',
              pb: '1rem',
              padding: '2.5rem',
              transition: 'all 0.3s ease-in-out allow-discrete',
              '&:hover': {
                boxShadow: ' 3px 5px 10px 0.7px rgba(0, 0, 0, .2)',
                cursor: 'pointer',
              },
            }}
          >
            <Typography sx={{ fontSize: '2rem', textAlign: 'center' }}>
              Add a new collection{' '}
            </Typography>
            <AddOutlined sx={{ fontSize: '4rem' }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EditCollection;
