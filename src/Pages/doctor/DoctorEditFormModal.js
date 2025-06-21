import React, { useEffect, useState } from 'react'
import { CloseOutlined } from '@mui/icons-material'
import { Dialog, DialogContent, DialogTitle, Grid, IconButton, TextField } from '@mui/material'
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorEditFormModal = ({ isEditModalOpen, setIsEditModalOpen, doctorDetails, getDoctorDetails }) => {

    const [formData, setFormData] = useState({
        drname: "",
        designation: "",
        biography: "",
        yearsofexperience: "",
        patientchecked: "",
        instituteName: "",
        registrationNumber: "",
        aadharNumber: "",
    });

    const handleClose = () => { setIsEditModalOpen(false) }

    const handleChange = (field) => (e) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        const values = formData
        try {
            const response = await axios.put(`${process.env.REACT_APP_HOS}/update-doctor-detail/${doctorDetails._id}`, values,
                { headers: { 'Content-Type': 'application/json' } })

            toast.success("Doctor's details was successfully updated")
            console.log('respon update dr', response.data)
            setIsEditModalOpen(false)
            getDoctorDetails()
        } catch (error) {
            toast.error("Error updating doctor details")
            console.log("Error updating doctor details", error)
        }
    };

    useEffect(() => {
        const data = doctorDetails
        setFormData({
            drname: data?.drname || '',
            designation: data?.designation || '',
            biography: data?.biography || '',
            yearsofexperience: data?.yearsofexperience || '',
            patientchecked: data?.patientchecked || '',
            instituteName: data.instituteName || '',
            registrationNumber: data.registrationNumber || '',
            aadharNumber: data.aadharNumber || '',
        });
    }, [])

    const resetForm = () => {
        setFormData({
            drname: "",
            designation: "",
            biography: "",
            yearsofexperience: "",
            patientchecked: "",
            instituteName: "",
            registrationNumber: "",
            aadharNumber: "",
        });
    };

    return (
        <>
            <Dialog open={isEditModalOpen} onClose={handleClose} fullWidth>

                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title"> Edit Doctor Details </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={() => setIsEditModalOpen(false)}
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

                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Name" size="small"
                                value={formData.drname}
                                onChange={handleChange('patiendrnametName')}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Designation" size="small"
                                value={formData.designation}
                                onChange={handleChange('designation')}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12}>
                            <TextField fullWidth label="Biography" size="small"
                                multiline
                                rows={2}
                                value={formData.biography}
                                onChange={handleChange('biography')}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth size="small" id="outlined-number" label="Year's of experience" type="number"
                                value={formData.yearsofexperience}
                                onChange={handleChange("yearsofexperience")}
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
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth size="small" id="outlined-number" label="Patient's Checked" type="number"
                                value={formData.patientchecked}
                                onChange={handleChange("patientchecked")}
                            />
                        </Grid>

                        {/* Buttons */}
                        <Grid item xs={12} sm={12}>
                            <MDBox display="flex" justifyContent="flex-end" gap={1}>
                                <MDButton variant="outlined" color="error" size="small" onClick={handleClose}> Cancel </MDButton>
                                <MDButton variant="contained" color="primary" size="small" onClick={handleSubmit}> Update </MDButton>
                            </MDBox>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default DoctorEditFormModal