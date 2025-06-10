import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Grid, Divider } from '@mui/material';
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneIcon from '@mui/icons-material/Phone';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MDAvatar from 'components/MDAvatar';
import Male from '@mui/icons-material/Male';
import Female from '@mui/icons-material/Female';
import { useNavigate } from 'react-router-dom';

function StaffCard() {
  const drID = localStorage.getItem('doctorID');
  const [appointmentdata, setAppointmentdata] = useState([]);
  const navigate = useNavigate();

  const getAllStaff = async () => {
    try {
      const result = await axios.get(`${process.env.REACT_APP_HOS}/get-doctor-with-staff/${drID}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      setAppointmentdata(result.data.staffIDs);
      console.log(result.data.staffIDs);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllStaff();
  }, []);

  return (
    <Grid container spacing={3}>
      {appointmentdata.map((e, index) => (
        <Grid item xs={12} md={6} lg={4} key={index}>
          <Card sx={{
            borderRadius: 4, boxShadow: "0px 2px 0px #25408f", transition: "transform 0.3s, box-shadow 0.3s", transformOrigin: 'center',
            '&:hover': {
              boxShadow: 2,
              transform: 'translateY(-5px)',
            },
          }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <MDAvatar src={e?.profile_url} alt={e.name} shadow="md" sx={{ width: 56, height: 56 }} />
                </Grid>
                <Grid item xs>
                  <MDTypography variant="h6" fontWeight="medium">
                    {e.name}
                  </MDTypography>
                  <MDTypography variant="button" color="text">
                    {e.assignAs}
                  </MDTypography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <MDBox display="flex" alignItems="center" mb={1}>
                {e.gender === 'Male' ? (
                  <Male sx={{ mr: 1, color: "#42a5f5" }} />
                ) : (
                  <Female sx={{ mr: 1, color: "#f48fb1" }} />
                )}
                <MDTypography variant="body2" color="text">{e.gender}</MDTypography>
              </MDBox>

              <MDBox display="flex" alignItems="center" mb={1}>
                <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                <MDTypography variant="body2" color="text">{e.number}</MDTypography>
              </MDBox>

              <MDBox display="flex" alignItems="center" mb={1}>
                <LocalHospitalIcon fontSize="small" sx={{ mr: 1, color: 'secondary.main' }} />
                <MDTypography variant="body2" color="text">{e.clinicID?.clinicname}</MDTypography>
              </MDBox>

              <MDBox display="flex" alignItems="center" mb={1}>
                <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
                <MDTypography variant="body2" color="text">Check-In: {e.checkInTime}</MDTypography>
              </MDBox>

              <MDBox display="flex" alignItems="center" mb={1}>
                <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'error.main' }} />
                <MDTypography variant="body2" color="text">Check-Out: {e.checkOutTime}</MDTypography>
              </MDBox>

              <MDBox display="flex" alignItems="center" mb={1}>
                <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'info.main' }} />
                <MDTypography variant="body2" color="text"
                  sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} >
                  {e.clinicID?.clinicAddress}
                </MDTypography>
              </MDBox>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default StaffCard;
