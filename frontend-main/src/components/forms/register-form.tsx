import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Typography,
  useTheme,
} from "@mui/material";
import { ChangeEvent, FC, useState } from "react";
import TextInput from "../form-components/textInput";
import { CheckBox } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import LINKS from "src/utilities/links";
import { FormValueRegister } from "src/utilities/types";
import { Formik, FormikHelpers, useFormikContext } from "formik";
import * as yup from "yup";
import { axiosPublic } from "src/axios/axios";
import { toast } from "react-toastify";
import useCountryName from "src/hooks/useCountryName";
import TextFieldInputLimit from "../form-components/TextFieldInputLimit";
import { countries } from "src/utilities/constants/countries";

export enum RegisterType {
  Collector = "collector",
  Seller = "seller",
}
interface Props {
  type: RegisterType;
}

const initialValueRegister: FormValueRegister = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  cpassword: "",
  country_code: "",
  mobile: "",
  about: "",
  delivery_option: "",
  country: "",
};
const registerSchema = yup.object().shape({
  first_name: yup.string().required("required"),
  last_name: yup.string().required("required"),
  email: yup.string().required("required"),
  password: yup.string().required("required"),
  cpassword: yup
    .string()
    .required("required")
    .oneOf([yup.ref("password")], "Passwords must match"),
  country_code: yup.string().required("required"),
  mobile: yup.string().required("required"),
  about: yup.string().required("required"),
  country: yup.string().required("required"),
  delivery_option: yup.string()
});

const registerSchemaSeller = yup.object().shape({
  first_name: yup.string().required("required"),
  last_name: yup.string().required("required"),
  email: yup.string().required("required").email("enter a valid email"),
  password: yup.string().required("required"),
  cpassword: yup
    .string()
    .required("required")
    .oneOf([yup.ref("password")], "Passwords must match"),
  country_code: yup.string(),
  mobile: yup
    .string()
    .required("required"),
  about: yup.string().required("required"),
  delivery_option: yup.string(),
  country: yup.string().required("required"),
});

const RegisterForm = ({ type }: Props) => {
  const theme = useTheme();
  const navigate = useNavigate()
  const blue = theme.palette.primary.light;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const countryNames = useCountryName();
  const [selectedCountryCode, setSelectedCountryCode] = useState<
    string | undefined
  >("");
  const handleCountryChange = (e: SelectChangeEvent<string>) => {
    const selectedCountry = e.target.value as string;
    const countryCode = countries.find(
      (country) => selectedCountry === country.name
    );
    console.log(countryCode?.phone_code);
    setSelectedCountryCode(countryCode?.phone_code || "");
  };
  const sellerRegister = async (values: FormValueRegister) => {
    try {
      values.country_code = selectedCountryCode;
      console.log(values);
      setIsSubmitting(true);
      const response = await axiosPublic.post("seller/signup", values);
      toast("Registration successful", {
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
      setIsSubmitting(false);
      navigate(LINKS.Login);
    } catch (error: any) {
      toast(`${error.response.data.message.split(":")[1]}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        isLoading: false,
        type: "error",
        theme: "light",
        style: {},
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const collectorRegister = async (values: FormValueRegister) => {
    try {
      console.log(values)
      values.country_code = selectedCountryCode
      setIsSubmitting(true);
      const response = await axiosPublic.post("duo/collector/signup", values);
      setIsSubmitting(false);
      toast("Registration successful", {
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
      navigate(LINKS.Login);
    } catch (error: any) {
      toast(`${error.response.data.message.split(":")[1]}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        isLoading: false,
        type: "error",
        theme: "light",
        style: {},
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  
  const handleFormSubmit = async (
    values: FormValueRegister,
    onSubmitProps: FormikHelpers<FormValueRegister>
  ) => {
    try {
      console.log(values)
      type === RegisterType.Collector
        ? await collectorRegister(values)
        : await sellerRegister(values);
      navigate(`${LINKS.verifyEmail}/${values.email}`);
    } catch (error) {}
  };

  return (
    <Formik
      onSubmit={(values, onSubmitProps) =>
        handleFormSubmit(values, onSubmitProps)
      }
      initialValues={initialValueRegister}
      validationSchema={
         registerSchemaSeller
      }
      enableReinitialize
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <Paper
          sx={{
            bgcolor: "white",
            py: "2rem",
            px: {
              xs: "1rem",
              sm: "2rem",
              md: "3rem",
              lg: "3.5rem",
              xl: "4rem",
            },
          }}
          onSubmit={handleSubmit}
          component={"form"}
        >
          <Typography
            sx={{
              fontSize: "3rem",
              fontWeight: 600,
              textAlign: "center",
              width: "fullWidth",
            }}
          >
            Welcome
          </Typography>
          <Typography
            sx={{ textAlign: "center", width: "fullWidth", mt: "1.5rem" }}
          >
            Welcome ! enter your details to Register
          </Typography>
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
              <Box component={"label"}>First Name</Box>
              <TextInput
                fullWidth
                variant={"standard"}
                placeholder={"Enter First Name "}
                name="first_name"
                value={values.first_name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  Boolean(touched.first_name) && Boolean(errors.first_name)
                }
                helperText={touched.first_name && errors.first_name}
              />
            </Box>
            <Box sx={{ mt: "1.5rem" }}>
              <Box component={"label"}>Last Name</Box>
              <TextInput
                fullWidth
                variant={"standard"}
                placeholder={"Enter Last Name"}
                name="last_name"
                value={values.last_name}
                onChange={handleChange}
                error={Boolean(touched.last_name) && Boolean(errors.last_name)}
                helperText={touched.last_name && errors.last_name}
                onBlur={handleBlur}
              />
            </Box>
          </Grid>

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
              <Box component={"label"}>Country</Box>
              <FormControl
                fullWidth
                error={Boolean(touched.country && errors.country)}
              >
                <Select
                  variant={"standard"}
                  fullWidth
                  name="country"
                  value={values.country}
                  onChange={(e) => {
                    handleChange(e);
                    handleCountryChange(e);
                  }}
                  placeholder="country"
                  onBlur={handleBlur}
                >
                  {countryNames.map((countryname) => (
                    <MenuItem value={countryname}>{countryname}</MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {touched.country && errors.country}
                </FormHelperText>
              </FormControl>
            </Box>
            <Box sx={{ mt: "1.5rem" }}>
              <Box component={"label"}>Mobile</Box>
              <TextInput
                fullWidth
                variant={"standard"}
                placeholder={"enter Phonenumber"}
                name="mobile"
                value={values.mobile}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.mobile) && Boolean(errors.mobile)}
                helperText={touched.mobile && errors.mobile}
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      sx={{ backgroundColor: "#F0F0F0", height: "100%" }}
                    >
                      <TextInput
                        sx={{ width: "4rem" }}
                        variant={"standard"}
                        placeholder={"code"}
                        name="country_code"
                        value={selectedCountryCode}
                        onChange={(e) => {
                          setSelectedCountryCode(e.target.value);
                        }}
                      />
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
              placeholder={"Enter Email"}
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
            />
          </Box>

          <Box sx={{ mt: "1.5rem" }}>
            <Box component={"label"}>Password</Box>
            <TextInput
              fullWidth
              variant={"standard"}
              placeholder={"Enter password"}
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
            />
          </Box>
          <Box sx={{ mt: "1.5rem" }}>
            <Box component={"label"}>Confirm Password</Box>
            <TextInput
              fullWidth
              variant={"standard"}
              placeholder={"Confirm you password"}
              name="cpassword"
              value={values.cpassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(touched.cpassword) && Boolean(errors.cpassword)}
              helperText={touched.cpassword && errors.cpassword}
            />
          </Box>
          <Box sx={{ mt: "1.5rem" }}>
            <Box component={"label"}>About</Box>
            <TextFieldInputLimit
              limit={50}
              multiline
              val={values.about}
              placeholder="Tell us about you and what you are collecting"
              sx={{ mt: "-2.5rem" }}
              onBlur={handleBlur}
              onChange={(event) => {
                handleChange({
                  target: {
                    name: "about",
                    value: event.target.value,
                  },
                });
              }}
              error={Boolean(touched.about) && Boolean(errors.about)}
              helperText={touched.about && errors.about}
            />
          </Box>
          {type === RegisterType.Seller && (
            <Box sx={{ }}>
              {/* <Box component={"label"}>Delivery & Pickup</Box>
              <TextFieldInputLimit
                limit={250}
                multiline
                val={values.delivery_option}
                placeholder="How do you want to deliver your items"
                sx={{ mt: "-2.5rem" }}
                onBlur={handleBlur}
                onChange={(event) => {
                  handleChange({
                    target: {
                      name: "delivery_option",
                      value: event.target.value,
                    },
                  });
                }}
                error={
                  Boolean(touched.delivery_option) &&
                  Boolean(errors.delivery_option)
                }
                helperText={touched.delivery_option && errors.delivery_option}
              /> */}
            </Box>
          )}

          <Button
            fullWidth
            sx={{
              bgcolor: "#0047AB",
              color: "white",
              fontSize: "1.5rem",
              borderRadius: "1rem",
              mt: "1.5rem",
            }}
            type="submit"
          >
            Sign Up{" "}
          </Button>
          <Typography
            sx={{
              fontSize: "0.76rem",
              color: "black",
              textAlign: "center",
              width: "fullWidth",
              mt: ".5rem",
            }}
          >
            Already have an account?{" "}
            <Typography
              component={"span"}
              sx={{ fontSize: "0.76rem", color: "#0047AB", fontWeight: 700 }}
            >
              {" "}
              <Link
                to={LINKS.Login}
                style={{
                  textDecoration: "none",
                  padding: "0",
                  margin: "0",
                  color: "#0047AB",
                }}
              >
                Sign In
              </Link>{" "}
            </Typography>
          </Typography>
        </Paper>
      )}
    </Formik>
  );
};
export default RegisterForm;
