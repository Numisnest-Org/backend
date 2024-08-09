import { Box, Button, Typography } from '@mui/material';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import LINKS from 'src/utilities/links';
import { SingleItemType } from 'src/utilities/types';
import editIcon from '../../assets/Image/edit.png';
import rotateIcon from '../../assets/Image/rotate.png';
import humanIcon from '../../assets/Image/setting.png';
import { CardType } from './ItemsCard';
interface Props {
  collectionName: string;
  collectionItems: Partial<SingleItemType>[];
  collectionId?: string;
  bgColor?: string;
  hidden?: boolean;
  cardtype?: CardType;
  sellerId?: string;
  setShowDeletemodal?: (value: boolean) => void;
  setSelectedId?: (value: string | null | undefined) => void;
}

const Collectionscard = ({
  collectionName,
  collectionItems,
  collectionId,
  hidden,
  bgColor,
  cardtype = 'Private',
  sellerId,
  setShowDeletemodal,
  setSelectedId,
}: Props) => {
  const images = collectionItems.map(
    (collectionnn: Partial<SingleItemType>) =>
      collectionnn?.firstPhoto?.secure_url
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const axiosPrivate = useAxiosPrivate();
  const fillImages = (images: any[], count: number) => {
    const filledImages = Array.from({ length: count }, (_, index) =>
      index < images.length ? images[index] : null
    );
    return filledImages;
  };
  const navigate = useNavigate();
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
  const editCollection = [
    {
      title: 'Add Items',
      icon: rotateIcon,
      func: () =>
        navigate(
          `${LINKS.singleCollectionPrivate}/${sellerId}/display?coll_id=${collectionId}`
        ),
    },
    {
      title: 'Edit Collection',
      icon: editIcon,
      func: () =>
        navigate(
          `${LINKS.singleCollectionPrivate}/${sellerId}/display?coll_id=${collectionId}`
        ),
    },
    {
      title: 'Hide Collection',
      icon: editIcon,
      func: handleCollectionAvailability,
    },
    {
      title: 'Delete Collection',
      icon: editIcon,
      func: () =>
        typeof setShowDeletemodal !== 'undefined' && setShowDeletemodal(true),
    },
  ];
  return (
    <Box
      sx={{
        backgroundColor: bgColor ? bgColor : '#F4F4F6',
        width: { xs: '15rem', lg: '20rem' },
        height: '100%',
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
      {cardtype === 'Private' && (
        <Box sx={{ position: 'relative', width: '80px' }}>
          <Box sx={{ position: 'relative', width: '' }}>
            <Button
              className="blue-btn"
              sx={{
                position: 'absolute',
                top: 50,

                display: 'flex',
                backgroundColor: '#0047AB',
                color: '#F9FAFA',
                height: { xs: '30px', md: '34px' },
                lineHeight: '1.5',
                fontSize: '0.7rem',
                zIndex: '1',
                '&:hover': {
                  backgroundColor: '#1166dc',
                },
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                typeof setSelectedId !== 'undefined' &&
                  setSelectedId(collectionId);
                setIsOpen(!isOpen);
              }}
            >
              <img style={{ width: '20px' }} src={humanIcon} alt="human icon" />{' '}
              Manage collection
            </Button>
            {isOpen && (
              <ul
                className="drop-down collection-drop-down"
                style={{ paddingInline: '10px', left: '5px' }}
              >
                {/* <Box
                  sx={{ display: 'flex', justifyContent: 'flex-end' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                >
                  <img
                    style={{
                      width: '20px',
                      height: '20px',
                      aspectRatio: '1',
                      cursor: 'pointer',
                    }}
                    src={closeIcon}
                    alt="close icon"
                  />
                </Box> */}
                {editCollection.map((item, i) => (
                  <li
                    style={{ color: '#fff', fontSize: '9px' }}
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      typeof item.func !== 'undefined' && item.func();
                      setIsOpen(false);
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      {item.title}
                    </Box>
                  </li>
                ))}
              </ul>
            )}
          </Box>
        </Box>
      )}
      <Typography
        sx={{
          fontSize: '16px',
          fontWeight: '700',
          pt: '0.5rem',
          textAlign: 'center',
        }}
        className="line-clamp"
      >
        {collectionName}{' '}
      </Typography>
      <hr />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          rowGap: '0rem',
          justifyContent: 'center',
          my: '0.5rem',
          alignItems: 'center',
        }}
      >
        {filledImages.map((image, index) => (
          <Box
            key={index}
            sx={{
              position: 'relative',
              paddingBottom: '100%',
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
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                padding: '0.2rem',
                objectFit: 'cover',
              }}
              alt=""
            />
          </Box>
        ))}
      </Box>

      <Typography
        sx={{
          textAlign: 'center',
          position: 'absolute',
          bottom: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          fontWeight: '700',
        }}
      >
        {' '}
        {collectionItems.length} Items
      </Typography>
    </Box>
  );
};

export default Collectionscard;
