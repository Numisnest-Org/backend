import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import Search from '../homeComponents/Search';
import SelectComp from '../Select/SelectComp';
import useAppContext from 'src/hooks/useAppContext';
import { axiosPublic } from 'src/axios/axios';
import { ActionType } from 'src/utilities/context/context';
import { getCurrencyByCountry } from 'src/utilities/constants/helpers';
import { countries } from 'src/utilities/constants/countries';

interface Props {
  setSearchValue: (value: any) => void;
  changeCountry: (value: any) => void;
  country: string;
  setSelectedCategories: (value: any) => void;
  selectedCategories: any;
  setCurrency: (value: string) => void;
  currency: string;
}

const AdminItemsheader = ({
  setSearchValue,
  changeCountry,
  country,
  setSelectedCategories,
  selectedCategories,
  setCurrency,
  currency,
}: Props) => {
  const CategoryOptions = [
    { label: 'Banknote', val: 'banknote' },
    { label: 'Coins', val: 'coin' },
    { label: 'Medal', val: 'medal' },
    { label: 'Stamp', val: 'stamp' },
    { label: 'Postcard', val: 'postcard' },
    { label: 'Envelope', val: 'envelope' },
    { label: 'Voucher', val: 'voucher' },
    { label: 'Token', val: 'token' },
    { label: 'Accessories', val: 'accessories' },
    { label: 'Others', val: 'others' },
  ];
  const handleChangee = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSelectedCategories(typeof value === 'string' ? value.split(',') : value);
  };
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

  const currencies = useMemo(() => {
    return getCurrencyByCountry(availableLocation, countries);
  }, [availableLocation]);
  return (
    <Box>
      <Typography
        sx={{ fontSize: '1.5rem', color: '#0047AB', fontWeight: 'bold' }}
      >
        All Items
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: '1rem',
        }}
      >
        <Select
          multiple
          value={selectedCategories}
          onChange={handleChangee}
          sx={{
            border: '0.79px solid rgba(0, 71, 171, 0.40)',
            width: '8rem',
            height: '2.5rem',
            fontSize: '1.12rem',
            borderRadius: '6px',
            backgroundColor: '#0047AB29',
            '& .MuiSelect-icon': {
              color: '#0047AB',
            },
            '& .Mui-selected': {
              color: '#0047AB',
            },
          }}
        >
          {CategoryOptions.map((category, index) => (
            <MenuItem key={index} value={category.val}>
              {category.label}
            </MenuItem>
          ))}
        </Select>

        <Search setState={setSearchValue} />

        <SelectComp
          selectLabel="Showing From "
          menuItems={['Everywhere', ...(availableLocation || [])]}
          // sx={{
          //   borderRadius: '6px',
          //   backgroundColor: '#0047AB29',
          //   '& .MuiSelect-icon': {
          //     color: '#0047AB',
          //   },
          //   '& .Mui-selected': {
          //     color: '#0047AB',
          //   },
          // }}
          value={country}
          handleChange={changeCountry}
        />
        <SelectComp
          selectLabel=""
          menuItems={currencies}
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
          value={currency}
          handleChange={(value) => setCurrency(value)}
        />
      </Box>
    </Box>
  );
};

export default AdminItemsheader;
