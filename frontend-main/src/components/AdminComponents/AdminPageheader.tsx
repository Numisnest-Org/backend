import { Box, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import Search from '../homeComponents/Search';
import SelectComp from '../Select/SelectComp';
import { ArrowDropDownCircleOutlined } from '@mui/icons-material';
import useAppContext from 'src/hooks/useAppContext';
import { axiosPublic } from 'src/axios/axios';
import { ActionType } from 'src/utilities/context/context';
interface Props {
  setSearchValue: (value: any) => void;
  changeCountry: (value: any) => void;
  country: string;
  title: string;
}
const AdminPageheader = ({
  setSearchValue,
  changeCountry,
  country,
  title,
}: Props) => {
  const handleChange = () => {};
  const { state, dispatch } = useAppContext();
  const { availableLocation } = state;
  useEffect(() => {
    const fetchAvailableCountries = async () => {
      try {
        const response = await axiosPublic.get('duo/general/countries');
        const { data } = response.data;
        dispatch({ type: ActionType.setAvailableLocation, payload: data });
      } catch (error) {
        console.log(error);
      }
    };
    fetchAvailableCountries();
  }, []);
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { md: '.5fr 2fr 1fr' },
        alignItems: 'center',
        gap: '3rem',
        mt: '2rem',
      }}
    >
      <Typography
        sx={{
          fontSize: '1.5rem',
          color: '#0047AB',
          fontWeight: '600',
        }}
      >
        {title}
      </Typography>
      <Box>
        <Search setState={setSearchValue} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography sx={{ fontSize: '14px', fontWeight: '500' }}>
          Showing From
        </Typography>
        <Box sx={{ width: '50%', alignSelf: 'center' }}>
          <SelectComp
            menuItems={['Everywhere', ...(availableLocation || [])]}
            // sx={{
            //   borderRadius: "6px",
            //   backgroundColor: "#0047AB29",
            //   "& .MuiSelect-icon": {
            //     color: "#0047AB",
            //   },
            //   "& .Mui-selected": {
            //     color: "#0047AB",
            //   },
            // }}
            value={country}
            handleChange={changeCountry}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminPageheader;
