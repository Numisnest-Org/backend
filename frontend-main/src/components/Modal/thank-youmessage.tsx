import React, { ReactElement } from "react";
import ModalWrapper from "./ModalWrapper";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import { ReportProblemRounded } from "@mui/icons-material";
import numiverify from "src/assets/Image/numiverify.png"
import Image from "../Image";
interface Props {
  contentWidth: string;
  closeModal?: () => void;
  
  icon?: ReactElement;
  text?: string;
  
}

const ThankyouModal = ({
  contentWidth,
  closeModal,

  icon,
  text,
  
}: Props) => {
  return (
    <ModalWrapper contentWidth={contentWidth}>
      <Box>
        <IconButton
          onClick={() => typeof closeModal !== "undefined" && closeModal()}
          sx={{
            position: "absolute",
            right: "8px",
            top: "8px",
          }}
        >
          <CloseOutlined />
        </IconButton>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: "2rem",
          }}
        >
          <Box>
            <Image src={numiverify}  alt= "verfyy" width={"10rem"}/>
          </Box>
          <Typography sx={{mb:"1rem"}}>Thank you for contacting us</Typography>
          <Typography>we will get back to you as soon as possible</Typography>
          
        </Box>
      </Box>
    </ModalWrapper>
  );
};

export default ThankyouModal;
