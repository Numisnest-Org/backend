import { Box } from "@mui/material";
import React, { ReactNode } from "react";
import AdminNavbar from "../AdminNavbar";
import AdminSidebar from "../AdminSidebar";
import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";

const AdminWrapper = () => {
  return (
    <Box sx={{ height: "100%" }}>
      <AdminNavbar />
      <Box sx={{ display: "flex", mt: "1rem" }}>
        <AdminSidebar />
        <Box
          sx={{ ml: "1.3rem", width: "100%", px: "1rem" }}
          component={motion.div}
        >
          {" "}
          <Outlet />{" "}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminWrapper;
