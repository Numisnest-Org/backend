import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import TextInput from '../form-components/textInput';
import { ChangeEvent, useState } from 'react';
import LINKS from 'src/utilities/links';
import ProfilePhoto from '../form-components/ProfilePhoto';
import useAppContext from 'src/hooks/useAppContext';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import useCollectorsAxiosPrivate from 'src/hooks/useCollectorsAxiosPrivate';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { countries } from 'src/utilities/constants/countries';
import TextFieldInputLimit from '../form-components/TextFieldInputLimit';

interface Props {
  firstName?: string;
  lastName?: string;
  Country?: string;
  CountryCode?: string;
  PhoneNumber?: string;
  About?: string;
  DeliveryOption?: string;
  profile_photo?: any;
  profiledescription?:string
}
const EditProfileForm = ({
  firstName,
  lastName,
  Country,
  CountryCode,
  PhoneNumber,
  About,
  DeliveryOption,
  profile_photo,
  profiledescription
}: Props) => {
  const { state } = useAppContext();
  const { userType } = state;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [firstname, setFirstname] = useState<string | null | undefined>(
    firstName
  );
  const [lastname, setLastname] = useState<string | null | undefined>(lastName);
  const [country, setCountry] = useState<string | null | undefined>(Country);
  const [countryCode, setCountryCode] = useState<string | null | undefined>(
    CountryCode
  );
  const [phoneNumber, setPhoneNumber] = useState<string | null | undefined>(
    PhoneNumber
  );
  const [about, setAbout] = useState<string | null | undefined>(About);
  const [deliveryOption, setDeliveryOption] = useState<
    string | null | undefined
  >(DeliveryOption);
  const [profiledesc, setProfileDesc] = useState<
    string  | undefined
  >(profiledescription);
  const [profilePhoto, setProfilePhoto] = useState<File | null | undefined>(
    profile_photo
  );

  const axiosPrivate = useAxiosPrivate();
  const axiosCollectorPrivate = useCollectorsAxiosPrivate();
  const navigate = useNavigate();
  const handleCountryChange = (e: SelectChangeEvent<string|null>) => {
    const selectedCountry = e.target.value as string;
    const countryCode = countries.find(
      (country) => selectedCountry === country.name
    );
    console.log(countryCode?.phone_code);
    setCountryCode(countryCode?.phone_code || "");
  };
  const valuesSubmit = [
    { head: 'first_name', value: firstname },
    { head: 'last_name', value: lastname },
    { head: 'country_code', value: countryCode },
    { head: 'mobile', value: phoneNumber },
    { head: 'about', value: about },
    { head: 'delivery_option', value: deliveryOption },
    { head: 'country', value: country },
    { head: 'profile_photo', value: profilePhoto },
    { head: 'details', value: profiledesc },
  ];
  console.log(valuesSubmit);
  const UpdateProfile = async () => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      valuesSubmit.forEach((val) => {
        if (typeof val.value === 'string') {
          formData.append(val.head, val.value);
        } else if (val.value instanceof File) {
          formData.append(val.head, val.value);
        }
      });
      if (userType === 'seller') {
        const response = await axiosPrivate.put(
          'seller/profile/update',
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
        toast('Update successful', {
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
        navigate(LINKS.sellerProfile);
      } else {
        const response = await axiosCollectorPrivate.put(
          'duo/collector/profile/update',
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
        toast('Update successful', {
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
        navigate(LINKS.collectorProfile);
      }
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
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Paper
      sx={{
        bgcolor: "white",
        py: "2rem",
        px: { xs: "1rem", sm: "2rem", md: "3rem", lg: "3.5rem", xl: "4rem" },
        mt: "4rem",
        borderRadius: "50px",
      }}
    >
      <Box>
        <ProfilePhoto
          setProfilePhoto={setProfilePhoto}
          profilePhoto={profilePhoto}
        />
      </Box>

      <Grid
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(2, 1fr)",
            xl: "",
          },
          columnGap: { xs: "1rem", lg: "1.5rem", xl: "2rem" },
        }}
      >
        <Box sx={{ mt: "1.5rem" }}>
          <Box component={"label"}>First name</Box>
          <TextInput
            fullWidth
            variant={"standard"}
            placeholder={"Enter your first name"}
            name="first_name"
            value={firstname}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFirstname(e.target.value)
            }
          />
        </Box>

        <Box sx={{ mt: "1.5rem" }}>
          <Box component={"label"}>Last name</Box>
          <TextInput
            fullWidth
            variant={"standard"}
            placeholder={"Enter lastname"}
            name="last_name"
            type="text"
            value={lastname}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setLastname(e.target.value)
            }
          />
        </Box>

        <Box sx={{ mt: "1.5rem" }}>
          <Box component={"label"}>Country of residence</Box>
          <FormControl fullWidth>
            <Select
              variant={"standard"}
              fullWidth
              name="country"
              placeholder="country"
              value={country}
              onChange={(event: SelectChangeEvent<string | null>) => {
                setCountry(event.target.value as string);
                handleCountryChange(event);
              }}
            >
              <MenuItem value={"Nigeria"}>Nigeria</MenuItem>
              <MenuItem value={"Israel"}>Israel</MenuItem>
              <MenuItem value={"United States"}>America</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mt: "1.5rem" }}>
          <Box component={"label"}>Phone number</Box>
          <TextInput
            fullWidth
            variant={"standard"}
            placeholder={"Enter countryCode"}
            name="country_code"
            type="text"
            value={phoneNumber}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPhoneNumber(e.target.value)
            }
            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                  sx={{ backgroundColor: "#F0F0F0", height: "100%" }}
                >
                  <Typography sx={{ px: "0.5rem" }}>
                    {countryCode?.includes("+")
                      ? `${countryCode}`
                      : `+${countryCode}`}
                  </Typography>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Grid>
      <Box sx={{ mt: "1.5rem" }}>
        <Box component={"label"}>Email</Box>
        <TextInput
          fullWidth
          variant={"standard"}
          placeholder={"Enter Email "}
          name="mobile"
          type="text"
          value={phoneNumber}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPhoneNumber(e.target.value)
          }
        />
      </Box>

      <Box sx={{ mt: "1.5rem" }}>
        <Box component={"label"}>About</Box>
        <TextInput
          fullWidth
          variant={"standard"}
          placeholder={"Tell us about yourself"}
          name="about"
          type="text"
          value={about}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setAbout(e.target.value)
          }
        />
      </Box>
      <Box sx={{ mt: "1.5rem" }}>
        <Box component={"label"}>Profile Description</Box>
        <TextFieldInputLimit
          textA
          limit={500}
          sx={{ borderRadius: "0.8rem" }}
          rows={4}
          val={profiledesc}
          onChange={(e)=>setProfileDesc(e.target.value)}
        />
      </Box>
      {userType === "seller" && (
        <Box sx={{ mt: "1.5rem" }}>
          <Box component={"label"}>Delivery Option</Box>
          <TextInput
            fullWidth
            variant={"standard"}
            placeholder={"Tell us how you want to deliver your items"}
            name="delivery_option"
            value={deliveryOption}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setDeliveryOption(e.target.value)
            }
          />
        </Box>
      )}

      <Box
        component={"div"}
        sx={{ display: "flex", justifyContent: "space-between", mt: "2rem" }}
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
          Back
        </Button>
        <Button
          sx={{
            backgroundColor: "#0047AB",
            color: "white",
            padding: "0.5rem 3.5rem",
            borderRadius: "0.4rem",
            mt: "2rem",
          }}
          onClick={UpdateProfile}
        >
          {isSubmitting ? (
            <CircularProgress
              size={"2rem"}
              sx={{
                color: "white",
                height: "1rem",
                width: "1rem",
              }}
            />
          ) : (
            "Save"
          )}
        </Button>
      </Box>
    </Paper>
  );
};

export default EditProfileForm;
