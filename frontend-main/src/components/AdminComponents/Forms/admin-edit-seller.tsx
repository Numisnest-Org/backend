import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Switch,
  Typography,
} from "@mui/material";
import React, { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ProfilePhoto from "src/components/form-components/ProfilePhoto";
import TextInput from "src/components/form-components/textInput";
import useAdminPrivate from "src/hooks/useAdminPrivate";
import LINKS from "src/utilities/links";
import { SingleSeller, singleSellerWOFeatured } from "src/utilities/types";
interface Props {
  data?: singleSellerWOFeatured;
  SellerId: string | null;
}
const AdminEditsellerForm = ({ data, SellerId }: Props) => {
  SellerId;
  const adminPrivate = useAdminPrivate();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [firstname, setFirstname] = useState<string | null | undefined>(
    data?.first_name
  );
  const [lastname, setLastname] = useState<string | null | undefined>(
    data?.last_name
  );
  const [country, setCountry] = useState<string | null | undefined>(
    data?.country
  );
  const [level, setLevel] = useState<string | null | undefined>(data?.level);
  const [countryCode, setCountryCode] = useState<string | null | undefined>(
    data?.country_code
  );
  const [phoneNumber, setPhoneNumber] = useState<string | null | undefined>(
    data?.mobile
  );
  const [about, setAbout] = useState<string | null | undefined>(data?.about);
  const [deliveryOption, setDeliveryOption] = useState<
    string | null | undefined
  >(data?.delivery_option);
  const [profilePhoto, setProfilePhoto] = useState<
    File | null | undefined | string
  >(data?.photo.secure_url);
  const [approved, setApproved] = useState<boolean | undefined>(data?.approved);
  const [suspended, setSuspended] = useState<boolean | undefined>(
    data?.suspended
  );
  const handleapproved = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApproved(event.target.checked);
  };
  const handleSuspended = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSuspended(event.target.checked);
  };
  const valuesSubmit = [
    { head: "first_name", value: firstname },
    { head: "last_name", value: lastname },
    { head: "country_code", value: countryCode },
    { head: "mobile", value: phoneNumber },
    { head: "about", value: about },
    { head: "delivery_option", value: deliveryOption },
    { head: "country", value: country },
    { head: "approved", value: approved },
    { head: "suspended", value: suspended },
    { head: "level", value: level },
  ];
  const updateSellerProfile = async () => {
    try {
      setIsSubmitting(true);
      const requestData: any = {};

      valuesSubmit.forEach((val) => {
        requestData[val.head] = val.value;
      });

      const response = await adminPrivate.put(
        `admin/seller/update/${SellerId}`,
        requestData
      );
      toast("Update successful", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        isLoading: false,
        type: "success",
        theme: "light",
        style: {},
      });
      navigate("/adminseller");
    } catch (error: any) {
      error;
      toast(`${error.response.data.message.split(":")[1]}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        isLoading: false,
        type: "error",
        theme: "light",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const navigate = useNavigate();
  return (
    <Paper
      sx={{
        bgcolor: "white",
        py: "2rem",
        px: { xs: "1rem", sm: "2rem", md: "3rem", lg: "3.5rem", xl: "4rem" },
        mt: "4rem",
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
          <Box component={"label"}>Firstname</Box>
          <TextInput
            fullWidth
            variant={"standard"}
            placeholder={"Enter your firstname"}
            name="first_name"
            value={firstname}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFirstname(e.target.value)
            }
          />
        </Box>

        <Box sx={{ mt: "1.5rem" }}>
          <Box component={"label"}>Lastname</Box>
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
          <Box component={"label"}>Country</Box>
          <FormControl fullWidth>
            <Select
              variant={"standard"}
              fullWidth
              name="country"
              placeholder="country"
              value={country}
              onChange={(event: SelectChangeEvent<string | null>) =>
                setCountry(event.target.value as string)
              }
            >
              <MenuItem value={"nigeria"}>Nigeria</MenuItem>
              <MenuItem value={"israel"}>Israel</MenuItem>
              <MenuItem value={"america"}>America</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mt: "1.5rem" }}>
          <Box component={"label"}>Country code</Box>
          <TextInput
            fullWidth
            variant={"standard"}
            placeholder={"Enter countryCode"}
            name="country_code"
            type="text"
            value={countryCode}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setCountryCode(e.target.value)
            }
          />
        </Box>
      </Grid>
      <Box sx={{ mt: "1.5rem" }}>
        <Box component={"label"}>Phonenumber</Box>
        <TextInput
          fullWidth
          variant={"standard"}
          placeholder={"Enter phonenumber"}
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

      <Box sx={{ mt: "1.5rem" }}>
        <Box component={"label"}>Level</Box>
        <FormControl fullWidth>
          <Select
            variant={"standard"}
            fullWidth
            name="level"
            placeholder="level"
            value={level}
            onChange={(event: SelectChangeEvent<string | null>) =>
              setLevel(event.target.value as string)
            }
          >
            <MenuItem value={"verified"}>Verified</MenuItem>
            <MenuItem value={"new"}>New</MenuItem>
            <MenuItem value={"trusted"}>Trusted</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ display: "flex", gap: "2rem", mt: "1.5rem" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography>Approved</Typography>
          <Switch checked={approved} onChange={handleapproved} />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography>Suspended</Typography>
          <Switch checked={suspended} onChange={handleSuspended} />
        </Box>
      </Box>

      <Box
        component={"div"}
        sx={{ display: "flex", justifyContent: "flex-end", mt: "2rem" }}
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
          sx={{
            backgroundColor: "#0047AB",
            color: "white",
            padding: "0.5rem 3.5rem",
            borderRadius: "0.4rem",
            mt: "2rem",
          }}
          onClick={updateSellerProfile}
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
            "Update"
          )}
        </Button>
      </Box>
    </Paper>
  );
};

export default AdminEditsellerForm;
