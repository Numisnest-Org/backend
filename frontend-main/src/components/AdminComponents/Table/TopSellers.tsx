import { Box, Paper, Table, TableBody, TableHead, Typography, useTheme } from '@mui/material'
import { grey } from '@mui/material/colors';
import React from 'react'
import SimpleBar from 'simplebar-react';
import { StyledTableCell as TableCell,
	StyledTableRow as TableRow, } from './TableComponents';
import { SellerType } from 'src/utilities/types';
import Image from 'src/components/Image';
import avater from "src/assets/Image/numisnest avater.jpg"
import _ from 'lodash';
import { textFromat } from 'src/utilities/constants/helpers';
import { Photo } from '@mui/icons-material';
interface Props{
  data:SellerType[] |undefined
}
const TopSellers = ({data}:Props) => {
  const theme = useTheme()
  return (
    <Paper sx={{ padding: "0.5rem", borderRadius: "1rem", width: "25rem" }}>
      <Typography
        sx={{
          color: "#0047AB",
          fontSize: "1.5rem",
          fontWeight: "bold",
          ml: "0.5rem",
        }}
      >
        Top Sellers
      </Typography>
      <Box>
        <SimpleBar style={{ width: "24rem" }}>
          <Table sx={{ overflow: "auto", mt: "0.8rem" }}>
            <TableHead
              sx={{
                "& tr": {
                  color: theme.palette.primary.main,
                },
              }}
            >
              <TableRow sx={{ borderBottom: "2px solid blue" }}>
                {/* {headers.map((header) => (
              <TableCell>{header.displayName}</TableCell>
            ))} */}
                <TableCell>S/N</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Items</TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                "& tr": {
                  color: theme.palette.primary.main,
                },
              }}
            >
              {data?.map((seller, index) => (
                <TableRow>
                  <TableCell>
                    {(index + 1).toString().padStart(2, "0")}
                  </TableCell>
                  <TableCell>
                    {seller.photo ? (
                      <Box
                        sx={{
                          width: "3.5rem",
                          height: "3.5rem",
                          backgroundImage: `url(${seller.photo})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      ></Box>
                    ) : (
                      <Image
                        src={ avater}
                        alt="image"
                        sx={{
                          maxWidth: "3.5rem",
                          maxHeight: "3.5rem",
                          height: "auto",
                          width: "auto ",
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell>{`${_.upperFirst(
                    textFromat(seller.first_name)
                  )} ${_.upperFirst(textFromat(seller.last_name))}`}</TableCell>
                  <TableCell>Category</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SimpleBar>
      </Box>
    </Paper>
  );
}

export default TopSellers