import React from 'react';
import { AddIcon } from '../Icons/icons';
import { Box, Button, Paper, Typography, useMediaQuery } from '@mui/material';
import { CollectionType } from 'src/utilities/types';
import { dark } from '@mui/material/styles/createPalette';
import Collectionscard from '../cards/collectioncard';
import { EditNoteOutlined } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import LINKS from 'src/utilities/links';

interface Props {
  data?: CollectionType[] | null;
  sellerId?: string;
}

const SellerCollection = ({ data, sellerId }: Props) => {
  console.log(data);
  const navigate = useNavigate();
  const isNotMobileScreens = useMediaQuery('(min-width:600px)');
  const style = {
    link: {
      textDecoration: 'none',
      color: 'white',
    },
  };
  return (
    <Box component={'div'}>
      {data?.[0] ? (
        <Box
          sx={{
            p: '1.2rem',
            backgroundColor: '#fff',
            boxShadow: '1px 2px 2px #0000',
            borderRadius: '4px',
            overflow: { xs: 'scroll', lg: 'unset' },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: '1rem',
            }}
          >
            <Typography
              variant={'h5'}
              sx={{
                fontWeight: 700,
                mr: '2rem',
                mb: '0.5rem',
                fontSize: { xs: '18px', md: '28px' },
                color: '#0047ab',
              }}
            >
              Collection
            </Typography>

            <Button
              sx={{
                backgroundColor: '#0047AB',
                color: 'white',
                cursor: 'pointer',
                padding: {
                  xs: '0.5rem 2rem',
                  sm: '0.5rem 2.5rem',
                  md: '0.5rem 2.5rem',
                },
                borderRadius: '0.4rem',
                '&:hover': {
                  backgroundColor: '#1166dc',
                },
              }}
            >
              <Link to={LINKS.editCollection} style={style.link}>
                Edit <EditNoteOutlined />
              </Link>
            </Button>
          </Box>

          <Box
            sx={{
              width: '100%',
              margin: '0 auto',
              overflow: { xs: 'scroll', lg: 'unset' },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: '1rem',
              }}
            >
              {data?.slice(0, 3).map((collection, index) => (
                <Box
                  component={'div'}
                  onClick={() =>
                    navigate(
                      `${LINKS.singleCollectionpublic}/${sellerId}?coll_id=${collection._id}`
                    )
                  }
                >
                  <Collectionscard
                    key={index}
                    collectionName={collection.name}
                    collectionItems={collection.coll_list}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mt: '5rem',
            color: '#0047AB',
          }}
        >
          <Typography
            variant={isNotMobileScreens ? 'h1' : 'h2'}
            sx={{ fontWeight: 700, mr: '4rem' }}
          >
            Collection
          </Typography>
          <Box>
            <AddIcon
              height={60}
              width={60}
              color="#0047AB"
              onClick={() => navigate(LINKS.createCollection)}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SellerCollection;
