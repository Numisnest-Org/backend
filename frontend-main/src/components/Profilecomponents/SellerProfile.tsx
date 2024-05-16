import {
  Box,
  Button,
  Paper,
  Typography,
  useMediaQuery,
  Divider,
} from '@mui/material';
import nora from 'src/assets/Image/jenny.jpg';
import _ from 'lodash';
import dayjs from 'dayjs';
import { Spinner } from 'src/pages/Item';
import avater from 'src/assets/Image/numisnest avater.jpg';
import Image from '../Image';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useAppContext from 'src/hooks/useAppContext';
import { useSocket } from 'src/utilities/context/socketContext';
import { ActionType } from 'src/utilities/context/context';
import LINKS from 'src/utilities/links';
import SendMessageForm from '../Modal/send-message-form';
import { useEffect, useState } from 'react';
import { axiosPublic } from 'src/axios/axios';
import delivery from 'src/assets/Image/Delivery.png';
import phone from 'src/assets/Image/Phone Contact.png';
import { toast } from 'react-toastify';
import useCollectorsAxiosPrivate from 'src/hooks/useCollectorsAxiosPrivate';
import infoIcon from '../../assets/Image/info.png';
import { AccountVisibilityType } from 'src/utilities/types';
interface Props {
  firstName?: string;
  lastName?: string;
  createdAt?: Date;
  about?: string;
  countryCode?: string;
  mobile?: string;
  deliveryOptions?: string;
  url?: string;
  country?: string;
  flag?: string;
  profiledescription?:string,isFetching:boolean
  

}

const SellerProfile = ({
  firstName,
  lastName,
  createdAt,
  about,
  countryCode,
  mobile,
  deliveryOptions,
  url,
  country,
  flag,
  profiledescription,
  isFetching
}: Props) => {
  const { id } = useParams();
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const { token, user } = state;
  const location = useLocation();
  const path = location.pathname;
  const isNotMobileScreens = useMediaQuery('(min-width:600px)');
  const socket = useSocket();
  const [isDisplayModal, setDisplayModal] = useState<boolean>(false);
  const axiosCollectorPrivate = useCollectorsAxiosPrivate();
  const [accountVisi,setAccountVisi]= useState<Partial<AccountVisibilityType>>()
  useEffect(()=>{
    const getUserVisibilityType = async ()=>{
      const response = await axiosPublic.get(
        `duo//collector/detmes-visibility/${id}`
      );
      const {data} = response?.data
      console.log(data)
      setAccountVisi(data?.[0])
      
    }
    getUserVisibilityType()
  },[])
  const messageSeller = async () => {
    try {
      if (token) {
        const response = await axiosPublic.post('duo/general/check-room', {
          sender_id: user._id,
          receiver_id: id,
        });
        const { data } = response.data;
        if (data.exist) {
          dispatch({ type: ActionType.setMessageid, payload: id });
          navigate(LINKS.chatpage);
        } else {
          setDisplayModal(true);
        }
        
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
  const addFavorites = async () => {
    try {
      await axiosCollectorPrivate.post('duo/collector/add-fav', {
        seller_id: id,
      });
      toast('Added to favorites', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        isLoading: false,
        type: 'success',
        theme: 'light',
        style: {},
      });
    } catch (error: any) {
      console.log(error);
      toast(`${error.response.data.message.split(':')[1]}`, {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        isLoading: false,
        type: 'error',
        theme: 'light',
        style: {},
      });
    }
  };

  const addToFavorites = async () => {
    if (token) {
      await addFavorites();
    } else {
      dispatch({ type: ActionType.SetNavigateToUrl, payload: path });
      navigate(LINKS.Login);
    }
  };
  if (
    
    !firstName ||
    !lastName ||
    !createdAt ||
    !about ||
    !countryCode ||
    !mobile ||
    !deliveryOptions ||
    !country
  ) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {isFetching ? <Spinner /> : <Typography variant='h2'>Profile not available</Typography> }
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        position: "relative",
        mt: "4rem",
        width: "100%",
        maxWidth: "1110px",
        marginLeft: "auto",
        marginRight: "auto",
        borderRadius: "24px",
        boxShadow: "1px 2px 2px #0000",
      }}
    >
      {isDisplayModal && (
        <SendMessageForm
          contentWidth={"500px"}
          closeModal={() => setDisplayModal(false)}
          senderId={user._id}
          receiverId={id}
        />
      )}
      <Box
        sx={{
          paddingTop: { xs: "2rem", md: "3rem" },
          paddingRight: { xs: "20px", md: "40px" },
          paddingLeft: { xs: "20px", md: "40px" },
          paddingBottom: { xs: "1.8rem", md: "2.8rem" },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "start", md: "center" },
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: { xs: "1.6rem", md: "" },
          }}
        >
          <Box sx={{ display: "flex", gap: { xs: "10px", md: "4rem" } }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "start",
                gap: { xs: "1rem", md: "1.2rem" },
              }}
            >
              <Box
                sx={{
                  width: { xs: "5rem", md: "10rem" },
                  aspectRatio: "1",
                  backgroundImage: `url(${url})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              ></Box>
              <Box
                className={`fi fi-${flag?.toLowerCase()}`}
                sx={{
                  width: { xs: "30px", md: "50px" },
                  aspectRatio: "1",
                }}
              ></Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                marginRight: "auto",
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "1.2rem", md: "1.8rem" },
                  fontWeight: "700",
                }}
              >{`${_.upperFirst(firstName)} ${_.upperFirst(
                lastName
              )}`}</Typography>
              <Typography sx={{ fontSize: { xs: ".9rem", md: "1.2rem" } }}>
                {about}
              </Typography>
            </Box>
          </Box>
          <Box display={"flex"} flexDirection={"column"}>
            <Button
              sx={{
                width: { xs: "80px", md: "110px" },
                backgroundColor: "#0047AB",
                color: "white",
                padding: "0.5rem 2.5rem",
                fontWeight: "400",
                fontSize: { xs: "13px", md: "1rem" },
                borderRadius: "0.4rem",
                "&:hover": { color: "#fff", backgroundColor: "#1166dc" },
              }}
              onClick={messageSeller}
              disabled={!accountVisi?.messaging === true}
            >
              {accountVisi?.messaging === true
                ? "Message"
                : "Messaging disabled"}
            </Button>
            {/* <Button
              sx={{
                width: { xs: "80px", md: "110px" },
                backgroundColor: "#0047AB",
                color: "white",
                padding: "0.5rem 2.5rem",
                fontWeight: "400",
                fontSize: { xs: "13px", md: "1rem" },
                borderRadius: "0.4rem",
                mt:"1rem",
                "&:hover": { color: "#fff", backgroundColor: "#1166dc" },
              }}
              onClick={addToFavorites}
            >
              Add to favourites
            </Button> */}
          </Box>
        </Box>

        <Box
          sx={{
            mt: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: { xs: "1rem", md: "1.6rem" },
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              gap: { xs: "1rem", md: "2rem" },

              alignItems: "center",
            }}
          >
            <img
              src={infoIcon}
              alt="information icon"
              style={{ width: "50px" }}
            />
            <>
              <Typography
                sx={{
                  width: "80%",
                  fontWeight: "500",
                  fontSize: { md: "18px" },
                  wordWrap: "break-word",
                }}
              >
                Member Since {dayjs(createdAt).format("DD.MM.YYYY  ")}
                <Box
                  sx={{
                    width: { xs: "20%", md: "10%" },
                    height: "2px",
                    marginTop: "10px",
                    backgroundColor: "#69696999",
                  }}
                ></Box>
              </Typography>
            </>
          </Box>

          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              gap: { xs: "1rem", md: "2rem" },

              alignItems: "center",
            }}
          >
            <img src={delivery} alt="delivery" style={{ width: "50px" }} />
            <>
              <Typography
                sx={{
                  width: "80%",
                  fontWeight: "500",
                  fontSize: { md: "18px" },
                  wordWrap: "break-word",
                }}
              >
                {accountVisi?.details === true
                  ? deliveryOptions
                  : "Not available"}
                <Box
                  sx={{
                    width: { xs: "20%", md: "10%" },
                    height: "2px",
                    marginTop: "10px",
                    backgroundColor: "#69696999",
                  }}
                ></Box>
              </Typography>
            </>
          </Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              gap: { xs: "1rem", md: "2rem" },

              alignItems: "center",
            }}
          >
            <img
              src={infoIcon}
              alt="information icon"
              style={{ width: "50px" }}
            />
            <>
              <Typography
                sx={{
                  width: "80%",
                  fontWeight: "500",
                  fontSize: { md: "18px" },
                  wordWrap: "break-word",
                }}
              >
                Profle Description  {profiledescription}
                <Box
                  sx={{
                    width: { xs: "20%", md: "10%" },
                    height: "2px",
                    marginTop: "10px",
                    backgroundColor: "#69696999",
                  }}
                ></Box>
              </Typography>
            </>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: { xs: "1rem", md: "2rem" },
              alignItems: "center",
            }}
          >
            <img src={phone} alt="delivery" style={{ width: "50px" }} />
            <Box>
              <Typography sx={{ fontWeight: "500", fontSize: { md: "18px" } }}>
                Phone Number {`${countryCode}${mobile}`}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SellerProfile;
function Loading() {
  return <h2>🌀 Loading...</h2>;
}
