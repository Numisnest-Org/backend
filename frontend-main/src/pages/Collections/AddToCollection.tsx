import { Box, Button, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ItemsCard from 'src/components/cards/ItemsCard';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import LINKS from 'src/utilities/links';
import { GroupItems, SingleItemType } from 'src/utilities/types';

const AddToCollectionPage = () => {
  const [items, setItems] = useState<GroupItems[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const collectionId = queryParams.get('coll_id');
  const axiosPrivate = useAxiosPrivate();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const {id} = useParams()
  console.log(collectionId);
  useEffect(() => {
    const fetchCollectionItems = async () => {
      try {
        const response = await axiosPrivate.get(`seller/seller-items`);
        const { data } = response.data;
        console.log(data);
        setItems(data.items);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCollectionItems();
  }, []);

  const handleSelect = (itemId: string | undefined) => {
    
    if (itemId) {
      const newItemId = itemId || '';

      if (selectedItems.includes(itemId)) {
        const newSelectedItems = selectedItems.filter((id) => id !== newItemId);
        setSelectedItems(newSelectedItems);
        return;
      }
      setSelectedItems((prev) => [...prev, newItemId]);
    }
  };
  const addToCollection = async () => {
    console.log(selectedItems)
    try {
      setIsSubmitting(true);
      const response = await axiosPrivate.post(
        `seller/collection/add-item/${collectionId}`,
        { item_id_arr: selectedItems }
      );
      console.log(response);
      toast('Added to Collection', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        isLoading: false,
        type: 'success',
        theme: 'light',
        style: {},
      });
      navigate(LINKS.sellerProfile);
    } catch (error: any) {
      toast(`${error.response.data.message.split(':')[1]}`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        isLoading: false,
        type: 'error',
        theme: 'light',
        style: {},
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  console.log(items)
  console.log(selectedItems);
  return (
    <Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(3, 1fr)',
            md: 'repeat(4, 1fr)',
            lg: 'repeat(6, 1fr)',
          },
          gap: { xs: '0.4rem', sm: '1rem' },
          position: 'relative',
          mt: { xs: '2.5rem', md: '4rem' },
          justifyItems: 'center',

          pb: '1rem',
        }}
      >
        {items?.map((item: any, indexx: number) => (
          <Box key={indexx} sx={{ width: '100%' }}>
            <Box
              component={'div'}
              onClick={(e) => {
                handleSelect(item?._id);
                e.preventDefault();
              }}
              key={indexx}
            >
              <ItemsCard
                key={indexx}
                url={item?.photos?.[0].secure_url}
                currency={item.convertedCurrency}
                selling={item?.name}
                createdAt={item.updatedAt}
                amount={item.convertedPrice}
                height="15.5rem"
                bgColor="#F4F4F6"
                cardtype="Private"
                selected={item?._id ? selectedItems.includes(item?._id) : false}
                // openModal={() => setDisplayModal(true)}
                // setItemId={setSelectedId}
              />
            </Box>
          </Box>
        ))}
      </Box>
      <Box
        component={'div'}
        sx={{ display: 'flex', justifyContent: 'flex-end', mt: '2rem' }}
      >
        <Button
          sx={{
            backgroundColor: '#0047AB',
            color: 'white',
            padding: '0.5rem 1.8rem',
            borderRadius: '0.4rem',
            mt: '2rem',
          }}
          onClick={addToCollection}
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
            'Add to collection'
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default AddToCollectionPage;
