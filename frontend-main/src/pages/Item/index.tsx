import { Box } from '@mui/material';
import { CSSProperties, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { axiosPublic } from 'src/axios/axios';
import ItemDisplay from 'src/components/ItemDescriptionCompnents/ItemDisplay';

import VisitorLayout from 'src/components/layouts/VisitorLayout';
import { SingleItemType } from 'src/utilities/types';

const ItemPage = () => {
  const { id } = useParams();
  const [singleItem, setSingleItem] = useState<SingleItemType | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  useScrollToTop();
  useEffect(() => {
    const fetchSingleItem = async () => {
      setIsFetching(true);
      try {
        const response = await axiosPublic.get(`duo/collector/get-item/${id}`);
        const { data } = response.data;
        setSingleItem(data?.[0]);
        setIsFetching(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleItem();
  }, [id, refresh]);

  return (
    <VisitorLayout>
      {isFetching ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: '15rem' }}>
          <Spinner />
        </Box>
      ) : (
        <ItemDisplay
          data={singleItem}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      )}
    </VisitorLayout>
  );
};

export default ItemPage;

import { motion } from 'framer-motion';
import useScrollToTop from 'src/hooks/useScrolllToTop';

const styleContainer = {
  position: 'relative',
  width: 50,
  height: 50,
};

const styleSpan = {
  display: 'block',
  width: 70,
  height: 70,
  border: '7px solid #eee',
  borderTop: '7px solid #0047AB',
  borderRadius: '50%',
  boxSizing: 'border-box',
  position: 'absolute',
  top: 0,
  left: 0,
};

const spinTransition = {
  repeat: Infinity,
  ease: 'easeInOut',
  // width: ['100%', '50%'],
  duration: 1,
};

export const Spinner = () => {
  return (
    <div style={styleContainer as CSSProperties}>
      <motion.span
        style={styleSpan as CSSProperties}
        animate={{ rotate: 360 }}
        transition={spinTransition}
      />
    </div>
  );
};
