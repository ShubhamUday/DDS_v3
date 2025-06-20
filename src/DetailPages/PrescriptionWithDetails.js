import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Paper, Divider, Button, Grid, TextField, ToggleButton, ToggleButtonGroup, Select, MenuItem, InputLabel, FormControl, InputAdornment, Stack, Dialog, DialogTitle, DialogActions } from '@mui/material';
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

function PrescriptionWithDetails() {
  const { id: param1 } = useParams();
  const role = localStorage.getItem("role");
  const [alldetails, setAllDetails] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addMedicine, setAddMedicine] = useState(false)
  const [medicineList, setMedicineList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedMedId, setSelectedMedId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [mode, setMode] = useState(null)


  const [formData, setFormData] = useState({
    afternoon: '',
    count: '',
    days: '',
    evening: '',
    foodtime: '',
    medicinename: '',
    medicinetype: '',
    morningdos: '',
    night: '',
    advice: '',
    note: '',
  });

  const toggleForm = () => setAddMedicine((prev) => !prev);

  // Handlers
  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    resetForm();
    setAddMedicine(false);
  };

  const handleDoseToggle = (event, newDoses) => {
    // Reset all doses first
    setFormData((prev) => ({
      ...prev,
      morningdos: newDoses.includes('Morning') ? 'Morning' : '',
      afternoon: newDoses.includes('Afternoon') ? 'Afternoon' : '',
      evening: newDoses.includes('Evening') ? 'Evening' : '',
      night: newDoses.includes('Night') ? 'Night' : '',
    }));
  };

  const handleSubmit = async () => {

    if (!formData.medicinename || !formData.medicinetype || !formData.count || !formData.days) {
      toast.error("Please fill all required fields.");
      return
    }

    const formArray = [formData]
    const values = { appointmentID: param1, valuable: formArray }
    try {
      const response = await axios.post(`${process.env.REACT_APP_HOS}/add-prescription`, values,
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log('add-prescptn response', response.data)
      if (response.data) {
        toast.success("Medicine added successfully!");
      }
    } catch (error) {
      console.log('Error adding priscription', error)
    }

    resetForm();
    setAddMedicine(false);
    getDetails();
  }

  const handleDelete = async (medId) => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_HOS}/delete-prescription/${medId}`,
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log('delete response', response)
      setOpenDelete(false)
      toast.success("Medicine deleted successfully")
    } catch (error) {
      toast.error("Error deleting medinicine")
      console.log('Error deleting medinicine', error)
    }
    getDetails();
  }

  const handleUpdate = async () => {
    const values = formData
    try {
      const response = await axios.put(`${process.env.REACT_APP_HOS}/update-prescription-Details/${selectedMedId}`, values,
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log('update response', response.data)
      setOpenDeleteDialog(false)
      toast.error("Medicine updated successfully")
    } catch (error) {
      toast.error('Error deleting medinicine')
      console.log('Error deleting medinicine', error)
    }
    resetForm();
    setAddMedicine(false);
    getDetails();
  }

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
      advice: "",
      note: "",
    });
  };

  const getDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_HOS}/get-single-appointment-with-details/${param1}`,
        { headers: { 'Content-Type': 'application/json' } }
      );
      setAllDetails(response.data);
      setMedicines(response.data.prescriptionID || []);
      console.log('response details', response.data);
    } catch (error) {
      console.error("Error fetching prescription details:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log('form data', formData)

  useEffect(() => {
    getDetails();
  }, [selectedMedId]);

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
            onClick={() => { toggleForm(); setMode('add'); }}> Add Medicine</MDButton>
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
                      formData.morningdos && 'Morning',
                      formData.afternoon && 'Afternoon',
                      formData.evening && 'Evening',
                      formData.night && 'Night',
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
                  <ToggleButton value="Morning" aria-label="morning"> Morning </ToggleButton>
                  <ToggleButton value="Afternoon" aria-label="afternoon"> Afternoon </ToggleButton>
                  <ToggleButton value="Evening" aria-label="evening"> Evening </ToggleButton>
                  <ToggleButton value="Night" aria-label="night"> Night </ToggleButton>
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
                    <MenuItem value={2}> 2 </MenuItem>
                    <MenuItem value={1}> 1 </MenuItem>
                    <MenuItem value={0.5}> 1/2 </MenuItem>
                    <MenuItem value={0.25}> 1/4 </MenuItem>

                  </Select>
                </FormControl>
              </Grid>

            </Grid>

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <MDButton size="small" variant="outlined" color="error" onClick={handleCancel}> Cancel </MDButton>
              {/* <MDButton size="small" variant="contained" color="primary" onClick={handleAddMore}> Add More </MDButton> */}
              {mode === 'add' ? (
                <MDButton size="small" variant="contained" color="success" onClick={() => { setMode('add'); handleSubmit() }}> Add </MDButton>
              ) : (
                <MDButton size="small" variant="contained" color="success" onClick={() => handleUpdate()}> Update </MDButton>
              )}
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
          <MDBox sx={{ flex: 1, textAlign: 'center' }}> <MDTypography fontSize="small"> Action </MDTypography> </MDBox>
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
            <MDBox sx={{ flex: 1, textAlign: 'center' }}>
              <MDTypography fontSize="small" fontWeight="light" sx={{ cursor: "pointer" }}
                onClick={() => { setMode('edit'); setFormData(med); setAddMedicine(true); setSelectedMedId(med._id); }}
              > Edit </MDTypography>

              <MDTypography fontSize="small" fontWeight="light" sx={{ cursor: "pointer" }}
                onClick={() => { setSelectedMedId(med._id); setOpenDeleteDialog(true); }}
              > Delete </MDTypography>
            </MDBox>

            {/* <MDButton size="small" variant="contained" color="primary" onClick={() => handleEdit(med)}> Edit </MDButton> */}

          </MDBox>
        ))}

        <Dialog open={openDeleteDialog} onClose={() => { setOpenDeleteDialog(false) }} >
          <DialogTitle id="alert-dialog-title"> {"Are you sure you want to delete this medicine?"} </DialogTitle>
          <DialogActions>
            <MDButton onClick={() => { setOpenDeleteDialog(false); setSelectedMedId(null) }}> Cancel </MDButton>
            <MDButton onClick={async () => {
              await handleDelete(selectedMedId);
              setOpenDeleteDialog(false);
            }} autoFocus> Delete </MDButton>
          </DialogActions>
        </Dialog>

        {/* Advice Section */}
        <MDBox mt={3} display="flex">
          <MDTypography fontSize="small"><strong> Advice: </strong> {alldetails?.advice || "—"} </MDTypography>
          <MDTypography fontSize="small" sx={{ ml: "auto" }}><strong> Note :</strong> {alldetails?.note || "—"} </MDTypography>
        </MDBox>

      </MDBox>

    </DashboardLayout>
  );
}

export default PrescriptionWithDetails;
