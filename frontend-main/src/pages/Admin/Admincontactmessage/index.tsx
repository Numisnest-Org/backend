import { TextFormat } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import backIcon from "src/assets/Image/AdminIcons/backIcon.png";
import Image from "src/components/Image";
import useAdminPrivate from "src/hooks/useAdminPrivate";
import { textFromat } from "src/utilities/constants/helpers";
import { ContactUsMessage } from "src/utilities/types";
import openemail from "src/assets/Image/AdminIcons/openemail.svg"
import useAppContext from "src/hooks/useAppContext";
const AdminContactmessages = () => {
  const handleReply = (email:string ,body:string) => {
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
      "In response to your question"
    )}&body=${encodeURIComponent(body.slice(0,15))}`;
    window.location.href = mailtoLink;
  };
  const navigate = useNavigate();
  const adminPrivate = useAdminPrivate();
  const { id } = useParams();
  const [message, setMessage] = useState<ContactUsMessage | undefined>(
    undefined
  );
  useEffect(() => {
    const getMessage = async () => {
      const response = await adminPrivate.get(`admin/contactus/message/${id}`);
      const { data } = response.data;
      setMessage(data);
    };
    getMessage();
  }, []);
  
  const contact = true;
  const { state } = useAppContext();
  const { adminloginDetails } = state;


  
  return (
    <Box className="admin-contact-message px-7" sx={{ px: "1re" }}>
      {" "}
      <Paper
        component={"section"}
        sx={{
          display: "flex",
          alignItems: "center",
          mt: "2.5rem",
          py: "1rem",
          px: "1.5rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              sx={{ marginRight: "1rem" }}
              onClick={() => navigate(-1)}
            >
              <Image
                src={backIcon}
                alt="backicon"
                className="back-icon"
                sx={{
                  width: "2.125rem",
                  height: "3.1875rem",
                  flexShrink: 0,
                }}
              />
            </IconButton>
            <Typography
              sx={{ fontSize: "1.5rem", fontWeight: "bold", color: "#0047AB" }}
            >
              Messages
            </Typography>
          </Box>
          <Box>
            <Typography>
              Current IP:{" "}
              <Typography component={"span"}>
                {" "}
                {adminloginDetails?.ip_address}
              </Typography>
            </Typography>
            <Typography>
              Last Login:
              <Typography component={"span"}>
                {" "}
                {dayjs(adminloginDetails?.last_login).format("D MMMM, YYYY")}
              </Typography>
            </Typography>
          </Box>

          <Button
            sx={{
              backgroundColor: "#0047AB",
              color: "white",
              padding: "0.5rem 2.5rem",
              borderRadius: "0.7rem",
            }}
          >
            Mark as Completed
          </Button>
        </Box>
      </Paper>
      <Box
        className="ml-56 mt-10 flex flex-col-reverse mb-5"
        sx={{ mt: "1rem", display: "flex", mb: "0.5rem" }}
      >
        {message ? (
          <Paper sx={{ width: "100%", px: "1rem", mt: "3.5rem", pt: "2rem" }}>
            <Box>
              <Typography
                sx={{ fontSize: "1.12rem", color: "#0047AB", textAlign: "end" }}
              >
                {dayjs(message?.updatedAt).format("DD/MM/YYYY, h:mmA")}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                px: "1.5rem",
                pb: "2.5rem",
              }}
            >
              <aside className="details">
                <h3>Phone Number</h3>
                {message?.phone_number ? (
                  <p>{`${message?.phone_number} `} </p>
                ) : (
                  <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                )}
              </aside>
              <aside className="details">
                <h3>Email Address</h3>
                {message ? (
                  <p>{`${message?.email} `} </p>
                ) : (
                  <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                )}
              </aside>
              <aside className="details" style={{ width: "25rem" }}>
                <h3>Message</h3>
                {message ? (
                  <p>
                    {`${message?.message}`}{" "}
                    <Box
                      component={"div"}
                      onClick={() =>
                        handleReply(message.email, message.message)
                      }
                      sx={{
                        display: "inline-flex",
                        color: "#009BD1",
                        fontSize: "1.12rem",
                      }}
                    >
                      {" "}
                      <Image
                        src={openemail}
                        alt="reply"
                        sx={{ width: "1rem" }}
                      />{" "}
                      Reply
                    </Box>
                  </p>
                ) : (
                  <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                )}
              </aside>
            </Box>
          </Paper>
        ) : (
          <div>
            <Skeleton
              variant="rounded"
              width={"65rem"}
              height={"15rem"}
              sx={{ marginBottom: "1.5rem" }}
            />
            <Skeleton variant="rounded" width={"65rem"} height={"15rem"} />
          </div>
        )}
      </Box>
      <Box sx={{ mt: "3rem" }}>
        {message?.other_messages?.[0] && (
          <Box>
            <Typography
              sx={{ fontSize: "1.5rem", fontWeight: "bold", color: "#0047AB" }}
            >
              Other Messages
            </Typography>
            {message?.other_messages.map((messageItem, index) => (
              <Paper
                sx={{ width: "100%", px: "1rem", mt: "1.5rem", pt: "2rem" }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: "1.12rem",
                      color: "#0047AB",
                      textAlign: "end",
                    }}
                  >
                    {dayjs(messageItem?.updatedAt).format("DD/MM/YYYY, h:mmA")}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    px: "1.5rem",
                    pb: "2.5rem",
                  }}
                >
                  <aside className="details">
                    <h3>Phone Number</h3>
                    {message?.phone_number ? (
                      <p>{`${textFromat(messageItem._id)} `} </p>
                    ) : (
                      <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                    )}
                  </aside>
                  <aside className="details">
                    <h3>Email Address</h3>
                    {message ? (
                      <p>{`${messageItem?.email} `} </p>
                    ) : (
                      <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                    )}
                  </aside>
                  <aside className="details" style={{ width: "25rem" }}>
                    <h3>Message</h3>
                    {message ? (
                      <p>
                        {`${messageItem?.message} `}{" "}
                        <Box
                          component={"div"}
                          sx={{
                            display: "inline-flex",
                            color: "#009BD1",
                            fontSize: "1.12rem",
                          }}
                          onClick={() =>
                            handleReply(messageItem.email, messageItem.message)
                          }
                        >
                          {" "}
                          <Image
                            src={openemail}
                            alt="reply"
                            sx={{ width: "1rem" }}
                          />{" "}
                          Reply
                        </Box>
                      </p>
                    ) : (
                      <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                    )}
                  </aside>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AdminContactmessages;
