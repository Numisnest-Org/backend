import { Box, Paper, Typography } from "@mui/material";
interface Props {
  description?: string | null;
  deliveryOptions?:string|null
  countryCode?:string|null
  mobile?:string|null
}
const ItemDesc = ({description,deliveryOptions,countryCode,mobile}:Props) => {
  return (
    <Paper sx={{ pl: "2rem", pt: "2rem", mt: "2rem", pb: "2rem" }}>
      <Box>
        <Typography
          component={"header"}
          sx={{
            fontSize: "2.5rem",
            fontWeight: 600,
            textDecoration: "underline",
          }}
        >
          Details
        </Typography>
        <Typography
          component={"p"}
          sx={{ fontSize: "2rem", wordBreak: "break-word" }}
        >
          {description}
        </Typography>
      </Box>
      <Box sx={{ mt: "2rem" }}>
        <Typography
          component={"header"}
          sx={{
            fontSize: "2.5rem",
            fontWeight: 600,
            textDecoration: "underline",
          }}
        >
          Purchase and delivery
        </Typography>
        <Typography
          component={"p"}
          sx={{ fontSize: "2rem", wordBreak: "break-word" }}
        >
          {deliveryOptions}
        </Typography>
      </Box>
      <Box sx={{ mt: "2rem" }}>
        <Typography
          component={"header"}
          sx={{
            fontSize: "2.5rem",
            fontWeight: 600,
            textDecoration: "underline",
          }}
        >
          Contact
        </Typography>
        <Typography component={"p"} sx={{ fontSize: "2rem" }}>
          Whatsapp:{" "}
          <Typography component={"span"} sx={{ fontSize: "2rem" }}>
            {`${countryCode} ${mobile}`}
          </Typography>{" "}
        </Typography>
      </Box>
    </Paper>
  );
};

export default ItemDesc;
