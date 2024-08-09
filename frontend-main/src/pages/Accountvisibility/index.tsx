import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VisitorLayout from "src/components/layouts/VisitorLayout";
import useScrollToTop from "src/hooks/useScrolllToTop";
import LINKS from "src/utilities/links";
import settings from "src/assets/Image/setting.png";
import padlock from "src/assets/Image/padlock.png";
import deleteK from "src/assets/Image/delete.png";
import eyes from "src/assets/Image/eyes.png";
import personIcon from "src/assets/Image/contact.svg";
import loveIcon from "src/assets/Image/love.png";
import sellerIcon from "src/assets/Image/seller.png";
import vIcon from "src/assets/Image/visibility.png";
import AccountVisibilityComp from "src/components/AccountvisivilityComponent/AccountVisibilityComp";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import {  AccountVisibilityType, BlockedDataType } from "src/utilities/types";
import { Spinner } from "../Item";


const AccountVisibility = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [accountVisibilityData,setAccountVisiblityData]= useState<AccountVisibilityType>()
  const [blockedListData ,setBlockedListData ]= useState<BlockedDataType>()
  useScrollToTop();

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
      title: "Block user",
      icon: vIcon,
      func: () => navigate(LINKS.blockuser),
    },
    // {
    //   title: "Become a seller",
    //   icon: sellerIcon,
    // },
    // {
    //   title: "Delete account",
    //   icon: deleteK,
    // },
  ];
  useEffect(() => {
    const getProfileVisibility = async () => {
      try {
        const response = await axiosPrivate.get(`seller/visibility/get`);
        const {data} = response.data
        setAccountVisiblityData(data?.[0])
      } catch (error) {
      } finally {
        setIsFetching(false);
      }
    };
    const getBlockedList = async ()=>{
      try {
        const response = await axiosPrivate.get("seller/block-list/get");
        const {data }=  response.data
        setBlockedListData(data?.[0])
      } catch (error) {
        
      }
     
    }
    getBlockedList();
    getProfileVisibility();
     
  }, []);
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
        <Box
          sx={{
            backgroundColor: "#fff",
            position: "relative",
            width: "100%",
            maxWidth: "1110px",
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: "24px",
            boxShadow: "1px 2px 2px #0000",
          }}
        >
          {isFetching ? (
            <Spinner />
          ) : (
            <AccountVisibilityComp data={accountVisibilityData} blockedUsers={blockedListData} />
          )}
        </Box>
      </Box>
    </VisitorLayout>
  );
};

export default AccountVisibility;
