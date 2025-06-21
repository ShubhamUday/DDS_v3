import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTitle, Divider, Grid, IconButton, Stack, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';
import { CloseOutlined } from '@mui/icons-material'
import { styled } from '@mui/material/styles';


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

function PatientFormModal({ selectedAppointment, isModalOpen, setIsModalOpen, getDetails, style }) {
    const [formData, setFormData] = useState({
        gender: '',
        age: '',
        weight: '',
        treatmentFor: '',
        problem: '',
        diabities: '',
        bloodPressure: '',
    });

    const handleClose = () => setIsModalOpen(false);

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

    const handleSubmit = () => {
        axios.put('/api/patient/123', formData) // Replace with your PUT endpoint
            .then(() => {
                alert('Updated successfully!');
                getDetails();
            })
            .catch((err) => {
                console.error('Error updating data:', err);
            });
    };

    useEffect(() => {
        const data = selectedAppointment
        setFormData({
            gender: data?.userID?.gender || '',
            age: data?.userID?.age || '',
            weight: data?.userID?.weight || '',
            treatmentFor: data?.Treatmentfor || '',
            problem: data?.ProblemDetails || '',
            diabities: data.hasDiabetes || '',
            bloodPressure: data.bpStatus || '',
        });
    }, [])

    console.log(selectedAppointment)

    return (
        <>
            <Dialog open={isModalOpen} onClose={handleClose} fullWidth>
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title"> Update Patient&apos;s Details </DialogTitle>
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

                    <Stack spacing={2}>
                        {/* Gender */}
                        <MDBox display="flex">
                            <MDTypography variant="subtitle2" color="textPrimary" mt={0.5} mr={1}> Gender </MDTypography>
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

                        {/* Age, Weight */}
                        <Grid container>
                            <Grid item xs={12} sm={6}>
                                <MDBox display="flex">
                                    <MDTypography variant="subtitle2" color="textPrimary" mt={0.5} mr={1}> Age </MDTypography>
                                    <TextField size="small" type="number"
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
                            <Grid item xs={12} sm={6}>
                                <MDBox display="flex">
                                    <MDTypography variant="subtitle2" color="textPrimary" mt={0.5} ml={1} mr={1}> Weight </MDTypography>
                                    <TextField size="small" type="number"
                                        value={formData.weight}
                                        onChange={handleChange('weight')}
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

                        </Grid>

                        {/* Treatment Options */}
                        <Grid container>

                            <Grid item xs={12} sm={12}>
                                <MDBox display="flex" mb={1}>
                                    <MDTypography variant="subtitle2" color="textPrimary" mt={0.5} mr={1}> Treatment </MDTypography>
                                    <TextField size="small" fullWidth />
                                </MDBox>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <ToggleButtonGroup
                                    size="small"
                                    color="primary"
                                    exclusive
                                    fullWidth
                                    value={formData.treatmentFor}
                                    onChange={handleChange('treatmentFor')}
                                >
                                    <StyledToggleButton value="Tooth Pain">Tooth Pain</StyledToggleButton>
                                    <StyledToggleButton value="Brace">Brace</StyledToggleButton>
                                    <StyledToggleButton value="Crown">Crown</StyledToggleButton>
                                    <StyledToggleButton value="Bridge">Bridge</StyledToggleButton>
                                    <StyledToggleButton value="Tooth Ache">Tooth Ache</StyledToggleButton>
                                </ToggleButtonGroup>
                            </Grid>


                        </Grid>

                        {/* Problem */}
                        <MDBox display="flex">
                            <MDTypography variant="subtitle2" mt={0.5} mr={1}>Problem</MDTypography>
                            <TextField size="small" fullWidth value={formData.problem}
                                onChange={handleChange('problem')} />
                        </MDBox>

                        {/* Diabities */}
                        <MDBox display="flex">
                            <MDTypography variant="subtitle2" color="textPrimary" mt={0.5} mr={1}> Diabities </MDTypography>
                            <ToggleButtonGroup
                                size="small"
                                color="primary"
                                value={formData.diabities}
                                exclusive
                                onChange={handleToggleChange('diabities')}
                            >
                                <StyledToggleButton value="Yes">Yes</StyledToggleButton>
                                <StyledToggleButton value="No">No</StyledToggleButton>
                                <StyledToggleButton value="Pre">Pre</StyledToggleButton>
                            </ToggleButtonGroup>
                        </MDBox>

                        {/* Blood Pressure */}
                        <MDBox display="flex">
                            <MDTypography variant="subtitle2" color="textPrimary" mt={0.5} mr={1}> Blood Pressure </MDTypography>
                            <ToggleButtonGroup
                                size="small"
                                color="primary"
                                value={formData.bloodPressure}
                                exclusive
                                onChange={handleToggleChange('bloodPressure')}
                            >
                                <StyledToggleButton value="Yes">Yes</StyledToggleButton>
                                <StyledToggleButton value="No">No</StyledToggleButton>
                            </ToggleButtonGroup>
                        </MDBox>

                        {/* Buttons */}
                        <MDBox display="flex" justifyContent="flex-end" gap={1}>
                            <MDButton variant="outlined" color="error" size="small" onClick={handleClose}> Cancel </MDButton>
                            <MDButton variant="contained" color="success" size="small" onClick={handleSubmit}> Save </MDButton>
                        </MDBox>
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default PatientFormModal