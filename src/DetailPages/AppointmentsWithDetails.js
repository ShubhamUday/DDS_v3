import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Grid,
  CircularProgress,
  Alert,
  Divider,
  Button,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import { Rating } from '@mui/material';

import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDAvatar from 'components/MDAvatar';

function AppointmentWithDetails() {
  const [appointmentData, setAppointmentData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const param1 = params.id;

  const getDetails = async () => {
    setLoading(true);
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_HOS}/get-single-appointment-with-details/${param1}`,
        { headers: { 'Content-Type': 'application/json' } }
      );
      setAppointmentData(result.data);
    } catch (error) {
      setError('Failed to load appointment details.');
    } finally {
      setLoading(false);
    }
  };

  console.log('Appointment Data', appointmentData)

  useEffect(() => {
    getDetails();
  }, [param1]);

  return (
    <DashboardLayout>
      <MDBox sx={{ padding: 3 }}>
        <MDBox
          sx={{
            minHeight: '100vh',
            position: 'relative',
            backgroundColor: '#f4f6f9',
            padding: 4,
          }}
        >
          {loading ? (
            <MDBox
              sx={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: 4,
                p: 4,
              }}
            >
              <MDBox display="flex" justifyContent="center" alignItems="center" sx={{ minHeight: '200px' }}>
                <CircularProgress />
              </MDBox>
            </MDBox>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <Grid container spacing={4}>
              {/* 👤 Patient Information Card */}
              <Grid item xs={12} md={5}>
                <MDBox
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    bgcolor: 'white',
                    border: '1px solid #d2d4d6',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-3px)',
                    },
                  }}
                >
                  <MDTypography variant="h6" fontWeight="medium">
                    👤 Patient Information
                  </MDTypography>
                  <Divider sx={{ mb: 2 }} />
                  <MDTypography variant="body2">Booking ID: <b>#D{appointmentData._id?.slice(0, 6)}</b></MDTypography>
                  <MDTypography variant="body2">Patient ID: <b>#D{appointmentData?.userID?._id?.slice(0, 6)}</b></MDTypography>
                  <MDTypography variant="body2">Name: {appointmentData?.userID?.name || appointmentData.patientName}</MDTypography>
                  <MDTypography variant="body2">Age: {appointmentData?.userID?.age || '--'}</MDTypography>
                  <MDTypography variant="body2">Gender: {appointmentData?.userID?.gender || '--'}</MDTypography>
                </MDBox>
              </Grid>

              {/* 🦷 Treatment Info Card */}
              <Grid item xs={12} md={6}>
                <MDBox
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    bgcolor: 'white',
                    transition: 'all 0.3s ease-in-out',
                    border: '1px solid #d2d4d6',
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-3px)',
                    },
                  }}
                >
                  <MDTypography variant="h6" fontWeight="medium">
                    🦷 Treatment Info
                  </MDTypography>
                  <Divider sx={{ mb: 2 }} />
                  <MDTypography variant="body2">Treatment: {appointmentData.Treatmentfor}</MDTypography>
                  <MDTypography variant="body2" mt={1}>Details: {appointmentData.ProblemDetails}</MDTypography>
                  <MDTypography variant="body2" mt={1}>Plan: {appointmentData.Plan}</MDTypography>
                </MDBox>
              </Grid>

              {/* 💊 Prescription Card */}
              <Grid item xs={12} md={6}>
                <MDBox
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    bgcolor: 'white',
                    transition: 'all 0.3s ease-in-out',
                    border: '1px solid #d2d4d6',
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-3px)',
                    },
                  }}
                >
                  <MDBox sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <MDTypography variant="h6" fontWeight="medium">
                      💊 Prescription
                    </MDTypography>
                    {appointmentData?.prescriptionID?.length > 0 && (
                      <MDTypography
                        component="a"
                        href={`/prescription-with-details/${appointmentData._id}`}
                        color="primary"
                        variant="button"
                        fontWeight="medium"
                        sx={{ cursor: 'pointer' }}
                      >
                        View Full →
                      </MDTypography>
                    )}
                  </MDBox>
                  <Divider sx={{ mb: 2 }} />
                  {appointmentData?.prescriptionID?.length > 0 ? (
                    <>
                      {appointmentData.prescriptionID.slice(0, 2).map((med, index) => (
                        <MDTypography key={index} variant="body2" sx={{ mb: 0.5 }}>
                          {index + 1}. {med.medicinename}
                        </MDTypography>
                      ))}
                      {appointmentData.prescriptionID.length > 2 && (
                        <MDTypography variant="body2">
                          + {appointmentData.prescriptionID.length - 2} more
                        </MDTypography>
                      )}
                    </>
                  ) : (
                    <MDTypography variant="body2">No prescription data yet.</MDTypography>
                  )}
                </MDBox>
              </Grid>

              {/* ⭐ Rating Card */}
              {appointmentData.ratingID && (
                <Grid item xs={12} md={5}>
                  <MDBox
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      bgcolor: 'white',
                      transition: 'all 0.3s ease-in-out',
                      border: '1px solid #d2d4d6',
                      '&:hover': {
                        boxShadow: 6,
                        transform: 'translateY(-3px)',
                      },
                    }}
                  >
                    <MDTypography variant="h6" fontWeight="medium">
                      ⭐ Patient Rating
                    </MDTypography>
                    <Divider sx={{ mb: 2 }} />
                    <MDBox display="flex" alignItems="center" gap={1}>
                      <Rating
                        name="read-only-rating"
                        value={appointmentData.ratingID.ratingCount}
                        precision={0.5}
                        readOnly
                      />
                    </MDBox>
                    <MDTypography variant="body2" mt={1}>
                      {appointmentData.ratingID.DiscriptionAppare}
                    </MDTypography>
                  </MDBox>
                </Grid>
              )}

              {/* 📁 Documents Card */}
              <Grid item xs={12} md={12}>
                <MDBox
                  p={3}
                  borderRadius="xl"
                  bgcolor="white"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    transition: '0.3s',
                    border: '1px solid #d2d4d6',
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-3px)',
                    },
                  }}
                >
                  <MDTypography variant="h6" fontWeight="medium">
                    📁 Patient Documents
                  </MDTypography>
                  <CloudUploadIcon sx={{ cursor: 'pointer' }} />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={12}>
                <MDBox
                  sx={{
                    p: 2,
                    margin: "0 auto",
                    backgroundColor: "#fff",
                    borderRadius: 3,
                    border: '1px solid #d2d4d6',
                    transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        boxShadow: 6,
                        transform: 'translateY(-3px)',
                        },
                 }}>
                <Grid item xs={12} md={12}>
                  <MDTypography variant='h4' align="center" gutterBottom > Appointment </MDTypography>
                  
                  <MDBox display="flex" justifyContent="space-between">  
                   <MDBox borderRadius="lg" m={0.5} p={0.5} sx={{ border: '1px solid #d2d4d6' }}>
                    <MDTypography variant="body2" ><b>Booking ID:</b>{" "}{appointmentData?._id}</MDTypography>
                   </MDBox>
                   <MDBox borderRadius="lg" m={0.5} p={0.5} sx={{ border: '1px solid #d2d4d6' }}>
                    <MDTypography variant="body2" ><b>Patient ID:</b>{" "}{appointmentData?.userID?._id}</MDTypography>         
                   </MDBox>
                  </MDBox>
                </Grid>
                  <MDBox display="flex" justifyContent="space-between" >
                   <Grid item xs={12} md={12}>
                     <MDBox display="flex" justifyContent="space-between">
                      <MDBox borderRadius="lg" m={0.5} p={0.5} sx={{ border: '1px solid #d2d4d6' }}>
                       <MDTypography variant="body2"> <b>Date :</b> {new Date(appointmentData?.Bookdate).toLocaleDateString("en-GB")}</MDTypography>
                      </MDBox>
                      <MDBox  borderRadius="lg" m={0.5} p={0.5} sx={{ border: '1px solid #d2d4d6' }}>
                       <MDTypography variant="body2"> <b>Time :</b> {new Date(appointmentData?.Bookdate).toLocaleTimeString("en-GB")}</MDTypography>
                      </MDBox>
                      <MDBox borderRadius="lg" m={0.5} p={0.5} sx={{ border: '1px solid #d2d4d6' }}>
                       <MDTypography variant="body2"><b>Name :</b>{" "}{ appointmentData?.userID?.name || appointmentData.patientName}</MDTypography>
                      </MDBox>
                     </MDBox>
                     <MDBox display='flex' justifyContent="space-between">
                      <MDBox borderRadius="lg" m={0.5} p={0.5} sx={{ border: '1px solid #d2d4d6' }}>
                       <MDTypography variant='body2'><b>Clinic/Hospital :</b>{" "}{appointmentData?.clinicID?.clinicname}</MDTypography>
                      </MDBox>
                      <MDBox borderRadius="lg" m={0.5} p={0.5} sx={{ border: '1px solid #d2d4d6' }}>
                       <MDTypography variant="body2"><b>Doctor :</b>{" "}{ appointmentData?.doctorID?.drname || appointmentData.patientName}</MDTypography>
                      </MDBox>
                     </MDBox>
                     <MDBox display='flex' justifyContent="space-between">
                      <MDBox borderRadius="lg" m={0.5} p={0.5} sx={{ border: '1px solid #d2d4d6' }}>
                       <MDTypography variant='body2'><b>Address :</b>{" "}{appointmentData?.clinicID?.clinicAddress}</MDTypography>
                      </MDBox>
                      <MDBox borderRadius="lg" m={0.5} p={0.5} sx={{ border: '1px solid #d2d4d6' }}>
                       <MDTypography variant="body2"><b>Designation :</b>{" "}{ appointmentData?.doctorID?.designation || appointmentData.patientName}</MDTypography>
                      </MDBox>
                     </MDBox>
                   </Grid>
                  </MDBox>
                  <MDBox display="flex" justifyContent="space-between" >
                    <Grid item xs={12} md={6}>
                     <MDBox borderRadius="lg" height="10rem" m={0.5} p={0.5} sx={{ border: '1px solid #d2d4d6' }}>
                      <MDTypography variant='h6' textAlign="center">Reason / Symptoms</MDTypography>
                      <MDTypography variant="button">{ appointmentData?.ProblemDetails || 'N/A'}</MDTypography>
                     </MDBox>
                    </Grid>
                    <Grid item xs={12} md={6}>
                     <MDBox borderRadius="lg"  height="10rem" m={0.5} p={0.5} sx={{ border: '1px solid #d2d4d6' }}>
                      <MDTypography textAlign="center" variant='h6'>Questions </MDTypography>
                      <MDTypography variant='button'>{ appointmentData?.Treatmentfor || 'N/A'} </MDTypography>
                     </MDBox>
                    </Grid>
                  </MDBox>
                  <MDBox display="flex" justifyContent="space-between" >
                    <Grid item xs={12} sm={6} md={6} lg={2} xl={2}>
                      <MDBox borderRadius="lg" textAlign="center" m={0.5} p={0.5} sx={{ border: '1px solid #d2d4d6' }}>
                         <MDTypography variant='h6'>AGE </MDTypography>
                         <MDTypography variant='button'>{ appointmentData?.userID?.age || 'N/A'} </MDTypography>
                      </MDBox>
                      
                    </Grid>
                  </MDBox>

                </MDBox>
              </Grid>
            </Grid>
          )}
          
        </MDBox>
      </MDBox>
    </DashboardLayout>


  );
}

export default AppointmentWithDetails;
