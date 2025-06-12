import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
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
  const [checkInTime, setCheckInTime] = useState("09:00");
  const [checkOutTime, setCheckOutTime] = useState("17:00");
  const [name, setName] = useState("");
  const [number, seNumber] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("Male");
  const [assignAs, setAssignAs] = useState("Receptionist");
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
        `${process.env.REACT_APP_HOS}/add-new-staff`,
        values,
        {
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

      <ToastContainer
        autoClose={2000}
        position="top-center"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
        style={{ width: '350px', font: 'message-box' }}
      />

      <MDBox sx={{ padding: 3 }}>
        <Card sx={{ borderRadius: 4, boxShadow: 2, p: 4, backgroundColor: '#ffffff' }}>

          <MDTypography variant="h6" fontWeight="medium" gutterBottom textAlign="center"> ➕ Add New Staff Member </MDTypography>

          <Divider />

          <Grid container spacing={2} sx={{ mt: 1, mb: 2 }}>
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
              <TextField fullWidth label="Phone Number" variant="outlined" size="small" type="tel" value={number}
                onChange={(e) => seNumber(e.target.value)}
                sx={{ backgroundColor: '#fafafa', borderRadius: 1 }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel  id="gender-label">Gender</InputLabel>
                <Select native labelId="gender-label" value={gender} label="Gender"
                  onChange={(e) => setGender(e.target.value)}
                  inputProps={{ name: 'gender', id: 'gender-select' }}
                >
                  <option value="" disabled>Select gender</option>
                  {['Male', 'Female', 'Other'].map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel  id="role-label">Role</InputLabel>
                <Select native labelId="role-label" value={assignAs} label="Role"
                  onChange={(e) => setAssignAs(e.target.value)}
                  inputProps={{ name: 'role', id: 'role-select' }}
                >
                  <option value="" disabled>Select role</option>
                  {['Receptionist', 'Co-helper', 'Nurse', 'Assistant', 'Ward Boy'].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            {[['Check-In Time', setCheckInTime], ['Check-Out Time', setCheckOutTime]].map(([label, setter]) => (
              <Grid item xs={12} sm={6} key={label}>
                <FormControl fullWidth size="small">
                  <InputLabel id={`${label.toLowerCase().replace(/ /g, '-')}-label`}>{label}</InputLabel>
                  <Select native value={label === 'Check-In Time' ? checkInTime : checkOutTime} label={label}
                    onChange={(e) => setter(e.target.value)}
                    inputProps={{ name: label.toLowerCase().replace(/ /g, '-') }}
                  >
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 3 }} />

          <MDTypography variant="h6" color="text" fontWeight="medium" gutterBottom> Clinics </MDTypography>

          <Grid container spacing={2}>
            {clinicList.map((clinic, index) => (
              <Grid item md={6} lg={4} key={index} onClick={() => handleClinicSelect(clinic)}>
                <Card
                  sx={{
                    cursor: 'pointer', borderRadius: 3, border: selectedClinic === clinic._id ? '2px solid #7e57c2' : '1px solid #e0e0e0', backgroundColor: selectedClinic === clinic._id ? '#f3e5f5' : '#ffffff', transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: 6,
                      backgroundColor: '#fafafa',
                    },
                  }}
                >
                  <MDBox sx={{ display: 'flex', flexDirection: 'column', padding: 2 }}>
                    <MDBox sx={{ display: 'flex', gap: 2, marginTop: 1 }}>
                      <MDBox sx={{ width: '40%', borderRadius: 5, overflow: 'hidden', height: '135px' }}>
                        <img
                          src={clinic.imgarry[0]?.profile_url}
                          alt={clinic.clinicname}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </MDBox>
                      <MDBox sx={{ width: '60%', display: 'flex', flexDirection: 'column' }}>
                        <MDBox sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                          <LocalHospitalIcon sx={{ color: 'primary.main' }} />
                          <MDTypography variant="body2" sx={{ marginLeft: 1 }}>{clinic.clinicname}</MDTypography>
                        </MDBox>
                        <MDBox sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                          <PhoneIcon sx={{ color: 'secondary.main' }} />
                          <MDTypography variant="body2" sx={{ marginLeft: 1 }}>{clinic.phone || 'Not Provided'}</MDTypography>
                        </MDBox>
                        <MDBox sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                          <AccessTimeIcon sx={{ color: 'success.main' }} />
                          <MDTypography variant="body2" sx={{ marginLeft: 1 }}>{clinic.openTime}</MDTypography>
                        </MDBox>
                        <MDBox sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                          <AccessTimeIcon sx={{ color: 'error.main' }} />
                          <MDTypography variant="body2" sx={{ marginLeft: 1 }}>{clinic.closeTime}</MDTypography>
                        </MDBox>
                      </MDBox>
                    </MDBox>
                    <Divider />
                    <MDBox sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOnIcon sx={{ color: 'info.main' }} />
                      <MDTypography
                        variant="body2"
                        sx={{ marginLeft: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      >
                        {clinic.clinicAddress}
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 3 }} />

          <MDTypography variant="h6" color="text" fontWeight="medium" gutterBottom>
            Staff Permissions
          </MDTypography>

          <Grid container spacing={2}>
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
          </Grid>

          <MDBox mt={4}>
            <MDButton variant="contained" onClick={handler} disabled={loading}
              sx={{
                color: 'white', bgcolor: '#051aa1', borderRadius: 2, textTransform: 'none', px: 4, py: 1.5, fontWeight: 'medium', boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.1)' },
              }}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
            >
              {loading ? "Adding..." : "Add Staff"}
            </MDButton>
            <MDButton variant="contained"
              onClick={() => navigate(-1)}
              sx={{
                color: 'white', bgcolor: '#051aa1', borderRadius: 2, textTransform: 'none', ml: 2, px: 4, py: 1.5, fontWeight: 'medium', boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.1)' },
              }}>
              Cancel
            </MDButton>
          </MDBox>
        </Card>
      </MDBox>
    </DashboardLayout>
  );
}

export default AddStaff;