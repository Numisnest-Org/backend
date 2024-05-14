import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  maxWidth,
  minWidth,
  sidebarItems,
} from "src/utilities/constants/helpers";
import Image from "../Image";
import logout from "src/assets/Image/AdminIcons/logout.svg";
import admindashselected from "src/assets/Image/AdminIcons/dashiconselected.svg";
const AdminSidebar = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  return (
    <Box
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#0047AB",
        gap: "3rem",
        ml: "2rem",
        padding: "0.25rem",
        pt: "3rem",
      }}
      initial={{ width: isExpanded ? maxWidth : minWidth }}
      animate={{ width: isExpanded ? maxWidth : minWidth }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      component={motion.div}
    >
      {sidebarItems.map((sidebaritem, index) => (
        <MenuListItem
        key={index}
          isExpanded={isExpanded}
          selectedIcon={sidebaritem.selectedIcon}
          icon={sidebaritem.icon}
          name={sidebaritem.name}
          path={sidebaritem.path}
        />
      ))}
      <Box sx={{ mt: "1rem" }}>
        <MenuListItem
          isExpanded={isExpanded}
          icon={logout}
          name="Logout"
          path={"adminauth/login"}
        />
      </Box>
    </Box>
  );
};

export default AdminSidebar;
interface MenuListProps {
  isExpanded: boolean;
  selectedIcon?: string;
  icon: string;
  name: string;
  path?: string;
}

const MenuListItem = ({
  isExpanded,
  selectedIcon,
  icon,
  name,
  path,
}: MenuListProps) => {
  const { pathname } = useLocation();
  const path1 = pathname.slice(1).split("/")[0];
  const [selected, setSelected] = useState<boolean>(false);
  const navigate = useNavigate();
  
  return (
    <Box
      sx={{
        bgcolor: path === path1 ? "#9CC6E2" : "none",
        textAlign: "center",
        py: "0.9rem",
        "&:hover": {
          cursor: "pointer",
        },
      }}
      component={"div"}
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/${path}`);
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: isExpanded ? "flex-start" : "center",
          alignItems: "center",
          ml: isExpanded ? "1.2rem" : "",
        }}
      >
        <Image
          src={path === path1 ? selectedIcon : icon}
          alt="icon"
          sx={{ width: "1.5rem" }}
        />
        <Typography
          component={motion.span}
          animate={{
            transform: isExpanded ? "scale(1)" : "scale(0)",
            display: isExpanded ? "inline-block" : "none",
          }}
         
          sx={{
            color: path === path1 ? "#0047AB" : "white",
            fontSize: "1rem",
            fontWeight: "bold",
            ml: "0.5rem",
          }}
        >
          {name}
        </Typography>
      </Box>
    </Box>
  );
};
