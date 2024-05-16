import React, { ReactNode } from "react";
import { Box, useTheme } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  children: ReactNode;
  contentWidth?: string;
  height?:string
};
const modalVariant = {
  inactive: {
    y: "-100vh",
    opacity: 0,
  },
  active: {
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.4,
      duration: 0.5,
      when: "beforeChildren",
    },
  },
  remove: {
    y: "-100vh",
    opacity: 0,
    transition: {
      delay: 0.5,
      duration: 0.5,
    },
  },
};
const ModalWrapper = ({ children, contentWidth = "480px",height }: Props) => {
  const theme = useTheme();
  return (
    <Box>
      <AnimatePresence>
        <Box
        key="modal-box"
          sx={{
            position: "fixed",
            top: "0px",
            left: "0px",
            height: "100vh",
            width: "100%",
            backgroundColor: "rgba(40, 83, 107, 0.7)",
            zIndex: theme.zIndex.modal,
            overflow: "auto",
          }}
          component={motion.div}
          variants={modalVariant}
          initial="inactive"
          animate="active"
          exit="remove"
        >
          <Box
            sx={{
              maxWidth: contentWidth,
              margin: "10rem auto",
              width: "100%",
              height:height?height:"auto",
              backgroundColor: "white",
              padding: "15px",
              borderRadius: "10px",
              position: "relative",
            }}
          >
            {children}
          </Box>
        </Box>
      </AnimatePresence>
    </Box>
  );
};

export default ModalWrapper;
