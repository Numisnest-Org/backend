import { Box, Paper, Typography } from '@mui/material';
import { defaultItems } from 'src/utilities/constants';
import {
  ItemType,
  SellerProfileType,
  SingleSeller,
  SingleSellerFeaturedItem,
} from 'src/utilities/types';
import ItemsCard from '../cards/ItemsCard';

interface Props {
  data?: any;
}

const Featured = ({ data }: Props) => {
  return (
    <Box sx={{ paddingTop: { xs: "2rem", md: "2.5rem" } }}>
      {data?.featured_items?.[0] && (
        <Typography
          sx={{
            fontSize: { xs: "1.2rem", md: "1.6rem" },
            fontWeight: 600,
            mb: "1rem",
          }}
        >
          Featured
        </Typography>
      )}

      {data?.featured_items?.[0] && (
        <Box
          sx={{
            paddingRight: { xs: "12px", md: "40px" },
            paddingLeft: { xs: "12px", md: "40px" },
            paddingBottom: { xs: "1.8rem", md: "2.8rem" },
            pt: { xs: "1.5rem", sm: "2rem" },
            bgcolor: "hsla(215, 100%, 92%, 1)",
            boxShadow: "1px 2px 2px #0000",
            borderRadius: "4px",
            overflow: { xs: "scroll", lg: "unset" },
          }}
        >
          {data?.featured_items?.[0] ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(6, 130px)",
                  md: "repeat(6, 1fr)",
                },
                gap: { xs: "0.6rem", sm: "1rem", md: "2rem" },
              }}
            >
              {data?.featured_items
                .slice(0, 6)
                .map((item: SingleSellerFeaturedItem, index: number) => (
                  <ItemsCard
                    key={index}
                    createdAt={data.createdAt}
                    flag={data.iso_code}
                    url={item.photos?.[0].secure_url}
                    firstName={data.first_name}
                    lastName={data.last_name}
                    selling={item.name}
                    amount={item.price}
                    currency={"usd"}
                    bgColor="#F4F4F6"
                    id={item._id}
                    height="15.5rem"
                    xsheight="12.5rem"
                  />
                ))}
            </Box>
          ) : (
            <Box>
              <Typography sx={{ fontSize: "1.4rem", mt: "1rem" }}>
                Seller is yet to add Featured items
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Featured;
