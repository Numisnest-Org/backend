import {
  Box,
  Container,
  Typography,
  useMediaQuery,
  Divider,
  Button,
} from "@mui/material";
import { SingleItemType } from "src/utilities/types";
import { Photo, ReportProblemRounded } from "@mui/icons-material";
import SimilarItems from "./similarItems";
import Itemdisplay2 from "./itemdisplay2";
import { textFromat } from "src/utilities/constants/helpers";
import "../../assets/css/style.css";
import currencyImg from "../../assets/Image/money.png";
import Link from "@mui/material/Link";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { upperFirst } from "lodash";
import dayjs from "dayjs";
import avater from "src/assets/Image/numisnest avater.jpg";
import delivery from "../../assets/Image/Delivery.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import useAppContext from "src/hooks/useAppContext";
import useCollectorsAxiosPrivate from "src/hooks/useCollectorsAxiosPrivate";
import { toast } from "react-toastify";
import { ActionType } from "src/utilities/context/context";
import LINKS from "src/utilities/links";
import { axiosPublic } from "src/axios/axios";
import EditItemsModal from "../Modal/edit-ItemsModal";
import ConfirmationModal from "../Modal/are-you-sure";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import DOMPurify from "dompurify";
import useScrollToTop from "src/hooks/useScrolllToTop";

const ItemDisplay = ({
  data,
  refresh,
  setRefresh,
}: {
  data?: SingleItemType | null;
  refresh: boolean;
  setRefresh: (value: boolean) => void;
}) => {
  const isMobile = useMediaQuery("(max-width:1004px)");
  useScrollToTop();
  const isNotMobileScreens = useMediaQuery("(min-width:600px)");
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [isDisplayModal, setDisplayModal] = useState<boolean>(false);
  const { state, dispatch } = useAppContext();
  const { token, user } = state;
  const axiosCollectorPrivate = useCollectorsAxiosPrivate();
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  console.log(data);
  const hideItem = async () => {
    try {
      const response = await axiosPrivate.put(
        `seller/update-item/${data?._id}`,
        { available: !data?.available }
      );
      console.log(response);
      toast("Update successful", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        isLoading: false,
        type: "success",
        theme: "light",
        style: {},
      });
    } catch (error: any) {
      console.log(error);
      toast(`${error.response.data.message.split(":")[1]}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        isLoading: false,
        type: "error",
        theme: "light",
      });
    }
  };

  const addFavorites = async () => {
    try {
      await axiosCollectorPrivate.post("duo/collector/add-fav", {
        seller_id: data?._id,
      });
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
    } catch (error: any) {
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
  };

  const addToFavorites = async () => {
    if (token) {
      await addFavorites();
    } else {
      dispatch({ type: ActionType.SetNavigateToUrl, payload: path });
      navigate(LINKS.Login);
    }
  };

  const messageSeller = async () => {
    try {
      if (token) {
        const response = await axiosPublic.post("duo/general/check-room", {
          sender_id: user._id,
          receiver_id: data?._id,
        });
        const { data: check } = response.data;
        if (check.exist) {
          dispatch({ type: ActionType.setMessageid, payload: data?._id });
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
  console.log(data);

  return (
    <>
      {showEdit && (
        <EditItemsModal
          contentWidth={"1200px"}
          closeModal={() => setShowEdit(false)}
          itemId={data?._id}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      )}
      {showDeleteModal && (
        <ConfirmationModal
          contentWidth={"400px"}
          closeModal={() => setShowDeleteModal(false)}
          itemId={data?._id}
          text="delete item"
          handleItem={async () => {
            try {
              await axiosPrivate.delete(`seller/delete-item/${data?._id}`);
              toast("Item deleted", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                isLoading: false,
                type: "success",
                theme: "light",
                style: {},
              });
              typeof setRefresh !== "undefined" && setRefresh(!refresh);
              navigate(LINKS.Allitems);
              setShowDeleteModal(false);
            } catch (error: any) {
              toast(`${error.response.data.message.split(":")[1]}`, {
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
            }
          }}
          icon={
            <ReportProblemRounded
              sx={{ color: " #D03531 ", fontSize: "4.5rem" }}
            />
          }
        />
      )}
      <Box
        className=""
        sx={{
          width: "100%",
          maxWidth: "1300px",
          marginLeft: "auto",
          marginRight: "auto",
          paddingTop: "70px",
        }}
      >
        <Box
        // className="custom-row"
        // sx={{ display: 'flex', flexWrap: 'wrap' }}
        >
          <Box
          // className="product-img"
          // sx={{ maxWidth: '50%', flex: '0 50%' }}
          >
            <Box
              // className="product-img-inner"
              // sx={isNotMobileScreens ? {} : { width: '100%' }}
              sx={{
                display: "grid",
                gridTemplateColumns: `${isMobile ? "" : "1fr 1fr"}`,
                gap: "3rem",
              }}
            >
              <Itemdisplay2
                arr={data?._id ? [...data.photos, data?.video] : []}
                sellerId={data?.seller_info[0]?._id}
                itemId={data?._id}
                setShowEdit={setShowEdit}
                showEdit={showEdit}
                showDeletemodal={showDeleteModal}
                setShowDeletemodal={setShowDeleteModal}
                hideItem={hideItem}
              />
              <Box
              // className="product-description"
              // sx={{ maxWidth: '50%', flex: '0 50%' }}
              >
                <Box
                // className="pd-inner"
                // sx={{ maxWidth: '520px', pl: '64px' }}
                >
                  <Box className="pd-title">
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: "600",
                        fontSize: { xs: "1.2rem", md: "1.8rem" },
                        paddingBottom: "30px",
                        borderBottom: "2px solid #000",
                      }}
                    >
                      {textFromat(data?.name)}
                    </Typography>
                  </Box>
                  <Box className="pd-middle">
                    <Box
                      className="pdm-date"
                      sx={{ textAlign: "right", mt: "5px" }}
                    >
                      <Typography
                        sx={{
                          color: "#0047AB",
                          fontSize: "16px",
                          fontWeight: "600",
                        }}
                      >
                        {data?.createdAt
                          ? dayjs(data?.createdAt).format("DD.MM.YYYY")
                          : ""}
                      </Typography>
                    </Box>
                    <Box className="pdm-price">
                      <Typography
                        sx={{
                          color: "#0047AB",
                          fontSize: { xs: "1.2rem", md: "1.6rem" },
                          fontWeight: "600",
                          padding: "8px 16px",
                          background: "#fff",
                          borderRadius: "16px",
                        }}
                        component="span"
                      >{`${Math.round(
                        Number(`${data?.convertedPrice}`)
                      )} ${data?.convertedCurrency?.toUpperCase()}`}</Typography>
                    </Box>
                  </Box>
                  <Box className="pd-bottom" sx={{ pt: "47px" }}>
                    <Box
                      className="white-box"
                      sx={{
                        p: "24px",
                        background: "#fff",
                        border: "1px solid #00000099",
                        borderRadius: "8px",
                      }}
                    >
                      <Typography
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(data?.description),
                        }}
                      />
                    </Box>
                    <Box sx={{ display: "flex", gap: "16px", pt: "16px" }}>
                      <Typography sx={{ fontSize: "14px" }}>
                        Country: {upperFirst(`${data?.country}`)}
                      </Typography>
                      <Typography sx={{ fontSize: "14px" }}>
                        Category: {upperFirst(`${data?.category}`)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
            {typeof user !== "undefined" && (
              <Box>
                {user?._id !== data?.seller_id && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "",
                      gap: isMobile ? "2rem" : "10rem",
                      flexDirection: `${isMobile ? "column-reverse" : "row"}`,
                    }}
                  >
                    <Box
                      className="seller-details"
                      style={{ paddingInline: "10px" }}
                      sx={{ pt: `${isMobile ? "10px" : "40px"}` }}
                    >
                      <Typography
                        sx={{
                          fontSize: { xs: "1.1rem", md: "1.6rem" },
                          fontWeight: "600",
                        }}
                      >
                        Seller
                      </Typography>
                      <Box
                        sx={{
                          paddingTop: "18px ",
                          paddingBottom: "18px",
                          paddingLeft: { xs: "10px", md: "16px" },
                          paddingRight: { xs: "10px", md: "16px" },
                          background: "#fff",
                          border: "2px solid #00000099",
                          borderRadius: "8px",
                          maxWidth: `${isMobile ? "auto" : "566px"}`,
                          display: "grid",
                          gap: { xs: "0.8rem", md: "1rem" },
                          placeItems: "center",
                          gridTemplateColumns: {
                            xs: "0.3fr 2fr 2fr",
                            md: "1.1fr 1.8fr auto",
                          },
                        }}
                        className="sellerBox"
                      >
                        <Box
                          className="sellerImg"
                          sx={{ width: { xs: "60px", md: "100px" } }}
                        >
                          {data?.seller_info[0].photo.secure_url ? (
                            <img
                              style={{ width: "100%" }}
                              src={data?.seller_info[0].photo.secure_url}
                              alt=""
                            />
                          ) : (
                            <img
                              style={{ width: "100%" }}
                              src={avater}
                              alt=""
                            />
                          )}
                        </Box>
                        <Box className="sellerText">
                          <Typography
                            className="sellerName"
                            sx={{
                              fontSize: { sx: "1rem", md: "1.2rem" },
                              fontWeight: "600",
                            }}
                          >
                            {upperFirst(`${data?.seller_info[0].first_name}`)}{" "}
                            {upperFirst(`${data?.seller_info[0].last_name}`)}
                          </Typography>
                          <Typography
                            sx={{
                              wordWrap: "break-word",
                              width: "100%",
                              maxWidth: { xs: "140px", md: "200px" },
                              fontSize: { xs: ".7rem", md: ".8rem" },
                            }}
                          >
                            {data?.seller_info[0].about}
                          </Typography>
                        </Box>
                        <Box
                          className="sellerbtn blue-btn"
                          component={"div"}
                          onClick={messageSeller}
                        >
                          Message Seller
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          display: `${isMobile ? "none" : "block"}`,
                          mt: "36px",
                        }}
                        component={"div"}
                        onClick={addToFavorites}
                      >
                        Add to favorites{" "}
                        <Typography sx={{ color: "#EE1A1A !important" }}>
                          {" "}
                          <FavoriteIcon />{" "}
                        </Typography>
                      </Box>
                    </Box>

                    <Box>
                      <Box
                        className="grayBox"
                        sx={{
                          background: "rgb(133 133 133 / 19%)",
                          p: "24px",
                          borderRadius: "24px",
                          mt: `${isMobile ? "40px" : "70px"}`,
                          maxWidth: `${isMobile ? "auto" : "500px"}`,
                          width: "100%",
                        }}
                      >
                        <Typography
                          sx={{
                            display: "flex",
                            gap: "10px",
                            mb: "16px",
                            fontWeight: "600",
                          }}
                        >
                          <Typography sx={{ color: "#0047AB" }}>
                            <LocalShippingIcon />
                          </Typography>{" "}
                          Purchase & delivery
                        </Typography>
                        <Typography sx={{ wordWrap: "break-word" }}>
                          {data?.seller_info[0].delivery_option}
                        </Typography>
                      </Box>{" "}
                      <Box
                        sx={{
                          display: `${isMobile ? "block" : "none"}`,
                          mt: "36px",
                        }}
                      >
                        <Link
                          className="blue-btn"
                          sx={{ color: "#fff", textDecoration: "none" }}
                        >
                          Add to favorites{" "}
                          <Typography sx={{ color: "#EE1A1A !important" }}>
                            {" "}
                            <FavoriteIcon />{" "}
                          </Typography>
                        </Link>
                      </Box>
                      {/* <Box
                        sx={{
                          mt: "48px",
                          textAlign: "right",
                          display: `${isMobile ? "none" : "block"}`,
                        }}
                      >
                        <Link className="red-btn">
                          {" "}
                          <Typography sx={{ color: "#fff !important" }}>
                            <WarningAmberIcon />
                          </Typography>{" "}
                          Report this Item
                        </Link>
                      </Box> */}
                    </Box>
                  </Box>
                )}{" "}
              </Box>
            )}

            <Box
              sx={{
                mt: `${isMobile ? "30px" : "48px"}`,
                textAlign: "right",
                display: `${isMobile ? "block" : "none"}`,
              }}
            >
              <Link className="red-btn">
                {" "}
                <Typography sx={{ color: "#fff !important" }}>
                  <WarningAmberIcon />
                </Typography>{" "}
                Report this Item
              </Link>
            </Box>
          </Box>
        </Box>
        <Box className="similarItem">
          <SimilarItems data={data?.similar_items} />
        </Box>
      </Box>
    </>
  );
};

export default ItemDisplay;
