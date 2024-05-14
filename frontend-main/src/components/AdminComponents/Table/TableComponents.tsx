import { tableCellClasses } from "@mui/material/TableCell";
import { styled, TableRow, TableCell } from "@mui/material";
import { grey } from "@mui/material/colors";

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontFamily: "ReservationWide",
  [`&.MuiTableCell-head`]: {
    fontSize: "1.25rem",
    color: theme.palette.primary.main,
    backgroundColor: "none",
    paddingLeft: "10px",
    paddingRight: "10px",
    fontFamily:"poppins"
  },

  [`&.MuiTableCell-head:nth-of-type(1)`]: {
    paddingLeft: "30px !important",
  },
  [`&.MuiTableCell-head:last-child`]: {
    paddingRight: "30px",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "0.85rem",
    fontFamily:"poppins",
    padding: "8px 10px",
  },
  [`&.MuiTableCell-body:last-child`]: {
    paddingRight: "30px",
  },
  [`&.MuiTableCell-body:nth-of-type(1)`]: {
    paddingLeft: "30px",
  },
}));

export const StyledTableHeaderCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: "14px",
    color: theme.palette.primary.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "14px",
  },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  color: theme.palette.primary.main,
  backgroundColor: grey[50],
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export const StyledTableHeaderRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
}));
