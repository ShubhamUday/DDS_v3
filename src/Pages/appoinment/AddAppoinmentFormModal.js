import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { styled } from '@mui/material/styles';
import { Card, Divider, Grid, Modal, Stack, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material'
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';
import { Schedule } from '@mui/icons-material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneIcon from '@mui/icons-material/Phone';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DateTimePicker } from '@mui/x-date-pickers';
// momentObj = moment(); // example from a DateTimePicker


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


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    maxHeight: 700,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 3,
    p: 3,
    overflowY: 'auto',
};


const AddAppoinmentFormModal = ({ isAppoinmentModalOpen, setIsAppoinmentModalOpen }) => {
    const drID = localStorage.getItem('doctorID');
    const [clinicList, setClinicList] = useState([]);
    const [selectedClinic, setSelectedClinic] = useState(null);
    const [formData, setFormData] = useState({
        doctorID: "",
        patientName: "",
        phone: "",
        gender: "",
        age: "",
        Weight: "",
        treatmentFor: "",
        ProblemDetails: "",
        diabetes: "",
        Bloodpressure: "",
        plan: "",
        Bookdate: "",
        BookTime: "",
        PayType: "",
        clinicID: "",
    });


    console.log('date', formData.Bookdate)
    console.log('form data', formData)

    const fetchClinicList = async () => {
        try {
            const result = await axios.get(
                `${process.env.REACT_APP_HOS}/get-single-doctor/${drID}`,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            setClinicList(result.data.clinicID);
            console.log('clinic daa', result)
        } catch (error) {
            console.log(error);
        }
    };

    const handleClinicSelect = (clinic) => {
        setSelectedClinic(clinic._id);
        setFormData((prev) => ({
            ...prev,
            doctorID: drID,
            clinicID: clinic._id,
        }));
    };

    // Handlers
    const handleClose = () => { setIsAppoinmentModalOpen(false) }

    const handleChange = (field) => (e) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
    };


    const handleScheduleChange = (momentObj) => {
        if (!momentObj || !momentObj.isValid()) return;

        setFormData((prev) => ({
            ...prev,
            Bookdate: momentObj.toISOString(),              // ISO format: "2024-07-30T12:30:00.000Z"
            BookTime: momentObj.format("h:mm A"),           // Time format: "6:00 PM"
        }));
    };


    const handleSubmit = async () => {
        const { patientName, age, gender, treatmentFor, ProblemDetails, Bookdate, clinicID } = formData;
        if (
            !patientName.trim() ||
            !age ||
            !gender ||
            !treatmentFor.trim() ||
            !ProblemDetails.trim() ||
            !Bookdate ||
            !clinicID
        ) {
            alert("Please fill all required fields: Name, Age, Gender, Treatment, Problem, Schedule, Clinic.");
            return;
        }
        try {
            const result = await axios.post(`${process.env.REACT_APP_HOS}/book-appointment-without-user`, formData, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (result.data) {
                console.log('axios reslu', result.data)
                resetForm()
                setIsAppoinmentModalOpen(false)
            }
            alert('Appointment booked sucsessfully!');
        } catch (error) {
            alert("Something went wrong");
            console.log(error)
        }
    };

    const resetForm = () => {
        setFormData({
            doctorID: "",
            patientName: "",
            phone: "",
            gender: "",
            age: "",
            Weight: "",
            treatmentFor: "",
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
        fetchClinicList();
        setFormData
    }, []);



    return (
        <>
            <Modal open={isAppoinmentModalOpen} onClose={handleClose}>
                <MDBox sx={style}>
                    <MDTypography variant="h6" mb={2} fontWeight="bold"> Add Appoinment </MDTypography>

                    <Divider />

                    <Stack spacing={2}>
                        <Grid container>
                            <Grid item xs={12} sm={6}>
                                <MDBox display="flex" mb={1} mr={2}>
                                    {/* <MDTypography variant="subtitle2"  color="textPrimary" mt={0.5} mr={1}> Name </MDTypography> */}
                                    <TextField required fullWidth label="Name" size="small"
                                        value={formData.patientName}
                                        onChange={handleChange('patientName')}
                                        error={!formData.patientName.trim()}
                                        helperText={!formData.patientName.trim() && "Required"} />
                                </MDBox>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth size="small" id="outlined-number" label="Phone Number" type="number"
                                    value={formData.phone}
                                    onChange={handleChange("phone")}
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
                        </Grid>

                        <Grid container>
                            <Grid item xs={12} sm={4}>
                                <MDBox display="flex" ml={3}>
                                    {/* <MDTypography variant="subtitle2" color="textPrimary" mt={0.5} mr={1}> Gender </MDTypography> */}
                                    <ToggleButtonGroup
                                        size="small"
                                        color="primary"
                                        value={formData.gender}
                                        exclusive
                                        onChange={handleChange('gender')}
                                    >
                                        <StyledToggleButton value="Male"> Male </StyledToggleButton>
                                        <StyledToggleButton value="Female"> Female </StyledToggleButton>
                                    </ToggleButtonGroup>
                                </MDBox>

                            </Grid>

                            <Grid item xs={12} sm={4}>
                                {/* <MDTypography variant="subtitle2" color="textPrimary" mt={0.5} mr={1}> Age </MDTypography> */}
                                <TextField size="small" id="outlined-number" label="Age" type="number"
                                    value={formData.age}
                                    onChange={handleChange('age')}
                                    error={!formData.age}
                                    helperText={!formData.age && "Required"}
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
                            <Grid item xs={12} sm={4}>
                                <MDBox display="flex">
                                    {/* <MDTypography variant="subtitle2" color="textPrimary" mt={0.5} ml={1} mr={1}> Weight </MDTypography> */}
                                    <TextField label="Weight" size="small" type="number"
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
                                        }}
                                    />
                                </MDBox>
                            </Grid>

                        </Grid>


                        <Grid container>
                            <Grid item xs={12} sm={12}>
                                <MDBox display="flex" mb={1}>
                                    {/* <MDTypography variant="subtitle2" color="textPrimary" mt={0.5} mr={1}> Treatment </MDTypography> */}
                                    <TextField label="Treatment" size="small" fullWidth
                                        value={formData.treatmentFor}
                                        onChange={handleChange('treatmentFor')}
                                        error={!formData.treatmentFor.trim()}
                                        helperText={!formData.treatmentFor.trim() && "Required"} />

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
                                    <StyledToggleButton value="Tooth Pain"> Tooth Pain </StyledToggleButton>
                                    <StyledToggleButton value="Brace"> Brace </StyledToggleButton>
                                    <StyledToggleButton value="Crown"> Crown </StyledToggleButton>
                                    <StyledToggleButton value="Bridge"> Bridge </StyledToggleButton>
                                    <StyledToggleButton value="Tooth Ache"> Tooth Ache </StyledToggleButton>
                                </ToggleButtonGroup>
                            </Grid>
                        </Grid>


                        <MDBox display="flex">
                            {/* <MDTypography variant="subtitle2" mt={0.5} mr={1}>Problem</MDTypography> */}
                            <TextField fullWidth label="Problem" size="small"
                                value={formData.ProblemDetails}
                                onChange={handleChange('ProblemDetails')}
                                error={!formData.ProblemDetails.trim()}
                                helperText={!formData.ProblemDetails.trim() && "Required"}
                            />
                        </MDBox>

                        <MDTypography variant="h6" color="text" fontWeight="medium" gutterBottom> Clinics </MDTypography>
                        <Grid container>
                            <Grid container spacing={2}>
                                {clinicList.map((clinic, index) => (
                                    <Grid item xs={12} sm={6} key={index} onClick={() => handleClinicSelect(clinic)}>
                                        <Card
                                            sx={{
                                                cursor: 'pointer',
                                                borderRadius: 2,
                                                border: selectedClinic === clinic._id ? '2px solid #7e57c2' : '1px solid #e0e0e0',
                                                backgroundColor: selectedClinic === clinic._id ? '#f3e5f5' : '#fff',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: 4,
                                                    backgroundColor: '#fafafa',
                                                },
                                            }}
                                        >
                                            <MDBox sx={{ display: 'flex', padding: 1.5, gap: 2 }}>
                                                {/* Clinic Image */}
                                                <MDBox sx={{ width: 70, height: 70, borderRadius: 2, overflow: 'hidden', flexShrink: 0 }}>
                                                    <img
                                                        src={clinic.imgarry[0]?.profile_url}
                                                        alt={clinic.clinicname}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                </MDBox>

                                                {/* Clinic Info */}
                                                <MDBox sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                    <MDTypography variant="body2" fontWeight="bold">
                                                        {clinic.clinicname}
                                                    </MDTypography>

                                                    <MDTypography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <PhoneIcon fontSize="inherit" color="secondary" /> {clinic.phone || 'N/A'}
                                                    </MDTypography>

                                                    <MDTypography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <AccessTimeIcon fontSize="inherit" color="success" /> {clinic.openTime} - {clinic.closeTime}
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
                                                        <LocationOnIcon fontSize="inherit" color="info" /> {clinic.clinicAddress}
                                                    </MDTypography>
                                                </MDBox>
                                            </MDBox>
                                        </Card>
                                    </Grid>

                                ))}
                            </Grid>
                        </Grid>

                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DateTimePicker
                                label="Schedule"
                                value={formData.Bookdate}
                                onChange={handleScheduleChange}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </LocalizationProvider>

                        <Grid container>
                            <Grid item xs={12} sm={6}>
                                {/* Diabities */}
                                <MDBox display="flex">
                                    <MDTypography variant="subtitle2" color="textPrimary" mt={0.5} mr={1}> Diabities </MDTypography>
                                    <ToggleButtonGroup
                                        size="small"
                                        color="primary"
                                        value={formData.diabetes}
                                        exclusive
                                        onChange={handleChange('diabetes')}

                                    >
                                        <StyledToggleButton value="Yes"> Yes </StyledToggleButton>
                                        <StyledToggleButton value="No"> No </StyledToggleButton>
                                        <StyledToggleButton value="Pre"> Pre </StyledToggleButton>
                                    </ToggleButtonGroup>
                                </MDBox>
                            </Grid>
                            <Grid item xs={12} sm={6}>

                                <MDBox display="flex">
                                    <MDTypography variant="subtitle2" color="textPrimary" mt={0.5} mr={1}> Blood Pressure </MDTypography>
                                    <ToggleButtonGroup
                                        size="small"
                                        color="primary"
                                        value={formData.Bloodpressure}
                                        exclusive
                                        onChange={handleChange('Bloodpressure')}

                                    >
                                        <StyledToggleButton value="Yes"> Yes </StyledToggleButton>
                                        <StyledToggleButton value="No"> No </StyledToggleButton>
                                    </ToggleButtonGroup>
                                </MDBox>
                            </Grid>
                        </Grid>

                        <Grid container>
                            <Grid item xs={12} sm={6}>
                                <MDBox display="flex">
                                    <MDTypography variant="subtitle2" color="textPrimary" mt={0.5} mr={1}> Plan </MDTypography>
                                    <ToggleButtonGroup
                                        size="small"
                                        color="primary"
                                        value={formData.plan}
                                        exclusive
                                        onChange={handleChange('plan')}

                                    >
                                        <StyledToggleButton value="online"> Online </StyledToggleButton>
                                        <StyledToggleButton value="inClinic"> In-Clinic </StyledToggleButton>
                                    </ToggleButtonGroup>
                                </MDBox>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <MDBox display="flex">
                                    <MDTypography variant="subtitle2" color="textPrimary" mt={0.5} mr={1}> Payment </MDTypography>
                                    <ToggleButtonGroup
                                        size="small"
                                        color="primary"
                                        value={formData.PayType}
                                        exclusive
                                        onChange={handleChange('PayType')}

                                    >
                                        <StyledToggleButton value="online"> Paid </StyledToggleButton>
                                        <StyledToggleButton value="inClinic"> In-Clinic </StyledToggleButton>
                                    </ToggleButtonGroup>
                                </MDBox>
                            </Grid>
                        </Grid>

                        <Divider />

                        {/* Buttons */}
                        <MDBox display="flex" justifyContent="flex-end" gap={1}>
                            <MDButton variant="outlined" color="error" size="small" onClick={handleClose}> Cancel </MDButton>
                            <MDButton variant="contained" color="success" size="small" onClick={handleSubmit}> Book </MDButton>
                        </MDBox>
                    </Stack>

                </MDBox>
            </Modal>
        </>
    )
}

export default AddAppoinmentFormModal