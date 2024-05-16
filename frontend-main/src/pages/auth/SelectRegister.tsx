import { Box, Paper, Typography } from "@mui/material";

import Image from "src/components/Image";
import eclipse from "src/assets/Image/Ellipse 1949.png";
import eclipse2 from "src/assets/Image/Ellipse2.png";
import logo from "src/assets/Image/Logo.png";
import collector from "src/assets/Image/collector.svg"
import seller from "src/assets/Image/eseller.svg"
import LINKS from "src/utilities/links";
import { Link, useNavigate } from "react-router-dom";

const SelectRegister = () => {
  const navigate  = useNavigate()
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
        <Image
          src={logo}
          alt="logo"
          sx={{ width: { sm: "29rem", lg: "36rem", zIndex: 9 } }}
        />
        <Paper
          sx={{
            bgcolor: "white",
            py: "2rem",
            px: {
              xs: "1rem",
              sm: "2rem",
              md: "3rem",
              lg: "3rem",
              xl: "3rem",
            },
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
            I am a
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: "2rem",
              mb: "1rem",
            }}
          >
            <Box
              sx={{
                bgcolor: "#F4F4F6",
                padding: "1rem 2.5rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                "&:hover": {
                  cursor: "pointer",
                },
              }}
              component={"div"}
              onClick={() => navigate(LINKS.CollectorSignUp)}
            >
              <Box sx={{ bgcolor: "white", padding: "2rem" }}>
                {" "}
                <Image
                  src={collector}
                  alt="collectorsvg"
                  sx={{ width: "5rem", height: "5rem" }}
                />
              </Box>
              <Typography
                sx={{
                  fontSize: "1.5rem",
                  color: "#343F7D",
                  textAlign: "center",
                  mt: "0.5rem",
                }}
              >
                {" "}
                Collector
              </Typography>
            </Box>

            <Box
              sx={{
                bgcolor: "#F4F4F6",
                padding: "1rem 2.5rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                "&:hover": {
                  cursor: "pointer",
                },
              }}
              component={"div"}
              onClick={() => navigate(LINKS.SignUp)}
            >
              <Box sx={{ bgcolor: "white", padding: "2rem" }}>
                {" "}
                <Image
                  src={seller}
                  alt="collectorsvg"
                  sx={{ width: "5rem", height: "5rem" }}
                />
              </Box>
              <Typography
                sx={{ fontSize: "1.5rem", color: "#343F7D", mt: "0.5rem" }}
              >
                {" "}
                Seller
              </Typography>
            </Box>
          </Box>
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
                to=""
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
      </Box>
    </Box>
  );
};

export default SelectRegister;
