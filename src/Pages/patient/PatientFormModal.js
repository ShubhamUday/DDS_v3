import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Dialog, DialogContent, DialogTitle, Divider, Grid, IconButton, Stack, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';
import { CloseOutlined } from '@mui/icons-material'
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';


const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
    textTransform: "capitalize",
    borderRadius: 8,
    fontWeight: 500,
    borderColor: "#cfd8dc",
    '&.Mui-selected': {
        backgroundColor: '#4caf50',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#43a047',
        },
    },
}));

function PatientFormModal({ selectedAppointment, isPatientModalOpen, setIsPatientModalOpen, getDetails }) {
    const [formData, setFormData] = useState({
        doctorID: "",
        // userID: "",
        patientName: "",
        phone: "",
        gender: "",
        age: "",
        Weight: "",
        Treatmentfor: "",
        ProblemDetails: "",
        diabetes: "",
        Bloodpressure: "",
    });

    const handleClose = () => setIsPatientModalOpen(false);

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

    const handleSubmit = async () => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_HOS}/update-Appointment-Details/${selectedAppointment._id}`, formData, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.data) {
                console.log('edit patient response', response.data)
                resetForm()
                setIsPatientModalOpen(false)
                getDetails()
                toast.success('Patient details updated sucsessfully!');
            }
        } catch (error) {
            toast.error("Something went wrong");
            console.log(error)
        }
    }

    const resetForm = () => {
        setFormData({
            doctorID: "",
            userID: "",
            patientName: "",
            phone: "",
            gender: "",
            age: "",
            Weight: "",
            Treatmentfor: "",
            ProblemDetails: "",
            diabetes: "",
            Bloodpressure: "",
            plan: "",
            Bookdate: "",
            BookTime: "",
            PayType: "",
            clinicID: "",
        });
    };

    useEffect(() => {
        const data = selectedAppointment
        setFormData({
            doctorID: data?.doctorID || "",
            userID: data?.userID?._id || "",
            patientName: data?.userID?.name || data?.patientName || "",
            phone: data?.userID?.number || data?.phone || "",
            gender: data?.userID?.gender || data?.gender || "",
            age: data?.userID?.age || data?.age || "",
            Weight: data?.userID?.Weight || data?.Weight || "",
            Treatmentfor: data?.Treatmentfor || "",
            ProblemDetails: data?.ProblemDetails || "",
            diabetes: data?.diabetes || "",
            Bloodpressure: data?.Bloodpressure || "",
        });
    }, [])

    console.log(selectedAppointment)

    return (
        <>
            <Dialog open={isPatientModalOpen} onClose={handleClose} fullWidth>
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title"> Edit Patient&apos;s Details </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
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


                    <Grid container spacing={2}>

                        {/* Gender */}
                        <Grid item xs={12} sm={4}>
                            <MDBox display="flex">
                                {/* <MDTypography variant="subtitle2" color="textPrimary" mt={0.5} mr={1}> Gender </MDTypography> */}
                                <ToggleButtonGroup
                                    size="small"
                                    color="primary"
                                    value={formData.gender}
                                    exclusive
                                    onChange={handleToggleChange('gender')}
                                >
                                    <StyledToggleButton value="Male"> Male </StyledToggleButton>
                                    <StyledToggleButton value="Female"> Female </StyledToggleButton>
                                </ToggleButtonGroup>
                            </MDBox>
                        </Grid>

                        {/* Age */}
                        <Grid item xs={6} sm={4}>
                            <MDBox display="flex">
                                {/* <MDTypography variant="subtitle2" color="textPrimary" mt={0.5} mr={1}> Age </MDTypography> */}
                                <TextField size="small" type="number" label="Age"
                                    value={formData.age}
                                    onChange={handleChange('age')}
                                    InputLabelProps={{ shrink: true }}
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
                                    }} />
                            </MDBox>
                        </Grid>

                        {/* Weight  */}
                        <Grid item xs={6} sm={4} display="flex" justifyContent="flex-end">
                                {/* <MDTypography variant="subtitle2" color="textPrimary" mt={0.5} ml={1} mr={1}> Weight </MDTypography> */}
                                <TextField size="small" type="number" label="Weight"
                                    value={formData.Weight}
                                    onChange={handleChange('Weight')}
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
                                    }} />
                        </Grid>

                        {/* Treatment Options */}
                        <Grid item xs={12} sm={12}>
                            <MDBox display="flex">
                                {/* <MDTypography variant="subtitle2" color="textPrimary" mt={0.5} mr={1}> Treatment </MDTypography> */}
                                <TextField size="small" fullWidth label="Treatment"
                                    value={formData.Treatmentfor}
                                    onChange={handleChange('Treatmentfor')}
                                />
                            </MDBox>
                        </Grid>

                        
                        <Grid item xs={12} sm={12}>
                            <ToggleButtonGroup
                                size="small"
                                color="primary"
                                exclusive
                                fullWidth
                                value={formData.Treatmentfor}
                                onChange={handleChange('Treatmentfor')}
                            >
                                <StyledToggleButton value="Tooth Pain">Tooth Pain</StyledToggleButton>
                                <StyledToggleButton value="Brace">Brace</StyledToggleButton>
                                <StyledToggleButton value="Crown">Crown</StyledToggleButton>
                                <StyledToggleButton value="Bridge">Bridge</StyledToggleButton>
                                <StyledToggleButton value="Tooth Ache">Tooth Ache</StyledToggleButton>
                            </ToggleButtonGroup>
                        </Grid>

                        {/* Problem */}
                        <Grid item xs={12} sm={12} lg={12}>
                            <MDBox display="flex">
                                {/* <MDTypography variant="subtitle2" mt={0.5} mr={1}>Problem</MDTypography> */}
                                <TextField size="small" fullWidth value={formData.ProblemDetails}
                                    label="Problem"
                                    onChange={handleChange('ProblemDetails')} />
                            </MDBox>
                        </Grid>

                        {/* Diabities */}
                        <Grid item xs={12} sm={12} lg={6}>
                            <MDBox display="flex" justifyContent="space-between"
                                sx={{ alignItems: 'center', backgroundColor: '#f8f9fa', padding: 1, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', }}
                            >
                                <MDTypography variant="subtitle2" color="textPrimary" mt={0.5} mr={1}> Diabities </MDTypography>
                                <ToggleButtonGroup
                                    size="small"
                                    color="primary"
                                    value={formData.diabetes}
                                    exclusive
                                    onChange={handleToggleChange('diabities')}
                                >
                                    <StyledToggleButton value="Yes">Yes</StyledToggleButton>
                                    <StyledToggleButton value="No">No</StyledToggleButton>
                                    <StyledToggleButton value="Pre">Pre</StyledToggleButton>
                                </ToggleButtonGroup>
                            </MDBox>
                        </Grid>

                        {/* Blood Pressure */}
                        <Grid item xs={12} sm={12} lg={6}>
                            <MDBox display="flex" justifyContent="space-between"
                                sx={{ alignItems: 'center', backgroundColor: '#f8f9fa', padding: 1, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', }}
                            >
                                <MDTypography variant="subtitle2" color="textPrimary" mt={0.5} mr={1}> Blood Pressure </MDTypography>
                                <ToggleButtonGroup
                                    size="small"
                                    color="primary"
                                    value={formData.Bloodpressure}
                                    exclusive
                                    onChange={handleToggleChange('bloodPressure')}
                                >
                                    <StyledToggleButton value="Yes">Yes</StyledToggleButton>
                                    <StyledToggleButton value="No">No</StyledToggleButton>
                                </ToggleButtonGroup>
                            </MDBox>
                        </Grid>

                        {/* Buttons */}
                        <Grid item xs={12} sm={12} lg={12}>
                            <MDBox display="flex" justifyContent="flex-end" gap={1}>
                                <MDButton variant="outlined" color="error" size="small" onClick={handleClose}> Cancel </MDButton>
                                <MDButton variant="contained" color="success" size="small" onClick={handleSubmit}> Save </MDButton>
                            </MDBox>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default PatientFormModal