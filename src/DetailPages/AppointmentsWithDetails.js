import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Grid, CircularProgress, Alert, Divider, Rating, Box } from '@mui/material';

import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MDButton from "components/MDButton";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import calendarIcon from 'assets/images/icon.png'


const previousAppointments = [
  {
    id: "1",
    treatmentFor: "Back Pain",
    date: "2025-06-05",
    doctor: "Dr. Smith",
  },
  {
    id: "2",
    treatmentFor: "Migraine",
    date: "2025-05-22",
    doctor: "Dr. Lee",
  },
  {
    id: "3",
    treatmentFor: "Physiotherapy",
    date: "2025-05-10",
    doctor: "Dr. Patel",
  },
];

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
      <DashboardNavbar />
      <MDBox sx={{ padding: 3 }}>
        <MDBox
          sx={{
            minHeight: '100vh',
            // position: 'relative',
            backgroundColor: '#f4f6f9',
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
              {/* <Grid item xs={12} md={5}>
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
              </Grid> */}

              {/* 🦷 Treatment Info Card */}
              {/* <Grid item xs={12} md={6}>
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
              </Grid> */}

              {/* 💊 Prescription Card */}
              {/* <Grid item xs={12} md={6}>
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
              </Grid> */}

              {/* ⭐ Rating Card */}
              {/* {appointmentData.ratingID && (
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
              )} */}

              {/* 📁 Documents Card */}
              {/* <Grid item xs={12} md={12}>
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
              </Grid> */}
              <Grid item xs={12} md={12}>
                <MDBox
                  sx={{
                    p: 2,
                    margin: "0 auto",
                    backgroundColor: "#fff",
                    borderRadius: 3,
                    border: '1px solid #d2d4d6',
                    boxShadow: "0px 2px 0px #25408f",
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-5px)',
                    },
                  }}>

                  <MDTypography variant="h4" align="center" color="info" gutterBottom
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }} >
                    <Box component="img" src={calendarIcon} alt="calendar icon" sx={{ width: 50, height: 40 }} />
                    Appointment
                  </MDTypography>

                  <Divider />
                  <MDBox display="flex" justifyContent="space-between" flexWrap="wrap" sx={{ flexDirection: { xs: 'column', md: 'row' } }} >
                    {/* Booking ID */}
                    <MDBox display="flex" alignItems="center" borderRadius="lg" m={0.5} p={0.5}
                      sx={{ border: '1px solid #d2d4d6', width: { xs: '100%', md: '30%' }, }} >
                      <MDTypography variant="body2" color="info" mr={1}> <b>Booking ID:</b> </MDTypography>
                      <MDTypography variant="body2">{appointmentData?._id}</MDTypography>
                    </MDBox>

                    {/* Patient ID */}
                    <MDBox display="flex" alignItems="center" borderRadius="lg" m={0.5} p={0.5}
                      sx={{ border: '1px solid #d2d4d6', width: { xs: '100%', md: '30%' }, justifyContent: { xs: 'flex-start', md: 'flex-end' }, }} >
                      <MDTypography variant="body2" color="info" mr={1}> <b>Patient ID:</b> </MDTypography>
                      <MDTypography variant="body2">{appointmentData?.userID?._id}</MDTypography>
                    </MDBox>
                  </MDBox>

                  <MDBox display="flex" justifyContent="space-between" >
                    <Grid item xs={12} md={12}>
                      <MDBox display="flex" justifyContent="space-between">
                        <MDBox display="flex" borderRadius="lg" m={0.5} p={0.5} sx={{ border: '1px solid #d2d4d6' }}>
                          <MDTypography variant="body2" color='info' sx={{ fontWeight: 'bold', mr: 1 }}> Date : </MDTypography>
                          <MDTypography variant="body2">{new Date(appointmentData?.Bookdate).toLocaleDateString("en-GB")}</MDTypography>
                        </MDBox>
                        <MDBox display="flex" borderRadius="lg" m={0.5} p={0.5} sx={{ border: '1px solid #d2d4d6' }}>
                          <MDTypography variant="body2" color='info' sx={{ fontWeight: 'bold', mr: 1 }}> Time : </MDTypography>
                          <MDTypography variant="body2">{new Date(appointmentData?.Bookdate).toLocaleTimeString("en-GB")}</MDTypography>
                        </MDBox>
                        <MDBox display="flex" borderRadius="lg" m={0.5} p={0.5} sx={{ border: '1px solid #d2d4d6' }}>
                          <MDTypography variant="body2" color='info' sx={{ fontWeight: 'bold', mr: 1 }}>Name :</MDTypography>
                          <MDTypography variant="body2">{appointmentData?.userID?.name || appointmentData.patientName}</MDTypography>
                        </MDBox>
                      </MDBox>
                      <MDBox display='flex' justifyContent="space-between">
                        <MDBox display="flex" borderRadius="lg" m={0.5} p={0.5} sx={{ border: '1px solid #d2d4d6' }}>
                          <MDTypography variant='body2' color='info' sx={{ fontWeight: 'bold', mr: 1 }}>Clinic/Hospital :</MDTypography>
                          <MDTypography variant="body2">{appointmentData?.clinicID?.clinicname}</MDTypography>
                        </MDBox>
                        <MDBox display="flex" borderRadius="lg" m={0.5} p={0.5} sx={{ border: '1px solid #d2d4d6' }}>
                          <MDTypography variant="body2" color='info' sx={{ fontWeight: 'bold', mr: 1 }}>Doctor :</MDTypography>
                          <MDTypography variant="body2">{appointmentData?.doctorID?.drname || appointmentData.patientName}</MDTypography>
                        </MDBox>
                      </MDBox>
                      <MDBox display='flex' justifyContent="space-between">
                        <MDBox display="flex" borderRadius="lg" m={0.5} p={0.5} sx={{ border: '1px solid #d2d4d6' }}>
                          <MDTypography variant='body2' color='info' sx={{ fontWeight: 'bold', mr: 1 }}>Address :</MDTypography>
                          <MDTypography variant="body2">{appointmentData?.clinicID?.clinicAddress}</MDTypography>
                        </MDBox>
                        <MDBox display="flex" borderRadius="lg" m={0.5} p={0.5} sx={{ border: '1px solid #d2d4d6' }}>
                          <MDTypography variant="body2" color='info' sx={{ fontWeight: 'bold', mr: 1 }}>Designation :</MDTypography>
                          <MDTypography variant="body2">{appointmentData?.doctorID?.designation || appointmentData.patientName}</MDTypography>
                        </MDBox>
                      </MDBox>
                    </Grid>
                  </MDBox>

                  <MDBox display="flex" justifyContent="space-between">
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <MDBox borderRadius="lg" height='10rem' m={0.5} p={0.5}
                          sx={{ border: '1px solid #d2d4d6', backgroundColor: '#f9f9f9', }} >
                          <MDTypography variant="body2" textAlign="center" color="white"
                            sx={{ backgroundColor: '#25408f', borderRadius: 1, fontWeight: 'bold', letterSpacing: '0.5px', }} >
                            Reason / Symptoms
                          </MDTypography>

                          <MDTypography variant="body2" sx={{ ml: 1, color: '#333', lineHeight: 1.6 }} >
                            {appointmentData?.ProblemDetails || 'N/A'}
                          </MDTypography>
                        </MDBox>

                      </Grid>
                      <Grid item xs={12} md={6}>
                        <MDBox borderRadius="lg" height="10rem" m={0.5} p={0.5} sx={{ border: '1px solid #d2d4d6' }}>
                          <MDTypography variant='body2' textAlign="center" color='white'
                            sx={{ backgroundColor: '#25408f', borderRadius: 1, fontWeight: 'bold', letterSpacing: '0.5px' }}>
                            Prescription </MDTypography>
                          {/* <MDTypography variant='button' ml={2}>{ appointmentData?.Treatmentfor || 'N/A'} </MDTypography> */}

                          {appointmentData?.prescriptionID?.length > 0 ? (
                            <>
                              {appointmentData.prescriptionID.slice(0, 3).map((med, index) => (
                                <MDTypography key={index} variant="body2"
                                  sx={{ color: '#333', lineHeight: 1.6, ml: 2, display: 'flex', alignItems: 'center' }}
                                >
                                  <Box component="span" sx={{ mr: 1 }}>•</Box> {med.medicinename}
                                </MDTypography>
                              ))}
                              {appointmentData.prescriptionID.length > 4 && (
                                <MDTypography variant="body2" ml={2}> + {appointmentData.prescriptionID.length - 2} more </MDTypography>
                              )}
                              {appointmentData?.prescriptionID?.length > 0 && (
                                <MDBox mt={2} textAlign="right" mr={1}>
                                  <MDButton
                                    size="small"
                                    href={`/prescription-with-details/${appointmentData._id}`}
                                    color="info"
                                    variant="outlined"
                                    fontWeight="small"
                                    sx={{
                                      mb: 1,
                                      cursor: 'pointer',
                                    }}
                                  >
                                    View Full →
                                  </MDButton>
                                </MDBox>
                              )}
                            </>
                          ) : (
                            <MDTypography variant="body2" ml={2}>No prescription data yet.</MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                    </Grid>
                  </MDBox>

                  <MDBox display="flex">
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={6} lg={2}>
                        <MDBox borderRadius="lg" textAlign="center" m={0.5} p={0.5} sx={{ border: '1px solid #d2d4d6' }}>
                          <MDTypography variant="body2" color='white' sx={{ backgroundColor: '#25408f', borderRadius: 1, fontWeight: 'bold' }}>Age <br /></MDTypography>
                          <MDTypography variant='body2'>{appointmentData?.userID?.age || 'N/A'} </MDTypography>
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={6} md={6} lg={2}>
                        <MDBox borderRadius="lg" textAlign="center" m={0.5} p={0.5} sx={{ border: '1px solid #d2d4d6' }}>
                          <MDTypography variant="body2" color='white' sx={{ backgroundColor: '#25408f', borderRadius: 1, fontWeight: 'bold' }}>Weight <br /> </MDTypography>
                          <MDTypography variant='body2'>{appointmentData?.userID?.weight || 'N/A'} </MDTypography>
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={6} md={6} lg={2}>
                        <MDBox borderRadius="lg" textAlign="center" m={0.5} p={0.5} sx={{ border: '1px solid #d2d4d6' }}>
                          <MDTypography variant="body2" color='white' sx={{ backgroundColor: '#25408f', borderRadius: 1, fontWeight: 'bold' }}>Height <br /></MDTypography>
                          <MDTypography variant='body2'>{appointmentData?.userID?.height || 'N/A'} </MDTypography>
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={6} md={6} lg={2}>
                        <MDBox borderRadius="lg" textAlign="center" m={0.5} p={0.5} sx={{ border: '1px solid #d2d4d6' }}>
                          <MDTypography variant="body2" color='white' sx={{ backgroundColor: '#25408f', borderRadius: 1, fontWeight: 'bold' }}>Temperature <br /> </MDTypography>
                          <MDTypography variant='body2'>{appointmentData?.userID?.temperature || 'N/A'} </MDTypography>
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={6} md={6} lg={2}>
                        <MDBox borderRadius="lg" textAlign="center" m={0.5} p={0.5} sx={{ border: '1px solid #d2d4d6' }}>
                          <MDTypography variant="body2" color='white' sx={{ backgroundColor: '#25408f', borderRadius: 1, fontWeight: 'bold' }}>Bood Pressure <br /> </MDTypography>
                          <MDTypography variant='body2'>{appointmentData?.userID?.bloodPressure || 'N/A'} </MDTypography>
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={6} md={6} lg={2}>
                        <MDBox borderRadius="lg" textAlign="center" m={0.5} p={0.5} sx={{ border: '1px solid #d2d4d6' }}>
                          <MDTypography variant="body2" color='white' sx={{ backgroundColor: '#25408f', borderRadius: 1, fontWeight: 'bold' }}>Heart Rate<br /> </MDTypography>
                          <MDTypography variant='body2'>{appointmentData?.userID?.heartRate || 'N/A'} </MDTypography>
                        </MDBox>
                      </Grid>
                    </Grid>
                  </MDBox>

                  <Grid item xs={12} md={12}>
                    <MDBox borderRadius="lg" m={0.5} p={0.5} sx={{ border: '1px solid #d2d4d6', minHeight: '10rem' }} >
                      <MDTypography textAlign="center" variant="body2" color="white"
                        sx={{ backgroundColor: '#25408f', borderRadius: 1, fontWeight: 'bold', letterSpacing: '0.5px', }} >
                        Previous Appointments
                      </MDTypography>

                      {previousAppointments.map((appointment) => (
                        <MDBox key={appointment.id} display="flex" justifyContent="space-between" alignItems="center" p={1} mb={1}
                          sx={{ backgroundColor: '#f9f9f9', borderRadius: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', "&:hover": { backgroundColor: "#f1f1f1" }, }} >
                          <MDBox>
                            <MDTypography variant="body2" fontWeight="bold">
                              {appointment.treatmentFor}
                            </MDTypography>
                            <MDTypography variant="caption" color="text.secondary">
                              Date: {appointment.date} | Doctor: {appointment.doctor}
                            </MDTypography>
                          </MDBox>

                          <MDButton size="small" variant="outlined" color="info">
                            Details
                          </MDButton>
                        </MDBox>
                      ))}
                    </MDBox>
                  </Grid>

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
