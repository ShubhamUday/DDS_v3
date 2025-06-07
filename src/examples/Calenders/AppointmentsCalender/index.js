import React, { useState } from "react";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Mock week days and date numbers
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const weekDates = [25, 26, 27, 28, 29, 30, 31];

// Dummy appointment data with date index (0-6)
const appointments = [
  { time: "12:00", name: "Mike Robin", service: "Consolation", image: "https://randomuser.me/api/portraits/men/11.jpg", dateIndex: 0 },
  { time: "14:00", name: "Esther Wilson", service: "Bleaching", image: "https://randomuser.me/api/portraits/women/44.jpg", dateIndex: 0 },
  { time: "15:00", name: "Jane Black", service: "Scalling", image: "https://randomuser.me/api/portraits/women/50.jpg", dateIndex: 0 },
  { time: "16:00", name: "Jake Long", service: "Check-up", image: "https://randomuser.me/api/portraits/men/51.jpg", dateIndex: 1 },
  { time: "17:00", name: "Lily Evans", service: "Filling", image: "https://randomuser.me/api/portraits/women/55.jpg", dateIndex: 2 },
];

const UpcomingAppointments = () => {
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  const filteredAppointments = appointments.filter(
    (item) => item.dateIndex === selectedDateIndex
  );

  return (
    <Card sx={{ borderRadius: 3, p: 2 }}>
      {/* Header */}
      <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <MDTypography variant="h6">October 2021</MDTypography>
        <MDBox>
          <IconButton size="small"><Icon>chevron_left</Icon></IconButton>
          <IconButton size="small"><Icon>chevron_right</Icon></IconButton>
        </MDBox>
      </MDBox>

      {/* Week Strip */}
      <MDBox display="flex" justifyContent="space-between" mb={2}>
        {weekDays.map((day, i) => (
          <MDBox
            key={i}
            onClick={() => setSelectedDateIndex(i)}
            textAlign="center"
            sx={{
              cursor: "pointer",
              bgcolor: selectedDateIndex === i ? "info.main" : "transparent",
              color: selectedDateIndex === i ? "white" : "text.primary",
              px: 1.5,
              py: 0.5,
              borderRadius: "md",
              transition: "all 0.2s ease-in-out",
            }}
          >
            <MDTypography variant="caption" fontWeight="medium">{day}</MDTypography>
            <MDTypography variant="caption" fontWeight="bold">
              {weekDates[i]}
            </MDTypography>
          </MDBox>
        ))}
      </MDBox>

      {/* Appointments Title */}
      <MDTypography variant="subtitle2" fontWeight="medium" mb={1}>
        Upcoming Appointments
      </MDTypography>

      <MDTypography variant="caption" color="text" mb={1}>
        {`Today, ${weekDays[selectedDateIndex]} ${weekDates[selectedDateIndex]} Oct`}
      </MDTypography>

      {/* Appointment List */}
      {filteredAppointments.length === 0 ? (
        <MDTypography variant="button" color="text" mt={1}>
          No Appointments
        </MDTypography>
      ) : (
        filteredAppointments.map((item, idx) => (
          <MDBox
            key={idx}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            bgcolor={idx % 2 === 0 ? "grey.100" : "grey.50"}
            borderRadius="lg"
            px={2}
            py={1.5}
            mb={1}
          >
            <MDBox width="20%">
              <MDTypography variant="button" fontWeight="medium">{item.time}</MDTypography>
            </MDBox>

            <MDBox display="flex" alignItems="center" gap={1} width="65%">
              <Avatar src={item.image} alt={item.name} sx={{ width: 32, height: 32 }} />
              <MDBox>
                <MDTypography variant="button" fontWeight="medium">{item.name}</MDTypography>
                <MDTypography variant="caption" color="text">{item.service}</MDTypography>
              </MDBox>
            </MDBox>

            <IconButton size="small">
              <Icon>more_vert</Icon>
            </IconButton>
          </MDBox>
        ))
      )}
    </Card>
  );
};

export default UpcomingAppointments;
