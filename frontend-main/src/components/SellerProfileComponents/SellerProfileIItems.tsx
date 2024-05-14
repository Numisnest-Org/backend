import {
  Box,
  Button,
  Divider,
  Paper,
  Typography,
  useMediaQuery,
} from '@mui/material';
import React, { useState } from 'react';
import { AddIcon } from '../Icons/icons';
import {
  GroupItems,
  SellerItemType,
  SingleItemType,
} from 'src/utilities/types';
import ItemsCard from '../cards/ItemsCard';
import EditItemsModal from '../Modal/edit-ItemsModal';
import {
  ArrowForwardIosOutlined,
  ReportProblemRounded,
  Sledding,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import LINKS from 'src/utilities/links';
import { dark } from '@mui/material/styles/createPalette';
import ConfirmationModal from '../Modal/are-you-sure';
import { toast } from 'react-toastify';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';

interface Props {
  data?: GroupItems[] | null;
  refresh?: boolean;
  setRefresh?: (val: boolean) => void;
}

const SellerProfileIItems = ({ data, refresh, setRefresh }: Props) => {
  const [isDisplayModal, setDisplayModal] = useState<boolean>(false);
  const [displayDeleteModal, setDisplayDeleteModal] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null | undefined>(null);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const isNotMobileScreens = useMediaQuery('(min-width:600px)');
  const axiosPrivate = useAxiosPrivate();

  const style = {
    link: {
      textDecoration: 'none',
      color: 'white',
    },
  };

  return (
    <Box component={"div"}>
      {showEdit && (
        <EditItemsModal
          contentWidth={"1200px"}
          closeModal={() => setShowEdit(false)}
          itemId={selectedId}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      )}
      {showDeleteModal && (
        <ConfirmationModal
          contentWidth={"400px"}
          closeModal={() => setShowDeleteModal(false)}
          itemId={selectedId}
          text="delete item"
          handleItem={async () => {
            try {
              await axiosPrivate.delete(`seller/delete-item/${selectedId}`);

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
      {isDisplayModal && (
        <EditItemsModal
          contentWidth={"1200px"}
          closeModal={() => setDisplayModal(false)}
          itemId={selectedId}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      )}

      {data?.[0] ? (
        <Box
          sx={{
            position: "relative",
            mt: "4rem",
            pax: ".3rem",
            px: { xs: ".2rem", sm: "1rem" },
            backgroundColor: "#D8E8FF",
            pt: "2rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: "30px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Typography
                variant={"h5"}
                sx={{
                  fontFamily: "Poppins",
                  fontSize: { xs: "1.2rem", md: "2rem" },
                  fontWeight: 700,
                  letterSpacing: "0em",
                }}
              >
                Items
              </Typography>
              <Divider
                orientation="vertical"
                flexItem={true}
                sx={{
                  width: 2, // Adjust the width as needed
                  marginLeft: 1, // Optional: Add margin for spacing
                  marginRight: 1, // Optional: Add margin for spacing
                  borderColor: "black",
                }}
              />

              <div onClick={() => navigate(LINKS.allSellerItemsPrivate)}>
                <Typography
                  variant={isNotMobileScreens ? "h2" : "h2"}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "#0047AB",
                    "&:hover": {
                      cursor: "pointer",
                    },
                    fontSize: { xs: "16px", md: "24px" },
                  }}
                >
                  See all
                </Typography>
              </div>
            </Box>
            <Box>
              <Button
                sx={{
                  backgroundColor: "#0047AB",
                  color: "#fff",
                  height: { xs: "40px", md: "48px" },
                  px: "20px",

                  "&:hover": {
                    backgroundColor: "#1166dc ",
                  },
                }}
              >
                <Link to={LINKS.AddItems} style={style.link}>Add Items</Link>
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(3, 1fr)",
                md: "repeat(4, 1fr)",
                lg: "repeat(6, 1fr)",
              },
              gap: { xs: "0.4rem", sm: "1rem" },
              position: "relative",
              height: "100%",
            }}
          >
            {data?.slice(0, 24)?.map((itemm: any, indexx: number) => (
              <Box key={indexx} sx={{ width: "100%", height: "100%" }}>
                <ItemsCard
                  key={indexx}
                  url={itemm.photos?.[0].secure_url}
                  currency={itemm.convertedCurrency}
                  selling={itemm?.name}
                  createdAt={itemm.updatedAt}
                  amount={itemm?.convertedPrice}
                  height="15.5rem"
                  bgColor="#F4F4F6"
                  id={itemm._id}
                  cardtype="Private"
                  openModal={() => setDisplayModal(true)}
                  setItemId={setSelectedId}
                  xsheight="12.5rem"
                  openDeleteModal={() => setDisplayDeleteModal(true)}
                  available={itemm.available}
                  setShowEdit={setShowEdit}
                  showEdit={showEdit}
                  setShowDeletemodal={setShowDeleteModal}
                  showDeletemodal={showDeleteModal}
                  setRefresh={setRefresh}
                />
              </Box>
            ))}
          </Box>
          <Box sx={{ display: "flex", justifyContent: "end", mr: "1.5rem" }}>
            <Button
              sx={{
                backgroundColor: "#D03531",
                color: "white",
                padding: "0.5rem 3.8rem",
                mt: "2rem",
                mb: "2rem",
                borderRadius: "0.4rem",
              }}
              onClick={() => navigate(LINKS.hidden)}
            >
              <Link to={LINKS.featured} style={style.link}>
                Hidden
              </Link>
            </Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: "flex", alignItems: "center", mt: "5rem" }}>
          <Typography
            variant={isNotMobileScreens ? "h1" : "h2"}
            sx={{ fontWeight: 700, mr: "10.5rem" }}
          >
            Items{" "}
          </Typography>
          <Box>
            <AddIcon
              height={60}
              width={60}
              onClick={() => navigate(LINKS.AddItems)}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SellerProfileIItems;
