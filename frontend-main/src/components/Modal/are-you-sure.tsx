import React, { ReactElement } from "react";
import ModalWrapper from "./ModalWrapper";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import { ReportProblemRounded } from "@mui/icons-material";
interface Props {
  contentWidth: string;
  closeModal?: () => void;
  itemId: string | null | undefined;
  icon?: ReactElement;
  text?: string;
  handleItem?: (val: string | null | undefined) => void;
}

const ConfirmationModal = ({
  contentWidth,
  closeModal,
  itemId,
  icon,
  text,
  handleItem
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
          <Box>{icon}</Box>
          <Typography>Are you sure you want to {text} ?</Typography>
          <Box sx={{ display: "flex", gap: "2.5rem" }}>
            <Button
              sx={{
                backgroundColor: "#00AB07",
                color: "white",
                padding: "0.5rem 1.5rem",
                borderRadius: "0.4rem",
                mt: "2rem",
              }}
              onClick={() =>
                typeof handleItem !== "undefined" && handleItem(itemId)
              }
            >
              Yes
            </Button>
            <Button
              sx={{
                backgroundColor: "#D03531",
                color: "white",
                padding: "0.5rem 1.5rem",
                borderRadius: "0.4rem",
                mt: "2rem",
              }}
              onClick={() => typeof closeModal !== "undefined" && closeModal()}
            >
              No
            </Button>
          </Box>
        </Box>
      </Box>
    </ModalWrapper>
  );
};

export default ConfirmationModal;
