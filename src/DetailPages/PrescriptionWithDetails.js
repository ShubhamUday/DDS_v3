import React, { useState, useEffect } from "react";
import { Paper, Divider, Button, Grid, TextField, ToggleButton, ToggleButtonGroup, Select, MenuItem, InputLabel, FormControl, InputAdornment, Stack } from '@mui/material';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DownloadIcon from '@mui/icons-material/Download';
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDAvatar from "components/MDAvatar";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import html2canvas from "html2canvas";
import img from "assets/images/abc.jpg";
import { AddCard } from "@mui/icons-material";
import AddLinkIcon from '@mui/icons-material/AddLink';
import MDInput from "components/MDInput";

function PrescriptionWithDetails() {
  const { id: param1 } = useParams();
  const [alldetails, setAllDetails] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem("role");
  const [addMedicine, setAddMedicine] = useState(false)
  const [medicineList, setMedicineList] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    afternoon: '',
    count: "",
    days: "",
    evening: '',
    foodtime: '',
    medicinename: '',
    medicinetype: '',
    morningdos: '',
    night: '',
    quantity: '',
  });

  const toggleForm = () => setAddMedicine((prev) => !prev);
  // Handlers
  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleChange = (field) => (e, value) => {
    if (value !== null) {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleCancel = () => {
    resetForm();
    setAddMedicine(false);
  };

  const handleDoseToggle = (event, newDoses) => {
    // Reset all doses first
    setFormData((prev) => ({
      ...prev,
      morningdos: newDoses.includes('morning') ? 'Yes' : '',
      afternoon: newDoses.includes('afternoon') ? 'Yes' : '',
      evening: newDoses.includes('evening') ? 'Yes' : '',
      night: newDoses.includes('night') ? 'Yes' : '',
    }));
  };

  const handleSubmit = () => {
    if (formData.medicinename && formData.medicinetype && formData.quantity && formData.days) {
      setMedicineList((prev) => [...prev, formData]);
      resetForm();
      setAddMedicine(false);
    } else {
      alert("Please fill all required fields.");
    }
  };

  const handleAddMore = () => {
    if (formData.medicinename && formData.medicinetype && formData.quantity && formData.days) {
      setMedicineList((prev) => [...prev, formData]);
      resetForm();
    } else {
      alert("Please fill all required fields.");
    }
  };

  const handleEdit = (med) => {
    setFormData(med)
    setAddMedicine(true);
  };

  const resetForm = () => {
    setFormData({
      afternoon: '',
      count: "",
      days: "",
      evening: '',
      foodtime: '',
      medicinename: '',
      medicinetype: '',
      morningdos: '',
      night: '',
      quantity: '',
    });
  };

  const getDetails = async () => {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_HOS}/get-single-appointment-with-details/${param1}`,
        { headers: { 'Content-Type': 'application/json' } }
      );
      setAllDetails(result.data);
      setMedicines(result.data.prescriptionID || []);
      console.log(result.data);
    } catch (error) {
      console.error("Error fetching prescription details:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log('form data', formData)

  useEffect(() => {
    getDetails();
  }, []);

  const handleDownload = () => {
    const captureElement = document.getElementById('prescription-capture');
    if (captureElement) {
      html2canvas(captureElement, { scale: 2 }).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'prescription.png';
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  return (
    <DashboardLayout>

      {/* Download Button */}
      {role === "Doctor" && (
        <MDBox display="flex" justifyContent="flex-end" p={2}>
          <MDButton color="primary" variant="contained" startIcon={<DownloadIcon />} onClick={handleDownload}
            sx={{
              borderRadius: '8px', boxShadow: 3,
              '&:hover': {
                boxShadow: 6, backgroundColor: '#cfccc6'
              }
            }}
          >
            Download Prescription
          </MDButton>
        </MDBox>
      )}

      {/* Prescription Content */}
      <MDBox id="prescription-capture" p={3}
        sx={{ backgroundColor: "#fff", borderRadius: 2, boxShadow: 3, }}>
        <MDBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>

          {/* Doctor & Patient Info */}
          <MDBox sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <MDTypography fontWeight="bold" color="teal" fontSize="lg"> {alldetails?.userID?.name} </MDTypography>
            <MDTypography fontSize="small">Booking No: {alldetails?.userID?._id?.slice(0, 7)} </MDTypography>
            <MDTypography fontSize="small"><strong>Contact:</strong> {alldetails?.userID?.number} </MDTypography>

            <MDBox mt={2}>
              <MDTypography fontSize="small"><strong>Diabities:</strong> {alldetails?.diabetes}</MDTypography>
              <MDTypography fontSize="small"><strong>Blood Pressure:</strong> {alldetails?.Bloodpressure}</MDTypography>
            </MDBox>
          </MDBox>

          {/* Avatar */}
          <MDBox mx={4}>
            <MDAvatar
              src={img || ""}
              alt={alldetails?.clinicID?.clinicname || "C"}
              size="xxl"
              sx={{ boxShadow: 3, border: '4px solid #fff', }}
            />
          </MDBox>

          {/* Clinic & Appointment Info */}
          <MDBox sx={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
            <MDBox mb={0} sx={{ maxWidth: 200, wordBreak: 'break-word' }}>
              <MDTypography fontWeight="bold" color="green" fontSize="lg"> {alldetails?.clinicID?.clinicname} </MDTypography>
              <MDTypography fontSize="small">Near {alldetails?.clinicID?.clinicAddress} </MDTypography>
              <MDTypography fontSize="small"> <strong>Timing:</strong> {alldetails?.clinicID?.openTime} - {alldetails?.clinicID?.closeTime} </MDTypography>
            </MDBox>
            <MDBox>
              <MDTypography fontSize="small"><strong>Date:</strong> {alldetails?.Bookdate?.slice(0, 10)}, {alldetails?.BookTime} </MDTypography>
              <MDTypography fontSize="small"><strong>Plan:</strong> {alldetails?.Plan} </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>

        <Divider sx={{ my: 2 }} />

        {/* Title */}
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography fontWeight="bold" fontSize="large" mb={1}> Rx </MDTypography>
          <MDButton size="small" color="primary" variant="contained" startIcon={<AddLinkIcon fontSize="large" />}
            onClick={() => toggleForm()}> Add Medicine</MDButton>

        </MDBox>

        {/* Add Medicine Form */}
        {addMedicine && (
          <Paper elevation={3} sx={{ mt: 2, p: 3, borderRadius: 2 }}>

            <MDTypography variant="h6" gutterBottom> Add Medicine </MDTypography>

            <Grid container spacing={2}>

              <Grid item xs={12} sm={4}>
                <TextField fullWidth size="small" label="Medicine Name" variant="outlined"
                  value={formData.medicinename} onChange={handleChange('medicinename')} />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel> Type </InputLabel>
                  <Select
                    value={formData.medicinetype}
                    label="Type"
                    onChange={handleChange("medicinetype")}
                  >
                    <MenuItem value="Tablet"> Tablet </MenuItem>
                    <MenuItem value="Capsule"> Capsule </MenuItem>
                    <MenuItem value="Tonic"> Tonic </MenuItem>
                    <MenuItem value="Other"> Other </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField fullWidth size="small" id="outlined-number" label="Duration (Days)" type="number"
                  value={formData.days}
                  onChange={handleChange("days")}
                  sx={{
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

              <Grid item xs={12}>
                {/* <MDTypography variant="subtitle1">Time</MDTypography> */}
                <ToggleButtonGroup size="small" fullWidth multiple
                  value={
                    [
                      formData.morningdos && 'morning',
                      formData.afternoon && 'afternoon',
                      formData.evening && 'evening',
                      formData.night && 'night',
                    ].filter(Boolean)
                  }
                  onChange={handleDoseToggle}
                  aria-label="dosage time"
                  sx={{
                    '& .MuiToggleButton-root': {
                      textTransform: "capitalize",
                      borderRadius: 2,
                      fontWeight: 500,
                      borderColor: "#cfd8dc",
                    },
                    '& .MuiToggleButton-root.Mui-selected': {
                      backgroundColor: '#4caf50',
                      color: '#fff',
                      '&:hover': {
                        backgroundColor: '#43a047',
                      },
                    },
                  }}
                >
                  <ToggleButton value="morning" aria-label="morning"> Morning </ToggleButton>
                  <ToggleButton value="afternoon" aria-label="afternoon"> Afternoon </ToggleButton>
                  <ToggleButton value="evening" aria-label="evening"> Evening </ToggleButton>
                  <ToggleButton value="night" aria-label="night"> Night </ToggleButton>
                </ToggleButtonGroup>
              </Grid>

              <Grid item xs={12} sm={3}>
                <FormControl size="small" fullWidth>
                  <InputLabel id="food-label"> Time </InputLabel>
                  <Select
                    labelId="food-label"
                    id="label"
                    value={formData.foodtime}
                    label="Food"
                    onChange={handleChange('foodtime')}
                    inputProps={{ name: 'food', id: 'food-label' }}
                  >
                    <MenuItem value={'After'}> After Meal </MenuItem>
                    <MenuItem value={'Befor'}> Before Meal </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel> Quantity </InputLabel>
                  <Select
                    value={formData.count}
                    label="Quantity"
                    onChange={handleChange("count")}
                  >

                    <MenuItem value="2"> 2 </MenuItem>
                    <MenuItem value="1"> 1 </MenuItem>
                    <MenuItem value="0.5"> 1/2 </MenuItem>
                    <MenuItem value="0.25"> 1/4 </MenuItem>

                  </Select>
                </FormControl>
              </Grid>

            </Grid>

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <MDButton size="small" variant="outlined" color="error" onClick={handleCancel}> Cancel </MDButton>
              <MDButton size="small" variant="contained" color="primary" onClick={handleAddMore}> Add More </MDButton>
              <MDButton size="small" variant="contained" color="success" onClick={handleSubmit}> Submit </MDButton>
            </Stack>

          </Paper>
        )}

        <Divider />

        {/* Prescription Table */}
        <MDBox sx={{ display: 'flex', fontWeight: 'bold', backgroundColor: '#f0f0f0', p: 1, borderRadius: 1 }}>
          <MDBox sx={{ flex: 2 }}> <MDTypography fontSize="small" color="dark"> Medicine </MDTypography> </MDBox>
          <MDBox sx={{ flex: 1, textAlign: 'center' }}> <MDTypography fontSize="small"> Food </MDTypography> </MDBox>
          <MDBox sx={{ flex: 1, textAlign: 'center' }}> <MDTypography fontSize="small"> Duration </MDTypography> </MDBox>
          <MDBox sx={{ flex: 1, textAlign: 'center' }}> <MDTypography fontSize="small"> M </MDTypography> </MDBox>
          <MDBox sx={{ flex: 1, textAlign: 'center' }}> <MDTypography fontSize="small"> A </MDTypography> </MDBox>
          <MDBox sx={{ flex: 1, textAlign: 'center' }}> <MDTypography fontSize="small"> E </MDTypography> </MDBox>
          <MDBox sx={{ flex: 1, textAlign: 'center' }}> <MDTypography fontSize="small"> N </MDTypography> </MDBox>
          <MDBox sx={{ flex: 1, textAlign: 'center  ' }}> <MDTypography fontSize="small"> Action </MDTypography> </MDBox>
        </MDBox>

        {medicines.map((med, index) => (
          <MDBox key={index}
            sx={{
              display: 'flex', alignItems: 'center', p: 1, borderBottom: '1px solid #eee',
              '&:hover': { backgroundColor: '#f9f9f9', }
            }} >
            <MDBox sx={{ flex: 2 }}> <MDTypography fontSize="small"> {`${index + 1}. ${med.medicinename}`} </MDTypography> </MDBox>
            <MDBox sx={{ flex: 1, textAlign: 'center' }}> <MDTypography fontSize="small"> {med.foodtime || "-"} </MDTypography> </MDBox>
            <MDBox sx={{ flex: 1, textAlign: 'center' }}> <MDTypography fontSize="small"> {med.days ? `${med.days} Days` : "-"} </MDTypography> </MDBox>
            <MDBox sx={{ flex: 1, textAlign: 'center' }}> <MDTypography fontSize="small" fontWeight="light"> {med.morningdos === "Morning" ? "✔️" : "—"} </MDTypography> </MDBox>
            <MDBox sx={{ flex: 1, textAlign: 'center' }}> <MDTypography fontSize="small" fontWeight="light"> {med.afternoon === "Afternoon" ? "✔️" : "—"} </MDTypography> </MDBox>
            <MDBox sx={{ flex: 1, textAlign: 'center' }}> <MDTypography fontSize="small" fontWeight="light"> {med.evening === "Evening" ? "✔️" : "—"} </MDTypography> </MDBox>
            <MDBox sx={{ flex: 1, textAlign: 'center' }}> <MDTypography fontSize="small" fontWeight="light"> {med.night === "Night" ? "✔️" : "—"} </MDTypography> </MDBox>
            <MDBox sx={{ flex: 1, textAlign: 'center' }}> <MDTypography fontSize="small" fontWeight="light"
              onClick={() => { handleEdit(med); console.log(med) }}
              sx={{ cursor: "pointer" }}
            > Edit </MDTypography> </MDBox>

            {/* <MDButton size="small" variant="contained" color="primary" onClick={() => handleEdit(med)}> Edit </MDButton> */}

          </MDBox>
        ))}


        {/* Advice Section */}
        <MDBox mt={3} display="flex">
          <MDTypography fontSize="small"><strong>Advice:</strong> {alldetails?.advice || "—"} </MDTypography>
          <MDTypography fontSize="small" sx={{ ml: "auto" }}><strong>Note:</strong> {alldetails?.note || "—"} </MDTypography>
        </MDBox>

      </MDBox>
    </DashboardLayout>
  );
}

export default PrescriptionWithDetails;
