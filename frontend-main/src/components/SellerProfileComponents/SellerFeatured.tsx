import { Box, Button, Paper, Typography, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { axiosPublic } from 'src/axios/axios';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import { Spinner } from 'src/pages/Item';
import { SingleSeller, SingleSellerFeaturedItem } from 'src/utilities/types';
import ItemsCard from '../cards/ItemsCard';
import { AddIcon } from '../Icons/icons';
import { EditNoteOutlined } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import LINKS from 'src/utilities/links';
interface Props {
  id?: string;
}
const SellerFeatured = ({ id }: Props) => {
  const style = {
    link: {
      textDecoration: 'none',
      color: 'white',
    },
  };
  const isMobile = useMediaQuery('(max-width: 1105px)');
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [featured, setFeatured] = useState<SingleSellerFeaturedItem[] | null>(
    null
  );
  const isNotMobileScreens = useMediaQuery('(min-width:600px)');
  useEffect(() => {
    const fetchSellerFeatured = async () => {
      try {
        if (id) {
          const response = await axiosPublic.get(`seller/featured/fetch`);
          const { data }: { data: any } = response.data;
          setFeatured(data?.[0].featured_items);
        } else {
          setFeatured(null);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSellerFeatured();
  }, [id]);

  if (!id) {
    return <Spinner />;
  }

  return (
    <Box sx={{ paddingTop: { xs: '2rem', md: '2.5rem' }, mb: '3rem' }}>
      {featured?.[0] ? (
        <Box
          sx={{
            paddingRight: { xs: '12px', md: '40px' },
            paddingLeft: { xs: '12px', md: '40px' },
            paddingBottom: { xs: '1.8rem', md: '2.8rem' },
            pt: { xs: '1.5rem', sm: '2rem' },
            bgcolor: 'hsla(215, 100%, 92%, 1)',
            boxShadow: '1px 2px 2px #0000',
            borderRadius: '4px',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              pr: '1rem',
            }}
          >
            <Typography
              variant={'h5'}
              sx={{
                fontWeight: 700,
                mr: '2rem',
                mb: '0.5rem',
                fontSize: { xs: '18px', md: '28px' },
              }}
            >
              Featured
            </Typography>
            <Button
              sx={{
                backgroundColor: '#0047AB',
                color: 'white',
                padding: {
                  xs: '0.5rem 2rem',
                  sm: '0.5rem 2.5rem',
                  md: '0.5rem 2.5rem',
                },
                mb: '1rem',
                borderRadius: '0.4rem',
                '&:hover': {
                  backgroundColor: '#1166dc',
                },
              }}
            >
              <Link to={LINKS.featured} style={style.link}>
                Edit <EditNoteOutlined />
              </Link>
            </Button>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(6, 130px)',
                md: 'repeat(6, 1fr)',
              },
              justifyItems: 'center',
              gap: { xs: '0.6rem', sm: '1rem', md: '1.2rem' },
              overflow: isMobile ? 'scroll' : 'unset',
            }}
          >
            {featured
              .slice(0, 6)
              .map((item: SingleSellerFeaturedItem, index: number) => (
                <ItemsCard
                  key={index}
                  url={item?.photos?.[0].secure_url}
                  selling={item?.name}
                  amount={item?.price}
                  currency={'usd'}
                  bgColor="#F4F4F6"
                  height="15.5rem"
                  id={item._id}
                  xsheight="12.5rem"
                />
              ))}
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: '5rem' }}>
          <Typography
            variant={'h5'}
            sx={{
              fontWeight: 700,
              mr: '2rem',
              mb: '0.5rem',
              fontSize: { xs: '18px', md: '28px' },
            }}
          >
            Featured{' '}
          </Typography>
          <Box>
            <AddIcon
              height={10}
              width={10}
              onClick={() => navigate(LINKS.featured)}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SellerFeatured;
