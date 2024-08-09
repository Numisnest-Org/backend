import { Box, Typography } from '@mui/material'

const Admincontactusheader = () => {
  const handleChange =()=>{

  }
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mt: "1rem",
      }}
    >
      <Box>
        <Typography
          sx={{ fontSize: "1.5rem", color: "#0047AB", fontWeight: "bold" }}
        >
          All Items
        </Typography>
        <Typography sx={{ fontSize: "1rem", color: "#0047AB" }}>
          170 total, proceed to resolve them
        </Typography>
      </Box>
      
    </Box>
  );
}

export default Admincontactusheader