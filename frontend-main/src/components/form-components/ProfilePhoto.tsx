import { Box } from "@mui/material";
import  { useEffect, useMemo, useState } from "react";
import { grey } from "@mui/material/colors";
import UploadIcon from "./UploadIcon";
import { Skeleton } from "@mui/material";
import nora from "src/assets/Image/nora.jpg"
interface Props {
  setProfilePhoto :(value:File)=>void
  profilePhoto :File|string|null|undefined
}
const ProfilePhoto = ({setProfilePhoto,profilePhoto}:Props) => {

 
 
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filePreview,setFilePreview]= useState<any|null>(null )
  
  const handleInputChange = async (files: FileList | null) => {
    let file;
    if (files) {
      file = files[0];
    }
    if (file) {
      setProfilePhoto(file);
      if(typeof file === "object"){
        let url;
        setIsLoading(true);
        url = URL.createObjectURL(file);
        setFilePreview(url)
        setIsLoading(false)
      }
      
      
    } else {
      console.log("file did not upload");
    }
  };

  // const uploadFile = async (file: any) => {
  //   try {
  //     let url;
  //     setIsLoading(true);

  //     url = URL.createObjectURL(file);

  //     const formData = new FormData();
  //     formData.append("profile_picture", file);
  //     formData.forEach((value, key) => {});
  //     const reponse = await axiosPrivate.put(
  //       "packers/me/profileimg",
  //       formData,
  //       {
  //         headers: { "Content-Type": "multipart/form-data" },
  //       }
  //     );

      
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  return (
    <Box
      sx={{
        backgroundColor: grey[50],
        padding: "10px",
        width:"9rem",
        height:"9rem",
        borderRadius: "10px",
        alignSelf: "center",
        position: "relative",
      }}
    >
      {isLoading ? (
        <Skeleton variant="circular" width={100} height={100} />
      ) : (
        <Box
          sx={{
            borderRadius: "50%",
            backgroundImage: `url(${filePreview? filePreview: profilePhoto})`,
            width: "120px",
            height: "120px",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        ></Box>
      )}

      <Box
        sx={{
          position: "absolute",
          backgroundColor: "transparent",
          right: 10,
          bottom: 10,
        }}
      >
        <UploadIcon handleChange={(files)=>handleInputChange(files)} />
      </Box>
    </Box>
  );
};

export default ProfilePhoto;
