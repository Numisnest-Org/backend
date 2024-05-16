import React, { ReactElement } from "react";
import ModalWrapper from "./ModalWrapper";
import {
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import { ReportProblemRounded } from "@mui/icons-material";
import numiverify from "src/assets/Image/numiverify.png";
import Image from "../Image";
import money from "src/assets/Image/money.png";
import useAppContext from "src/hooks/useAppContext";
import { ActionType } from "src/utilities/context/context";
import { useNavigate } from "react-router-dom";
import LINKS from "src/utilities/links";
import { Photo } from "src/utilities/types";
import useScrollToTop from "src/hooks/useScrolllToTop";
interface Props {
  contentWidth: string;
  closeModal?: () => void;
  valuesSubmit: any;
  photos:Photo[]
}

const ItemAddedModal = ({ contentWidth, closeModal, valuesSubmit ,photos}: Props) => {
  console.log(valuesSubmit)
  const isNotMobileScreens = useMediaQuery("(min-width:600px)");
  const { dispatch } = useAppContext();
  const navigate = useNavigate();
  return (
    <ModalWrapper contentWidth={contentWidth}>
      <Box>
        <IconButton
          onClick={() => {
            typeof closeModal !== "undefined" && closeModal();
            navigate(LINKS.sellerProfile);
          }}
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

            px: {
              xs: "1rem",
              sm: "2rem",
              md: "3rem",
              lg: "3.5rem",
              xl: "5rem",
            },
          }}
        >
          <Typography variant={isNotMobileScreens ? "h3" : "h3"} fontWeight={700}>
            Item added with success!
          </Typography>
          <Box
            sx={{
              display: "flex",
              bgcolor: "#ededed",
              padding: "2rem",
              borderRadius: "1rem",
              alignItems: "center",
              boxShadow: "10px 10px 13px #b8b8b8, -10px -10px 13px #ffffff",
              mt: "1.2rem",
            }}
          >
            <Box
              component={"aside"}
              sx={{ height: "auto", width: "10rem", objectFit: "contain" }}
            >
              <Image
                src={photos?.[0]?.secure_url}
                alt="item"
                sx={{
                  height: "100%",
                  width: "100%",
                  maxHeight: "100%",
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
              />
            </Box>
            <Typography
              variant={isNotMobileScreens ? "body1" : "body2"}
              sx={{ ml: "2rem" }}
              fontWeight={700}
            >
              {valuesSubmit?.[0]?.value}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Button
              sx={{
                backgroundColor: "#0047AB",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "0.4rem",
                mt: "2rem",
              }}
              onClick={() => {
                // dispatch({
                //   type: ActionType.setAddItemsValues,
                //   payload: valuesSubmit,
                // });
                typeof closeModal !== "undefined" && closeModal();
                 window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Add a similar item
            </Button>
            <Button
              sx={{
                backgroundColor: "#0047AB",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "0.4rem",
                mt: "2rem",
              }}
              onClick={() => {
                typeof closeModal !== "undefined" && closeModal();
                navigate(0);
              }}
            >
              Add a different item
            </Button>
          </Box>
          <Box
            component={"aside"}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Button
              sx={{
                backgroundColor: "#0047AB",
                color: "white",
                padding: "0.5rem 1.8rem",
                borderRadius: "0.4rem",
                mt: "2rem",
                fontSize:"1.4rem",
                fontWeight:"bold"
              }}
              onClick={() => {
                navigate(LINKS.sellerProfile);
              }}
            >
              Back to Profile
            </Button>
          </Box>
        </Box>
      </Box>
    </ModalWrapper>
  );
};

export default ItemAddedModal;
