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
import Image from "src/components/Image";

import LINKS from "src/utilities/links";
import { axiosPublic } from "src/axios/axios";
import TextInput from "../form-components/textInput";
import { toast } from "react-toastify";

const RequestOtpForm = () => {
 
  const navigate = useNavigate();
  const theme = useTheme();
  const styles = useStyles(theme);
  const [email,setEmail]= useState<string>("")


  const isEmailValid = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  const handleSubmit = async () => {
    try {
      if (!isEmailValid(email)) {
        toast(`Invalid Email`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          isLoading: false,
          type: "error",
          theme: "light",
          style: { zIndex: "auto" },
        });
      }else{
        const response = await axiosPublic.post("duo/general/password/getcode",{email:email});
        navigate(`${LINKS.verifyOTP}/${email}`);
      }

      
    } catch (error) {
      console.log(error)
    }
    
    
  };
  return (
    <Paper style={styles.paper}>
      <Typography style={styles.title as CSSProperties} variant={"h5"}>
        Get back in no time
      </Typography>
      <Typography
        sx={{ margin: "2rem auto", textAlign: "center", maxWidth: "320px" }}
        variant={"body1"}
      >
        Enter your email, and we'll send you a code to reset your
        password
      </Typography>
      <Box style={styles.form as CSSProperties} component={"form"}>
        <Box>
          <Box style={styles.label} component={"label"}>
            Enter address
          </Box>
          <TextInput
            fullWidth
            variant={"standard"}
            placeholder={"Enter email address"}
            onChange={(e)=>setEmail(e.target.value)}
          />
        </Box>

        <Button
          size={"large"}
          style={styles.button}
          onClick={handleSubmit}
        >
          Send Code
        </Button>
        <Button
          onClick={() => navigate(-1)}
          variant={"outlined"}
          size={"large"}
          style={styles.buttonOutlined}
        >
          Back
        </Button>
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
  buttonOutlined: {
    color: theme.palette.secondary.main,
    borderColor: theme.palette.secondary.main,
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

export default RequestOtpForm;
