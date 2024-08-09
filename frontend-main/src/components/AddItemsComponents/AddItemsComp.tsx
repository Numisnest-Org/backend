import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Typography,
  SelectChangeEvent,
  Input,
  InputBase,
} from '@mui/material';
import InputComponent from '../inputComponent.tsx/InputComponent';
import SelectComp from '../Select/SelectComp';
import TextFieldInputLimit from '../form-components/TextFieldInputLimit';
import React, { useEffect, useRef, useState } from 'react';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import { FastField } from 'formik';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import LINKS from 'src/utilities/links';
import ToggleSwitch, { CustomSwitch } from './toggleISwitch';
import useCountryName from 'src/hooks/useCountryName';
import useCurrency from 'src/hooks/useCurrency';
import { CollectionType } from 'src/utilities/types';
import { useDrag, useDrop } from 'react-dnd';
import MultipleInputSelect from '../inputComponent.tsx/multipleInputSelect';
import { array } from 'yup';
import ItemAddedModal from '../Modal/item-added-modal';
import useScrollToTop from 'src/hooks/useScrolllToTop';
import MultipleSelectDropdown from '../Select/MultiselectDropdown';
import MultipleSelectDropdownCountry from '../Select/MultiselectDropdownCountry';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import ReactQuill from 'react-quill';
import TextInput from '../form-components/textInput';
export const CategoryOptions = [
  { label: 'Banknotes', val: 'banknote' },
  { label: 'Coins', val: 'coin' },
  { label: 'Medals', val: 'medal' },
  { label: 'Stamps', val: 'stamp' },
  { label: 'Postcards', val: 'postcard' },
  { label: 'Envelopes', val: 'envelope' },
  { label: 'Vouchers', val: 'voucher' },
  { label: 'Tokens', val: 'token' },
  { label: 'Accessories', val: 'accessorie' },
  { label: 'Others', val: 'others' },
];
const AddItemsComp = () => {
  const axiosPrivate = useAxiosPrivate();
  useScrollToTop();
  const [video, setvideo] = useState<File | null | string>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [available, setAvailable] = useState<boolean>(true);
  const [category, setCategory] = useState<string | null>(null);
  const [currency, setCurrency] = useState(
    localStorage.getItem('currency') ? localStorage.getItem('currency') : 'USD'
  );
  const [amount, setAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [collection, setCollection] = useState<CollectionType[]>([]);
  const [selectedCOllection, setSelectedCollection] = useState<String>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string[]>([]);
  const [country, setCountry] = useState<string | null>(null);
  const [multipleimg, setMultipleImg] = useState<File[]>([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDisplayModal, setDisplayModal] = useState<boolean>(false);
  const [freq, setFreqoptions] = useState([]);
  const [year, setYear] = useState<number | null>(null);
  const [val, setVal] = useState<any>('');
  const handleChange = (html: any) => {
    if (html.length <= 500) {
      setVal(html);
    }
  };
  useEffect(() => {
    const getCollections = async () => {
      try {
        const response = await axiosPrivate.get(`seller/collection/fetch`);
        const { data } = response?.data;
        setCollection(data);
      } catch (error) {
        error;
      }
    };
    const getFrequentlySelectedCoutries = async () => {
      try {
        const response = await axiosPrivate.get(
          'seller/frequently-selected-countries'
        );
        const { data } = response?.data;
        setFreqoptions(data);
      } catch (error) {}
    };
    getCollections();
    getFrequentlySelectedCoutries();
  }, []);
  console.log(year);
  const handleChangee = (event: SelectChangeEvent<any>) => {
    const value = event.target.value;
    if (value.length > 3) {
      toast('Can only select up to 3 catrgories', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        isLoading: false,
        type: 'error',
        theme: 'light',
        style: { width: '20rem', height: '7rem', fontSize: '1.3rem' },
      });
      return;
    }
    setSelectedCategories(typeof value === 'string' ? value.split(',') : value);
    const selectedCat = selectedCategories.join(',');

    setCategory(value.join(','));
  };

  const handleCountryChange = (event: SelectChangeEvent<any>) => {
    const value = event.target.value;
    if (value.length > 5) {
      toast('Can only select up to 5 countries', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        isLoading: false,
        type: 'error',
        theme: 'light',
        style: { width: '20rem', height: '7rem', fontSize: '1.3rem' },
      });
      return;
    }
    setSelectedCountry(typeof value === 'string' ? value.split(',') : value);
    const selectedCont = selectedCountry.join(',');

    setCountry(value.join(','));
  };
  const countrynames = useCountryName();
  const navigate = useNavigate();
  const { countryCurrency } = useCurrency();
  const quillRef = useRef<ReactQuill>(null);
  const formats = [
    'size',
    'bold',
    'italic',
    'underline',
    'list',
    'bullet'
  ];
  const modules = {
    toolbar: false
  };
  const valuesSubmit = [
    { head: 'name', value: title },
    { head: 'description', value: val },
    { head: 'currency', value: currency },
    { head: 'price', value: amount },
    { head: 'category', value: category },
    { head: 'video', value: JSON.stringify(video) },
    { head: 'available', value: available },
    { head: 'country', value: country },
    { head: 'collection', value: selectedCOllection },
    { head: 'year', value: year },
    // ...selectedFiles.map((fileobj,index)=>({
    //   head:"Photos",value:fileobj
    // }))
  ];
  const handleSubmit = async () => {
    try {
      localStorage.setItem('currency', currency ? currency : '');
      setIsSubmitting(true);
      const formData = new FormData();
      valuesSubmit.forEach((val) => {
        if (typeof val.value === 'string') {
          formData.append(val.head, val.value);
        } else if (typeof val.value === 'number') {
          formData.append(val.head, val.value.toString());
        } else if (typeof val.value === 'boolean') {
          formData.append(val.head, val.value.toString());
        }
      });
      formData.append('photos', JSON.stringify(selectedFiles));
      const response = await axiosPrivate.post('/seller/add-item', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // navigate(LINKS.sellerProfile);
      toast('Item Added', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        isLoading: false,
        type: 'success',
        theme: 'light',
        style: { width: '20rem', height: '7rem', fontSize: '1.3rem' },
      });
      setDisplayModal(true);
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
        style: { width: '20rem', height: '7rem', fontSize: '1.3rem' },
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Box sx={{ mb: "2rem" }}>
      {isDisplayModal && (
        <ItemAddedModal
          contentWidth={"600px"}
          closeModal={() => setDisplayModal(false)}
          valuesSubmit={valuesSubmit}
          photos={selectedFiles}
        />
      )}
      <Paper sx={{ px: "1rem", pt: "2rem", pb: "2rem", bgcolor: "white" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mb: "2rem",
          }}
        >
          {/* <ToggleSwitch setState={setAvailable} state={available} /> */}
          <CustomSwitch setState={setAvailable} state={available} />
        </Box>

        <Box>
          <MultipleInputSelect
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            setFile={setvideo}
            fileName={video}
          />
        </Box>
        <Box
          sx={{
            px: {
              xs: "0.5rem",
              sm: "1rem",
              md: "2.5rem",
              lg: "15rem",
              xl: "20rem",
            },
          }}
        >
          <Box sx={{ mt: "2rem" }}>
            <TextFieldInputLimit
              limit={70}
              label={"Item Title"}
              onChange={(e) => setTitle(e.target.value)}
              val={title}
              sx={{}}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              mt: "2rem",
            }}
          >
            <Box
              component={"label"}
              sx={{
                fontSize: { xs: "1.1rem", md: "1.2rem" },
                fontWeight: 500,
                mr: "0.5rem",
              }}
            >
              Category:
            </Box>
            <MultipleSelectDropdown
              options={CategoryOptions}
              option={category}
              setOption={setCategory}
            />
          </Box>

          <Box>
            <Box
              sx={{
                mt: "2rem",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Box
                component={"label"}
                sx={{
                  fontSize: { xs: "1.1rem", md: "1.2rem" },
                  fontWeight: 500,
                  mr: "1rem",
                }}
              >
                Country:
              </Box>
              <MultipleSelectDropdownCountry
                freqoptions={freq}
                options={[
                  "Austro-Hungarian Empire",
                  "Yugoslavia",
                  "East Germany",
                  "Czechoslovakia",
                  "South Vietnam",
                  "Soviet Union",
                  " West Germany",
                  "Tibet",
                  " Palestine",
                  " Bohemia and Moravia",
                  ...countrynames,
                ]}
                countryType
                option={country}
                setOption={setCountry}
              />
              {/* <Select
                                multiple
                                fullWidth
                                value={selectedCountry}
                                onChange={handleCountryChange}
                                sx={{
                                    border: "0.79px solid rgba(0, 71, 171, 0.40)",
                                    width: "13rem",
                                    height: "2.5rem",
                                    fontSize: "1.12rem",
                                    mt: "1.5rem",
                                    borderRadius: "0.8rem",
                                }}
                            >
                                {countrynames.map((country) => (
                                    <MenuItem value={country}>
                                        {country}
                                    </MenuItem>
                                ))}
                            </Select> */}
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                mt: "2rem",
              }}
            >
              <Box
                component={"label"}
                sx={{
                  fontSize: { xs: "1.1rem", md: "1.2rem" },
                  fontWeight: 500,
                  mr: "0.5rem",
                }}
              >
                Year:
              </Box>
              <InputBase
                sx={{
                  border: "0.79px solid rgba(0, 71, 171, 0.40)",
                  width: "13rem",
                  height: "2.5rem",
                  fontSize: "1.12rem",
                  borderRadius: "0.8rem",
                  ml: "2.6rem",
                  padding: "0.5rem 1rem",
                }}
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
              />
            </Box>
            <Box sx={{ mt: "3rem" }}>
              <Box sx={{ mb: "1rem" }}>
                <Box
                  component={"label"}
                  sx={{
                    fontSize: { xs: "1.1rem", md: "1.2rem" },
                    fontWeight: 500,
                    mb: "1rem",
                  }}
                >
                  Item details
                </Box>
                {/* <textarea style={{width:"100%",height:"9rem",padding:"1rem 1.5rem"}} value={val} onChange={(e)=>setVal(e.target.value)}></textarea> */}
                
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={val}
                  onChange={handleChange}
                  style={{
                    height: "120px",
                    maxWidth: "100%",
                    
                  }}
                  formats={formats}
                  modules={modules}
                  className="quill-container"
                />
              </Box>
              {/* <TextFieldInputLimit
                limit={500}
                multiline
                rows={5}
                variant="outlined"
                label={'Details'}
                val={description}
                onChange={(e) => setDescription(e.target.value)}
              /> */}
              {/* <Box sx={{ mt: '5rem', mb: '2rem' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']}>
                    <DatePicker
                      label={'"year"'}
                      openTo="year"
                      views={['year']}
                      value={year}
                      onChange={(newyear) => setYear(newyear)}
                      minDate={dayjs('100-01-01')}
                      maxDate={dayjs()}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </Box> */}

              <Box
                sx={{
                  mt: "3rem",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  component={"label"}
                  sx={{
                    fontSize: { xs: "1.1rem", md: "1.2rem" },
                    fontWeight: 500,
                    mb: "1rem",
                  }}
                >
                  Price
                </Box>
                <Box sx={{ display: "flex" }}>
                  <TextField
                    sx={{
                      fontSize: "1.5rem",
                      "& .MuiInputAdornment-root": {
                        backgroundColor: "#F0F0F0",
                        padding: "1.5rem 0.8rem",
                      },
                    }}
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value))}
                    type="number"
                    variant="outlined"
                  />
                  <Select
                    variant="outlined"
                    sx={{
                      fontSize: "1rem",
                      border: "none",
                      ml: "1rem",
                      "&:focus": {
                        backgroundColor: "transparent",
                        border: "none",
                      },
                    }}
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <MenuItem value={"USD"}>USD</MenuItem>
                    <MenuItem value={"EUR"}>EUR</MenuItem>
                    <MenuItem value={"ILS"}>ILS</MenuItem>
                    <MenuItem value={"RON"}>RON</MenuItem>
                  </Select>
                </Box>
              </Box>
              <Box sx={{ mt: "2rem" }}>
                <Box
                  component={"label"}
                  sx={{
                    fontSize: { xs: "1.1rem", md: "1.2rem" },
                    fontWeight: 500,
                    mr: "1.2rem",
                  }}
                >
                  Collections :
                </Box>
                <Select
                  placeholder="Select collection from available collection"
                  fullWidth
                  variant="outlined"
                  value={selectedCOllection}
                  sx={{
                    border: "0.79px solid rgba(0, 71, 171, 0.40)",
                    width: "13rem",
                    height: "2.5rem",
                    fontSize: "1.12rem",
                    mt: "1.5rem",
                    borderRadius: "0.8rem",
                  }}
                  onChange={(e) => setSelectedCollection(e.target.value)}
                >
                  <MenuItem>No collection</MenuItem>
                  {collection.map((collect) => (
                    <MenuItem value={collect?._id}>{collect.name}</MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>
            <Box
              component={"div"}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: "2rem",
              }}
            >
              <Button
                sx={{
                  backgroundColor: "#F4F4F6",
                  color: "black",
                  padding: "0.5rem 3.5rem",
                  borderRadius: "0.4rem",
                  mt: "2rem",
                  mr: "1rem",
                }}
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                className="blue-btn"
                sx={{
                  backgroundColor: "#0047AB",
                  color: "white",
                  padding: "0.5rem 3.8rem",
                  borderRadius: "0.4rem",
                  mt: "2rem",
                  "&:hover": {
                    backgroundColor: "#1166dc",
                  },
                }}
                onClick={handleSubmit}
              >
                {isSubmitting ? (
                  <CircularProgress
                    size={"1rem"}
                    sx={{
                      color: "white",
                      height: "1rem",
                      width: "1rem",
                    }}
                  />
                ) : (
                  "Add"
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddItemsComp;
