import {
  Box,
  Button,
  IconButton,
  Skeleton,
  Typography,
  useMediaQuery,
} from '@mui/material';
import '/node_modules/flag-icons/css/flag-icons.min.css';
import dayjs from 'dayjs';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import EditItemsModal from '../Modal/edit-ItemsModal';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import { textFromat } from 'src/utilities/constants/helpers';
import pin from 'src/assets/Image/Pin.svg';
import _ from 'lodash';
import Image from '../Image';
import { toast } from 'react-toastify';
import rotateIcon from '../../assets/Image/rotate.png';
import editIcon from '../../assets/Image/edit.png';
import closeIcon from '../../assets/Image/close.png';
import eyesIcon from '../../assets/Image/eyes.png';
import deleteIcon from '../../assets/Image/delete.png';
import humanIcon from '../../assets/Image/human.png';
import { PRIMARY_COLOR } from 'src/utilities/constants';
export type CardType = 'Private' | 'public';
interface Props {
  flag?: string;
  url?: string;
  firstName?: string;
  lastName?: string;
  selling?: string;
  createdAt?: string;
  amount?: number;
  bgColor?: string;
  isFetching?: boolean;
  currency?: string;
  height?: string;
  xsheight?: string;
  id?: string;
  cardtype?: CardType;
  openModal?: () => void;
  setItemId?: (value: string | undefined) => void;
  selected?: boolean;
  remCollection?: () => void;
  featured?: boolean;
  addFeatured?: boolean;
  available?: boolean;
  setRefresh?: (val: any) => void;
  openDeleteModal?: () => void;
  setShowEdit?: (value: boolean) => void;
  showEdit?: boolean;
  showDeletemodal?: boolean;
  setShowDeletemodal?: (value: boolean) => void;
}

const ItemsCard = ({
  flag,
  url,
  firstName,
  lastName,
  selling,
  createdAt,
  amount,
  bgColor,
  isFetching,
  currency,
  height,
  xsheight,
  id,
  selected,
  cardtype = 'public',
  featured,
  addFeatured,
  available,
  setRefresh,
  openModal,
  setItemId,
  remCollection,
  openDeleteModal,
  setShowEdit,
  showEdit,
  showDeletemodal,
  setShowDeletemodal,
}: Props) => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const isNotMobileScreens = useMediaQuery('(min-width:600px)');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  console.log(available);
  const updateItem = async () => {
    try {
      const response = await axiosPrivate.put(
        `seller/update-item/${id}`,
        { name: '' },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      typeof setRefresh !== 'undefined' && setRefresh((prev: boolean) => !prev);
    } catch (error) {}
  };

  const EditItem = () => {
    setItemId ? setItemId(id) : '';
    typeof setShowEdit !== 'undefined' && setShowEdit(true);
  };
  const hideItem = async () => {
    try {
      const response = await axiosPrivate.put(`seller/update-item/${id}`, {
        available: !available,
      });
      console.log(response);
      toast('Update successful', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        isLoading: false,
        type: 'success',
        theme: 'light',
        style: {},
      });
      typeof setRefresh !== 'undefined' && setRefresh((prev: boolean) => !prev);
    } catch (error: any) {
      console.log(error);
      toast(`${error.response.data.message.split(':')[1]}`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        isLoading: false,
        type: 'error',
        theme: 'light',
      });
    } finally {
      setIsOpen(false);
    }
  };
  const deleteItem = () => {
    setItemId ? setItemId(id) : '';
    typeof setShowDeletemodal !== 'undefined' && setShowDeletemodal(true);
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
    <>
      {cardtype === 'Private' &&
        <Box sx={{ position: 'relative', width: '80px' }}>
          <Box sx={{ position: 'relative', width: '' }}>
            <Button
              className="blue-btn"
              sx={{
                position: 'absolute',
                top: 10,
                marginLeft: { xs: '10px', md: '14px' },
                display: 'flex',
                backgroundColor: '#0047AB',
                color: '#F9FAFA',
                height: { xs: '20px', md: '30px' },
                fontSize: '0.7rem',
                zIndex: '1',
                '&:hover': {
                  backgroundColor: '#1166dc',
                },
              }}
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(!isOpen);
              }}
            >
              <img style={{ width: '20px' }} src={humanIcon} alt="human icon" />{' '}
              Manage
            </Button>
            {isOpen && (
              <ul
                className="drop-down"
                style={{ paddingInline: '10px', left: '5px' }}
              >
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
                      <img
                        style={{
                          width: '15px',

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
          {/*
              <Button
                sx={{
                  position: 'absolute',
                  bottom: 70,
                  left: 0,
                  display: 'inline-flex',
                  backgroundColor: '#0047AB',
                  color: '#F9FAFA',
                  paddingY: '0.1rem',
                  fontSize: '0.7rem',
                }}
                onClick={async (e) => {
                  try {
                    e.stopPropagation();
                    // typeof openModal !== "undefined" && openModal();
                    // setItemId ? setItemId(id) : "";
                    const response = await axiosPrivate.put(
                      `seller/update-item/${id}`,
                      { name: '' },
                      {
                        headers: {
                          'Content-Type': 'multipart/form-data',
                        },
                      }
                    );
                    typeof setRefresh !== 'undefined' &&
                      setRefresh((prev: boolean) => !prev);
                  } catch (error) {}
                }}
              >
                Update
              </Button>
              <Button
                sx={{
                  position: 'absolute',
                  top: 10,
                  right: 0,
                  display: 'inline-flex',
                  backgroundColor: '#0047AB',
                  color: '#F9FAFA',
                  paddingY: '0.1rem',
                  fontSize: '0.7rem',
                }}
                onClick={async (e) => {
                  e.stopPropagation();
                  typeof openDeleteModal !== 'undefined' && openDeleteModal();
                  setItemId ? setItemId(id) : '';
                  // await axiosPrivate.delete(`seller/delete-item/${id}`);
                  // typeof setRefresh !== "undefined" &&
                  //   setRefresh((prev: boolean) => !prev);
                }}
              >
                Delete
              </Button>
              {remCollection && (
                <Button
                  sx={{
                    position: 'absolute',
                    top: 100,
                    right: 30,
                    display: 'inline-flex',
                    backgroundColor: '#0047AB',
                    color: '#F9FAFA',
                    paddingY: '0.1rem',
                    fontSize: '0.7rem',
                  }}
                  onClick={remCollection}
                >
                  remove from Collection
                </Button>
              )} */}
        </Box>
        }

      <Box
        sx={{
          width: '100%',
          height: { xs: '200px', md: '250px' },
          bgcolor: '#FFFFFF',
          border: '1px solid #E6E9F9',
          borderRadius: '1rem',
          p: { xs: '0.4rem', sm: '1rem' },
          position: 'relative',
          cursor: 'pointer',
          transition: 'all 0.3s ease-in-out allow-discrete',
          '&:hover': {
            boxShadow: '0px 0px 10px -2px rgba(0, 0, 0, .2)',
          },
        }}
      >
        <Link
          to={id ? `/item/${id}` : ''}
          style={{ textDecoration: 'none', color: PRIMARY_COLOR }}
        >
          <Box
            sx={{
              height: '100%',
            }}
          >
            {featured && (
              <IconButton
                sx={{ position: 'absolute', top: -10, left: -10 }}
                onClick={async (e) => {
                  e.stopPropagation();
                  const response = await axiosPrivate.delete(
                    `seller/featured/rem/${id}`
                  );
                  typeof setRefresh !== 'undefined' &&
                    setRefresh((prev: boolean) => !prev);
                }}
              >
                <Image
                  src={pin}
                  alt="pin"
                  sx={{
                    width: '2.5rem',
                  }}
                />
              </IconButton>
            )}
            {addFeatured && (
              <Button
                sx={{
                  position: 'absolute',
                  top: 20,
                  left: 13,
                  display: 'inline-flex',
                  backgroundColor: '#0047AB',
                  color: '#F9FAFA',
                  fontSize: '0.6rem',
                }}
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    const response = await axiosPrivate.put(
                      'seller/featured/add',
                      {
                        items_id: [id],
                      }
                    );
                    console.log(response);
                    typeof setRefresh !== 'undefined' &&
                      setRefresh((prev: boolean) => !prev);
                    toast('item added to festured', {
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
                  }
                }}
              >
                Add to featured
              </Button>
            )}

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                paddingBottom: { xs: '20px', md: '30px' },
              }}
            >
              {isFetching ? (
                <Skeleton
                  width="1.2rem"
                  height="1.2rem"
                  variant="circular"
                ></Skeleton>
              ) : (
                <>
                  {flag && (
                    <Box
                      component={'span'}
                      sx={{ height: '12px' }}
                      className={`fi fi-${flag?.toLowerCase()}`}
                    ></Box>
                  )}
                </>
              )}
              {isFetching ? (
                <Skeleton width={'40%'} component="h2"></Skeleton>
              ) : (
                <Typography
                  sx={{
                    ml: '.5rem',
                    fontWeight: '600',
                    fontSize: { xs: '0.75rem', sm: '1rem' },
                    color: 'black',
                  }}
                >
                  {firstName &&
                    `${textFromat(_.upperFirst(firstName))} ${textFromat(
                      _.upperFirst(lastName)
                    )}`}
                </Typography>
              )}
            </Box>

            <Box
              sx={{
                width: '100%',
                height: { xs: '80px', md: '100px' },
                mt: cardtype === 'Private' ? '10px' : 'unset',
              }}
            >
              {isFetching ? (
                <Skeleton
                  sx={{
                    width: '100%',
                    height: '4rem',
                    mt: '1rem',
                    borderRadius: '0.3rem',
                  }}
                ></Skeleton>
              ) : (
                <img
                  src={url}
                  alt="item-image"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              )}
            </Box>
            {isFetching ? (
              <Skeleton
                variant="rectangular"
                component={'h6'}
                sx={{ mt: '0.5rem' }}
              ></Skeleton>
            ) : (
              <Typography
                sx={{
                  mt: '0.5rem',
                  mb: '0.5rem',
                  color: 'black',
                  fontSize: {
                    xs: '12px',
                    md: '14px',
                    wordBreak: 'break-word',
                  },
                }}
              >
                {selling && selling.length > 15
                  ? `${selling.slice(0, 13)}..`
                  : selling}{' '}
              </Typography>
            )}

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',

                gap: '2px',
                alignItems: { xs: 'start', sm: 'center' },
                position: 'absolute',
                bottom: '6px',
              }}
            >
              {isFetching ? (
                <Skeleton
                  variant="rectangular"
                  component={'h3'}
                  sx={{ mt: '0.5rem', width: '40%' }}
                ></Skeleton>
              ) : (
                <Typography
                  sx={{
                    fontSize: { xs: '8px', md: '0.75rem' },
                    color:
                      dayjs().diff(createdAt, 'days') > 21 ? 'red' : '#0047AB',
                  }}
                >
                  {createdAt ? dayjs(createdAt).format('DD.MM.YYYY') : ''}
                </Typography>
              )}

              {isFetching ? (
                <Skeleton
                  variant="rectangular"
                  sx={{ mt: '0.5rem', width: '30%' }}
                ></Skeleton>
              ) : (
                <Typography
                  sx={{
                    fontWeight: '700',
                    fontSize: { xs: '8px', md: '0.75rem' },
                    justifySelf: 'end',
                    color: 'black',
                  }}
                >
                  {`${
                    amount?.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    }) || '0.00'
                  } ${currency?.toUpperCase()}`}
                </Typography>
              )}
            </Box>
          </Box>
        </Link>
      </Box>
    </>
  );
};

export default ItemsCard;
