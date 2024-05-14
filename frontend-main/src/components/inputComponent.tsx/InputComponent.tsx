import {
  CameraAltOutlined,
  CloseOutlined,
  DeleteOutlined,
  VideoCameraBackOutlined,
} from "@mui/icons-material";
import { Box, IconButton, Input, InputLabel, Typography, useTheme } from "@mui/material";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import Image from "../Image";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import cameraicon from "src/assets/Image/cameraicon.png"
import videoicon from  "src/assets/Image/vide.jpg"
interface Props {
  acceptType?: string;
  pnum?: number;
  setFile: (value: File | null | string) => void;
  fileName?: File | null | any;
}

const InputComponent = ({ acceptType, pnum, setFile, fileName }: Props) => {
  console.log(fileName)
  const theme = useTheme()
  const axiosPrivate = useAxiosPrivate();
  const [preview, setPreview] = useState<any>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const handleChange = async (files: FileList | null) => {
    const formdata = new FormData();
    let url;
    if (files) {
      setFile(files[0]);
      url = URL.createObjectURL(files[0]);
      setPreview(url);

      if (acceptType === "img") {
        if (files[0].size > 5 * 1024 * 1024) {
         toast("File size exceeds 5 MB", {
           position: "top-right",
           autoClose: 8000,
           hideProgressBar: false,
           closeOnClick: true,
           pauseOnHover: true,
           isLoading: false,
           type: "error",
           theme: "light",
           style: {},
         });
         setFile(null)
         setPreview(null)
          
        }else{
          console.log(files[0]);
          formdata.append("photo", files[0]);
          const response = await axiosPrivate.post(
            "seller/upload-photo",
            formdata,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          const { data } = response.data;
          setFile(data);
        }

        
      } else {
        formdata.append("video", files[0]);
        setVideoDuration(null); // Reset previous duration
        const videoElement = document.createElement("video");
        videoElement.src = URL.createObjectURL(files[0]);

        videoElement.oncanplay = async () => { 
         console.log(files[0].size <= 50 * 1024 * 1024);
          setVideoDuration(videoElement.duration);
          if (files[0].size <= 50 * 1024 * 1024) {
            toast(`Video is over 50mb`, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              isLoading: false,
              type: "error",
              theme: "light",
              style: {},
            });
            setFile(null);
            setPreview(null);
          }
          if (videoElement.duration > 60 ) {
            toast(`Video is over 1 minute`, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              isLoading: false,
              type: "error",
              theme: "light",
              style: {},
            });
            setFile(null);
            setPreview(null);
          }
           else {
            console.log("uploading");
            const response = await axiosPrivate.post(
              "seller/upload-video",
              formdata,
              {
                headers: { "Content-Type": "multipart/form-data" },
              }
            );
            const { data } = response.data;
            setFile(data);
          }
          URL.revokeObjectURL(videoElement.src);
          videoElement.remove();
        };
        
         
      }
    }
  };
  useEffect(()=>{
    if (fileName){
      setPreview(fileName)
    }
  },[])
  return (
    <Box sx={{ textAlign: 'center' }}>
      <input
        ref={fileInputRef}
        type="file"
        id={`file_upload${pnum}`}
        style={{ display: 'none' }}
        accept={
          acceptType === 'video'
            ? 'video/*'
            : acceptType === 'img'
            ? 'image/*'
            : ''
        }
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleChange(e.target.files)
        }
      />

      <IconButton>
        <InputLabel htmlFor={`file_upload${pnum}`} sx={{ padding: '0.3rem' }}>
          {acceptType === 'video' ? (
            <Box>
              {preview ? (
                <Box>
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      backgroundColor: theme.palette.primary.light,
                      color: 'white',
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setPreview(null);
                      setFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                  <video
                    style={{ width: '15rem', height: '12rem' }}
                    controls // Add controls for video playback
                  >
                    <source
                      src={fileName.secure_url ? fileName.secure_url : preview}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </Box>
              ) : (
                <Box>
                  <Image
                    src={videoicon}
                    alt="camera"
                    sx={{ width: '6rem', aspectRation: '1' }}
                  />
                  {/* <VideoCameraBackOutlined
                    sx={{ color: "#0047AB", fontSize: "9rem" }}
                  /> */}
                </Box>
              )}
            </Box>
          ) : (
            <Box>
              {preview ? (
                <Box sx={{ position: 'relative' }}>
                  <Box
                    sx={{
                      backgroundImage: `url(${preview}    tyrxg )`,
                      width: '15rem',
                      height: '9rem',
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                    }}
                  >
                    {' '}
                  </Box>
                  <IconButton
                    sx={{ position: 'absolute', top: -15, right: -22 }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setPreview(null);
                      setFile(null);
                    }}
                  >
                    <CloseOutlined
                      sx={{ color: 'red', fontSize: '2rem', zIndex: 700 }}
                    />
                  </IconButton>
                </Box>
              ) : (
                <Box>
                  <Image
                    src={cameraicon}
                    alt="camera"
                    sx={{ width: '12rem', height: '10rem' }}
                  />
                  {/* <CameraAltOutlined
                    sx={{ color: "#0047AB", fontSize: "9rem" }}
                  /> */}
                </Box>
              )}
            </Box>
          )}
        </InputLabel>
      </IconButton>

      <Typography>
        {acceptType === 'video' ? 'Video' : `Photo ${pnum}`}
      </Typography>
    </Box>
  );
};

export default InputComponent;
