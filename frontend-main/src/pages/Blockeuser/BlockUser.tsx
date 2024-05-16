import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { axiosPublic } from "src/axios/axios";
import SellerCard from "src/components/cards/SellerCard";
import Search from "src/components/homeComponents/Search";
import VisitorLayout from "src/components/layouts/VisitorLayout";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { SellerType } from "src/utilities/types";

const BlockUserPage = () => {
  const [searchVal, setSearchValue] = useState<string>();
  const axiosPrivate = useAxiosPrivate();
  const [users, setUsers] = useState<Partial<SellerType[]>>([]);
  useEffect(() => {
    const search = async () => {
      try {
        const response = await axiosPublic.post(
          `/seller/block-list/search-user?search=${searchVal}`
        );
        const { data } = response.data;
        setUsers(data);
        console.log(data);
        // setAllItems(data.items);
      } catch (error) {}
    };
    if (searchVal !== "") {
      search();
    }
  }, [searchVal]);

  return (
    <VisitorLayout>
      <Box>
        <Box sx={{ maxWidth: "400px", mt: "2rem" }}>
          <Search
            setState={setSearchValue}
            place="Search user you want to block"
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: { xs: "1rem", md: "1.5rem", lg: "2rem" },
            width: "100%",

            position: "relative",
            mt: "3rem",
            transformOrigin: "top left",
          }}
        >
          {users?.map((item, index) => (
            <SellerCard
              key={index}
              flag={item?.iso_code}
              url={item?.photo?.secure_url}
              name={`${item?.first_name} ${item?.last_name}`}
              selling={item?.about}
              id={item?._id}
              approved={item?.approved}
              blockuser
            />
          ))}
        </Box>
      </Box>
    </VisitorLayout>
  );
};

export default BlockUserPage;
