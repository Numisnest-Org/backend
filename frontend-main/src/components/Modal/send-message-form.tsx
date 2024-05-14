import React, { useState } from 'react'
import ModalWrapper from './ModalWrapper'
import { Box, Button, IconButton, TextField, Typography } from '@mui/material'
import { CloseOutlined } from '@mui/icons-material';
import sendbtn from "src/assets/Image/sendbtn.svg";
import Image from '../Image';
import { useSocket } from 'src/utilities/context/socketContext';
import useAppContext from 'src/hooks/useAppContext';
import { ActionType } from 'src/utilities/context/context';
import LINKS from 'src/utilities/links';
import { useNavigate } from 'react-router-dom';

type Props = {
  closeModal?: () => void;
  contentWidth?: string;
  senderId?:string;
  receiverId?:string
  
};
const SendMessageForm = ({closeModal,contentWidth,senderId ,receiverId}:Props) => {
  const [message,setMessage] = useState<string> ()
  const socket = useSocket()
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate()
  const sendMessage = () => {
    try {
      if (message === ""||null||undefined) throw new Error
      socket.emit(
        "new room",
        { sender_id: senderId, receiver_id: receiverId ,message:message},

        function (error: any) {
          if (error) {
            // Handle the error here
            console.error("Error:", error);
          } else {
            // The event was successfully emitted
            console.log("Event 'new room' emitted successfully");
          }
        }
      );
      dispatch({ type: ActionType.setMessageid, payload: receiverId });
      navigate(LINKS.chatpage);
    } catch (error) {}
  };
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
        <CloseOutlined />
      </IconButton>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center",mt:"2rem",mb:"2rem" }}
      >

        
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            onChange={(e) => setMessage(e.target.value)}
            placeholder='send a message to the seller'
            value={message}
            sx={{ width: "20rem" }}
          />
          <IconButton onClick={sendMessage}>
            <Image
              src={sendbtn}
              alt="send"
              sx={{ width: "3.2rem", ml: "1rem" }}
            />
          </IconButton>
        </Box>
      </Box>
    </ModalWrapper>
  );
}

export default SendMessageForm