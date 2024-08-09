import React from 'react';
import { Typography, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import LINKS from 'src/utilities/links';

const Footer = () => {
  
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "100px",
        paddingInline: "20px",
        paddingBottom: "60px",
        textAlign: "center",
      }}
    >
      <Divider
        sx={{
          width: "100%",
          margin: "10px",
          height: "4px",
          backgroundColor: "#69696980",
        }}
      />

      <Typography
        sx={{
          fontSize: "20px",
          fontWeight: "700",
          color: "#0047AB",
          paddingTop: "20px",
        }}
        component={"div"}
      >
        <Link to={LINKS.disclaimer}>Disclaimer</Link>
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: "12px", md: "16px" },
          color: "#000000",
          paddingTop: "10px",
        }}
      >
        Copyright© 2023-2024 Numisnest. All Rights Reserved.
      </Typography>
    </div>
  );
};

export default Footer;
