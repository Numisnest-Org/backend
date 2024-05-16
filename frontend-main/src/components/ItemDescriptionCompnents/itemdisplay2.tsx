import { Box, Button, IconButton, useMediaQuery } from '@mui/material';
import { FlashAuto, Height, ZoomOutMapOutlined } from '@mui/icons-material';
import money from 'src/assets/Image/money.png';
import nora from 'src/assets/Image/nora.jpg';
import jenny from 'src/assets/Image/jenny.jpg';
import Image from '../Image';
import video from 'src/assets/Image/video.mp4';
import { BorderClear } from '@mui/icons-material';
import SimpleBar from 'simplebar-react';
import { Fragment, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import videotag from 'src/assets/Image/videotag.png';
import ImageZoom from '../Modal/image-zoom';
import { Photo } from 'src/utilities/types';
import humanIcon from '../../assets/Image/human.png';
import rotateIcon from '../../assets/Image/rotate.png';
import editIcon from '../../assets/Image/edit.png';
import closeIcon from '../../assets/Image/close.png';
import eyesIcon from '../../assets/Image/eyes.png';
import deleteIcon from '../../assets/Image/delete.png';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import useAppContext from 'src/hooks/useAppContext';

interface Props {
  arr: any[];
  sellerId?: string;
  itemId?: string;
  setShowEdit: (value: boolean) => void;
  showEdit: boolean;
  showDeletemodal: boolean;
  setShowDeletemodal: (value: boolean) => void;
  hideItem: () => void;
}
const Itemdisplay2 = ({
  arr,
  sellerId,
  itemId,
  setShowEdit,
  showEdit,
  showDeletemodal,
  setShowDeletemodal,
  hideItem,
}: Props) => {
  const arrs = [money, money, nora, jenny, nora, video];
  const [activepic, setActivepicture] = useState<number>(0);
  const isNotMobileScreens = useMediaQuery('(min-width:600px)');
  const isMobile = useMediaQuery('(max-width:1004px)');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { state, dispatch } = useAppContext();
  const axiosPrivate = useAxiosPrivate();
  const { user } = state;
  const isVideo = (path: string) => {
    return path?.endsWith('.mp4') || path?.endsWith('.webm');
  };
  const [Imagezoom, setImageZoom] = useState<boolean>(false);

  const updateItem = async () => {
    try {
      const response = await axiosPrivate.put(
        `seller/update-item/${itemId}`,
        { name: '' },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    } catch (error) {}
  };
  const EditItem = () => {
    setShowEdit(true);
  };
  const deleteItem = () => {
    setShowDeletemodal(true);
  };
  const data = [
    {
      title: 'Update',
      icon: rotateIcon,
      func: updateItem,
    },
    {
      title: 'Edit',
      icon: editIcon,
      func: EditItem,
    },
    {
      title: 'Hide',
      icon: eyesIcon,
      func: hideItem,
    },
    {
      title: 'Delete',
      icon: deleteIcon,
      func: deleteItem,
    },
  ];
  return (
    <Box component={'section'}>
      {typeof sellerId !== 'undefined' && (
        <Box>
          {user?._id === sellerId && (
            <Box sx={{ position: 'relative', width: '120px' }}>
              <button
                className="blue-btn"
                style={{
                  marginBottom: '1rem',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
                onClick={() => {
                  setIsOpen(!isOpen);
                }}
              >
                <img
                  style={{ width: '20px' }}
                  src={humanIcon}
                  alt="human icon"
                />{' '}
                Manage
              </button>
              {isOpen && (
                <ul className="drop-down">
                  <Box
                    sx={{ display: 'flex', justifyContent: 'flex-end' }}
                    onClick={() => {
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
                  </Box>
                  {data.map((item, i) => (
                    <li
                      key={i}
                      onClick={() =>
                        typeof item.func !== 'undefined' && item.func()
                      }
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                        }}
                      >
                        <img
                          style={{
                            width: '16px',
                            height: '16px',
                            aspectRatio: '1',
                          }}
                          src={item.icon}
                          alt=""
                        />
                        {item.title}
                      </Box>
                    </li>
                  ))}
                </ul>
              )}
            </Box>
          )}
        </Box>
      )}

      <Box className="zoom-img">
        {Imagezoom && (
          <ImageZoom contentWidth="95%" filePath={arr[activepic]?.secure_url} closeModal={()=>setImageZoom(false)} height='100%' imageArray={arr} />
        )}
      </Box>
      <Box
        // className="simplebar-row"
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column-reverse' : 'row',
          alignItems: isNotMobileScreens ? '' : 'center',
          transformOrigin: 'top',
          gap: '1.2rem',
        }}
      >
        {/* <SimpleBar
          style={{
            width: `${isMobile ? '100%' : '110px'}`,
            // height: isNotMobileScreens ? '121px' : '100px',
            // width: isNotMobileScreens ? '100px' : '121px',
          }}
        > */}
        <Box
          sx={{
            width: isMobile ? '100%' : 'unset',
            display: 'flex',
            flexDirection: isMobile ? 'row' : 'column',
            // maxHeight: '100%',
            // maxWidth: 'auto',
            height: isMobile ? '100px' : 'unset',
            aspectRatio: '1',
            gap: isMobile ? '1rem' : '1.2rem',
            overflowX: isMobile ? 'scroll' : 'unset',
            overflowY: !isMobile ? 'scroll' : 'hidden',
          }}
        >
          {arr?.map(
            (item: Photo, index) =>
              item?.secure_url !== '' &&
              item?.secure_url !== undefined && (
                <Box
                  key={index}
                  component={'div'}
                  onClick={() => setActivepicture(index)}
                  sx={{
                    borderRadius: '8px',

                    objectFit: 'cover',
                    height: '100%',
                    width: '100%',
                    cursor: 'pointer',
                    bgcolor: '#fff',
                    padding: '1rem',
                    border: `${
                      index === activepic ? '2px solid #0047AB' : 'black'
                    }`,
                  }}
                >
                  {item?.secure_url !== '' &&
                    item?.secure_url !== undefined && (
                      <Fragment>
                        {isVideo(item?.secure_url) ? (
                          <Box
                            sx={{
                              width: '100%',

                              objectFit: 'cover',
                              position: 'relative',
                            }}
                          >
                            <img
                              src={videotag}
                              style={{
                                position: 'absolute',
                                width: '4rem',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                              }}
                            />
                            <video
                              src={item?.secure_url}
                              style={{
                                // width: '100px',
                                height: '121px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                              }}
                            />
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              width: '100px',
                              height: '100%',
                              backgroundImage: `url(${item?.secure_url})`,
                              backgroundSize: 'contain',
                              backgroundRepeat: 'no-repeat',
                              borderRadius: '0.5rem',
                              backgroundPosition: 'center',
                              left: '50%',
                              transform: 'translatex(-50%)',
                            }}
                            position={'relative'}
                          >
                            <img
                              src={item?.secure_url}
                              alt={`image-${index}`}
                              style={{
                                display: isMobile ? 'none' : 'block',
                                objectFit: 'cover',
                                width: 'auto',
                                maxWidth: '100%',
                                height: '100%',
                              }}
                            />
                          </Box>
                        )}
                      </Fragment>
                    )}
                </Box>
              )
          )}
        </Box>
        {/* </SimpleBar> */}

        <Box
          sx={{
            width: '100%',
            height: isMobile ? '400px' : '500px',
            borderRadius: '10%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            objectFit: 'contain',
            position: 'relative',
            py: isMobile ? '.5rem' : '1.5rem',
            bgcolor: '#e1e1e1',
          }}
          component={"div"}
          onClick={()=>setImageZoom(true)}
        >
          {!isVideo(arr?.[activepic]?.secure_url) && (
            <IconButton
              sx={{ position: 'absolute', bottom: 0, right: 0 }}
              onClick={() => setImageZoom(true)}
            >
              {/* <ZoomOutMapOutlined sx={{ fontSize: '3rem', color: '#0047AB' }} /> */}
            </IconButton>
          )}

          <AnimatePresence>
            {isVideo(arr[activepic]?.secure_url) ? (
              <motion.video
                key={activepic}
                src={arr[activepic]?.secure_url}
                style={{
                  objectFit: 'contain',
                  width: '100%',
                  height: '100%',
                  display: 'block',
                  maxWidth: '100%',
                  // maxHeight: '532px',
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4 }}
                autoPlay
                loop
                controls
              />
            ) : (
              <motion.img
                key={activepic}
                src={arr[activepic]?.secure_url}
                alt={`image-${activepic}`}
                style={{
                  objectFit: 'contain',
                  width: '100%',
                  height: '100%',
                  display: 'block',
                  maxWidth: '100%',
                  maxHeight: '532px',
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4 }}
              />
            )}
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
};

export default Itemdisplay2;
