import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import { FC, useState } from "react";
import nora from "src/assets/Image/nora.jpg";
import SellerCard from "../cards/SellerCard";
import { Seller, singleSellerWOFeatured } from "src/utilities/types";
import useAppContext from "src/hooks/useAppContext";
import { useLocation, useNavigate } from "react-router-dom";
import LINKS from "src/utilities/links";
import useCollectorsAxiosPrivate from "src/hooks/useCollectorsAxiosPrivate";
import { toast } from "react-toastify";
import { ActionType } from "src/utilities/context/context";
import { useSocket } from "src/utilities/context/socketContext";
import { axiosPublic } from "src/axios/axios";
import SendMessageForm from "../Modal/send-message-form";

const seller: Seller = {
  flag: "ng",
  img: nora,
  name: "James Doe",
  selling: "World Bank Notes",
};
interface Props{
  data?:singleSellerWOFeatured
}
const SellerAbout = ({data }:Props) => {
  const location = useLocation()
  const navigate = useNavigate()
  const {state,dispatch} = useAppContext()
  const {token,user} = state
  const socket = useSocket()
  const axiosCollectorPrivate = useCollectorsAxiosPrivate()
  const path =location.pathname
  const isNotMobileScreens = useMediaQuery("(min-width:600px)");
  const [isDisplayModal, setDisplayModal] = useState<boolean>(false);
  const addFavorites = async ()=>{
    try {
       await axiosCollectorPrivate.post(
        "duo/collector/add-fav",
        { seller_id :data?._id}
      );
      toast("Added to favorites", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        isLoading: false,
        type: "success",
        theme: "light",
        style: {},
      });
    } catch (error:any) {
      toast(`${error.response.data.message.split(":")[1]}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        isLoading: false,
        type: "error",
        theme: "light",
        style: {},
      });
    }
  }
  const addToFavorites = async()=>{
    if(token ){
      await addFavorites()
    }else{
      dispatch({type:ActionType.SetNavigateToUrl ,payload:path})
       navigate(LINKS.Login);
    }
   
  }
  const messageSeller = async() => {
    try {
      if (token) {
        const response = await axiosPublic.post("duo/general/check-room", {
          sender_id: user._id,
          receiver_id: data?._id,
        });
        const { data :check } = response.data;
        if (check.exist) {
          dispatch({ type: ActionType.setMessageid, payload: data?._id });
          navigate(LINKS.chatpage);
        } else {
          setDisplayModal(true);
        }
        console.log(response);
        // socket.emit(
        //   "new room",
        //   { sender_id: state.user._id, receiver_id: id },

        //   function (error:any) {
        //     if (error) {
        //       // Handle the error here
        //       console.error("Error:", error);
        //     } else {
        //       // The event was successfully emitted
        //       console.log("Event 'new room' emitted successfully");
        //     }
        //   }
        // );
        // dispatch({ type: ActionType.setMessageid, payload: id });
        // navigate(LINKS.chatpage)
      } else {
        dispatch({ type: ActionType.SetNavigateToUrl, payload: path });
        navigate(LINKS.Login);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        mt: "5rem",
        alignItems: "center",
        flexDirection: { xs: "column", sm: "column", md: "row" },
      }}
    >
      {isDisplayModal && (
        <SendMessageForm
          contentWidth={"500px"}
          closeModal={() => setDisplayModal(false)}
          senderId={user._id}
          receiverId={data?._id}
        />
      )}
      <SellerCard
        flag={data?.iso_code}
        url={data?.photo.secure_url}
        name={`${data?.first_name} ${data?.last_name}`}
        selling={data?.about}
        id={data?._id}
        approved={data?.approved}
      />
      <Box
        sx={{
          ml: { xs: "0.5rem", sm: "1rem", lg: "3rem" },
          mt: isNotMobileScreens ? "0rem" : "1rem",
        }}
      >
        <Typography
          component={"header"}
          sx={{
            fontSize: { xs: "2.5rem", md: "2.5rem", lg: "2.5rem" },
            fontWeight: 600,
            textAlign: { xs: "center", sm: "center", md: "start" },
          }}
        >
          About
        </Typography>
        <Typography
          component={"p"}
          sx={{
            fontSize: { xs: "1rem", sm: "1.1rem", md: "1.5rem", lg: "2rem" },
            textAlign: { xs: "center", sm: "center", md: "start" },
          }}
        >
          {data?.about.slice(0, 100)}
        </Typography>
        <Box component={"div"} sx={{ display: "flex", mt: "3rem" }}>
          <Button
            fullWidth
            sx={{
              bgcolor: "#0047AB",
              color: "white",
              fontSize: "1rem",
              borderRadius: "0.5rem",
              py: "0.5rem",
            }}
            onClick={messageSeller}
          >
            Message seller
          </Button>
          <Button
            fullWidth
            sx={{
              bgcolor: "#0047AB",
              color: "white",
              fontSize: "1rem",
              borderRadius: "0.5rem",
              ml: "1.5rem",
            }}
            onClick={() => navigate(`/seller/${data?._id}`)}
          >
            Seller's profile
          </Button>
          <Button
            fullWidth
            sx={{
              bgcolor: "#0047AB",
              color: "white",
              fontSize: "1rem",
              borderRadius: "0.5rem",
              ml: "1.5rem",
            }}
            onClick={addToFavorites}
          >
            Add to favorites ❤️
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SellerAbout;
