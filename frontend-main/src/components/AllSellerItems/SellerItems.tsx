import {
  Box,
  MenuItem,
  Pagination,
  Select,
  SelectChangeEvent,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import SelectComp from '../Select/SelectComp';
import Search from '../homeComponents/Search';
import _ from 'lodash';
import { GroupItems, SingleItemType } from 'src/utilities/types';
import ItemsCard, { CardType } from '../cards/ItemsCard';
import EditItemsModal from '../Modal/edit-ItemsModal';
import { axiosPublic } from 'src/axios/axios';
import { CategoryOptions } from '../AddItemsComponents/AddItemsComp';
import { ReportProblemRounded } from '@mui/icons-material';
import ConfirmationModal from '../Modal/are-you-sure';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import { toast } from 'react-toastify';
// import { Spinner } from 'src/pages/Item';
import CircularProgress from '@mui/material/CircularProgress';
interface Props {
  sellerName?: string;
  data: any[] | null;
  type?: CardType;
  setCountry?: (value: string) => void;
  countryValue?: string;
  setPage?: (value: number) => void;
  setSearchValue?: (value: any) => void;
  setSelectedCategories?: (value: any) => void;
  selectedCategories?: any;
  page?: number;
  totalPage?: number;
  setRefresh?: (val: any) => void;
  refresh?: boolean;
}
const AllSellerItems = ({
  sellerName,
  data,
  type,
  setCountry,
  setPage,
  totalPage,
  page,
  selectedCategories,
  setSelectedCategories,
  setSearchValue,
  setRefresh,
  refresh,
}: Props) => {
  // const CategoryOptions = [
  //   { label: "Banknote", val: "banknote" },
  //   { label: "Coins", val: "coin" },
  //   { label: "Medal", val: "medal" },
  //   { label: "Stamp", val: "stamp" },
  //   { label: "Postcard", val: "postcard" },
  //   { label: "Envelope", val: "envelope" },
  //   { label: "Voucher", val: "voucher" },
  //   { label: "Token", val: "token" },
  //   { label: "Accessories", val: "accessory" },
  //   { label: "Others", val: "other" },
  // ];
  const theme = useTheme();
  const handleChange = () => {};
  const handleChangee = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    typeof setSelectedCategories !== 'undefined' &&
      setSelectedCategories(
        typeof value === 'string' ? value.split(',') : value
      );
  };
  const [isDisplayModal, setDisplayModal] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null | undefined>(null);
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const axiosPrivate = useAxiosPrivate();
  useEffect(() => {
    const fetchAvailableCountries = async () => {
      try {
        setIsLoading(true);
        const response = await axiosPublic.get('duo/general/items/countries');
        const { data } = response.data;
        setIsLoading(false);
        setAvailableCountries(data);
      } catch (error) {
        error;
      }
    };
    fetchAvailableCountries();
  }, []);
  return (
    <Box>
      {showEdit && (
        <EditItemsModal
          contentWidth={'1200px'}
          closeModal={() => setShowEdit(false)}
          itemId={selectedId}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      )}
      {showDeleteModal && (
        <ConfirmationModal
          contentWidth={'400px'}
          closeModal={() => setShowDeleteModal(false)}
          itemId={selectedId}
          text="delete item"
          handleItem={async () => {
            try {
              await axiosPrivate.delete(`seller/delete-item/${selectedId}`);

              toast('Item deleted', {
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
              typeof setRefresh !== 'undefined' && setRefresh(!refresh);
              setShowDeleteModal(false);
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
          icon={
            <ReportProblemRounded
              sx={{ color: ' #D03531 ', fontSize: '4.5rem' }}
            />
          }
        />
      )}
      {isDisplayModal && (
        <EditItemsModal
          contentWidth={'1200px'}
          closeModal={() => setDisplayModal(false)}
          itemId={selectedId}
        />
      )}
      <Box sx={{ mt: '1rem' }}>
        <Typography
          sx={{
            fontSize: { xs: '1.5rem', md: '2.5rem' },
            fontWeight: '600',
            mb: '1rem',
            textAlign: 'center',
          }}
        >
          {isLoading ? (
            <CircularProgress />
          ) : (
            `${_.upperFirst(sellerName)}'s Items`
          )}
        </Typography>
        <Box
          sx={{
            display: { sx: 'block', sm: 'flex' },
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ width: '100%', maxWidth: '420px' }}>
            <Search setState={setSearchValue} />
          </Box>

          <Box sx={{ display: 'flex' }}>
            <Select
              multiple
              value={selectedCategories}
              onChange={handleChangee}
              sx={{
                border: '0.79px solid rgba(0, 71, 171, 0.40)',
                width: '8rem',
                height: '2.5rem',
                fontSize: '1.12rem',
                mt: '1.5rem',
                borderRadius: '0.8rem',
              }}
            >
              {CategoryOptions.map((category, index) => (
                <MenuItem key={index} value={category.val}>
                  {category.label}
                </MenuItem>
              ))}
            </Select>

            <SelectComp
              selectLabel=""
              menuItems={['Everywhere', ...availableCountries]}
              sx={{
                border: '0.79px solid rgba(0, 71, 171, 0.40)',
                mt: '1.5rem',
              }}
              handleChange={(value) =>
                typeof setCountry !== 'undefined' && setCountry(value)
              }
            />
          </Box>
        </Box>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <Box
            sx={
              {
                // display: "grid",
                // gridTemplateColumns: {
                //   xs: "repeat(3, 1fr)",
                //   sm: "repeat(3, 1fr)",
                //   md: "repeat(4, 1fr)",
                //   lg: "repeat(6, 1fr)",
                //   xl: "repeat(6, 1fr)",
                // },
                // columnGap: { xs: "0.5rem", lg: "0.9rem", xl: "2rem" },
                // rowGap: "2rem",
                // justifyItems: "center",
                // position: "relative",
                // mt: "5rem",
              }
            }
          >
            {type === 'Private' ? (
              <Box>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: 'repeat(3, 1fr)',
                      sm: 'repeat(3, 1fr)',
                      md: 'repeat(4, 1fr)',
                      lg: 'repeat(6, 1fr)',
                      xl: 'repeat(6, 1fr)',
                    },
                    columnGap: { xs: '0.5rem', lg: '0.9rem', xl: '2rem' },
                    rowGap: '2rem',
                    justifyItems: 'center',
                    position: 'relative',
                    pb: '1rem',
                    ml: '0rem',
                    mt: '1.5rem',
                    transform: 'scale(0.96)',
                  }}
                >
                  {data?.map((itemm: any, indexx: number) => (
                    <Box key={indexx} sx={{ width: '100%' }}>
                      <ItemsCard
                        key={indexx}
                        url={itemm?.photos?.[0].secure_url}
                        currency={itemm.convertedCurrency}
                        selling={itemm.name}
                        createdAt={itemm.updatedAt}
                        amount={itemm.convertedPrice}
                        height="15.5rem"
                        bgColor="#F4F4F6"
                        id={itemm._id}
                        cardtype="Private"
                        openModal={() => setDisplayModal(true)}
                        setItemId={setSelectedId}
                        setShowDeletemodal={setShowDeleteModal}
                        setShowEdit={setShowEdit}
                        showDeletemodal={showDeleteModal}
                        showEdit={showEdit}
                        setRefresh={setRefresh}
                        available={itemm.available}
                      />
                    </Box>
                  ))}
                </Box>{' '}
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'repeat(3, 1fr)',
                    sm: 'repeat(3, 1fr)',
                    md: 'repeat(4, 1fr)',
                    lg: 'repeat(6, 1fr)',
                    xl: 'repeat(6, 1fr)',
                  },
                  columnGap: { xs: '0.3rem', lg: '0.9rem', xl: '2rem' },
                  rowGap: '2rem',
                  justifyItems: 'center',
                  position: 'relative',
                  mt: '3rem',
                }}
              >
                {data?.map((item: SingleItemType, index: number) => (
                  <ItemsCard
                    key={index}
                    url={item.photos?.[0].secure_url}
                    selling={item.name}
                    createdAt={item.updatedAt}
                    amount={item.convertedPrice}
                    currency={item.convertedCurrency}
                    height="15.5rem"
                    id={item._id}
                    cardtype={type}
                    openModal={() => setDisplayModal(true)}
                    setItemId={setSelectedId}
                    xsheight="12.5rem"
                    setShowDeletemodal={setShowDeleteModal}
                    setShowEdit={setShowEdit}
                    showDeletemodal={showDeleteModal}
                    showEdit={showEdit}
                    setRefresh={setRefresh}
                    available={item.available}
                  />
                ))}{' '}
              </Box>
            )}
          </Box>
        )}

        <Pagination
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '5rem',
            color: theme.palette.primary.light,

            '& .css-c8vooq-MuiButtonBase-root-MuiPaginationItem-root': {
              fontSize: '1.2rem',
              fontFamily: 'poppin',
            },
            '& .Mui-selected': {
              backgroundColor: 'rgba(0, 71, 171, 0.7)',
              color: 'white',
            },
          }}
          size={'large'}
          shape={'circular'}
          variant={'outlined'}
          count={totalPage}
          page={page}
          onChange={(event, value) =>
            typeof setPage !== 'undefined' && setPage(value)
          }
        />
      </Box>
    </Box>
  );
};

export default AllSellerItems;
