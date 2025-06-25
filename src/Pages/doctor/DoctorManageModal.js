import React, { Fragment, useEffect, useState } from 'react'
import { CloseOutlined } from '@mui/icons-material'
import { Checkbox, Dialog, DialogContent, DialogTitle, FormControl, FormControlLabel, FormGroup, Grid, IconButton, TextField } from '@mui/material'
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepButton from '@mui/material/StepButton';
import ClearIcon from '@mui/icons-material/Clear';
import img from "../../assets/Frame9347.png";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const steps = [
    'Details',
    'Upload',
    'Overview',
];

const DoctorManageModal = ({ isManageModalOpen, setIsManageModalOpen, doctorDetails, getDoctorDetails, handleMenuClose }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [files, setFiles] = useState([]);
    const [agree, setAgree] = useState(false);

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

    const isLastStep = activeStep === steps.length - 1;

    const handleNext = async () => {
        console.log("image", imagePreviews)

        if (isLastStep) {
            try {
                const form = new FormData();
                form.append('form', formData)

                if (files && files.length > 0) {
                    files.forEach((file) => {
                        form.append('images', file, file.name);
                    });
                }
                const response = await axios.put(`${process.env.REACT_APP_HOS}/update-doctor-detail/${doctorDetails._id}`, formData,
                    { headers: { 'Content-Type': 'multipart/form-data', } })

                toast.success("Submitted successfully")
                console.log("update Response data", response.data);
                console.log("Update response", response);

                setIsManageModalOpen(false);
                getDoctorDetails()
                handleMenuClose()

            } catch (error) {
                toast.error("Submission failed")
                console.error("Submission failed:", error);
            }
        } else {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStep = (step) => () => {
        setActiveStep(step);
    };

    const handleClose = () => { 
        setIsManageModalOpen(false); 
        handleMenuClose();
    }

    const handleChange = (field) => (e) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleImageChange = (event) => {
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

    const handleSubmit = () => {
        axios.put('/api/patient/123', formData)
            .then(() => {
                alert('Updated successfully!');
            })
            .catch((err) => {
                console.error('Error updating data:', err);
            });
        try {
            const form = new FormData();
            form.append(formData)

            if (files && files.length > 0) {
                files.forEach((file) => {
                    form.append('images', file, file.name);
                });
            }

        } catch (error) {

        }
    };

    console.log('form Data', formData)

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
            <Dialog open={isManageModalOpen} onClose={handleClose} fullWidth>
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title"> Manage Doctor Details </DialogTitle>
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
                    <MDBox sx={{ width: '100%' }}>
                        <Stepper alternativeLabel activeStep={activeStep} sx={{ mb: 3, boxShadow: 'none' }}>
                            {steps.map((label, index) => (
                                <Step key={label} >
                                    <StepButton color="inherit" onClick={handleStep(index)}>
                                        {label}
                                    </StepButton>
                                </Step>
                            ))}
                        </Stepper>
                        <Fragment>
                            {/* Render inputs conditionally based on activeStep */}
                            {activeStep === 0 && (
                                <>
                                    <Grid container spacing={2}>

                                        <Grid item xs={12} sm={6}>
                                            <TextField fullWidth label="Name" size="small"
                                                value={formData.drname}
                                                onChange={handleChange('patiendrnametName')}
                                                error={!formData.drname.trim()}
                                                helperText={!formData.drname.trim() && "Required"} />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <TextField fullWidth label="Designation" size="small"
                                                value={formData.designation}
                                                onChange={handleChange('designation')}
                                                error={!formData.designation.trim()}
                                                helperText={!formData.designation.trim() && "Required"} />
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

                                        <Grid item xs={12} sm={6}>
                                            <TextField fullWidth label="Institue Name" size="small"
                                                value={formData.instituteName}
                                                onChange={handleChange('instituteName')}
                                                error={!formData.instituteName.trim()}
                                                helperText={!formData.instituteName.trim() && "Required"} />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <TextField fullWidth size="small" id="outlined-number" label="Aadhar Number" type="number"
                                                value={formData.aadharNumber}
                                                onChange={handleChange("aadharNumber")}
                                                sx={{
                                                    // For Chrome, Safari, Edge
                                                    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                                                        WebkitAppearance: 'none',
                                                        margin: 0,
                                                    },
                                                    // For Firefox
                                                    '& input[type=number]': { MozAppearance: 'textfield' },
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={12}>
                                            <TextField fullWidth label="Biography" size="small"
                                                multiline
                                                rows={2}
                                                value={formData.biography}
                                                onChange={handleChange('biography')}
                                                error={!formData.biography.trim()}
                                                helperText={!formData.biography.trim() && "Required"} />
                                        </Grid>

                                    </Grid>
                                </>
                            )}

                            {activeStep === 1 && (
                                <>
                                    <MDBox
                                        sx={{ border: '2px dashed #bbb', borderRadius: 2, padding: 3, backgroundColor: '#f9f9f9', }} >
                                        <TextField type="file" fullWidth variant="standard"
                                            sx={{ mb: 3 }}
                                            inputProps={{ accept: "image/*", multiple: true }}
                                            onChange={handleImageChange}
                                        />

                                        <MDBox sx={{ textAlign: 'center', mb: 2 }}>
                                            {imagePreviews.length === 0 ? (
                                                <>
                                                    <img src={img} alt="Upload icon" width={60} style={{ marginBottom: 8 }} />
                                                    <MDTypography variant="h6" fontWeight="medium">
                                                        Upload images of Aadhar Card & Degree
                                                    </MDTypography>
                                                    <MDTypography variant="body2" color="text" mt={1}>
                                                        Choose your photos carefully. You can upload Max 5 photos
                                                    </MDTypography>
                                                </>
                                            ) : (
                                                <MDBox sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                                                    {imagePreviews.map((preview, idx) => (
                                                        <MDBox key={idx}
                                                            sx={{ position: 'relative', width: 80, height: 80, borderRadius: 2, overflow: 'hidden', border: '1px solid #ccc', }} >
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
                                </>
                            )}

                            {activeStep === 2 && (
                                <>
                                    <Grid container spacing={2}>

                                        <Grid item xs={12} sm={6}>
                                            <TextField fullWidth disabled label="Name" size="small"
                                                value={formData.drname}
                                                onChange={handleChange('patiendrnametName')}
                                                error={!formData.drname.trim()}
                                                helperText={!formData.drname.trim() && "Required"} />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <TextField fullWidth disabled label="Designation" size="small"
                                                value={formData.designation}
                                                onChange={handleChange('designation')}
                                                error={!formData.designation.trim()}
                                                helperText={!formData.designation.trim() && "Required"} />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <TextField fullWidth disabled size="small" id="outlined-number" label="Year's of experience" type="number"
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
                                            <TextField fullWidth disabled size="small" id="outlined-number" label="Patient's Checked" type="number"
                                                value={formData.patientchecked}
                                                onChange={handleChange("patientchecked")}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <TextField fullWidth disabled label="Institue Name" size="small"
                                                value={formData.instituteName}
                                                onChange={handleChange('instituteName')}
                                                error={!formData.instituteName.trim()}
                                                helperText={!formData.instituteName.trim() && "Required"} />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <TextField fullWidth disabled size="small" id="outlined-number" label="Aadhar Number" type="number"
                                                value={formData.aadharNumber}
                                                onChange={handleChange("aadharNumber")}
                                                sx={{
                                                    // For Chrome, Safari, Edge
                                                    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                                                        WebkitAppearance: 'none',
                                                        margin: 0,
                                                    },
                                                    // For Firefox
                                                    '& input[type=number]': { MozAppearance: 'textfield' },
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={12}>
                                            <TextField fullWidth disabled label="Biography" size="small"
                                                multiline
                                                rows={2}
                                                value={formData.biography}
                                                onChange={handleChange('biography')}
                                                error={!formData.biography.trim()}
                                                helperText={!formData.biography.trim() && "Required"} />
                                        </Grid>
                                    </Grid>
                                    <MDTypography fontSize="small">Aadhar Card & Degree</MDTypography>
                                    <MDBox sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                                        {imagePreviews.map((preview, idx) => (
                                            <MDBox key={idx}
                                                sx={{ position: 'relative', width: 80, height: 80, borderRadius: 2, overflow: 'hidden', border: '1px solid #ccc', }} >
                                                <img src={preview} alt={`Preview ${idx}`} width="100%" height="100%" style={{ objectFit: 'cover' }} />
                                            </MDBox>
                                        ))}
                                    </MDBox>
                                    <MDBox>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={agree}
                                                    onChange={(e) => setAgree(e.target.checked)}
                                                    name="terms"
                                                />
                                            }
                                            label={
                                                <MDTypography variant="body2">
                                                    I agree to the{' '}
                                                    <Link href="/terms" target="_blank" rel="noopener noreferrer">
                                                        &quot;Terms & Conditions&quot;
                                                    </Link>{' '}
                                                    and{' '}
                                                    <Link href="/privacy" target="_blank" rel="noopener noreferrer">
                                                        &quot;Privacy Policy&quot;
                                                    </Link>
                                                </MDTypography>
                                            }
                                        />
                                    </MDBox>
                                </>
                            )}

                            <MDBox sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                <MDButton variant="outlined" color="secondary" size="small"
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    sx={{ mr: 1 }}
                                >
                                    Back
                                </MDButton>
                                <MDBox sx={{ flex: '1 1 auto' }} />
                                {/* <MDButton variant="contained" color="primary" size="small" onClick={handleNext} sx={{ mr: 1 }}> Next </MDButton> */}
                                <MDButton variant="contained" color="primary" size="small" onClick={handleNext}>
                                    {isLastStep ? 'Submit' : 'Next'}
                                </MDButton>
                            </MDBox>
                        </Fragment>
                    </MDBox>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default DoctorManageModal