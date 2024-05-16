import { Box, Pagination, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { SellerType } from 'src/utilities/types';
import AdminSellerCard from './AdminCards/AdminSellerCard';
import ConfirmationModal from '../Modal/are-you-sure';
import { ReportProblemRounded } from '@mui/icons-material';
import useAdminPrivate from 'src/hooks/useAdminPrivate';
import { toast } from 'react-toastify';

const AdminAllSellers = ({
  isFetching,
  data,
  totalPage,
  page,
  setPage,
  setRefresh,
}: {
  isFetching?: boolean;
  data?: SellerType[];
  totalPage: number;
  page: number;
  setPage: (val: number) => void;
  setRefresh: (val: any) => void;
}) => {
  const theme = useTheme();
  const [isDisplayModal1, setDisplayModal1] = useState<boolean>(false);
  const [isDisplayModal2, setDisplayModal2] = useState<boolean>(false);
  const [isDisplayModal3, setDisplayModal3] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null | undefined>(null);
  const adminPrivate = useAdminPrivate();
  return (
    <Box>
      {isDisplayModal1 && (
        <ConfirmationModal
          contentWidth={'400px'}
          closeModal={() => setDisplayModal1(false)}
          itemId={selectedId}
          text="approve seller"
          handleItem={async () => {
            try {
              const response = await adminPrivate.put(
                `admin/seller/update/${selectedId}`,
                { approved: true }
              );
              console.log(response);
              toast('Seller approved', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                isLoading: false,
                type: 'success',
                theme: 'light',
              });
              setRefresh((prev: boolean) => !prev);
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
      {isDisplayModal2 && (
        <ConfirmationModal
          contentWidth={'400px'}
          closeModal={() => setDisplayModal2(false)}
          itemId={selectedId}
          text="disapprove seller"
          handleItem={async () => {
            try {
              const response = await adminPrivate.put(
                `admin/seller/update/${selectedId}`,
                { approved: false }
              );
              console.log(response);
              toast('Seller disapprove', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                isLoading: false,
                type: 'success',
                theme: 'light',
              });
              setRefresh((prev: boolean) => !prev);
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
      {isDisplayModal3 && (
        <ConfirmationModal
          contentWidth={'400px'}
          closeModal={() => setDisplayModal3(false)}
          itemId={selectedId}
          text="delete seller"
          handleItem={async () => {
            try {
              const response = await adminPrivate.delete(
                `admin/seller/remove/${selectedId}`
              );
              console.log(response);
              toast('Seller deleted', {
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
              setRefresh((prev: boolean) => !prev);
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
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              columnGap: { xs: '1rem', lg: '1.5rem', xl: '2rem' },
              rowGap: '2rem',
              position: 'relative',
              mt: { xs: '2rem', sm: '3rem', md: '5rem' },
              transformOrigin: 'top left',
            }}
          >
            {data?.map((item: SellerType, index: number) => (
              <Box component={'div'} onClick={() => setSelectedId(item._id)}>
                <AdminSellerCard
                  key={index}
                  flag={item?.iso_code}
                  url={item.photo?.secure_url}
                  name={`${item.first_name} ${item.last_name}`}
                  selling={item.delivery_option}
                  isFetching={isFetching}
                  id={item._id}
                  approved={item.approved}
                  setDisplayModal1={setDisplayModal1}
                  setDisplayModal2={setDisplayModal2}
                  setDisplayModal3={setDisplayModal3}
                  pinned={item.pinned}
                  setRefresh={setRefresh}
                />
              </Box>
            ))}
          </Box>
        </Box>
        <Pagination
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: { xs: '2rem', sm: '2rem', md: '4rem' },
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
          onChange={(event, value) => setPage(value)}
        />
      </Box>
    </Box>
  );
};

export default AdminAllSellers;
