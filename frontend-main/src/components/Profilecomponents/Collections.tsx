import { Box, Divider, Paper, Typography, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowForwardIosOutlined } from '@mui/icons-material';
import Collectionscard from '../cards/collectioncard';
import { CollectionType } from 'src/utilities/types';
import LINKS from 'src/utilities/links';
interface Props {
  sellerCollectionData?: CollectionType[];
  sellerId?: string;
  sellerFirstname?: string;
}

const Collections = ({
  sellerCollectionData,
  sellerId,
  sellerFirstname,
}: Props) => {
  const navigate = useNavigate();
  const isNotMobileScreens = useMediaQuery('(min-width:500px)');

  return (
    <Box>
      {sellerCollectionData?.[0] && (
        <Box
          sx={{
            display: "flex",
            mb: "1rem",
            alignItems: "center",
            gap: "1rem",
            mt: { xs: "2rem", md: "3rem" },
            color: "#0047AB",
          }}
        >
          <Typography
            variant={"h3"}
            sx={{
              fontSize: { xs: "1.5rem", md: "1.8rem" },
              fontWeight: 600,
            }}
          >
            Collection
          </Typography>
          <Divider
            orientation="vertical"
            flexItem={true}
            sx={{
              borderColor: "#0047AB",
            }}
          />
          <div
            onClick={() =>
              navigate(`${LINKS.showColletion}/${sellerId}/${sellerFirstname}`)
            }
          >
            <Typography
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

      {sellerCollectionData?.[0] && (
        <Box
          sx={{
            p: "1.2rem",
            backgroundColor: "#fff",
            boxShadow: "1px 2px 2px #0000",
            borderRadius: "4px",
          }}
        >
          <Box
            sx={{
              width: "100%",
              margin: "0 auto",
              overflow: { xs: "scroll", lg: "unset" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: "1rem",
              }}
            >
              {sellerCollectionData?.slice(0, 3)?.map((collection, index) => (
                <Box
                  component={"div"}
                  sx={{ height: "100%" }}
                  onClick={() =>
                    navigate(
                      `${LINKS.singleCollectionpublic}/${sellerId}?coll_id=${collection._id}`
                    )
                  }
                >
                  <Collectionscard
                    key={index}
                    collectionName={collection.name}
                    collectionItems={collection.coll_list}
                    cardtype="public"
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Collections;
