import { Box, useMediaQuery } from "@mui/material";
import Image from "src/components/Image";
import eclipse from "src/assets/Image/Ellipse 1949.png";
import eclipse2 from "src/assets/Image/Ellipse2.png";
import logo from "src/assets/Image/Logo.png";
import LoginForm from "src/components/forms/logIn-form";
import { useNavigate } from "react-router-dom";
import LINKS from "src/utilities/links";

const LoginPage = () => {
  const isNotMobileScreens = useMediaQuery("(min-width:900px)");
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100vh", // Set height to full viewport height
        overflow: "hidden", // Prevent scrolling
        bgcolor: "#F4F4F6",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 0,
        padding: "1rem"
      }}
    >
      <Image
        src={eclipse}
        alt="kk"
        sx={{
          position: "absolute",
          width: "10rem",
          height: "10rem",
          top: "83vh",
          left: 0,
          zIndex: 0,
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
      <Box
        sx={{
          height: { xs: "auto", sm: "30rem" },
          zIndex: 15,
          width: { xs: "100%", sm: "100%", md: "50%" }, // Full width on phone view, 50% width on medium and larger screens
          maxWidth: ["30rem"], // Max width of 60rem on small screens and 36rem on medium and larger screens
          padding: ["1rem", "2rem"], // 0.5
          mt: "0.5rem",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }} component="div" onClick={() => navigate(LINKS.Home)}>
          <Image
            src={logo}
            alt="logo"
            sx={{
              width: "100%", // Make the image 80% of the width of its container
              marginBottom: "1rem", // Add a bottom margin of 1rem
            }}
          />
        </Box>
        <LoginForm />
        <Box
          sx={{
            // 2rem for mobile, 3rem for desktop
            mt: "1rem",
            width: "100%",
            "@media (max-width: 600px)": { // Hide the image on screens smaller than 600px (phones)
              display: "none",
            },
          }}
        >
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

export default LoginPage;
