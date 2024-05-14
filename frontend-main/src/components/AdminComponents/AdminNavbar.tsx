import { Box, Typography } from "@mui/material";
import logo from "src/assets/Image/Logo.svg";
import Image from "../Image";
import nora from "src/assets/Image/nora.jpg";
import { KeyboardArrowDownOutlined } from "@mui/icons-material";
import useAppContext from "src/hooks/useAppContext";
import dayjs from "dayjs";

const AdminNavbar = () => {
  const {state }= useAppContext()
  const {adminloginDetails}= state
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        pt: "1.5rem",
        px: "2rem",
      }}
    >
      <Image
        src={logo}
        alt="logo"
        sx={{ width: { sm: "15rem", lg: "18rem", zIndex: 9 } }}
      />

      <Box>
        <Typography
          sx={{ fontSize: "1rem", fontWeight: 700, color: "#0047AB" }}
        >
          IP Address:{" "}
          <Typography
            component={"span"}
            sx={{ fontSize: "1rem", fontWeight: 400, color: "#0047AB" }}
          >
            {adminloginDetails?.ip_address}
          </Typography>
        </Typography>
      </Box>
      <Box>
        <Typography
          sx={{ fontSize: "1rem", fontWeight: 700, color: "#0047AB" }}
        >
          Last Login:
          <Typography
            component={"span"}
            sx={{ fontSize: "1rem", fontWeight: 400, color: "#0047AB" }}
          >
            {dayjs(adminloginDetails?.last_login).format("D MMMM, YYYY")}
          </Typography>
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box
          sx={{
            width: "4rem",
            height: "4rem",
            borderRadius: "50%",
            backgroundImage: `url(${nora})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></Box>
        <Typography
          sx={{
            fontSize: "1rem",
            fontWeight: 700,
            color: "#0047AB",
            ml: "1rem",
          }}
        >
          Sparks
        </Typography>
        <KeyboardArrowDownOutlined sx={{ fontSize: "2.5rem" }} />
      </Box>
    </Box>
  );
};

export default AdminNavbar;
