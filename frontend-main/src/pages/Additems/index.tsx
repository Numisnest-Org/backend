import { Typography } from '@mui/material';

import AddItemsComp from 'src/components/AddItemsComponents/AddItemsComp';
import VisitorLayout from 'src/components/layouts/VisitorLayout';
import useScrollToTop from 'src/hooks/useScrolllToTop';

const AddItemsPage = () => {
  useScrollToTop();
  return (
    <VisitorLayout>
      <Typography
        sx={{
          fontSize: { xs: '1.4rem', md: '1.6rem' },
          pt: '2rem',
          fontWeight: '600',
          mb: '2rem',
        }}
      >
        Add Item
      </Typography>

      <AddItemsComp />
    </VisitorLayout>
  );
};

export default AddItemsPage;
