import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Grid, CardContent, Divider, CardActions } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import img from "skel2.png";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Data
import projectsTableData from "layouts/tables/data/AppointmentData";
import { AlignVerticalBottomTwoTone } from "@mui/icons-material";
import MDButton from "components/MDButton";
import tab from "assets/theme/components/tabs/tab";

function Tables() {
  const { appointmentdata, columns } = projectsTableData();
  const [tabValue, setTabValue] = useState(0);

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  // Filter rows based on the selected tab
  const filterRowsByStatus = (status) => {
    return appointmentdata.filter((appointment) => appointment.requestStatus === status);
  };

  const navigate = useNavigate();

  // Get filtered rows based on the tab
  const getFilteredRows = () => {
    switch (tabValue) {
      case 0:
        return filterRowsByStatus("Pending");
      case 1:
        return filterRowsByStatus("Accepted");
      case 2:
        return filterRowsByStatus("Completed");
      default:
        return [];
    }
  };

  // Handle row click
  const handleRowClick = (id) => {
    navigate(`/appointment-with-details/${id}`);
  };

  const rows = getFilteredRows().map((appointment) => ({
    id: appointment._id,
    project: (
      <>
        <MDBox
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            flexWrap: "wrap",
          }}
        >
          {/* Left: Patient Info */}
          <MDBox sx={{ display: "flex", alignItems: "center" }}>
            <MDAvatar
              src={appointment?.userID?.profile_url || img}
              alt="User Avatar"
              sx={{ width: 50, height: 50, mr: 2 }}
            />
            <MDBox>
              <MDTypography fontWeight="bold" fontSize="lg">
                {appointment?.userID?.name || appointment.patientName}
              </MDTypography>
              <MDTypography fontSize="small" color="text">
                {appointment.gender} | {appointment.age} yrs
              </MDTypography>
            </MDBox>
          </MDBox>

          {/* Right: Date & Time */}
          <MDBox sx={{ textAlign: "right" }}>
            <MDTypography
              fontSize="small"
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
            >
              <Icon sx={{ fontSize: 18, mr: 1, color: "info" }}>calendar_today</Icon>
              {new Date(appointment.Bookdate).toLocaleDateString("en-GB")}
            </MDTypography>
            <MDTypography
              fontSize="small"
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
            >
              <Icon sx={{ fontSize: 18, mr: 1, color: "info" }}>access_time</Icon>
              {new Date(appointment.Bookdate).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </MDTypography>
          </MDBox>
        </MDBox>

        <Divider sx={{ mb: 2, mt: 0 }} />

        {/* Treatment Details */}
        <MDBox>
          {appointment.Treatmentfor && (
            <MDTypography
              fontSize="small"
              sx={{ mb: 0.5 }}
              display="flex"
              alignItems="center"
              textTransform="capitalize"
            >
              <Icon sx={{ fontSize: 18, mr: 1, color: "primary.main" }}>medical_services</Icon>
              <strong>Treatment:</strong>&nbsp;{appointment.Treatmentfor}
            </MDTypography>
          )}
          {appointment.ProblemDetails && (
            <MDTypography
              fontSize="small"
              sx={{ mb: 0.5 }}
              display="flex"
              alignItems="center"
              textTransform="capitalize"
            >
              <Icon sx={{ fontSize: 18, mr: 1, color: "secondary.main" }}>assignment</Icon>
              <strong>Details:</strong>&nbsp;{appointment.ProblemDetails}
            </MDTypography>
          )}
          {appointment.clinicID?.clinicname && (
            <MDTypography
              fontSize="small"
              sx={{ mt: 1 }}
              display="flex"
              alignItems="center"
              textTransform="capitalize"
            >
              <Icon sx={{ fontSize: 18, mr: 1, color: "info.main" }}>local_hospital</Icon>
              <strong>Clinic:</strong>&nbsp;{appointment.clinicID.clinicname}
            </MDTypography>
          )}
        </MDBox>
      </>
    ),
  }));

  const tabStyles = [
    {
      selectedBg: "#25408f", // Pending
      textColor: "#fff",
    },
    {
      selectedBg: "#ff914d", // Upcoming
      textColor: "#fff",
    },
    {
      selectedBg: "#3e87d9", // Completed
      textColor: "#fff",
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox sx={{ padding: 3 }}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            {/* <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Appointments
                </MDTypography>
              </MDBox> */}

            <Grid padding={1}>
              <AppBar position="fixed" color="default" sx={{ boxShadow: "none", marginTop:11, width:1100, marginRight:5}}>
                <Tabs
                  value={tabValue}
                  onChange={handleSetTabValue}
                  // variant="fullWidth"
                  sx={{ background: "white" }}
                >
                  {["Pending", "Upcoming", "Completed"].map((label, index) => (
                    <Tab
                      key={label}
                      iconPosition="start"
                      icon={
                        <Icon sx={{ fontSize: 18, mr: 1 }}>
                          {index === 0
                            ? "pending_actions"
                            : index === 1
                            ? "event_upcoming"
                            : "checklist"}
                        </Icon>
                      }
                      label={
                        <MDBox
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            color: tabValue === index ? "#fff" : "inherit",
                          }}
                        >
                          {label}
                        </MDBox>
                      }
                      sx={{
                        flex: 1,
                        borderRadius: 1,
                        mx: 0.5,
                        backgroundColor:
                          tabValue === index ? tabStyles[index].selectedBg : "transparent",
                        transition: "background-color 0.3s ease",
                        "& .MuiTab-wrapper": {
                          flexDirection: "row",
                          justifyContent: "center",
                          color: tabValue === index ? "#fff" : "inherit", // For label and icon
                        },
                        "&:hover": {
                          backgroundColor:
                            tabValue === index ? tabStyles[index].selectedBg : "#f0f0f0",
                        },
                      }}
                    />
                  ))}
                </Tabs>
              </AppBar>
            </Grid>

            {/* cards */}
            <MDBox pt={3} sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2.5 }}>
              {rows.map((row, index) => (
                <Card
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    p: 0,
                    borderRadius: 4,
                    transition: "all 0.3s ease",
                    boxShadow:
                      tabValue === 0
                        ? "0px 2px 0px #25408f"
                        : tabValue === 1
                        ? "0px 2px 0px #ff914d"
                        : "0px 2px 0px #3e87d9",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: 2,
                    },
                  }}
                  onClick={() => handleRowClick(row.id)}
                >
                  <CardContent>
                    <MDBox sx={{ display: "flex", flexDirection: "column", mb: 0 }}>
                      {row.project}
                    </MDBox>
                  </CardContent>
                  <CardActions sx={{ marginTop: "auto" }}>
                    {tabValue === 0 && (
                      <>
                        {" "}
                        <MDButton
                          fullWidth
                          size="small"
                          color="primary"
                          sx={{ margin: 1, border:'1px solid grey',borderRadius:'999px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Button clicked", row.id);
                          }}
                        >
                          Accept
                        </MDButton>
                        <MDButton
                          fullWidth
                          size="small"
                          // color="info"
                          sx={{ margin: 1, border:'1px solid grey',borderRadius:'999px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Button clicked", row.id);
                          }}
                        >
                          Reject
                        </MDButton>
                      </>
                    )}
                    {tabValue === 1 && (
                      <MDButton
                        fullWidth
                        size="small"
                        // color="secondary"
                        sx={{ margin: 1, border:'1px solid grey',borderRadius:'999px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Button clicked", row.id);
                        }}
                      >
                        Reschedule
                      </MDButton>
                    )}
                    {tabValue === 2 && <></>}
                  </CardActions>
                </Card>
              ))}
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Tables;
