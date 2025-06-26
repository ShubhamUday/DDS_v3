import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";

// Custom Components
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import StatCard from "examples/Cards/StatCards";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

function Dashboard() {
  const drID = localStorage.getItem("doctorID");
  const stID = localStorage.getItem("CoHelperID")
  const navigate = useNavigate();
  const [appointmentdata, setAppointmentdata] = useState({});
  const [staff, setStaff] = useState([]);
  const [appointment, setAppointment] = useState([]);
  const [clinic, setClinic] = useState([]);
  const [patients, setPatients] = useState([]);
  const [singleStaff, setSingleStaff] = useState()

  const getAllAppointments = async () => {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_HOS}/get-single-doctor-with-appointment/${drID}`,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("doctr apptn details", result.data)
      setAppointment(result.data.appointmentID);
      const result1 = await axios.get(`${process.env.REACT_APP_HOS}/get-single-doctor/${drID}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log("doctr detls", result1.data);
      setClinic(result1.data.clinicID);
      const result2 = await axios.get(`${process.env.REACT_APP_HOS}/get-doctor-with-staff/${drID}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log("dotr with staff details", result2.data);
      setStaff(result2.data.staffIDs);
      setAppointmentdata(result.data);
      const uniqueEmailAppointments = filterUniqueEmails(result.data.appointmentID);
      setPatients(uniqueEmailAppointments);

      const result3 = await axios.get(`${process.env.REACT_APP_HOS}/get-one-staff-with-details/${stID}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      setSingleStaff(result3.data)

    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const filterUniqueEmails = (appointments) => {
    const seenEmails = new Set();
    return appointments.filter((appointment) => {
      const email = appointment.userID?.email;
      if (seenEmails.has(email)) {
        return false;
      } else {
        seenEmails.add(email);
        return true;
      }
    });
  };

  console.log("single staff", singleStaff)

  useEffect(() => {
    getAllAppointments();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox sx={{ p: 3 }}>

        <Grid container sx={{
          alignItems: 'center',
          backgroundImage: 'url(https://buybootstrap.com/demos/medflex/medflex-admin-dashboard/assets/images/banner3.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 4,
          backgroundRepeat: 'no-repeat',
          // height: '300px' ,
          minHeight: '300px', // ✅ ensures at least 100px but can grow
          flexWrap: 'wrap', // ✅ important for mobile wrapping
          // alignItems: 'stretch', // ⬅️ optional: keeps height consistent
        }}>
          <Grid item xs={12} md={6} lg={2} sx={{ m: 1 }}>
            <StatCard
              title="Total Patients"
              value={appointmentdata.patientchecked || 0}
              icon="group"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={2} sx={{ m: 1 }}>
            <StatCard
              title="Current Appointments"
              value={appointment.length}
              icon="event"
              bgColor="#ff914d"
              gradient="#4db6ac"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={2} sx={{ m: 1 }}>
            <StatCard
              title="Experience"
              value={`${appointmentdata.yearsofexperience || 0} yrs`}
              icon="badge"
              bgColor="#3e87d9"
              gradient="#64b5f6"
            />
          </Grid>
        </Grid>


        <Grid container spacing={2} sx={{ mt: 2 }}>

          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: "20px" }}>

              <MDBox display="flex" px={2} pb={1} alignItems="center" justifyContent="space-between">
                <MDTypography variant="h6">Appointments</MDTypography>
                <IconButton href="/appointments"><MoreVertIcon /></IconButton>
              </MDBox>
              <MDBox display="flex" px={2} pb={1} alignItems="center">
                <MDBox flex={3}>
                  <MDTypography variant="button" fontSize="small" fontWeight="medium">PATIENT</MDTypography>
                </MDBox>
                <MDBox flex={2} textAlign="center">
                  <MDTypography variant="button" fontSize="small" fontWeight="medium">DATE</MDTypography>
                </MDBox>
                <MDBox flex={2} textAlign="center">
                  <MDTypography variant="button" fontSize="small" fontWeight="medium">TIME</MDTypography>
                </MDBox>
              </MDBox>
              {appointment.slice(0, 4).map((item, index) => (
                <MDBox
                  key={index}
                  display="flex"
                  alignItems="center"
                  py={1}
                  px={2}
                  sx={{
                    borderTop: "1px solid #eee",
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#f9f9f9" },
                  }}
                  onClick={() => navigate(`/appointment-with-details/${item._id}`)}
                >

                  <MDBox flex={3} display="flex" alignItems="center" gap={1}>
                    <MDTypography color="text" fontSize="small" fontWeight="regular">{item.patientName || item.userID.name}</MDTypography>
                  </MDBox>

                  <MDBox flex={2} textAlign="center" >
                    <MDTypography color="text" fontSize="small" fontWeight="regular">
                      {new Date(item.Bookdate).toLocaleDateString("en-GB")}
                    </MDTypography>
                  </MDBox>

                  <MDBox flex={2} textAlign="center" >
                    <MDTypography color="text" fontSize="small" fontWeight="regular">
                      {new Date(item.Bookdate).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </MDTypography>
                  </MDBox>

                </MDBox>
              ))}

            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>

              <MDBox display="flex" px={2} pb={1} alignItems="center" justifyContent="space-between">
                <MDTypography variant="h6">Patients</MDTypography>
                <IconButton href="/patients"><MoreVertIcon /></IconButton>
              </MDBox>
              <MDBox display="flex" px={2} pb={1} alignItems="center">
                <MDBox flex={3}>
                  <MDTypography variant="button" fontSize="small" fontWeight="medium">NAME</MDTypography>
                </MDBox>
                <MDBox flex={2} textAlign="center">
                  <MDTypography variant="button" fontSize="small" fontWeight="medium">GENDER</MDTypography>
                </MDBox>
                <MDBox flex={2} textAlign="center">
                  <MDTypography variant="button" fontSize="small" fontWeight="medium">CLINIC</MDTypography>
                </MDBox>
              </MDBox>
              {patients.slice(0, 4).map((item, index) => (
                <MDBox
                  key={index}
                  display="flex"
                  alignItems="center"
                  py={1}
                  px={2}
                  sx={{
                    borderTop: "1px solid #eee",
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#f9f9f9" },
                  }}
                  onClick={() => navigate(`/patient-with-details/${item._id}`)}
                >

                  <MDBox flex={3} display="flex" alignItems="center" gap={1}>
                    <MDTypography color="text" fontSize="small" fontWeight="regular">{item?.userID?.name || item.patientName}</MDTypography>
                  </MDBox>

                  <MDBox flex={2} textAlign="center" >
                    <MDTypography color="text" fontSize="small" fontWeight="regular">
                      {item.gender || "Not specified"}
                    </MDTypography>
                  </MDBox>

                  <MDBox flex={2} textAlign="center" >
                    <MDTypography color="text" fontSize="small" fontWeight="regular">
                      {item?.clinicID?.clinicname || 'Not available'}
                    </MDTypography>
                  </MDBox>

                </MDBox>
              ))}

            </Card>
          </Grid>

        </Grid>


        <Grid container spacing={2} sx={{ mt: 2 }}>

          <Grid item xs={12} md={6}>
            <Card>

              <MDBox display="flex" px={2} pb={1} alignItems="center" justifyContent="space-between">
                <MDTypography variant="h6">Staffs</MDTypography>
                <IconButton href="/staffs"><MoreVertIcon /></IconButton>
              </MDBox>
              <MDBox display="flex" px={2} pb={1} alignItems="center">
                <MDBox flex={3}>
                  <MDTypography variant="button" fontSize="small" fontWeight="medium">NAME</MDTypography>
                </MDBox>
                <MDBox flex={2} textAlign="center">
                  <MDTypography variant="button" fontSize="small" fontWeight="medium">GENDER</MDTypography>
                </MDBox>
                <MDBox flex={2} textAlign="center">
                  <MDTypography variant="button" fontSize="small" fontWeight="medium">POSITION</MDTypography>
                </MDBox>
              </MDBox>
              {staff.slice(0, 2).map((item, index) => (
                <MDBox
                  key={index}
                  display="flex"
                  alignItems="center"
                  py={1}
                  px={2}
                  sx={{
                    borderTop: "1px solid #eee",
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#f9f9f9" },
                  }}
                  onClick={() => navigate(`/staffs`)}
                >

                  <MDBox flex={3} display="flex" alignItems="center" gap={1}>
                    <MDTypography color="text" fontSize="small" fontWeight="regular">{item.name}</MDTypography>
                  </MDBox>

                  <MDBox flex={2} textAlign="center" >
                    <MDTypography color="text" fontSize="small" fontWeight="regular">
                      {item.gender}
                    </MDTypography>
                  </MDBox>

                  <MDBox flex={2} textAlign="center" >
                    <MDTypography color="text" fontSize="small" fontWeight="regular">
                      {item.assignAs}
                    </MDTypography>
                  </MDBox>

                </MDBox>
              ))}

            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>

              <MDBox display="flex" px={2} pb={1} alignItems="center" justifyContent="space-between">
                <MDTypography variant="h6">Clinics</MDTypography>
                <IconButton href="/clinics"><MoreVertIcon /></IconButton>
              </MDBox>
              <MDBox display="flex" px={2} pb={1} alignItems="center">
                <MDBox flex={3}>
                  <MDTypography variant="button" fontSize="small" fontWeight="medium">NAME</MDTypography>
                </MDBox>
                <MDBox flex={2} textAlign="center">
                  <MDTypography variant="button" fontSize="small" fontWeight="medium">OPEN</MDTypography>
                </MDBox>
                <MDBox flex={2} textAlign="center">
                  <MDTypography variant="button" fontSize="small" fontWeight="medium">CLOSE</MDTypography>
                </MDBox>
              </MDBox>
              {clinic.slice(0, 2).map((item, index) => (
                <MDBox
                  key={index}
                  display="flex"
                  alignItems="center"
                  py={1}
                  px={2}
                  sx={{
                    borderTop: "1px solid #eee",
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#f9f9f9" },
                  }}
                  onClick={() => navigate(`/clinic-with-details/${item._id}`)}
                >

                  <MDBox flex={3} display="flex" alignItems="center" gap={1}>
                    <MDTypography color="text" fontSize="small" fontWeight="regular">{item.clinicname}</MDTypography>
                  </MDBox>

                  <MDBox flex={2} textAlign="center" >
                    <MDTypography color="text" fontSize="small" fontWeight="regular">
                      {item.openTime || "Not available"}
                    </MDTypography>
                  </MDBox>

                  <MDBox flex={2} textAlign="center" >
                    <MDTypography color="text" fontSize="small" fontWeight="regular">
                      {item.closeTime || 'Not available'}
                    </MDTypography>
                  </MDBox>

                </MDBox>
              ))}

            </Card>
          </Grid>

        </Grid>

      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;