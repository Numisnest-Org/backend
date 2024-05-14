import { Box, Typography, useMediaQuery } from '@mui/material';
import React, { useState } from 'react';
import { GroupItems } from 'src/utilities/types';
import ItemsCard from '../cards/ItemsCard';
import EditItemsModal from '../Modal/edit-ItemsModal';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import { ReportProblemRounded } from '@mui/icons-material';
import { toast } from 'react-toastify';
import ConfirmationModal from '../Modal/are-you-sure';
interface Props {
  data?: GroupItems[];
  setRefresh?: (val: any) => void;
  refresh?: boolean;
}
const HiddenItemsComponent = ({ data, setRefresh, refresh }: Props) => {
  const [isDisplayModal, setDisplayModal] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null | undefined>(null);
  const isNotMobileScreens = useMediaQuery('(min-width:600px)');
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const axiosPrivate = useAxiosPrivate();
  return (
    <Box>
      <Typography
        sx={{
          fontSize: { xs: '1.2rem', md: '1.6rem' },
          textAlign: 'center',
          pt: '2rem',
          fontWeight: '600',
        }}
        variant={'h3'}
      >
        Hidden Items
      </Typography>
      {data?.[0] ? (
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
              contentWidth={'1020px'}
              closeModal={() => setDisplayModal(false)}
              itemId={selectedId}
            />
          )}
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

              mt: '2rem',
            }}
          >
            {data?.slice(0, 6)?.map((item: any, indexx: number) => (
              <Box key={indexx} sx={{ width: '100%' }}>
                <ItemsCard
                  key={indexx}
                  url={item?.photos?.[0].secure_url}
                  currency={item.currency}
                  selling={item.name}
                  createdAt={item.updatedAt}
                  amount={item.price}
                  height="15.5rem"
                  bgColor="white"
                  id={item._id}
                  cardtype="Private"
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
              </Box>
            ))}
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant={'h4'} sx={{ fontSize: '1.2rem', mt: '5rem' }}>
            {' '}
            No Hidden Items
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default HiddenItemsComponent;
