import { Box, Button, IconButton, Skeleton, Typography, useMediaQuery } from '@mui/material';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import _ from "lodash";
import { textFromat } from 'src/utilities/constants/helpers';
import daytring;
  isFetching?: boolean;
  currency?: string;
  height?: string;
  xsheight?: string;
  id?: string;
  cardtype?: CardType;
  openModal?: () => void;
  setItemId?: (value: string | undefined) => void;
  selected?: boolean;
  pinned?:boolean;
  remCollection?: () => void;
  setRefresh?:(val:any)=>void;
}

const Adminitemscard = ({
  flag,
  url,
  firstName,
  lastName,
  selling,
  createdAt,
  amount,
  bgColor,
  isFetching,
  currency,
  height,
  xsheight,
  id,
  selected,
  cardtype = "public",
  openModal,
  setItemId,
  setRefresh,
  pinned,
  remCollection,
}: Props) => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const isNotMobileScreens = useMediaQuery("(min-width:600px)");
  const adminPrivate = useAdminPrivate()
  const pinItem = async () => {
    try {
      const response = await adminPrivate.put(
        `/admin/pinned/item/${id}?pin=${!pinned}`
      );

      toast(pinned ? "Item Unpinned" : "Item Pinned", {
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
      typeof setRefresh !== "undefined" && setRefresh((prev: boolean) => !prev);
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
  };
  return (
    <Box>
      <Box
        sx={{
          backgroundColor: bgColor ? bgColor : "white",
          width: {
            xs: "7.6rem",
            sm: "11rem",
            md: "11rem",
            lg: "11rem",
            x "all 0.3s ease-in-out allow-discrete",
          "&:hover": {
            boxShadow: " 3px 5px 10px 0.7px rgba(0, 0, 0, .2)",
            cursor: "pointer",
          },
        }}
      >
        {pinned && (
          <IconButton sx={{ position: "absolute", top: -20, left: -30 }}>
            <Image
              src={pin}
              alt="pin"
              sx={{
                width: "2.5rem",
              }}
            />
          </IconButton>
        )}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {isFetching ? (
            <Skeleton width={"40%"} component="h2"></Skeleton>
          ) : (
            <Typography
              sx={{ mt: "0.7rem", fontSize: { xs: "0.65rem", sm: "1.2rem" } }}
            >
              {firstName &&
                `${textFromat(_.upperFirst(firstName))} ${textFromat(
                  _.upperFirst(lastName)
                )}`}
            </Typography>
          )}
          {isFetching ? (
            <Skeleton
              width="1.5rem"
              height="1.5rem"
              variant="circular"
            ></Skeleton>
          ) : (
            <>
              {flag && (
                <Box
                  component={"span"}
                  className={`fi fi-${flag?.toLowerCase()}`}
                  style={{
                    fontSize: isNotMobileScreens ? "1.2rem" : "0.85rem",
                  }}
                ></Box>
              )}
            </>
          )}
        </Box>
        <Box sx={{}}>
          {isFetching ? (
            <Skeleton
              sx={{
                width: "100%",
                height: "4rem",
                mt: "1rem",
                borderRadius: "0.3rem",
              }}
            ></Skeleton>
          ) : (
            <Box
              sx={{
                width: "100%",
                height: { xs: "4rem", sm: "5rem" },
                backgroundImage: `url(${url})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                mt: "1rem",
                borderRadius: "0.3rem",
              }}
            ></Box>
          )}
        </Box>
        {isFetching ? (
          <Skeleton
            variant="rectangular"
            component={"h6"}
            sx={{ mt: "0.5rem" }}
          ></Skeleton>
        ) : (
          <Typography
            sx={{
              mt: "1rem",
              fontSize: { xs: "0.8rem", sm: "1rem", wordBreak: "break-word" },
            }}
          >
            {textFromat(selling?.slice(0, 19))}
          </Typography>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: { xs: "auto", md: "auto" },
          }}
        >
          {isFetching ? (
            <Skeleton
              variant="rectangular"
              component={"h3"}
              sx={{ mt: "0.5rem", width: "40%" }}
            ></Skeleton>
          ) : (
            <Typography
              sx={{
                fontWeight: "400",
                fontSize: { xs: "0.55rem", sm: "0.75rem" },
                color: "#0047AB",
              }}
            >
              {createdAt ? dayjs(createdAt).format("DD.MM.YYYY") : ""}
            </Typography>
          )}

          {isFetching ? (
            <Skeleton
              variant="rectangular"
              sx={{ mt: "0.5rem", width: "30%" }}
            ></Skeleton>
          ) : (
            <Typography
              sx={{
                fontWeight: "600",
                fontSize: { xs: "0.7rem", sm: "0.75rem" },
              }}
            >
              {`${amount} ${currency?.toUpperCase()}`}
            </Typography>
          )}
        </Box>
        {cardtype === "Private" && (
          <Box>
            <Button
              sx={{
                position: "absolute",
                top: 120,
                right: 10,
                display: "inline-flex",
                backgroundColor: "#D03531",
                color: "#F9FAFA",
                paddingY: "0.1rem",
                fontSize: "0.7rem",
              }}
              onClick={async (e) => {
                e.stopPropagation();
                typeof openModal !== "undefined" && openModal();
                typeof setItemId !== "undefined" && setItemId(id);
                // await axiosPrivate.delete(`seller/delete-item/${id}`);
              }}
            >
              Delete
            </Button>
            <Button
              sx={{
                position: "absolute",
                top: 120,
                left: 10,
                display: "inline-flex",
                backgroundColor: PRIMARY_COLOR,
                color: "#F9FAFA",
                paddingY: "0.1rem",
                fontSize: "0.7rem",
              }}
              onClick={pinItem}
            >
              {pinned ? "unpin" : "pin"}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Adminitemscard