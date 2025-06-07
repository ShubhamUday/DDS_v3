import React from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Dummy data
const appointments = [
  { id: 1, name: "Guy Hawkins", dentist: "Dr. Emily Carter", time: "20 Aug 6:30pm", notes: "Cold" },
  { id: 2, name: "Ralph Edwards", dentist: "Dr. Benjamin Hayes", time: "20 Aug 6:30pm", notes: "Fever" },
  { id: 3, name: "Theresa Webb", dentist: "Dr. Olivia Smith", time: "20 Aug 6:30pm", notes: "Headache" },
  { id: 4, name: "Ronald Richards", dentist: "Dr. Michael Anderson", time: "20 Aug 6:30pm", notes: "Back Pain" },
];

const AppointmentToday = () => {
  return (
    <Card sx={{ borderRadius: 3, p: 2 }}>
      {/* Header */}
      <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <MDTypography variant="h6">Appointment Today</MDTypography>
        <MDTypography variant="button" color="info" sx={{ cursor: "pointer" }}>
          View all
        </MDTypography>
      </MDBox>

      {/* Filters */}
      <MDBox display="flex" alignItems="center" gap={2} mb={2}>
        <MDBox display="flex" gap={1}>
          <Button variant="contained" color="info" size="small" sx={{ textTransform: "capitalize" }}>
            Pending
          </Button>
          <Button variant="text" color="dark" size="small" sx={{ textTransform: "capitalize" }}>
            All
          </Button>
        </MDBox>
        <Select defaultValue="All Dentist" size="small" sx={{ ml: "auto" }}>
          <MenuItem value="All Dentist">All Dentist</MenuItem>
          <MenuItem value="Dr. Olivia">Dr. Olivia</MenuItem>
          <MenuItem value="Dr. Carter">Dr. Carter</MenuItem>
        </Select>
      </MDBox>

      {/* Table Header */}
      <MDBox display="flex" fontWeight="bold" px={1} py={1} sx={{ backgroundColor: "#f8f9fa" }}>
        <MDBox width="5%">No.</MDBox>
        <MDBox width="20%">Name</MDBox>
        <MDBox width="25%">Dentist</MDBox>
        <MDBox width="20%">Time</MDBox>
        <MDBox width="20%">Notes</MDBox>
        <MDBox width="10%">Action</MDBox>
      </MDBox>

      {/* Table Rows */}
      {appointments.map((a, idx) => (
        <MDBox
          key={a.id}
          display="flex"
          alignItems="center"
          px={1}
          py={1}
          sx={{ borderBottom: "1px solid #f0f0f0" }}
        >
          <MDBox width="5%">{String(idx + 1).padStart(2, "0")}</MDBox>
          <MDBox width="20%">{a.name}</MDBox>
          <MDBox width="25%">{a.dentist}</MDBox>
          <MDBox width="20%">{a.time}</MDBox>
          <MDBox width="20%">{a.notes}</MDBox>
          <MDBox width="10%" display="flex" gap={1}>
            <Button variant="outlined" color="success" size="small" sx={{ textTransform: "capitalize" }}>
              Take Up
            </Button>
            <IconButton color="error" size="small">
              <Icon>delete</Icon>
            </IconButton>
          </MDBox>
        </MDBox>
      ))}
    </Card>
  );
};

export default AppointmentToday;
