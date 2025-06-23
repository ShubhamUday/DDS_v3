import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Grid, CardContent, Divider, CardActions, Fab } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton";
import img from "skel2.png";
import AddIcon from '@mui/icons-material/Add';

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Data
import { AlignVerticalBottomTwoTone } from "@mui/icons-material";
import tab from "assets/theme/components/tabs/tab";
import AddAppoinmentFormModal from "Pages/appoinment/AddAppoinmentFormModal";
import axios from "axios";
import { toast } from "react-toastify";
import { resetWarningCache } from "prop-types";
import moment from 'moment';

function Tables() {
  // const { appointmentdata, columns } = projectsTableData();
  const [appointmentdata, setAppointmentdata] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [isAppoinmentModalOpen, setIsAppoinmentModalOpen] = useState(false)
  const [formType, setFormType] = useState("add")
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  const navigate = useNavigate();

  // Filter rows based on the selected tab
  const filterRowsByStatus = (status) => {
    return appointmentdata.filter((appointment) => appointment.requestStatus === status);
  };


  const statusController = async (id, request) => {
    let requestStatus = request;

    const values = { requestStatus }
    console.log(values)
    try {
      const response = await axios.put(`${process.env.REACT_APP_HOS}/update-Appointment-Details/${id}`, values, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(response.data)
      if (response.data) {
        getAllAppointments()
        toast.success("Appoinment is updated successfully")
      }
    }
    catch (error) {
      console.log(error)
      toast.error("Unable to update appoinment")
    }
  };

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
                {appointment?.userID?.gender || appointment.gender} | {appointment?.userID?.age || appointment.age} yrs
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
              {appointment?.BookTime}
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

  const getAllAppointments = async () => {
    const drID = localStorage.getItem("doctorID");
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_HOS}/get-single-doctor-with-appointment/${drID}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      
      const appointments = result.data.appointmentID;
      setAppointmentdata(appointments);
      console.log("appointments", appointments);
    } catch (error) {
      toast.error("Error fetching appointments")
      console.error("Error fetching appointments:", error);
    }
  };

  const getSelectedAppoinemt = async (id)=>{
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_HOS}/get-single-appointment-with-details/${id}`,
        { headers: { 'Content-Type': 'application/json' } }
      );
      setSelectedAppointment(response.data)
      console.log("Selected Appointment", selectedAppointment)
    } catch (error) {
       toast.error("Error fetching appointments")
      console.error("Error fetching appointments:", error);
    }
  }
  useEffect(() => {
    getAllAppointments();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox p={3} >
        <Grid container spacing={6}>

          {/* <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info" >
                <MDTypography variant="h6" color="white">
                  Appointments
                </MDTypography>
              </MDBox> */}
          <Grid item xs={12} md={12} lg={12}>
            <AppBar position="sticky" color="default" sx={{ border: '.5px solid #ccc', borderRadius: 3, boxShadow: "none", top: '90px', zIndex: 1100, }}>
              <Tabs
                value={tabValue}
                onChange={handleSetTabValue}
                variant="fullWidth"
                sx={{ background: "white" }}
              >
                {["Pending", "Upcoming", "Completed"].map((label, index) => (
                  <Tab
                    key={label}
                    iconPosition="start"
                    icon={
                      <Icon sx={{ fontSize: 18, mr: 1 }}>
                        {index === 0 ? "pending_actions" : index === 1 ? "event_upcoming" : "checklist"}
                      </Icon>
                    }
                    label={
                      <MDBox sx={{ display: "flex", alignItems: "center", color: tabValue === index ? "#fff" : "inherit", }} >
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

          <Grid item lg={12}>

            {/* Cards */}
            <Grid container spacing={2}>
              {rows.map((row, index) => (
                <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
                  <Card
                    key={index}
                    sx={{
                      display: "flex",
                      height: "100%",
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
                      <MDBox sx={{ display: "flex", flexDirection: "column", mb: 0 }}> {row.project} </MDBox>
                    </CardContent>

                    <CardActions sx={{ marginTop: "auto" }}>
                      {tabValue === 0 && (
                        <>
                          <MDButton fullWidth size="small" color="primary"
                            sx={{ margin: 1, border: '1px solid grey', borderRadius: '999px' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("Accept Button clicked", row.id);
                              statusController(row.id, "Accepted")
                            }}
                          > Accept </MDButton>
                          <MDButton fullWidth size="small"
                            sx={{ margin: 1, border: '1px solid grey', borderRadius: '999px' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("Reject Button clicked", row.id);
                              statusController(row.id, "Reject")
                            }}
                          >
                            Reject </MDButton>
                        </>
                      )}
                      {tabValue === 1 && (
                        <MDButton
                          fullWidth
                          size="small"
                          // color="secondary"
                          sx={{ margin: 1, border: '1px solid grey', borderRadius: '999px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Reschedule Button clicked", row.id);
                            setFormType("edit")
                            getSelectedAppoinemt(row.id)
                            setIsAppoinmentModalOpen(true)
                          }}
                        >
                          Reschedule </MDButton>
                      )}
                      {tabValue === 2 && <></>}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item >
            <Fab color="primary" aria-label="add" onClick={() => { setIsAppoinmentModalOpen(true); setFormType("add") }}
              sx={{
                position: 'fixed',
                bottom: 16,
                right: 16,
              }}
            > <AddIcon /> </Fab>
          </Grid>

          {isAppoinmentModalOpen && (
            <AddAppoinmentFormModal
              isAppoinmentModalOpen={isAppoinmentModalOpen}
              setIsAppoinmentModalOpen={setIsAppoinmentModalOpen}
              getAllAppointments={getAllAppointments}
              formType={formType}
              selectedAppointment={selectedAppointment}
            />
          )}

        </Grid>
      </MDBox>

    </DashboardLayout>
  );
}

export default Tables;
