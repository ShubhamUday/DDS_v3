import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Grid, CircularProgress, Alert, Divider, IconButton, MenuItem, Menu, Checkbox, List, ListItem, ListItemIcon, ListItemText, DialogTitle, DialogContent, Dialog, FormControlLabel } from '@mui/material';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from "components/MDButton";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import calendarIcon from 'assets/images/schedule-calendar-and-blue-clock-18292.png'
import { EditOutlined, FamilyRestroomOutlined, VisibilityOutlined, PrintOutlined, DownloadOutlined, UpgradeOutlined, MoreVertOutlined, CheckOutlined, Male, Female } from '@mui/icons-material';
import { CloseOutlined } from '@mui/icons-material'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import PatientFormModal from 'Pages/patient/PatientFormModal';
import PaymentFormModal from 'Pages/payment/PaymentFormModal';
import moment from 'moment';
import Switch from '@mui/material/Switch';
import { toast } from 'react-toastify';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const previousAppointments = [
  { id: "1", treatmentFor: "Back Pain", date: "2025-06-05", doctor: "Dr. Smith" },
  { id: "2", treatmentFor: "Migraine", date: "2025-05-22", doctor: "Dr. Lee" },
  { id: "3", treatmentFor: "Physiotherapy", date: "2025-05-10", doctor: "Dr. Patel" },
];

const prescriptions = [
  { date: "2025-06-01" },
  { date: "2025-05-25" },
  { date: "2025-05-15" },
];

const familyMembers = [
  { name: 'John Doe', relation: 'Father', gender: 'Male' },
  { name: 'Jane Doe', relation: 'Mother', gender: 'Female' },
  { name: 'Sarah Doe', relation: 'Sister', gender: 'Female' },
  { name: 'Alex Doe', relation: 'Brother', gender: 'Male' },
];

function AppointmentWithDetails() {
  const params = useParams();
  const param1 = params.id;
  const [appointmentData, setAppointmentData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false)
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false)
  const [isPaymentUpdateModalOpen, setIsPaymentUpdateModalOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState("");
  const [requestStatus, setRequestStatus] = useState("")
  const open2 = Boolean(anchorEl);

  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    console.log('switch event', event.target.checked)

    const isChecked = event.target.checked;
    setChecked(isChecked);
    statusController(isChecked ? "Completed" : "Accepted");

  };

  const getGenderIcon = (gender) => {
    return gender === 'Male' ? <Male color="primary" /> : <Female color="secondary" />;
  };

  const getDetails = async () => {
    setLoading(true);
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_HOS}/get-single-appointment-with-details/${param1}`,
        { headers: { 'Content-Type': 'application/json' } }
      );

      setAppointmentData(result.data);
      setRequestStatus(result.data.requestStatus)
    } catch (error) {
      setError('Failed to load appointment details.');
      toast.error("Failed to load appointment detals.")
    }
  };

  const statusController = async (request) => {
    const requestStatus = request;
    const values = { requestStatus }
    console.log(values)
    try {
      const response = await axios.put(`${process.env.REACT_APP_HOS}/update-Appointment-Details/${appointmentData._id}`, values, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log("response data", response.data)
      if (response.data) {
        getDetails()
        toast.success("Appoinment is updated successfully")
      }
    }
    catch (error) {
      console.log(error)
      toast.error("Unable to update appoinment")
    }
  };

  console.log('Appointment Data', appointmentData)
  console.log('status', appointmentData?.requestStatus)
  console.log("checked", checked)
  console.log("requestStatus", requestStatus)

  const handleClick2 = (event) => setAnchorEl(event.currentTarget);
  const handleClose2 = () => setAnchorEl(null);

  const renderButtons = () => {
    switch (appointmentData?.requestStatus) {
      case "Pending":
        return [
          <MDButton key="reject" variant="outlined" color="error" size="small"
            onClick={() => {
              console.log('check Reject btn');
              statusController("Rejected");
            }}>
            Reject
          </MDButton>,
          <MDButton key="accept" variant="contained" color="success" size="small"
            onClick={() => {
              console.log('check Accept btn');
              statusController("Accepted");
            }}>
            Accept
          </MDButton>,
        ];
      case "Completed":
        return [
          <MDButton key="feedback" variant="outlined" color="secondary" size="small"> Feedback </MDButton>,
          <MDButton key="revisit_reminder" variant="contained" color="primary" size="small"> Revisit Reminder </MDButton>,
          <Switch key='switch' color="warning"
            checked={checked}
            onChange={handleChange}
          />
        ];
      case "Accepted":
        return [
          <MDButton key="reschedule" variant="contained" color="primary" size="small"
            onClick={() => { console.log('check resch btn') }}
          >
            Reschedule
          </MDButton>,
          <Switch key='switch' color="warning"
            checked={checked}
            onChange={handleChange}
          />
        ];
      default:
        return null;
    }
  };
  const buttons = renderButtons();

  useEffect(() => {
    getDetails();
    if (requestStatus === "Completed") {
      setChecked(true)
    } else if (requestStatus === "Accepted") {
      setChecked(false)
    }
  }, [requestStatus]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox p={3}>
        <MDBox sx={{ minHeight: '100vh', backgroundColor: '#f4f6f9' }} >
          {loading ? (
            <MDBox
              sx={{
                backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', borderRadius: 4, p: 4,
              }} >
              <MDBox display="flex" justifyContent="center" alignItems="center" sx={{ minHeight: '200px' }}> <CircularProgress /> </MDBox>
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
                    <MDTypography variant="h6" fontWeight="medium">⭐ Patient Rating </MDTypography>
                    <Divider sx={{ mb: 2 }} />
                    <MDBox display="flex" alignItems="center" gap={1}>
                      <Rating name="read-only-rating" value={appointmentData.ratingID.ratingCount} precision={0.5} readOnly />
                    </MDBox>
                    <MDTypography variant="body2" mt={1}> {appointmentData.ratingID.DiscriptionAppare} </MDTypography>
                  </MDBox>
                </Grid>
              )} */}

              {/* 📁 Documents Card */}
              {/* <Grid item xs={12} md={12}>
                <MDBox p={3} borderRadius="xl" bgcolor="white" display="flex" justifyContent="space-between" alignItems="center"
                  sx={{ transition: '0.3s', border: '1px solid #d2d4d6', '&:hover': { boxShadow: 6, transform: 'translateY(-3px)' } }} >
                  <MDTypography variant="h6" fontWeight="medium"> 📁 Patient Documents </MDTypography>
                  <CloudUploadIcon sx={{ cursor: 'pointer' }} />
                </MDBox>
              </Grid> */}

              <Grid item xs={12} md={12}>
                <MDBox
                  sx={{
                    p: 2, margin: "0 auto", backgroundColor: "#fff", borderRadius: 3, border: '1px solid #d2d4d6', boxShadow: "0px 2px 0px #25408f",
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-5px)',
                    },
                  }}>

                  <MDBox display="flex" justifyContent="space-between" alignItems="center"  >


                    <MDTypography variant="h4" align="center" color="info" gutterBottom
                      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }} >
                      <MDBox component="img" src={calendarIcon} alt="calendar icon" sx={{ width: 40, height: 40 }} />
                      Appointment : {new Date(appointmentData?.Bookdate).toLocaleDateString("en-GB")} at {moment(appointmentData?.BookTime, ["h:mm A"]).format("HH:mm")}
                    </MDTypography>

                    {buttons[0] && (<MDBox ml={'auto'}> {buttons[0]} </MDBox>)}
                    {buttons[1] && (<MDBox ml={1}> {buttons[1]} </MDBox>)}
                    {buttons[2] && (<MDBox ml={1}> {buttons[2]} </MDBox>)}


                  </MDBox>

                  <Divider sx={{ mb: 2 }} />

                  {/* IDs Section */}
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <MDTypography variant="button" fontWeight="bold" color='info'>Booking ID</MDTypography>
                      <MDTypography fontSize="medium" color="text">{appointmentData?._id}</MDTypography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <MDTypography variant="button" fontWeight="bold" color='info'>Patient ID</MDTypography>
                      <MDTypography fontSize="medium" color="text">{appointmentData?.userID?._id}</MDTypography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <MDTypography variant="button" fontWeight="bold" color='info'>Family ID</MDTypography>
                      <MDTypography fontSize="medium" color="text">{appointmentData?.userID?._id}</MDTypography>
                    </Grid>
                  </Grid>

                  {/* <MDBox display="flex" justifyContent="space-between" flexWrap="wrap" sx={{ flexDirection: { xs: 'column', md: 'row' } }} >
                    <Grid container>
                      <Grid item xs={12} md={4}>
                        <MDBox display="flex" borderRadius="lg" m={0.5} p={0.5} sx={{ border: '1px solid #d2d4d6', minWidth: '45%', flex: 1, justifyContent: 'center' }}>
                          <MDTypography fontSize="medium" color='info' mr={1}> <b>Booking ID:</b> </MDTypography>
                          <MDTypography fontSize="medium">{appointmentData?._id}</MDTypography>
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <MDBox display="flex" borderRadius="lg" m={0.5} p={0.5} sx={{ border: '1px solid #d2d4d6', minWidth: '45%', flex: 1, justifyContent: 'center' }}>
                          <MDTypography fontSize="medium" color='info' mr={1}> <b>Family ID:</b> </MDTypography>
                          <MDTypography fontSize="medium"> {appointmentData?.userID?._id} </MDTypography>
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <MDBox display="flex" borderRadius="lg" m={0.5} p={0.5} sx={{ border: '1px solid #d2d4d6', minWidth: '45%', flex: 1, justifyContent: 'center' }}>
                          <MDTypography fontSize="medium" color='info' mr={1}> <b>Patient ID:</b> </MDTypography>
                          <MDTypography fontSize="medium"> {appointmentData?.userID?._id} </MDTypography>
                        </MDBox>
                      </Grid>

                    </Grid>
                  </MDBox> */}

                  <Divider />

                  {/* Patient Details */}
                  <MDBox display="flex" justifyContent="space-between">

                    <MDButton variant="text" color="success" title="Family Tree" startIcon={<FamilyRestroomOutlined />}
                      onClick={() => { setIsFamilyModalOpen(true) }} />

                    <MDTypography variant="h6" fontWeight="bold" color="info"> Patient Details </MDTypography>

                    <IconButton onClick={handleClick2} size="small"> <MoreVertOutlined /> </IconButton>

                    {/* Dropdown Menu */}
                    <Menu
                      anchorEl={anchorEl}
                      open={open2}
                      onClose={handleClose2}
                      anchorOrigin={{ vertical: "bottom", horizontal: "right", }}
                      transformOrigin={{ vertical: "top", horizontal: "right", }}
                    >
                      <MenuItem onClick={() => { setIsPatientModalOpen(true); handleClose2(); console.log("Edit clicked"); }}> Edit </MenuItem>
                      <MenuItem onClick={() => { handleClose2(); console.log("Delete clicked"); }}> Delete </MenuItem>
                      <MenuItem onClick={() => { handleClose2(); console.log("View History clicked"); }}> View History </MenuItem>
                    </Menu>
                  </MDBox>
                  {/* <MDTypography variant="h6" fontWeight="bold" color='info' sx={{ display: 'flex', justifyContent: 'center' }}> Patient Details</MDTypography>
                  <IconButton sx={{ display: 'flex', justifyContent: 'flex-end', }}><MoreVertOutlined /></IconButton> */}


                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                      <MDTypography variant="button" fontWeight="bold" color='info'>Name</MDTypography>
                      <MDTypography fontSize="medium" color="text">{appointmentData?.userID?.name || appointmentData?.patientName}</MDTypography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <MDTypography variant="button" fontWeight="bold" color='info'>Gender</MDTypography>
                      <MDTypography fontSize="medium" color="text">{appointmentData?.userID?.gender || appointmentData?.gender}</MDTypography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <MDTypography variant="button" fontWeight="bold" color='info'>Mobile</MDTypography>
                      <MDTypography fontSize="medium" color="text">{appointmentData?.userID?.number}</MDTypography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <MDTypography variant="button" fontWeight="bold" color='info'>Patients Documents</MDTypography>
                      <MDButton
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                      >
                        Upload files
                        <VisuallyHiddenInput
                          type="file"
                          onChange={(event) => console.log(event.target.files)}
                          multiple
                        />
                      </MDButton>
                    </Grid>
                  </Grid>


                  {/* Action Buttons */}
                  {/* <MDBox display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                    <MDButton variant="outlined" color="secondary" onClick={handleOpen} startIcon={<EditOutlined />}> Edit Patient </MDButton>

                    <MDButton variant="text" color="info" startIcon={<FamilyRestroomOutlined />}
                    // onClick={onShowFamilyTree}
                    > Show Family Tree </MDButton>
                  </MDBox> */}

                  {isFamilyModalOpen && (
                    <Dialog open={isFamilyModalOpen} onClose={() => { setIsFamilyModalOpen(false) }} fullWidth>
                      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title"> Patient&apos;s Family Tree </DialogTitle>
                      <IconButton
                        aria-label="close"
                        onClick={() => { setIsFamilyModalOpen(false) }}
                        sx={(theme) => ({
                          position: 'absolute',
                          right: 8,
                          top: 8,
                          color: theme.palette.grey[500],
                        })}
                      >
                        <CloseOutlined />
                      </IconButton>
                      <DialogContent>
                        <List>
                          {familyMembers.map((member, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>{getGenderIcon(member.gender)}</ListItemIcon>
                              <ListItemText
                                primary={member.name}
                                secondary={member.relation}
                                primaryTypographyProps={{ fontWeight: 'medium' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </DialogContent>
                    </Dialog>
                  )}

                  <Divider sx={{}} />

                  <Grid container spacing={2}>

                    {/* Clinic Info */}
                    <Grid item xs={12} sm={6}>
                      <MDBox display="flex" sx={{ flex: 1 }}>
                        <MDTypography variant="button" fontWeight="bold" color='info' mr={1}> Clinic Name : </MDTypography>
                        <MDTypography variant="button" fontWeight="bold" color="text"> {appointmentData?.clinicID?.clinicname} </MDTypography>
                      </MDBox>
                      <MDTypography variant="button" fontWeight="bold" color='info' mr={1}> Address</MDTypography>
                      <MDTypography variant="button" fontWeight="bold" color="text"> {appointmentData?.clinicID?.clinicAddress} </MDTypography>
                    </Grid>

                    {/* Payment Details */}
                    <Grid item xs={12} sm={6}>
                      <MDBox position="relative">
                        {appointmentData?.PayStatus !== "Paid" && (
                          <IconButton size="small" color="primary" title="Update Payment"
                            sx={{ position: 'absolute', top: 1, right: 4, }}
                            onClick={() => { setIsPaymentUpdateModalOpen(true) }}
                          >
                            <UpgradeOutlined />
                          </IconButton>
                        )}

                        <MDBox display="flex" mb={1}>
                          <MDTypography variant="button" fontWeight="bold" color="info" mr={1}> Payment Status: </MDTypography>
                          <MDTypography variant="button" fontWeight="bold" color="text"> {appointmentData?.PayStatus} </MDTypography>
                        </MDBox>

                        <MDBox display="flex">
                          <MDTypography variant="button" fontWeight="bold" color="info" mr={1}> Payment Amount: </MDTypography>
                          <MDTypography variant="button" fontWeight="bold" color="text"> ₹ {appointmentData?.PayAmount}  </MDTypography>
                        </MDBox>

                      </MDBox>
                    </Grid>
                  </Grid>

                  {/* Update Payment */}
                  {isPaymentUpdateModalOpen && (
                    <PaymentFormModal
                      appointmentData={appointmentData}
                      isPaymentUpdateModalOpen={isPaymentUpdateModalOpen}
                      setIsPaymentUpdateModalOpen={setIsPaymentUpdateModalOpen}
                      getDetails={getDetails}
                    />
                  )}

                  <Divider sx={{}} />

                  <MDBox display="flex">
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={6} lg={2}>
                        <MDBox borderRadius="lg" textAlign="center" m={0.5} p={0.5} sx={{ border: '1px solid #d2d4d6' }}>
                          <MDTypography fontSize="medium" color='white' sx={{ backgroundColor: '#25408f', borderRadius: 1, fontWeight: 'bold' }}>Age <br /></MDTypography>
                          <MDTypography fontSize="medium"> {appointmentData?.userID?.age || appointmentData?.age || 'N/A'} </MDTypography>
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={6} md={6} lg={2}>
                        <MDBox borderRadius="lg" textAlign="center" m={0.5} p={0.5} sx={{ border: '1px solid #d2d4d6' }}>
                          <MDTypography fontSize="medium" color='white' sx={{ backgroundColor: '#25408f', borderRadius: 1, fontWeight: 'bold' }}>Weight <br /> </MDTypography>
                          <MDTypography fontSize="medium"> {appointmentData?.userID?.Weight || appointmentData?.Weight || 'N/A'} </MDTypography>
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={6} md={6} lg={2}>
                        <MDBox borderRadius="lg" textAlign="center" m={0.5} p={0.5} sx={{ border: '1px solid #d2d4d6' }}>
                          <MDTypography fontSize="medium" color='white' sx={{ backgroundColor: '#25408f', borderRadius: 1, fontWeight: 'bold' }}>Diabities <br /></MDTypography>
                          <MDTypography fontSize="medium">{appointmentData?.userID?.diabetes || appointmentData?.diabetes || 'N/A'} </MDTypography>
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={6} md={6} lg={2}>
                        <MDBox borderRadius="lg" textAlign="center" m={0.5} p={0.5} sx={{ border: '1px solid #d2d4d6' }}>
                          <MDTypography fontSize="medium" color='white' sx={{ backgroundColor: '#25408f', borderRadius: 1, fontWeight: 'bold' }}>Temperature <br /> </MDTypography>
                          <MDTypography fontSize="medium">{appointmentData?.userID?.temperature || appointmentData?.temperature || 'N/A'} </MDTypography>
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={6} md={6} lg={2}>
                        <MDBox borderRadius="lg" textAlign="center" m={0.5} p={0.5} sx={{ border: '1px solid #d2d4d6' }}>
                          <MDTypography fontSize="medium" color='white' sx={{ backgroundColor: '#25408f', borderRadius: 1, fontWeight: 'bold' }}>Bood Pressure <br /> </MDTypography>
                          <MDTypography fontSize="medium">{appointmentData?.userID?.Bloodpressure || appointmentData?.Bloodpressure || 'N/A'} </MDTypography>
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={6} md={6} lg={2}>
                        <MDBox borderRadius="lg" textAlign="center" m={0.5} p={0.5} sx={{ border: '1px solid #d2d4d6' }}>
                          <MDTypography fontSize="medium" color='white' sx={{ backgroundColor: '#25408f', borderRadius: 1, fontWeight: 'bold' }}>Heart Rate<br /> </MDTypography>
                          <MDTypography fontSize="medium">{appointmentData?.userID?.heartRate || appointmentData?.heartRate || 'N/A'} </MDTypography>
                        </MDBox>
                      </Grid>
                    </Grid>
                  </MDBox>

                  <MDBox display="flex" justifyContent="space-between">
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <MDBox borderRadius="lg" m={0.5} p={0.5}
                          sx={{ border: '1px solid #d2d4d6', backgroundColor: '#f9f9f9', }} >
                          <MDTypography fontSize="medium" textAlign="center" color="white"
                            sx={{ backgroundColor: '#25408f', borderRadius: 1, fontWeight: 'bold', letterSpacing: '0.5px', }} >
                            Reason / Symptoms
                          </MDTypography>

                          <MDTypography fontSize="medium" sx={{ ml: 1, color: '#333', lineHeight: 1.6 }} >
                            {appointmentData?.ProblemDetails || 'N/A'}
                          </MDTypography>


                        </MDBox>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <MDBox borderRadius="lg" m={0.5} p={0.5}
                          sx={{ border: '1px solid #d2d4d6', backgroundColor: '#f9f9f9', }} >

                          <MDTypography fontSize="medium" textAlign="center" color="white"
                            sx={{ backgroundColor: '#25408f', borderRadius: 1, fontWeight: 'bold', letterSpacing: '0.5px', }} >
                            Treatment
                          </MDTypography>

                          <MDTypography fontSize="medium" sx={{ ml: 1, color: '#333', lineHeight: 1.6 }} >
                            {appointmentData?.Treatmentfor || 'N/A'}
                          </MDTypography>
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} md={12}>
                        <MDBox borderRadius="lg" m={0.5} p={0.5} sx={{ border: '1px solid #d2d4d6' }}>
                          <MDTypography fontSize="medium" textAlign="center" color='white'
                            sx={{ backgroundColor: '#25408f', borderRadius: 1, fontWeight: 'bold', letterSpacing: '0.5px' }}>
                            Last 3 Prescriptions </MDTypography>

                          {appointmentData?.prescriptionID?.length > 0 ? (
                            <>
                              {appointmentData.prescriptionID.slice(0, 3).map((med, index) => (
                                <MDTypography key={index} fontSize="medium"
                                  sx={{ color: '#333', lineHeight: 1.6, ml: 2, display: 'flex', alignItems: 'center' }}
                                >
                                  <MDBox component="span" sx={{ mr: 1 }}>•</MDBox> {med.medicinename}
                                </MDTypography>
                              ))}
                              {appointmentData.prescriptionID.length > 4 && (
                                <MDTypography fontSize="medium" ml={2}> + {appointmentData.prescriptionID.length - 2} more </MDTypography>
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
                            <>
                              {prescriptions.map((item, index) => (
                                <MDBox key={index} display="flex" justifyContent="space-between" alignItems="center" py={1} px={1.5}
                                  sx={{
                                    borderBottom: index < prescriptions.length - 1 ? '1px solid #e0e0e0' : 'none',
                                    backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                                  }}
                                >
                                  {/* Date */}
                                  <MDTypography fontSize="small" fontWeight="medium"> {item.date} </MDTypography>

                                  {/* Action Icons */}
                                  <MDBox display="flex" gap={1}>
                                    <IconButton size="small" color="primary" title="Edit"> <EditOutlined fontSize="small" /> </IconButton>
                                    <IconButton size="small" color="info" title="View"> <VisibilityOutlined fontSize="small" /> </IconButton>
                                    <IconButton size="small" color="secondary" title="Print"> <PrintOutlined fontSize="small" /> </IconButton>
                                    <IconButton size="small" color="success" title="Download"> <DownloadOutlined fontSize="small" /> </IconButton>
                                  </MDBox>
                                </MDBox>
                              ))}
                            </>
                          )}
                        </MDBox>
                      </Grid>
                    </Grid>
                  </MDBox>



                  <Grid item xs={12} md={12}>
                    <MDBox borderRadius="lg" m={0.5} p={0.5} sx={{ border: '1px solid #d2d4d6', minHeight: '10rem' }} >
                      <MDTypography textAlign="center" fontSize="medium" color="white"
                        sx={{ backgroundColor: '#25408f', borderRadius: 1, fontWeight: 'bold', letterSpacing: '0.5px', }} >
                        Previous Appointments
                      </MDTypography>

                      {previousAppointments.map((appointment) => (
                        <MDBox key={appointment.id} display="flex" justifyContent="space-between" alignItems="center" p={1} mb={1}
                          sx={{ backgroundColor: '#f9f9f9', borderRadius: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', "&:hover": { backgroundColor: "#f1f1f1" }, }} >
                          <MDBox>
                            <MDTypography fontSize="medium" fontWeight="bold"> {appointment.treatmentFor} </MDTypography>
                            <MDTypography fontSize="small" color="info"> Date: {appointment.date} | Doctor: {appointment.doctor} </MDTypography>
                          </MDBox>

                          <MDButton size="small" variant="outlined" color="info"> Details </MDButton>
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

      {isPatientModalOpen && (
        <PatientFormModal
          selectedAppointment={appointmentData}
          isPatientModalOpen={isPatientModalOpen}
          setIsPatientModalOpen={setIsPatientModalOpen}
          getDetails={getDetails}
        />
      )}

    </DashboardLayout >
  );
}

export default AppointmentWithDetails;
