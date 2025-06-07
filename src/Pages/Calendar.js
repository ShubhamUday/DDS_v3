import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Card, Divider, Grid, Icon } from "@mui/material";
import Calendar from "react-calendar";
import "../examples/Calenders/CalendarStyles.css";

import appointmentData from "../layouts/tables/data/AppointmentData";

function CalendarPage() {
  const navigate = useNavigate();
  const [value, setValue] = useState(new Date());
  const { appointmentdata } = appointmentData();
  const [filteredData, setFilteredData] = useState([]);

  console.log("selected date", value);

  console.log("Appointments data", appointmentdata);

  const filterAppointment = () => {
    const filteredData = appointmentdata.filter((item) => {
      const appointmentDate = new Date(item.Bookdate);
      return (
        appointmentDate.getFullYear() === value.getFullYear() &&
        appointmentDate.getMonth() === value.getMonth() &&
        appointmentDate.getDate() === value.getDate()
      );
    });
    setFilteredData(filteredData);
    console.log("Filtered data for selected date:", filteredData);
  };

  useEffect(() => {
    filterAppointment();
  }, [value, appointmentdata]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container spacing={1}>
        <Grid item xs={12} md={6} lg={8}>
          {filteredData.slice(0).map((item, index) => (
            <Card
              key={{index}}
              onClick={() => navigate(`/appointment-with-details/${item._id}`)}
              sx={{
                m: 1,
                padding: 2,
                cursor: "pointer",
                "&:hover": { backgroundColor: "#f9f9f9" },
              }}
            >
              <MDBox key={index}>
                <MDBox
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                    flexWrap: "wrap",
                    // border:2,
                  }}
                >
                  <MDBox display="flex" alignItems="center" gap={1}>
                    <MDTypography variant="h6" fontWeight="bold">
                      {item?.patientName || item?.userID?.name}
                    </MDTypography>
                    <MDTypography fontSize="small" color="text">
                      {item?.gender} | {item?.age} yrs
                    </MDTypography>
                  </MDBox>
                  <MDBox>
                    <MDTypography
                      fontSize="small"
                      display="flex"
                      alignItems="center"
                      justifyContent="flex-end"
                    >
                      <Icon sx={{ fontSize: 18, mr: 1, color: "info" }}>calendar_today</Icon>
                      {new Date(item?.Bookdate).toLocaleDateString("en-GB")}{" "}
                      <Icon sx={{ fontSize: 18, mr: 1, ml: 1, color: "info" }}>access_time</Icon>
                      {new Date(item?.Bookdate).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </MDTypography>
                  </MDBox>
                </MDBox>

                <Divider sx={{ mt: -1 }} />
                <MDTypography
                  fontSize="small"
                  sx={{ mb: 0.5, mt: -1 }}
                  display="flex"
                  alignItems="center"
                  textTransform="capitalize"
                >
                  <Icon sx={{ fontSize: 18, mr: 1, color: "primary.main" }}>medical_services</Icon>
                  <strong>Treatment:</strong>&nbsp;{item?.Treatmentfor}
                </MDTypography>
                <MDTypography
                  fontSize="small"
                  sx={{}}
                  display="flex"
                  alignItems="center"
                  textTransform="capitalize"
                >
                  <Icon sx={{ fontSize: 18, mr: 1, color: "secondary.main" }}>assignment</Icon>
                  <strong>Details:</strong>&nbsp;{item?.ProblemDetails}
                </MDTypography>
              </MDBox>
            </Card>
          ))}
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ m: 1 }}>
            <Calendar
              className="my-calendar"
              onChange={setValue}
              value={value}
              selectRange={false}
            />
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}

export default CalendarPage;
