import { Box, Button, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import Search from '../homeComponents/Search';
import SelectComp from '../Select/SelectComp';
import { ArrowDropDownCircleOutlined } from '@mui/icons-material';
import useAppContext from 'src/hooks/useAppContext';
import { axiosPublic } from 'src/axios/axios';
import { ActionType } from 'src/utilities/context/context';
import { useNavigate } from 'react-router-dom';
import LINKS from 'src/utilities/links';
interface Props {
  changeCountry: (value: any) => void;
  country: string;
  title: string;
}
const AdmininformationHeader = ({ changeCountry, country, title }: Props) => {
  const handleChange = () => {};
  const { state, dispatch } = useAppContext();
  const { availableLocation } = state;
  const navigate = useNavigate();
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
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Typography
        sx={{ fontSize: '1.5rem', color: '#0047AB', fontWeight: 'bold' }}
      >
        {title}
      </Typography>

      <SelectComp
        selectLabel="Showing From "
        menuItems={[...(availableLocation || [])]}
        // sx={{
        //   width:"12rem",
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
      <Button
        sx={{
          backgroundColor: '#0047AB',
          color: 'white',
          padding: '0.5rem 1.5rem',
          borderRadius: '0.7rem',
        }}
        onClick={() => navigate(LINKS.admininformationtext)}
      >
        Add new Topic
      </Button>
    </Box>
  );
};

export default AdmininformationHeader;
