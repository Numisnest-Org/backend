import React from 'react'
import ModalWrapper from './ModalWrapper'
import { Box, IconButton } from '@mui/material'
import { Close } from '@mui/icons-material';
type Props = {
  closeModal?: () => void;
  contentWidth?: string;
  filePath:string
};
const ImageZoom = ({closeModal,contentWidth,filePath}:Props) => {
  return (
    <ModalWrapper contentWidth={contentWidth}>
      <IconButton
        onClick={() => typeof closeModal !== "undefined" && closeModal()}
        sx={{
          position: "absolute",
          right: "8px",
          top: "8px",
        }}
      >
        <Close />
      </IconButton>
      <img  src={filePath} alt="zoom" style={{width:"100%",height:"auto",marginTop:"2.5rem"}}/>
    </ModalWrapper>
  );
}

export default ImageZoom