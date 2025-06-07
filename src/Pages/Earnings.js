import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  Grid,
  Chip,
  Rating,
  LinearProgress,
} from "@mui/material";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";
import IndianCurrencyFormatter from "components/IndianCurrencyFormatter";
import MDBox from "components/MDBox";

const Earning = () => {
  const navigate = useNavigate();
  const [chatData, setChatData] = useState([]);
  const [paidTotalAmount, setPaidTotalAmount] = useState(0);
  const [pendingAmount, setPendingAmount] = useState(0);

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
      <MDBox sx={{padding:3}}>
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
      <Grid container p={2}>
        <Grid item xs={12}>
          <Card sx={{ p: 2 }}>
            <MDBox display="flex" px={2} pb={1} alignItems="center">
              <MDBox flex={3}>
                <MDTypography variant="button" fontSize="small" fontWeight="medium">PATIENT</MDTypography>
              </MDBox>
              <MDBox flex={2} textAlign="center">
                <MDTypography variant="button" fontSize="small" fontWeight="medium">AMOUNT</MDTypography>
              </MDBox>
              <MDBox flex={2} textAlign="center">
                <MDTypography variant="button" fontSize="small" fontWeight="medium">STATUS</MDTypography>
              </MDBox>
              <MDBox flex={2} textAlign="center">
                <MDTypography variant="button" fontSize="small" fontWeight="medium">RATING</MDTypography>
              </MDBox>
            </MDBox>

            {chatData.map((item, index) => (
              <Card
                key={index}
                sx={{
                  p: 2,
                  mb: 2,
                  boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.1)",
                  borderRadius: 2,
                  backgroundColor: "#f9f9f9",
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#f1f1f1" },
                }}
                onClick={() => navigate(`/appointment-with-details/${item._id}`)}
              >
                <MDBox display="flex" alignItems="center" py={1}>
                  {/* Patient */}
                  <MDBox flex={3} display="flex" alignItems="center" gap={1}>
                    <MDTypography color="text" fontSize="small" fontWeight="regular">{item.patientName || item.userID.name}</MDTypography>
                  </MDBox>

                  {/* Amount */}
                  <MDBox flex={2} textAlign="center">
                    <MDTypography color="text" fontSize="small" fontWeight="regular">
                      ₹ {item.PayAmount}
                    </MDTypography>
                  </MDBox>

                  {/* Status */}
                  <MDBox flex={2} textAlign="center" sx={{ border: '.5px solid #ccc', borderRadius: '90px' }}>
                    {
                      item.PayStatus === "Paid" ? 
                      <MDTypography color="success" fontSize="small" fontWeight="bold">PAID</MDTypography> :
                      <MDTypography color="error" fontSize="small" fontWeight="bold">PENDING</MDTypography>
                    }
                  </MDBox>

                  {/* Rating */}
                  <MDBox flex={2} textAlign="center">
                    <MDTypography variant="button" fontSize="small" fontWeight="regular">
                      <Rating
                        value={item?.ratingID?.ratingCount || 0}
                        precision={1}
                        readOnly
                        size="small"
                      />
                    </MDTypography>
                  </MDBox>

                </MDBox>
              </Card>
            ))}
          </Card>
        </Grid>
      </Grid>
      </MDBox>
    </DashboardLayout>
  );
};

export default Earning;
