import {
  Box,
  FormControl,
  IconButton,
  InputBase,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SelectComp from 'src/components/Select/SelectComp';
import Search from 'src/components/homeComponents/Search';
import { HomeItemType } from 'src/utilities/types';
import Pagination from '../Pagination';
import React, { useEffect, useMemo, useState } from 'react';
import MuiTextField, { TextFieldProps } from '@mui/material/TextField';
import ItemsCard from '../cards/ItemsCard';
import { axiosPublic } from 'src/axios/axios';
import { countries } from 'src/utilities/constants/countries';
import _, { upperFirst } from 'lodash';
import useAppContext from 'src/hooks/useAppContext';
import { CategoryOptions } from '../AddItemsComponents/AddItemsComp';
import {
  CloseOutlined,
  CurrencyExchange,
  LocationOn,
  Payment,
} from '@mui/icons-material';
// import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import TextInput from '../form-components/textInput';
import { getyearList } from 'src/utilities/constants/helpers';
import OutlinedInput from "@mui/material/OutlinedInput";
// import { DatePicker } from "antd";
const TextField = React.forwardRef(
  (props: TextFieldProps, ref: React.Ref<HTMLDivElement>) => (
    <TextInput
      {...props}
      ref={ref}
      variant="standard"
      style={{
        border: '2px solid black',
        borderRadius: '0.3rem',
        paddingLeft: '0.5rem',
        // maxWidth: '10rem',
        width: '100%',
      }}
      placeholder="min"
    />
  )
);
interface Props {
  data?: any;
  isFetching?: boolean;
  setCountry: (value: string) => void;
  setScountry: (value: string) => void;
  scountry: string;
  currency: string;
  setCurrency: (value: string) => void;
  countryValue: string;
  setPage: (value: number) => void;
  setSearchValue: (value: any) => void;
  setSelectedCategories: (value: any) => void;
  selectedCategories: any;
  page: number;
  totalPage: number;
  startDate: any;
  setStartDate: (value: any) => void;
  endDate: any;
  setEndDate: (value: any) => void;
  setFormattedDate: (value: any) => void;
  totalItems: number;
}

const ItemsComponets = ({
  data,
  isFetching,
  setCountry,
  setSelectedCategories,
  selectedCategories,
  setPage,
  currency,
  setCurrency,
  countryValue,
  totalPage,
  setSearchValue,
  page,
  setScountry,
  scountry,
  setEndDate,
  setStartDate,
  setFormattedDate,
  startDate,
  endDate,
  totalItems,
}: Props) => {
  const theme = useTheme();
  // const {RangePicker}= DatePicker
  const [personName, setPersonName] = React.useState<string[]>([]);
  const names = [
    "Oliver Hansen",
    "Van Henry",
    "April Tucker",
    "Ralph Hubbard",
    "Omar Alexander",
    "Carlos Abbott",
    "Miriam Wagner",
    "Bradley Wilkerson",
    "Virginia Andrews",
    "Kelly Snyder",
  ];
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const isNotMobileScreens = useMediaQuery('(min-width:600px)');
  const { state, dispatch } = useAppContext();
  const { availableLocation } = state;
  useEffect(() => {
    const fetchAvailableCountries = async () => {
      try {
        const response = await axiosPublic.get('duo/general/items/countries');
        const { data } = response.data;
        setAvailableCountries(data);
      } catch (error) {
        error;
      }
    };
    fetchAvailableCountries();
  }, []);

  const getCurrencyByCountry = (
    availableCountries: any,
    countriesList: any
  ) => {
    const currencies: any = [];

    availableCountries.forEach((availableCountry: any) => {
      const country = countriesList.find(
        (c: any) => c.name === _.startCase(availableCountry)
      );

      if (country) {
        currencies.push(country.currency);
      }
    });

    return currencies;
  };

  const currencies = useMemo(() => {
    return getCurrencyByCountry(availableCountries, countries);
  }, [availableCountries]);

  const handleChangee = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSelectedCategories(typeof value === 'string' ? value.split(',') : value);
  };
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [displayFilter, setDispalyFilter] = useState<any[]>([]);
  const filterItemsByPrice = (item: HomeItemType) => {
    if (!minPrice || !maxPrice) return true;
    const price = item?.item?.convertedPrice;
    return price >= parseFloat(minPrice) && price <= parseFloat(maxPrice);
  };

  const filteredData = data.filter(filterItemsByPrice);
  const formatDate = () => {
    const format = `${startDate}.${endDate}`;
    setFormattedDate(format);
  };
  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const handleremove = (filter: string) => {
    setSelectedCategories(
      selectedCategories.filter((item: string) => item !== filter)
    );
    setDispalyFilter(displayFilter.filter((item) => item !== filter));
  };
  useEffect(() => {
    setDispalyFilter([...selectedCategories]);
  }, [selectedCategories, scountry]);
  return (
    <Box sx={{ pb: { xs: '2rem', md: '4rem' }, color: '#0047AB' }}>
      <Box
        sx={{
          my: '.5rem',
          mt: '-10px',
        }}
      >
        <Typography
          variant={'h3'}
          sx={{
            width: '100%',
            fontWeight: '600',
            mt: { xs: '0.2rem', md: '2rem' },
            mb: '.6rem',
            textAlign: 'center',
            fontSize: { xs: '1.4rem', md: '2rem' },
          }}
        >
          All Items
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center',
            color: '#0047AB',
            mb: { xs: '0.7rem', md: '1rem' },
          }}
        >
          <LocationOn />
          <Typography sx={{ fontWeight: '600' }}>View results from</Typography>
          <SelectComp
            menuItems={['Everywhere', ...(availableLocation || [])]}
            sx={{ border: '1px solid #0047AB' }}
            handleChange={(value) => setCountry(value)}
            value={countryValue}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center',
            color: '#0047AB',
          }}
        >
          <CurrencyExchange />
          <Typography sx={{ fontWeight: '600' }}>View price in</Typography>
          <SelectComp
            menuItems={['USD', 'EUR', 'RON', 'ILS']}
            sx={{
              border: '1px solid #0047AB',
            }}
            handleChange={(value) => setCurrency(value)}
            selectLabel=""
          />
        </Box>
      </Box>

      <Box sx={{ my: '0.5rem' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              md: '1.3fr 1fr 1fr ',
            },

            gap: { xs: '0.5rem', lg: '1rem' },
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <Search setState={setSearchValue} />
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.2rem',
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontWeight: 600,
                  textAlign: 'center',
                  mb: '0.5rem',
                }}
              >
                Category
              </Typography>
              <Select
                multiple
                value={selectedCategories}
                onChange={handleChangee}

                defaultValue={["all"]}
                displayEmpty
                sx={{
                  border: '1px solid #000',
                  borderRadius: '0.8rem',
                  p: 0,
                  height: '2.7rem',
                  backgroundColor: '#fff',
                  width: '100%',
                }}
                inputProps={{ "aria-label": "Without label" }}
                renderValue={(selected) => {

                  if (selected.length === 0) {
                    return <Typography>All</Typography>;

                  }
                  // if (!selected || selected.includes("all")) {
                  //   return <em>All</em>;
                  // } else if (selected.length === CategoryOptions.length) {
                  //   return <em>All</em>;
                  // } else {
                  //   return <em>...</em>;
                  // }
                }}
              >
                {CategoryOptions.map((category, index) => (
                  <MenuItem key={index} value={category.val}>
                    {category.label}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Box>
              <Typography
                sx={{
                  fontWeight: 600,
                  textAlign: 'center',
                  mb: '0.5rem',
                }}
              >
                Country
              </Typography>
              <SelectComp
                value={scountry}
                menuItems={['Everywhere', ...availableCountries]}
                sx={{
                  border: '1px solid #000',
                  borderRadius: '0.8rem',
                }}
                handleChange={(value) => setScountry(value)}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.2rem',
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontWeight: 600,
                  textAlign: 'center',
                  mb: '0.5rem',
                }}
              >
                Year
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  // gridTemplateColumns: '1fr 0.2fr 1fr',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: '2px solid #000',
                  background: '#fff',
                  paddingBlock: '6px',
                  paddingInline: '8px',
                  borderRadius: '10px',
                  gap: '.5rem',
                }}
              >
                {/* <SelectComp
                  menuItems={["Everywhere", ...currencies]}
                  sx={{
                    border: "1px solid #000",
                    background: "#F5F5F5",
                    width: "100%",
                  }}
                  handleChange={(value) => setCurrency(value)}
                /> */}
                <input
                  type="number"
                  value={startDate}
                  className="input"
                  min={1000}
                  max={new Date().getFullYear() + 1}
                  step={1}
                  placeholder='min year'
                  onChange={(e) => {
                    const newStartDate = e.target.value;
                    if (
                      newStartDate?.length <= 4 &&
                      parseInt(newStartDate) >= 1000 &&
                      parseInt(newStartDate) <= new Date().getFullYear() + 1 &&
                      endDate?.length === 4
                    ) {
                      console.log(newStartDate);
                      setStartDate(newStartDate);
                      setFormattedDate(`${newStartDate}.${endDate}`);
                    } else {
                      setStartDate(newStartDate);
                    }
                  }}
                  style={{
                    border: '1px solid #000',
                    height: '1.6rem',
                  }}
                />
                <Typography
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  to
                </Typography>
                <input
                  type="number"
                  min={1000}
                  className="input"
                  max={new Date().getFullYear() + 1}
                  step={1}
                  placeholder='max year'
                  value={endDate}
                  style={{
                    border: '1px solid #000',

                    height: '1.6rem',
                  }}
                  onChange={(e) => {
                    const newEndDate = e.target.value;
                    if (
                      newEndDate.length <= 4 &&
                      parseInt(newEndDate) >= 1000 &&
                      parseInt(newEndDate) <= new Date().getFullYear() + 1 &&
                      startDate.length === 4
                    ) {
                      setEndDate(newEndDate);
                      setFormattedDate(`${startDate}.${newEndDate}`);
                    } else {
                      setEndDate(newEndDate);
                    }
                  }}
                />
                {/* <SelectComp
                  selectLabel=""
                  menuItems={["Everywhere", ...currencies]}
                  sx={{
                    border: "1px solid #000",
                    background: "#F5F5F5",
                  }}
                  handleChange={(value) => setCurrency(value)}
                /> */}
              </Box>
            </Box>

            <Box>
              <Typography
                sx={{
                  fontWeight: 600,
                  textAlign: 'center',
                  mb: '0.5rem',
                }}
              >
                Price
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  // gridTemplateColumns: '1fr 0.2fr 1fr',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #000',
                  background: '#fff',
                  paddingBlock: '5px',
                  paddingInline: '8px',
                  borderRadius: '10px',
                  gap: '.5rem',
                }}
              >
                {/* <SelectComp
                  menuItems={["Everywhere", ...currencies]}
                  sx={{
                    border: "1px solid #000",
                    background: "#F5F5F5",
                    width: "100%",
                  }}
                  handleChange={(value) => setCurrency(value)}
                /> */}
                <Typography> {currency?.toUpperCase()} </Typography>
                <Box sx={{ display: 'flex', gap: '.5rem' }}>
                  <input
                    type="number"
                    value={minPrice}
                    placeholder="Min Price"
                    className="input"
                    onChange={(e) => {
                      setMinPrice(e.target.value);
                    }}
                    style={{
                      border: '1px solid #000',
                      height: '1.6rem',
                    }}
                  />
                  <Typography
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    to
                  </Typography>
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice}
                    className="input"
                    onChange={(e) => {
                      setMaxPrice(e.target.value);
                    }}
                    style={{
                      border: '1px solid #000',
                      height: '1.6rem',
                    }}
                  />
                </Box>
                {/* <SelectComp
                  selectLabel=""
                  menuItems={["Everywhere", ...currencies]}
                  sx={{
                    border: "1px solid #000",
                    background: "#F5F5F5",
                  }}
                  handleChange={(value) => setCurrency(value)}
                /> */}
              </Box>
            </Box>
          </Box>

          {/* 
          
            
            
            //
            <Box sx={{ display: "flex", alignItems: "center", mt: "1rem" }}>
              
            </Box>
            ///
          </Box> */}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap' }}>
        {displayFilter.map((item) => (
          <>
            {item !== '' && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',

                  border: '0.8px solid black',
                  borderRadius: '0.8rem',
                  pl: '0.5rem',
                  justifyContent: 'center',
                  height: '1.8rem',
                }}
              >
                <Typography>{upperFirst(item)}</Typography>
                <IconButton onClick={() => handleremove(item)}>
                  <CloseOutlined sx={{ width: '1rem' }} />
                </IconButton>
              </Box>
            )}
          </>
        ))}
        {scountry !== 'everywhere' && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',

              border: '0.8px solid black',
              borderRadius: '0.8rem',
              pl: '0.5rem',
              justifyContent: 'center',
              height: '1.8rem',
            }}
          >
            <Typography>{upperFirst(scountry)}</Typography>
            <IconButton onClick={() => setScountry('everywhere')}>
              <CloseOutlined sx={{ width: '1rem' }} />
            </IconButton>
          </Box>
        )}
        {minPrice || maxPrice ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              border: '0.8px solid black',
              borderRadius: '0.8rem',
              pl: '0.5rem',
              justifyContent: 'center',
              height: '1.8rem',
            }}
          >
            <Typography>
              {minPrice} - {maxPrice}
            </Typography>
            <IconButton
              onClick={() => {
                setMinPrice('');
                setMaxPrice('');
              }}
            >
              <CloseOutlined sx={{ width: '1rem' }} />
            </IconButton>
          </Box>
        ) : null}
        {startDate || endDate ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              border: '0.8px solid black',
              borderRadius: '0.8rem',
              pl: '0.5rem',
              justifyContent: 'center',
              height: '1.8rem',
            }}
          >
            <Typography>
              {startDate} - {endDate}
            </Typography>
            <IconButton
              onClick={() => {
                setStartDate('');
                setEndDate('');
              }}
            >
              <CloseOutlined sx={{ width: '1rem' }} />
            </IconButton>
          </Box>
        ) : null}
      </Box>
      <Typography>{totalItems} Items</Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(3, 1fr)',
            md: 'repeat(4, 1fr)',
            lg: 'repeat(6, 1fr)',
          },
          gap: { xs: '0.4rem', sm: '1rem' },
          position: 'relative',
          mt: { xs: '.5rem', md: '4rem' },
        }}
      >
        {filteredData.map((item: HomeItemType, index: number) => (
          <ItemsCard
            key={index}
            flag={item?.item?.iso_code}
            url={item?.item?.photos?.[0].secure_url}
            firstName={item?.item?.seller_info[0].first_name}
            lastName={item?.item?.seller_info[0].last_name}
            selling={item?.item?.name}
            createdAt={item?.item?.updatedAt}
            amount={item?.item?.convertedPrice}
            isFetching={isFetching}
            currency={item?.item?.convertedCurrency}
            id={item?.item?._id}
          />
        ))}
      </Box>

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
        onChange={(event: any, value: any) => {
          setPage(value);
        }}
      />
    </Box>
  );
};

export default ItemsComponets;
