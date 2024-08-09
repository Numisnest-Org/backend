import React, { CSSProperties, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import OtpInput from "react-otp-input";
import {
  Box,
  Button,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {ArrowLeftOutlined,ArrowBackIos} from "@mui/icons-material"
import Image from "src/components/Image";

import LINKS from "src/utilities/links";
import { axiosPublic } from "src/axios/axios";
import useAppContext from "src/hooks/useAppContext";
import { ActionType } from "src/utilities/context/context";
import TextInput from "../form-components/textInput";
import { toast } from "react-toastify";
;

const VerifyOtpForm = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const styles = useStyles(theme);
  const [otp, setOtp] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isSubmmiting, setIsSubmmiting] = useState<boolean>(false);
  
  
  const mobileScreen = useMediaQuery("(max-width:600px)");
  const {state ,dispatch}= useAppContext()
  const handleSubmit = async () => {
    try {
      setIsSubmmiting(true);
      const response = await axiosPublic.post("duo/general/password/change", {
        email: email,
        pin: otp,
        password:password,
        cpassword:confirmPassword
      });
      console.log(response);
      toast("Password Updated", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        isLoading: false,
        type: "success",
        theme: "light",
        style: {},
      });
      navigate(LINKS.Login);
      setIsSubmmiting(false);
    } catch (error:any) {
      console.log(error)
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
    }
    
  };

  return (
    <Paper
      sx={{
        bgcolor: "white",
        py: "2rem",
        px: { xs: "1rem", sm: "2rem", md: "3rem", lg: "3.5rem", xl: "4rem" },
      }}
    >
      <Typography
        sx={{
          fontSize: "3rem",
          fontWeight: 600,
          textAlign: "center",
          width: "fullWidth",
        }}
      >
        Welcome Back
      </Typography>
      <Typography
        sx={{ textAlign: "center", width: "fullWidth", mt: "1.5rem" }}
      >
        Welcome Back! enter your details to sign in
      </Typography>

      <Box component={"form"}>
        <Box sx={{ mt: "1.5rem" }}>
          <Box component={"label"}>Code</Box>
          <TextInput
            fullWidth
            variant={"standard"}
            placeholder={"Enter Otp code "}
            name="otp"
            onChange={(e) => setOtp(e.target.value)}
          />
        </Box>
        <Box sx={{ mt: "1.5rem" }}>
          <Box component={"label"}>Password</Box>
          <TextInput
            fullWidth
            variant={"standard"}
            placeholder={"Enter password"}
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Box>
        <Box sx={{ mt: "1.5rem" }}>
          <Box component={"label"}>Confirm Password</Box>
          <TextInput
            fullWidth
            variant={"standard"}
            placeholder={"Confirm you password"}
            name="cpassword"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mt: "1.5rem" }}>
          <Button size={"large"} style={styles.button} onClick={handleSubmit}>
            Verify
          </Button>
        </Box>

        <Box sx={{display:"flex",justifyContent:"center",alignItems:"center",mt:"1.5rem"}} component={"div"} onClick={()=>navigate("/")}>
          <ArrowBackIos />{" "}
          <Typography
            sx={{ textAlign: "center", width: "fullWidth", }}
          >
            Go back to home page
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

const useStyles = (theme: any) => ({
  paper: {
    padding: "2rem",
    borderRadius: "10px",
  },
  title: {
    fontWeight: "600",
    textAlign: "center",
    color: theme.palette.secondary.main,
    marginBottom: theme.spacing(3),
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
    marginTop: "2rem",
    alignItems: "center",
  },
  label: {
    display: "inline-block",
    marginBottom: theme.spacing(1),
  },
  button: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    fontWeight: "600",
    justifySelf: "center",
    padding: "10px 40px",
    minWidth: "240px",
  },

  image: {
    maxWidth: "100px",
    margin: "2rem auto",
  },
  inputStyle: {
    height: "4rem",
    width: "4rem",
    color: theme.palette.secondary.main,
    backgroundColor: "#E5EAEE",
    outline: "none",
    border: "none",
    borderRadius: theme.spacing(1),
  },
});

export default VerifyOtpForm;
