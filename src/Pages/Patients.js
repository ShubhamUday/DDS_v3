import { useEffect, useState } from "react";
import axios from 'axios';
import img from "skel2.png";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Person, Phone, Male, Female, Business } from "@mui/icons-material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";


import { useNavigate } from 'react-router-dom';



function Patients() {

  const [patients, setPatients] = useState([]);
  const [patients1, setPatients1] = useState([]);

  const getPatients = async () => {
    const drID = localStorage.getItem("doctorID");
    try {
      const result = await axios.get(`${process.env.REACT_APP_HOS}/get-single-doctor-with-appointment/${drID}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      const uniqueEmailAppointments = filterUniqueEmails(result.data.appointmentID);
      const uniqueEmailAppointments1 = filterUniqueEmails(result.data.oldtreatmenthistoryID);
      setPatients(uniqueEmailAppointments);
      setPatients1(uniqueEmailAppointments1);
      console.log(uniqueEmailAppointments);
    }
    catch (error) {
      console.log(error)
    }
  };

  const filterUniqueEmails = (appointments) => {
    const seenEmails = new Set();
    return appointments.filter(appointment => {
      const email = appointment.userID?.email;
      if (seenEmails.has(email)) {
        return false;
      } else {
        seenEmails.add(email);
        return true;
      }
    });
  };

  const navigate = useNavigate();

  const handleClick = (patientId) => {
    navigate(`/patient-with-details/${patientId}`);
  };

  useEffect(() => {
    getPatients();
  }, []);

  const PatientCard = ({ patient }) => (
    <Card
      sx={{
        position: 'relative',
        borderRadius: "20px",
        boxShadow: "0px 2px 0px #25408f",
        background: "linear-gradient(to bottom, #ffffff, #f7f9fc)",
        transition: "all 0.3s ease-in-out",
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 2,
        },
      }}
    >
      <MDBox sx={{ padding: 2 }}>
        <MDBox sx={{ position: 'relative' }}>
          <MDAvatar src={patient?.userID?.profile_url || img} alt="User Avatar"
            sx={{
              width: 60,
              height: 60,
              borderRadius: "12px",
              border: '3px solid #e0e0e0',
              boxShadow: 1,
              position: 'absolute',
              top: '-40px',
              right: '1px',
            }}
          />
        </MDBox>

        <MDBox sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {/* Name */}
          <MDBox sx={{ display: 'flex', alignItems: 'center' }}>
            <Person sx={{ mr: 1, color: 'primary.main' }} />
            <MDTypography variant="h6" fontWeight="bold">
              {patient?.userID?.name || patient.patientName}
            </MDTypography>
          </MDBox>

          {/* Gender */}
          <MDBox sx={{ display: 'flex', alignItems: 'center' }}>
            {patient.gender === 'Male' ? (
              <Male sx={{ mr: 1, color: "#2196f3", bgcolor: "#e3f2fd", borderRadius: "50%", p: 0.5 }} />
            ) : (
              <Female sx={{ mr: 1, color: "#e91e63", bgcolor: "#fce4ec", borderRadius: "50%", p: 0.5 }} />
            )}
            <MDTypography variant="body2">{patient.gender || "Not specified"}</MDTypography>
          </MDBox>

          {/* Phone */}
          <MDBox sx={{ display: 'flex', alignItems: 'center' }}>
            <Phone sx={{ mr: 1, color: 'secondary.main' }} />
            <MDTypography variant="body2">
              {patient?.userID?.number || 'Not available'}
            </MDTypography>
          </MDBox>

          {/* Clinic */}
          <MDBox sx={{ display: 'flex', alignItems: 'center' }}>
            <Business sx={{ mr: 1, color: 'info.main' }} />
            <MDTypography variant="body2">
              {patient?.clinicID?.clinicname || 'Not available'}
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox sx={{ padding: 3 }}>

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
                    <MDTypography variant="h6" color="white" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        Patients
                    </MDTypography>
                </MDBox> */}

        {/* Patient Cards Grid */}
        <Grid container spacing={3.5} mt={3}>
          {patients.map((patient, index) => (
            <Grid item xs={12} md={6} lg={4} key={index} onClick={() => handleClick(patient._id)}>
              <PatientCard patient={patient} />
            </Grid>
          ))}
          {patients1.map((patient, index) => (
            <Grid item xs={6} sm={4} lg={3} key={index}>
              <PatientCard patient={patient} />
            </Grid>
          ))}
        </Grid>

      </MDBox>

    </DashboardLayout>
  );
}

export default Patients;
