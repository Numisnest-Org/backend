import { Box, Button, Paper, Table, TableBody, TableHead, Typography, useTheme } from '@mui/material'
import React, { useMemo } from 'react'
import SimpleBar from 'simplebar-react';
import { StyledTableHeaderCell } from './TableComponents';
import { StyledTableCell as TableCell,
	StyledTableRow as TableRow, } from './TableComponents';
import { Contactus } from 'src/utilities/types';
import dayjs from 'dayjs';
import _, { slice } from 'lodash';
import { textFromat } from 'src/utilities/constants/helpers';
import viewmessageicon from 'src/assets/Image/AdminIcons/viewmessageicon.svg'
import { useNavigate } from 'react-router-dom';
  interface Props{
    data?:Contactus[]
    fin?:number
  }

const ContactusTable = ({data,fin}:Props) => {
  const theme = useTheme()
  const navigate = useNavigate();
  const handleAction = (id:string) => {
    const url = `/admincontactus/admincontactmessage/${id}`;
    navigate(url);
  };
  const memoizedData = useMemo(() => {
    return fin ? data?.slice(0, fin) : data;
  }, [fin, data]);
  return (
    <Paper sx={{ padding: "0.5rem", borderRadius: "0.5rem" }}>
      <Box>
        <SimpleBar style={{ width: "100%" }}>
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
                <TableCell>Timestamp</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email Address</TableCell>
                {/* <TableCell>Phone Number</TableCell> */}
                <TableCell>Message</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                "& tr": {
                  color: theme.palette.primary.main,
                },
              }}
            >
              {memoizedData?.map((message, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {dayjs(message.updatedAt).format("h:mmA, DD/MM/YYYY")}
                  </TableCell>
                  <TableCell>
                    {textFromat(_.upperFirst(message.first_name))}
                  </TableCell>
                  <TableCell>
                    {textFromat(_.upperFirst(message.last_name))}
                  </TableCell>
                  <TableCell>{textFromat(message.email)}</TableCell>
                  {/* <TableCell>{textFromat(message.phone_number)}</TableCell> */}
                  <TableCell>
                    {textFromat(message.message).slice(0, 10)}
                  </TableCell>
                  <TableCell>
                    <Button
                      style={{
                        backgroundColor: "#0047AB",
                        color: "white",
                        padding: "0.3rem",
                        width: "9rem",
                        borderRadius: "1.5rem",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onClick={() => handleAction(message._id)}
                    >
                      View Message{" "}
                      <img
                        style={{ marginLeft: "0.2rem" }}
                        src={viewmessageicon}
                      />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SimpleBar>
      </Box>
    </Paper>
  );
}

export default ContactusTable