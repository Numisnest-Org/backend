import { Box, Divider, Paper, Typography, useMediaQuery } from '@mui/material';
import { ItemType, SellerItemType, item } from 'src/utilities/types';
import { defaultItems } from 'src/utilities/constants';
import ItemsCard from '../cards/ItemsCard';
import { useNavigate } from 'react-router-dom';
import { ArrowForwardIosOutlined } from '@mui/icons-material';
import LINKS from 'src/utilities/links';

interface Props {
  data?: any;
  sellerId?: string;
}
const ItemsProfile = ({ data, sellerId }: Props) => {
  const navigate = useNavigate();
  const isNotMobileScreens = useMediaQuery('(min-width:600px)');

  return (
    <Box>
      {data?.items?.[0] && (
        <Box
          sx={{
            display: "flex",
            mb: "1rem",
            mt: { xs: "2rem", md: "2.5rem" },
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <Typography
            variant={"h5"}
            sx={{ fontSize: { xs: "1.5rem", md: "1.8rem" }, fontWeight: 600 }}
          >
            Items
          </Typography>

          <Divider
            orientation="vertical"
            flexItem={true}
            sx={{
              borderColor: "black",
            }}
          />

          <div
            onClick={() =>
              navigate(`${LINKS.allSellerItemsPublic}/${sellerId}`)
            }
          >
            <Typography
              variant={"h5"}
              sx={{
                fontSize: "24px",
                cursor: "pointer",
              }}
            >
              See all
            </Typography>
          </div>
        </Box>
      )}

      {data?.items?.[0] && (
        <Box
          sx={{
            p: "1rem",
            bgcolor: "hsla(215, 100%, 92%, 1)",
            boxShadow: "1px 2px 2px black",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(3, 1fr)",
                md: "repeat(4, 1fr)",
                lg: "repeat(6, 1fr)",
              },
              gap: { xs: "0.5rem", sm: "1rem" },
            }}
          >
            {data.items
              ?.slice(0, 24)
              ?.map((item: SellerItemType, index: number) => (
                <ItemsCard
                  key={index}
                  url={item.photos?.[0].secure_url}
                  currency={item.currency}
                  selling={item.name}
                  createdAt={item.updatedAt}
                  amount={item.price}
                  height="15.5rem"
                  bgColor="#F4F4F6"
                  id={item._id}
                  xsheight="12.5rem"
                />
              ))}
          </Box>
          <Box
            sx={{ display: "flex", justifyContent: "end" }}
            onClick={() =>
              navigate(`${LINKS.allSellerItemsPublic}/${sellerId}`)
            }
          >
            <Typography
              sx={{
                fontSize: { md: "20px" },
                cursor: "pointer",
                pt: "14px",
                color: "#0047AB",
              }}
            >
              See all Items
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ItemsProfile;
