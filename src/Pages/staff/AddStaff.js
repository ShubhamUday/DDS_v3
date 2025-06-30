import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { Card, Grid, Divider, TextField, Select, FormControl, InputLabel, Switch, Button, MenuItem } from '@mui/material';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneIcon from '@mui/icons-material/Phone';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MDButton from 'components/MDButton';

function AddStaff() {
  const drID = localStorage.getItem('doctorID');
  const [loading, setLoading] = useState(false);
  const [clinicList, setClinicList] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [name, setName] = useState("");
  const [number, seNumber] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [assignAs, setAssignAs] = useState("");
  const [permissions, setPermissions] = useState({
    canAcceptAppointments: false,
    canAddAppointments: false,
    canUpdatePaymentDetails: false,
    canSendTickets: false,
  });
  const navigate = useNavigate();

  const [age, setAge] = useState('age');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const fetchClinicList = async () => {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_HOS}/get-single-doctor/${drID}`,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      setClinicList(result.data.clinicID);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePermissionChange = (event) => {
    const { name, checked } = event.target;
    setPermissions((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const formatTimeTo12Hour = (time24) => {
    const [hour, minute] = time24.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  const handler = async () => {
    if (!name || !email || !password || !number || !gender || !assignAs || !selectedClinic) {
      toast.error("Please fill out all required fields!");
      return;
    }

    setLoading(true);

    const values = {
      email,
      password,
      doctorID: drID,
      name,
      number,
      gender,
      checkInTime: formatTimeTo12Hour(checkInTime),
      checkOutTime: formatTimeTo12Hour(checkOutTime),
      CanAcceptAppointment: permissions.canAcceptAppointments,
      CanAddAppointment: permissions.canAddAppointments,
      CanUpdateRecivedPaymentAppointment: permissions.canUpdatePaymentDetails,
      CanSendTickets: permissions.canSendTickets,
      clinicID: selectedClinic,
      assignAs,
    };

    try {
      const result = await axios.post(
        `${process.env.REACT_APP_HOS}/add-new-staff`, values, {
        headers: { 'Content-Type': 'application/json' },
      }
      );

      if (result.data) {
        toast.success("Staff added successfully!");
        navigate(-1);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClinicList();
  }, []);

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const h = hour.toString().padStart(2, '0');
        const m = minute.toString().padStart(2, '0');
        options.push(`${h}:${m}`);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  const handleClinicSelect = (clinic) => {
    setSelectedClinic(clinic._id);
  };

  return (
    <DashboardLayout>

      <MDBox sx={{ padding: 2 }}>
        <Card sx={{ borderRadius: 4, boxShadow: 2, p: 4, backgroundColor: '#ffffff' }}>
          <Grid container spacing={2} sx={{}}>
            <Grid item xs={12} sm={12} lg={12}>
              <MDTypography variant="h6" fontWeight="medium" gutterBottom textAlign="center"> ➕ Add New Staff Member </MDTypography>
              <Divider sx={{}} />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Name" variant="outlined" size="small" value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ backgroundColor: '#fafafa', borderRadius: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Email" variant="outlined" size="small" type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ backgroundColor: '#fafafa', borderRadius: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Password" variant="outlined" size="small" type="password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ backgroundColor: '#fafafa', borderRadius: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth size="small" label="Phone Number" variant="outlined" type="number" value={number}
                onChange={(e) => seNumber(e.target.value)}
                sx={{
                  backgroundColor: '#fafafa', borderRadius: 1,
                  // For Chrome, Safari, Edge
                  '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0,
                  },
                  // For Firefox
                  '& input[type=number]': {
                    MozAppearance: 'textfield',
                  },
                }}
              />
            </Grid>


            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="gender-label"> Gender </InputLabel>
                <Select labelId="gender-label" value={gender} label="Gender"
                  onChange={(e) => setGender(e.target.value)}
                // inputProps={{ name: 'gender', id: 'gender-select' }}
                >
                  <MenuItem value="" disabled> Select gender </MenuItem>
                  {['Male', 'Female', 'Other'].map((opt) => (
                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="role-label">Role</InputLabel>
                <Select labelId="role-label" value={assignAs} label="Role"
                  onChange={(e) => setAssignAs(e.target.value)}
                  inputProps={{ name: 'role', id: 'role-select' }}
                >
                  <MenuItem value="" disabled>Select role</MenuItem>
                  {['Receptionist', 'Co-helper', 'Nurse', 'Assistant', 'Ward Boy'].map(opt => (
                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>



            {/* Check In/Out time */}
            {[['Check-In Time', setCheckInTime], ['Check-Out Time', setCheckOutTime]].map(([label, setter]) => (
              <Grid item xs={12} sm={6} key={label}>
                <FormControl fullWidth size="small">
                  <InputLabel id={`${label.toLowerCase().replace(/ /g, '-')}-label`}>{label}</InputLabel>
                  <Select value={label === 'Check-In Time' ? checkInTime : checkOutTime} label={label}
                    onChange={(e) => setter(e.target.value)}
                    inputProps={{ name: label.toLowerCase().replace(/ /g, '-') }}
                  >
                    {timeOptions.map((time) => (
                      <MenuItem key={time} value={time}> {time} </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ))}

            <Grid item xs={12} sm={12} lg={12}>
              <MDTypography variant="h6" color="text" fontWeight="medium" gutterBottom> Clinics </MDTypography>
            </Grid>

            {/* Select Clinic */}
            {clinicList.map((clinic, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}
                onClick={() => handleClinicSelect(clinic)}
              >
                <Card
                  sx={{
                    cursor: 'pointer', borderRadius: 2,
                    border: selectedClinic === clinic?._id ? '2px solid #7e57c2' : '1px solid #e0e0e0',
                    backgroundColor: selectedClinic === clinic?._id ? '#f3e5f5' : '#ffffff',
                    transition: 'all 0.3s ease',
                    minHeight: '115px',
                    '&:hover': {
                      boxShadow: 6,
                      backgroundColor: '#fafafa',
                    },
                  }}
                >
                  <MDBox sx={{ display: 'flex', padding: 2, gap: 2 }}>
                    <MDBox sx={{ width: 70, height: 70, borderRadius: 2, overflow: 'hidden', flexShrink: 0 }}>
                      <img
                        src={clinic?.imgarry[0]?.profile_url}
                        alt={clinic?.clinicname}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </MDBox>

                    <MDBox sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

                      <MDTypography variant="body2" fontWeight="bold">
                        {clinic?.clinicname}
                      </MDTypography>

                      <MDTypography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PhoneIcon sx={{ color: 'secondary.main' }} />  {clinic?.phone || 'Not Provided'}
                      </MDTypography>

                      <MDTypography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTimeIcon sx={{ color: 'success.main' }} />  {clinic?.openTime} - {clinic?.closeTime}
                      </MDTypography>

                      <MDTypography
                        variant="caption"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          color: 'text.secondary',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          displayWebkitBox: true,
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        <LocationOnIcon fontSize="inherit" color="info" /> {clinic?.clinicAddress}
                      </MDTypography>

                    </MDBox>
                  </MDBox>
                </Card>
              </Grid>
            ))}

            {/* Staff Permission */}
            <Grid item xs={12} sm={12} lg={12}>
              <Divider sx={{}} />
              <MDTypography variant="h6" color="text" fontWeight="medium" gutterBottom>
                Staff Permissions
              </MDTypography>
            </Grid>

            {[
              ['canAcceptAppointments', 'Can Accept Appointments'],
              ['canAddAppointments', 'Can Add Appointment'],
              ['canUpdatePaymentDetails', 'Can Update Payment Details'],
              ['canSendTickets', 'Can Send Tickets'],
            ].map(([key, label]) => (
              <Grid item xs={12} key={key}>
                <FormControl fullWidth>
                  <MDBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8f9fa', padding: 2, borderRadius: 2, mb: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <MDTypography color="text" variant="body2" fontWeight="small">{label}</MDTypography>
                    <Switch
                      checked={permissions[key]}
                      onChange={handlePermissionChange}
                      name={key}
                    />
                  </MDBox>
                </FormControl>
              </Grid>
            ))}

            <Grid item xs={12} sm={12}>
              <MDBox mt={4} display="flex" justifyContent="flex-end" gap={1}>
                <MDButton variant="outlined" color="error" size="small"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </MDButton>
                <MDButton variant="contained" color="success" onClick={handler} disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                >
                  {loading ? "Adding..." : "Add Staff"}
                </MDButton>

              </MDBox>
            </Grid>
          </Grid>
        </Card>
      </MDBox>
    </DashboardLayout>
  );
}

export default AddStaff;