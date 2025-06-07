import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import {
  Card,
  Grid,
  Divider,
  TextField,
  Select,
  FormControl,
  InputLabel,
  IconButton,
} from '@mui/material';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import MDButton from 'components/MDButton';
import img from "../assets/Frame9347.png";
import ClearIcon from '@mui/icons-material/Clear';

function AddClinic() {
  const drID = localStorage.getItem('doctorID');
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [clinicCoordinates, setClinicCoordinates] = useState({ lat: null, lng: null });
  const [checkInTime, setCheckInTime] = useState("09:00");
  const [checkOutTime, setCheckOutTime] = useState("17:00");
  const [EmergencycheckInTime, setEmergencyCheckInTime] = useState("09:00");
  const [EmergencycheckOutTime, setEmergencyCheckOutTime] = useState("17:00");
  const [clinicName, setClinicName] = useState("");
  const [clinicAddress, setClinicAddress] = useState("");
  const [clinicDetails, setClinicDetails] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [files, setFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [permissions, setPermissions] = useState({
    AppointmentFee: null,
    MessageFee: null,
    VideoCallFee: null,
    EmergencyFee: null,
  });

  const navigate = useNavigate();

  const formatTimeTo12Hour = (time24) => {
    const [hour, minute] = time24.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  const fetchAddressSuggestions = async (query) => {
    if (!query) return;
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: query,
          format: "json",
          addressdetails: 1,
          limit: 5,
        },
      });
      setAddressSuggestions(response.data);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Failed to fetch suggestions", error);
    }
  };

  // const handleFileChange = (event) => {
  //   const selectedFiles = Array.from(event.target.files);
  //   const validFiles = selectedFiles.filter(file => file.type.startsWith("image/"));

  //   if ((files.length + validFiles.length) > 5) {
  //     toast.error("You can upload a maximum of 5 images.");
  //     return;
  //   }

  //   if (validFiles.length > 0) {
  //     setFiles(prevFiles => [...prevFiles, ...validFiles]);
  //     setImagePreviews(prevPreviews => [
  //       ...prevPreviews,
  //       ...validFiles.map(file => URL.createObjectURL(file)),
  //     ]);
  //   } else {
  //     alert("Please upload valid image files.");
  //   }
  // };
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const validFiles = selectedFiles.filter(file => file.type.startsWith("image/"));

    if (validFiles.length > 0) {
        setFiles(prevFiles => [...prevFiles, ...validFiles]);
        setImagePreviews(prevPreviews => [
            ...prevPreviews,
            ...validFiles.map(file => URL.createObjectURL(file)),
        ]);
    } else {
        alert("Please upload valid image files.");
    }
};

  const handleRemoveFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
  };

  const handler = async () => {
    if (!clinicName || !clinicAddress || !selectedClinic) {
      toast.error("Please fill out all required fields!");
      return;
    }

    if (!clinicCoordinates.lat || !clinicCoordinates.lng) {
      toast.error("Please select a valid clinic location.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('doctorID', drID);
      formData.append('clinicname', clinicName);
      formData.append('clinicAddress', clinicAddress);
      formData.append('longitude', clinicCoordinates.lng);
      formData.append('latitude', clinicCoordinates.lat);
      formData.append('openTime', formatTimeTo12Hour(checkInTime));
      formData.append('closeTime', formatTimeTo12Hour(checkOutTime));
      formData.append('EmergencyopenTime', formatTimeTo12Hour(EmergencycheckInTime));
      formData.append('EmergencycloseTime', formatTimeTo12Hour(EmergencycheckOutTime));
      formData.append('Details', clinicDetails);
      formData.append('NormalFee', permissions.AppointmentFee);
      formData.append('MessageFee', permissions.MessageFee);
      formData.append('CallFee', permissions.VideoCallFee);
      formData.append('EmergencyFee', permissions.EmergencyFee);

      if (files && files.length > 0) {
          files.forEach((file) => {
              formData.append('images', file,file.name);
          });
          
      }

      const apiUrl = `${process.env.REACT_APP_HOS}/add-clinic-in-doctor-profile`;
      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        toast.success("Clinic added successfully!");
        navigate(-1);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <DashboardLayout>
      <ToastContainer autoClose={2000} position="top-center" />


      <MDBox sx={{ padding: 3 }}>
        <Card sx={{ borderRadius: 4, p: 4, backgroundColor: '#ffffff' }}>
          
          <MDTypography variant="h6" fontWeight="medium" gutterBottom>
            ➕ Add New Clinic
          </MDTypography>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Clinic Name"
                variant="outlined"
                size="small"
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                sx={{ backgroundColor: '#fafafa', borderRadius: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={8}>
              <MDBox sx={{ position: 'relative' }}>
                <TextField
                  fullWidth
                  label="Clinic Address"
                  variant="outlined"
                  size="small"
                  value={clinicAddress}
                  onChange={(e) => {
                    setClinicAddress(e.target.value);
                    fetchAddressSuggestions(e.target.value);
                  }}
                  sx={{ backgroundColor: '#fafafa', borderRadius: 1 }}
                />
                {showSuggestions && addressSuggestions.length > 0 && (
                  <MDBox
                    sx={{
                      position: 'absolute',
                      zIndex: 10,
                      width: '100%',
                      bgcolor: 'white',
                      boxShadow: 3,
                      borderRadius: 1,
                      mt: 1,
                      maxHeight: 200,
                      overflowY: 'auto',
                    }}
                  >
                    {addressSuggestions.map((suggestion, idx) => (
                      <MDBox
                        key={idx}
                        px={2}
                        py={1}
                        sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#f0f0f0' } }}
                        onClick={() => {
                          setClinicAddress(suggestion.display_name);
                          setSelectedClinic(suggestion.place_id);
                          setClinicCoordinates({
                            lat: parseFloat(suggestion.lat),
                            lng: parseFloat(suggestion.lon),
                          });
                          setShowSuggestions(false);
                        }}
                      >
                        {suggestion.display_name}
                      </MDBox>
                    ))}
                  </MDBox>
                )}
              </MDBox>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            {[['Open Time', checkInTime, setCheckInTime], ['Close Time', checkOutTime, setCheckOutTime]].map(([label, value, setter]) => (
              <Grid item xs={12} sm={6} key={label}>
                <FormControl fullWidth size="small">
                  <InputLabel shrink>{label}</InputLabel>
                  <Select native value={value} onChange={(e) => setter(e.target.value)}>
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={2}>
            {[['Emergency Open Time', EmergencycheckInTime, setEmergencyCheckInTime], ['Emergency Close Time', EmergencycheckOutTime, setEmergencyCheckOutTime]].map(([label, value, setter]) => (
              <Grid item xs={12} sm={6} key={label}>
                <FormControl fullWidth size="small">
                  <InputLabel shrink>{label}</InputLabel>
                  <Select native value={value} onChange={(e) => setter(e.target.value)}>
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={2}>
            {[ 
              ['AppointmentFee', 'Consultation Appointment Fee'],
              ['MessageFee', 'Messaging Fee'],
              ['VideoCallFee', 'Video Call Fee'],
              ['EmergencyFee', 'Emergency Fee'],
            ].map(([key, label]) => (
              <Grid item xs={12} key={key}>
                <FormControl fullWidth>
                  <MDBox
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: '#f8f9fa',
                      padding: 2,
                      borderRadius: 2,
                      mb: 1,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}
                  >
                    <MDTypography color="text" variant="body2" fontWeight="small">
                      {label}
                    </MDTypography>
                    <TextField
                      type="number"
                      name={key}
                      size="small"
                      variant="outlined"
                      value={permissions[key]}
                      onChange={(e) =>
                        setPermissions((prev) => ({ ...prev, [key]: e.target.value }))}
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                      sx={{ width: 100 }}
                    />
                  </MDBox>
                </FormControl>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <MDBox
                sx={{
                  border: '2px dashed #bbb',
                  borderRadius: 2,
                  padding: 3,
                  backgroundColor: '#f9f9f9',
                }}
              >
                <TextField
                  type="file"
                  fullWidth
                  variant="standard"
                  sx={{ mb: 3 }}
                  inputProps={{ accept: "image/*", multiple: true }}
                  onChange={handleFileChange}
                />

                <MDBox sx={{ textAlign: 'center', mb: 2 }}>
                  {imagePreviews.length === 0 ? (
                    <>
                      <img src={img} alt="Upload icon" width={60} style={{ marginBottom: 8 }} />
                      <MDTypography variant="h6" fontWeight="medium">
                        Upload Photos
                      </MDTypography>
                      <MDTypography variant="body2" color="text" mt={1}>
                        Choose your photos carefully. You can upload Max 5 photos
                      </MDTypography>
                    </>
                  ) : (
                    <MDBox sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                      {imagePreviews.map((preview, idx) => (
                        <MDBox
                          key={idx}
                          sx={{
                            position: 'relative',
                            width: 80,
                            height: 80,
                            borderRadius: 2,
                            overflow: 'hidden',
                            border: '1px solid #ccc',
                          }}
                        >
                          <img src={preview} alt={`Preview ${idx}`} width="100%" height="100%" style={{ objectFit: 'cover' }} />
                          <IconButton
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 2,
                              right: 2,
                              padding: '2px 6px',
                              fontSize: '0.7rem',
                              backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            }}
                            onClick={() => handleRemoveFile(idx)}
                          >
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        </MDBox>
                      ))}
                    </MDBox>
                  )}
                </MDBox>
              </MDBox>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Clinic Description"
                variant="outlined"
                value={clinicDetails}
                onChange={(e) => setClinicDetails(e.target.value)}
                sx={{ backgroundColor: '#fafafa', borderRadius: 1, mt: 2 }}
                placeholder="Enter details about the clinic, facilities, etc."
              />
            </Grid>
          </Grid>

          <MDBox mt={4}>
            <MDButton
              variant="contained"
              onClick={handler}
              disabled={loading}
              sx={{
                color:'white',
                bgcolor: '#051aa1',
                borderRadius: 2,
                textTransform: 'none',
                px: 4,
                py: 1.5,
                fontWeight: 'medium',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.1)' },
              }}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
            >
              {loading ? "Adding..." : "Add Clinic"}
            </MDButton>
          </MDBox>
        </Card>
      </MDBox>

    </DashboardLayout>
  );
}

export default AddClinic;