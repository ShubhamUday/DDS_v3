import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Grid, Rating, Table, TableBody, useMediaQuery, TableCell, TableContainer, TableHead, TableRow, Paper, TableFooter, TablePagination } from "@mui/material";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";
import IndianCurrencyFormatter from "components/IndianCurrencyFormatter";
import MDBox from "components/MDBox";
import { useTheme } from "@emotion/react";

const Earning = () => {
  const navigate = useNavigate();
  const [chatData, setChatData] = useState([]);
  const [paidTotalAmount, setPaidTotalAmount] = useState(0);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getAllAppointments = async () => {
    const drID = localStorage.getItem("doctorID");
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_HOS}/get-single-doctor-with-appointment/${drID}`
      );
      const appointments = result.data.appointmentID.reverse();
      setChatData(appointments);
      console.log(appointments);

      const paid = appointments.reduce(
        (acc, item) => (item.PayStatus === "Paid" ? acc + item.PayAmount : acc),
        0
      );
      const pending = appointments.reduce(
        (acc, item) => (item.PayStatus === "Pending" ? acc + item.PayAmount : acc),
        0
      );
      setPaidTotalAmount(paid);
      setPendingAmount(pending);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllAppointments();
  }, []);



  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox sx={{ padding: 3 }}>
        <Grid container spacing={3} p={2}>
          <Grid item xs={12} md={4}>
            <DefaultInfoCard
              icon="currency_rupee_circle"
              title="Total Revenue"
              value={<IndianCurrencyFormatter value={pendingAmount + paidTotalAmount} />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <DefaultInfoCard
              icon="wallet"
              title="Collected"
              value={<IndianCurrencyFormatter value={paidTotalAmount} />}
              color="secondary"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <DefaultInfoCard
              icon="pending"
              title="Pending"
              value={<IndianCurrencyFormatter value={pendingAmount} />}
              color="info"
            />
          </Grid>
        </Grid>

        <TableContainer component={Paper} >
          <Table sx={{ minWidth: 660, overflowX: "auto" }} aria-label="simple table">

            <TableHead>
              <TableRow>
                <TableCell>
                  <MDTypography variant="button" fontSize="small" fontWeight="medium">PATIENT</MDTypography>
                </TableCell>
                <TableCell align="center">
                  <MDTypography variant="button" fontSize="small" fontWeight="medium">AMOUNT</MDTypography>
                </TableCell>
                <TableCell align="center">
                  <MDTypography variant="button" fontSize="small" fontWeight="medium">STATUS</MDTypography>
                </TableCell>
                <TableCell align="center">
                  <MDTypography variant="button" fontSize="small" fontWeight="medium">RATING</MDTypography>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {chatData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: '#f9f9f9',
                      '&:hover': {
                        backgroundColor: "#f1f1f1",
                        cursor: 'pointer',
                      },
                    }}
                    onClick={() => navigate(`/appointment-with-details/${item._id}`)}
                  >
                    <TableCell>
                      <MDTypography color="text" fontSize="small" fontWeight="regular">{item.patientName || item.userID.name}</MDTypography>
                    </TableCell>

                    <TableCell align="center">
                      <MDTypography color="text" fontSize="small" fontWeight="regular">
                        ₹ {item.PayAmount}
                      </MDTypography>
                    </TableCell>

                    <TableCell align="center">
                      <MDBox flex={2} textAlign="center" sx={{ border: '.5px solid #ccc', borderRadius: '90px' }}>
                        {item.PayStatus === "Paid" ?
                          <MDTypography color="success" fontSize="small" fontWeight="bold"> PAID </MDTypography> :
                          <MDTypography color="error" fontSize="small" fontWeight="bold"> PENDING </MDTypography>}
                      </MDBox>
                    </TableCell>

                    <TableCell align="center">
                      <MDTypography variant="button" fontSize="small" fontWeight="regular">
                        <Rating
                          value={item?.ratingID?.ratingCount || 0}
                          precision={0.1}
                          readOnly
                          size="small"
                        />
                      </MDTypography>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            <TableFooter>

              <TablePagination
                component="div"
                count={chatData.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
              />
            </TableFooter>
          </Table>
        </TableContainer>

      </MDBox>
    </DashboardLayout>
  );
};

export default Earning;
