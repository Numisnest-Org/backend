import { Box, Input, InputLabel } from '@mui/material';
import React, { ChangeEvent } from 'react'
import Image from '../Image';
import { CameraAltOutlined } from "@mui/icons-material";
interface Props {
  handleChange: (files: FileList | null) => void;
}
const UploadIcon = ({ handleChange }: Props) => {
  return (
    <Box>
      <Input
        type="file"
        id="file_upload"
        sx={{ display: "none" }}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleChange(e.target.files)
        }
      />
      <InputLabel htmlFor="file_upload">
        <CameraAltOutlined sx={{ width: "20px" }} />
      </InputLabel>
    </Box>
  );
};

export default UploadIcon