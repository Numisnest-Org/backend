import { Box, Typography } from "@mui/material";

import { Link, useLocation } from "react-router-dom";
interface Props {
  title: string;
  path: string;
  link:string;
}

const NavLinks = ({ title, path,link }: Props) => {
  const { pathname } = useLocation();
  const path1 = pathname.slice(1).split("/")[0];
  const isPath = path === path1
  
  return (
    <Link to={link} style={{ textDecoration: "none", color: "none",padding:"0",margin:"0" , height : '100%'}}>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" ,height : '100%' }}
      >
        <Typography
          sx={{
            // fontSize: "1.5rem",
            color: isPath ? "#0047AB" : "#000000",
            fontWeight: 400,
          }}
        >
          {title}
        </Typography>
        {isPath && (
          <Box sx={{position : 'absolute' , mt : '15px'}}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="5"
              height="15"
              viewBox="0 0 4 4"
              fill="none"
            >
              <circle cx="2" cy="2" r="2" fill="#0047AB" />
            </svg>
          </Box>
        )}
      </Box>
    </Link>
  );
};

export default NavLinks;
