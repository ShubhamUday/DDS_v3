import React, { useEffect, useState } from 'react'
import { Divider, Grid, Modal, Stack, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';

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
            <Modal open={isModalOpen} onClose={handleClose}  >
                <MDBox sx={style}>
                    <MDTypography variant="h6" mb={2} fontWeight="bold"> Update Patient Details </MDTypography>

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
                                <ToggleButton value="Male">Male</ToggleButton>
                                <ToggleButton value="Female">Female</ToggleButton>
                            </ToggleButtonGroup>
                        </MDBox>

                        {/* Age, Weight */}
                        <Grid container>
                            <Grid item xs={12} sm={6}>
                                <MDBox display="flex">
                                    <MDTypography variant="subtitle2" color="textPrimary" mt={0.5} mr={1}> Age </MDTypography>
                                    <TextField size="small" type="number" value={formData.age} onChange={handleChange('age')} InputLabelProps={{ shrink: true }} />
                                </MDBox>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <MDBox display="flex">
                                    <MDTypography variant="subtitle2" color="textPrimary" mt={0.5} ml={1} mr={1}> Weight </MDTypography>
                                    <TextField size="small" type="number" value={formData.weight} onChange={handleChange('weight')} InputLabelProps={{ shrink: true }} />
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
                                    <ToggleButton value="Tooth Pain">Tooth Pain</ToggleButton>
                                    <ToggleButton value="Brace">Brace</ToggleButton>
                                    <ToggleButton value="Crown">Crown</ToggleButton>
                                    <ToggleButton value="Bridge">Bridge</ToggleButton>
                                    <ToggleButton value="Tooth Ache">Tooth Ache</ToggleButton>
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
                                <ToggleButton value="Yes">Yes</ToggleButton>
                                <ToggleButton value="No">No</ToggleButton>
                                <ToggleButton value="Pre">Pre</ToggleButton>
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
                                <ToggleButton value="Yes">Yes</ToggleButton>
                                <ToggleButton value="No">No</ToggleButton>
                            </ToggleButtonGroup>
                        </MDBox>

                        <Divider />

                        {/* Buttons */}
                        <MDBox display="flex" justifyContent="flex-end" gap={1}>
                            <MDButton variant="outlined" color="error" size="small" onClick={handleClose}> Cancel </MDButton>
                            <MDButton variant="contained" color="success" size="small" onClick={handleSubmit}> Save </MDButton>
                        </MDBox>
                    </Stack>

                </MDBox>
            </Modal>
        </>
    )
}

export default PatientFormModal