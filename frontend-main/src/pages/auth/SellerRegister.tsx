import { Box, useMediaQuery } from "@mui/material";

import Image from "src/components/Image";
import eclipse from "src/assets/Image/Ellipse 1949.png";
import eclipse2 from "src/assets/Image/Ellipse2.png";
import logo from "src/assets/Image/Logo.png";
import RegisterForm, { RegisterType } from "src/components/forms/register-form";
import useAppContext from "src/hooks/useAppContext";
import { useNavigate } from "react-router-dom";
import LINKS from "src/utilities/links";
const SellerRegisterPage = () => {
   const { state } = useAppContext();
   const navigate = useNavigate()
  const isNotMobileScreens = useMediaQuery("(min-width:900px)");
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
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Box component={"div"} onClick={() => navigate(LINKS.Home)}>
          <Image
            src={logo}
            alt="logo"
            sx={{ width: { sm: "20rem", lg: "36rem", zIndex: 9 } }}
          />
        </Box>
        <RegisterForm type={RegisterType.Seller} />
      </Box>
    </Box>
  );
};

export default SellerRegisterPage;
