import React, { CSSProperties, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import OtpInput from "react-otp-input";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import LINKS from "src/utilities/links";
import { axiosPublic } from "src/axios/axios";

const VerifyEmailOtpForm = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const styles = useStyles(theme);
  const [otp, setOtp] = useState<string>("");
  const [isSubmmiting, setIsSubmmiting] = useState<boolean>(false);
  const disapbleButton = () => {
    if (otp.length === 6) {
      return false;
    }
    return true;
  };
  const mobileScreen = useMediaQuery("(max-width:600px)");

  const handleSubmit = async () => {
    try {
      setIsSubmmiting(true);
      const response = await axiosPublic.post("duo/general/verify-email", {
        email: email,
        pin: otp,
      });
      navigate(LINKS.Login)
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmmiting(false);
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
        Kindly input the verification code sent to your email.
      </Typography>
      <Box style={styles.form as CSSProperties} component={"form"}>
        <OtpInput
          containerStyle={{ color: theme.palette.secondary.main }}
          inputStyle={{
            ...styles.inputStyle,
            height: mobileScreen ? "2.6rem" : "4rem",
            width: mobileScreen ? "2.6rem" : "4rem",
          }}
          value={otp}
          onChange={(value: any) => setOtp(value)}
          numInputs={6}
          renderSeparator={<span style={{ padding: "0.2rem" }}></span>}
          renderInput={(props) => <input {...props} />}
        />
        <Button
          size={"large"}
          disabled={disapbleButton() || isSubmmiting}
          style={styles.button}
          onClick={handleSubmit}
        >
          {isSubmmiting ? (
            <CircularProgress
              size={"2rem"}
              sx={{
                color: "white",
                height: "1rem",
                width: "1rem",
              }}
            />
          ) : (
            "Verify"
          )}
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

export default VerifyEmailOtpForm;
