import { Box } from '@mui/material'
import React, { useState } from 'react'
import { Form, Navigate, useNavigate } from 'react-router-dom';
import VisitorLayout from 'src/components/layouts/VisitorLayout'
import LINKS from 'src/utilities/links';
import delivery from "src/assets/Image/Delivery.png";
import phone from "src/assets/Image/Phone Contact.png";
import settings from "src/assets/Image/setting.png";
import padlock from "src/assets/Image/padlock.png";
import deleteK from "src/assets/Image/delete.png";
import eyes from "src/assets/Image/eyes.png";
import personIcon from "src/assets/Image/contact.svg";
import loveIcon from "src/assets/Image/love.png";
import sellerIcon from "src/assets/Image/seller.png";
import vIcon from "src/assets/Image/visibility.png";
import ChangePasswordForm from 'src/components/forms/change-password-form';
import useScrollToTop from 'src/hooks/useScrolllToTop';
const ChangePasswordloggedin  = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navigate = useNavigate()
  useScrollToTop()
  const data = [
    {
      title: "Edit profile",
      icon: personIcon,
      func: () => navigate(LINKS.editProfile),
    },
    {
      title: "Change password",
      icon: padlock,
      func: () => navigate(LINKS.forgotpassword),
    },
    {
      title: "Favourites",
      icon: loveIcon,
    },
    {
      title: "Hidden",
      icon: eyes,
      func: () => navigate(LINKS.hidden),
    },
    {
      title: "Account visibility",
      icon: vIcon,
    },
    {
      title: "Become a seller",
      icon: sellerIcon,
    },
    {
      title: "Delete account",
      icon: deleteK,
    },
  ];
  return (
    <VisitorLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: "1rem",
          mt: { xs: "1.5rem", md: "3rem" },
          px: { xs: "1rem", sm: "unset" },
        }}
      >
        <Box sx={{ position: "relative", width: { xs: "170px", md: "170px" } }}>
          <button
            className="blue-btn"
            style={{
              marginBottom: "1rem",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              color: "#fff",
            }}
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            <img style={{ width: "20px" }} src={settings} alt="" /> Account
          </button>
          {isOpen && (
            <ul
              className="drop-down"
              style={{
                width: "100%",
                marginTop: "1.8rem",
                gap: "2.2rem",
                paddingBottom: "2rem",
                paddingTop: "1.2rem",
              }}
            >
              {data.map((item, i) => (
                <li
                  key={i}
                  style={{ fontSize: "12px" }}
                  className="account-drop-down"
                  onClick={() =>
                    typeof item.func !== "undefined" && item.func()
                  }
                >
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "10px" }}
                  >
                    <img
                      style={{
                        width: "16px",
                        height: "16px",
                        aspectRatio: "1",
                      }}
                      src={item.icon}
                      alt=""
                    />

                    {item.title}
                  </Box>
                </li>
              ))}
            </ul>
          )}
        </Box>
        <Box sx={{
          backgroundColor: '#fff',
          position: 'relative',

          width: '100%',
          maxWidth: '1110px',
          marginLeft: 'auto',
          marginRight: 'auto',
          borderRadius: '24px',
          boxShadow: '1px 2px 2px #0000',
        }}>
          
        <ChangePasswordForm />

        </Box>
      </Box>
    </VisitorLayout>
  );
}

export default ChangePasswordloggedin 