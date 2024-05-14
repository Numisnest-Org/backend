import { Box, Button, Paper, Typography } from "@mui/material";
import React, { useRef } from "react";
import Image from "src/components/Image";
import seller from "src/assets/Image/AdminIcons/Reseller.svg";
import collector from "src/assets/Image/AdminIcons/collector.svg";
import items from "src/assets/Image/AdminIcons/items.svg";
import letter from "src/assets/Image/AdminIcons/Letter.svg";
import exportt from "src/assets/Image/AdminIcons/Export.svg";
import { useReactToPrint } from "react-to-print";
import { WebsiteOverview } from "src/utilities/types";
import { numberWithCommas } from "src/utilities/constants/helpers";
interface Props {
  data?: WebsiteOverview;
}
const Overview = ({ data }: Props) => {
  data;
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  return (
    <Paper
      sx={{ padding: "1.5rem", flexGrow: 1, borderRadius: "1rem" }}
      ref={printRef}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          sx={{ color: "#0047AB", fontSize: "1.5rem", fontWeight: "bold" }}
        >
          Overview
        </Typography>
        <Button
          onClick={handlePrint}
          sx={{
            border: "1px solid #C3D3E2",
            borderRadius: "0.5rem",
            color: "#0F3659",
            fontSize: "0.75rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Image src={exportt} alt="" sx={{}} />
          Export
        </Button>
      </Box>
      <Box
        sx={{ display: "flex", mt: "2rem", justifyContent: "space-between" }}
        ref={printRef}
      >
        <OverviewCard
          icon={seller}
          primaryColor="#FFE2E5"
          secondaryColor="#FA5A7D"
          title="Total Sellers"
          total={numberWithCommas(data ? data?.tot_sellers : 20000)}
          analysis={`${data?.sellers_today} sellers joined today`}
        />
        <OverviewCard
          icon={collector}
          primaryColor="#FFF4DE"
          secondaryColor="#FF947A"
          title="Total Collectors"
          total={numberWithCommas(data ? data?.tot_collectors : 20000)}
          analysis={`${data?.collectors_today} collectors joined today`}
        />
        <OverviewCard
          icon={items}
          primaryColor="#F3E8FF"
          secondaryColor="#BF83FF"
          title="Total Items"
          total={numberWithCommas(data ? data?.tot_items : 20000)}
          analysis={`${data?.items_today} added today`}
        />
        <OverviewCard
          icon={letter}
          primaryColor="#DCFCE7"
          secondaryColor="#3CD856"
          title="Total Messgaes"
          total={numberWithCommas(data ? data?.tot_messages : 20000)}
          analysis={`${data?.messages_today} messages sent today`}
        />
      </Box>
    </Paper>
  );
};

export default Overview;

interface CardProps {
  icon: string;
  primaryColor: string;
  secondaryColor: string;
  title: string;
  total?: string;
  analysis?: string;
}
const OverviewCard = ({
  icon,
  primaryColor,
  secondaryColor,
  title,
  total,
  analysis,
}: CardProps) => {
  return (
    <Box
      sx={{
        width: "11.25rem",
        height: "11.5rem",
        bgcolor: primaryColor,
        borderRadius: "1rem",
        display: "flex",
        flexDirection: "column",
        paddingX: "1.5rem",
        gap: "0.5rem",
        pt: "1rem",
      }}
    >
      <Box
        sx={{
          width: "2.5rem",
          height: "2.5rem",
          borderRadius: "50%",
          bgcolor: secondaryColor,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image src={icon} alt="" sx={{ width: "2rem" }} />
      </Box>
      <Typography
        sx={{ color: "#000", fontSize: "1.5rem", fontWeight: "bold" }}
      >
        {total}
      </Typography>
      <Typography sx={{ color: "#425166", fontSize: "1rem" }}>
        {title}
      </Typography>
      <Typography sx={{ color: "#4079ED", fontSize: "0.75rem" }}>
        {analysis}
      </Typography>
    </Box>
  );
};
