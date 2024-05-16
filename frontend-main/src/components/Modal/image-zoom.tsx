import React, { useState } from 'react'
import ModalWrapper from './ModalWrapper'
import { Box, IconButton } from '@mui/material'
import { Close } from '@mui/icons-material';
import { Photo } from 'src/utilities/types';
type Props = {
  closeModal?: () => void;
  contentWidth?: string;
  filePath:string
  height:string
  imageArray:any[]
};
const ImageZoom = ({closeModal,contentWidth,filePath,height,imageArray}:Props) => {
  console.log(imageArray)
 const filteredImages = imageArray.filter(
   (image:Photo) =>
     image && 
     image?.secure_url && 
     image?.secure_url !== "" 
 );
 const [activeImage,setActiveImage]= useState<string>(filePath)
 console.log(filteredImages)
  return (
    <ModalWrapper contentWidth={contentWidth} height={height ? height : "auto"}>
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
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <img
          src={activeImage}
          alt="zoom"
          style={{ width: "65%", height: "100%", marginTop: "2.5rem" }}
        />
      </Box>
      <Box sx={{display:'flex',gap:"1rem",mt:"2rem", width:"100%",justifyContent:"center"}}>
        {filteredImages.map((image: Photo) => (
          <div onClick={()=>setActiveImage(image.secure_url)}>
            {image?.secure_url === "" && image?.public_id === "" ? (
              null
            ) : (
              <img
                src={image?.secure_url}
                alt="zoom"
                style={{ width: "5rem", height: "5rem", marginTop: "2.5rem" }}
              />
            )}
          </div>
        ))}
      </Box>
    </ModalWrapper>
  );
}

export default ImageZoom