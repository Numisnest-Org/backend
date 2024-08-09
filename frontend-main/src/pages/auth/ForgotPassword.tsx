import { Box, useMediaQuery } from "@mui/material";

import Image from "src/components/Image";
import eclipse from "src/assets/Image/Ellipse 1949.png";
import eclipse2 from "src/assets/Image/Ellipse2.png";
import logo from "src/assets/Image/Logo.png";
import { useState } from "react";
import { axiosPublic } from "src/axios/axios";
import RequestOtpForm from "src/components/forms/request-code-form";
import { useNavigate } from "react-router-dom";
import LINKS from "src/utilities/links";
const ForgotPassword = () => {
  const isNotMobileScreens = useMediaQuery("(min-width:900px)");
  const navigate = useNavigate()
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        bgcolor: "#F4F4F6",
        pt: "1.5rem",
        px: { xs: "1rem", sm: "1rem", md: "2rem", lg: "3rem" },
        display: "flex",

        justifyContent: "center",
        zIndex: 0,
      }}
    >
      <Image
        src={eclipse}
        alt="kk"
        sx={{
          position: "absolute",
          width: "10rem",
          height: "10rem",
          bottom: "-1%",
          left: 0,
        }}
      />
      <Image
        src={eclipse2}
        alt="kk"
        sx={{
          position: "absolute",
          width: "10rem",
          height: "10rem",
          top: 0,
          right: 0,
          zIndex: -1,
        }}
      />
      <Box>
        <Box component={"div"} onClick={() => navigate(LINKS.Home)}>
          <Image
            src={logo}
            alt="logo"
            sx={{ width: { sm: "20rem", lg: "36rem", zIndex: 9 } }}
          />
        </Box>
        <RequestOtpForm />

        <Box sx={{ mt: "1rem", width: "100%" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="auto"
            viewBox="0 0 572 157"
            fill="none"
          >
            <path
              d="M286 156.757C443.953 156.757 572 121.665 572 78.3783C572 35.0911 443.953 0 286 0C128.047 0 0 35.0911 0 78.3783C0 121.665 128.047 156.757 286 156.757Z"
              fill="#2A94F4"
            />
          </svg>
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
