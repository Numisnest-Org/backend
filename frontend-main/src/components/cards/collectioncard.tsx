import { Box, Typography } from '@mui/material';

import { SingleItemType } from 'src/utilities/types';
import { CustomSwitch } from '../AddItemsComponents/toggleISwitch';
import { useState } from 'react';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import { CardType } from './ItemsCard';
interface Props {
  collectionName: string;
  collectionItems: Partial<SingleItemType>[];
  collectionId?: string;
  bgColor?: string;
  hidden?: boolean;
  cardtype?: CardType;
}
const Collectionscard = ({
  collectionName,
  collectionItems,
  collectionId,
  hidden,
  bgColor,
  cardtype = 'Private',
}: Props) => {
  const images = collectionItems.map(
    (collectionnn: Partial<SingleItemType>) =>
      collectionnn?.firstPhoto?.secure_url
  );
  const axiosPrivate = useAxiosPrivate();
  const fillImages = (images: any[], count: number) => {
    const filledImages = Array.from({ length: count }, (_, index) =>
      index < images.length ? images[index] : null
    );
    return filledImages;
  };
  const filledImages = fillImages(images, 4);
  const [available, setAvailable] = useState<boolean>(!hidden);
  const handleCollectionAvailability = async () => {
    try {
      await axiosPrivate.put(`seller/collection/edit/${collectionId}`, {
        hidden: available,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Box
      sx={{
        backgroundColor: bgColor ? bgColor : '#F4F4F6',
        width: { xs: '15rem', lg: '20rem' },
        // height: { xs: "16rem", lg: "15rem", xl: "16rem" },
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderRadius: '0.6rem',
        px: '0.7rem',
        pb: '1rem',
        transition: 'all 0.3s ease-in-out allow-discrete',
        '&:hover': {
          boxShadow: ' 3px 5px 10px 0.7px rgba(0, 0, 0, .2)',
          cursor: 'pointer',
        },
      }}
    >
      <Typography
        sx={{
          fontSize: '1rem',
          pt: '1rem',
          textAlign: 'center',
        }}
      >
        {collectionName}{' '}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 0fr)',
          rowGap: '0rem',
          justifyContent: 'center',
          mt: '1rem',
        }}
      >
        {filledImages.map((image, index) => (
          <Box
            key={index}
            sx={{
              width: { xs: '4.5rem', lg: '5rem', xl: '6rem' },
              aspectRatio: '1',
              border: { xs: '1px solid #fff', md: '2px solid #fff' },
              // backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundColor: '#D8E8FF',
            }}
          >
            <img
              src={image}
              style={{
                width: '100%',
                height: '100%',
                paddingTop: '10px',
                paddingBottom: '10px',
                paddingRight: '5px',
                paddingLeft: '5px',
              }}
              alt=""
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Collectionscard;
