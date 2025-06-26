import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import { Card, Chip, Dialog, DialogContent, DialogTitle, Divider, Grid, IconButton, Modal, Stack, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material'
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneIcon from '@mui/icons-material/Phone';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import LockIcon from '@mui/icons-material/Lock';
import CloseIcon from '@mui/icons-material/Close';


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

const AddAppointmentFormModal = ({ isAppointmentModalOpen, setIsAppointmentModalOpen, getAllAppointments, selectedAppointment, formType }) => {
    const drID = localStorage.getItem('doctorID');
    const [clinicList, setClinicList] = useState([]);
    const [selectedClinic, setSelectedClinic] = useState(null);
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [intervalArray, setIntervalArray] = useState([]);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [availableTime, setAvailableTime] = useState(null);
    const [bookTimenew, setBookTimenew] = useState(null);

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
        plan: "",
        Bookdate: "",
        BookTime: "",
        PayType: "",
        clinicID: "",
    });

    // Helper
    const extractHour = (timeStr) => {
        if (!timeStr || typeof timeStr !== 'string') {
            console.warn("Invalid time string:", timeStr);
            return 0; // or return null if you want to skip
        }
        const [time, modifier] = timeStr.split(' ');
        if (!time || !modifier) {
            console.warn("Time or modifier missing:", timeStr);
            return 0;
        }
        let [hours, minutes] = time.split(':');

        hours = parseInt(hours, 10);

        if (modifier === 'PM' && hours !== 12) {
            hours += 12;
        }
        if (modifier === 'AM' && hours === 12) {
            hours = 0;
        }
        return hours;
    };

    // const normalizeTime = (time) => {
    //     const date = new Date(`1970-01-01T${time}`);
    //     return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    // };

    const handleClose = () => { setIsAppointmentModalOpen(false); resetForm() }

    const handleChange = (field) => (e) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const fetchClinicList = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_HOS}/get-single-doctor/${drID}`,
                { headers: { 'Content-Type': 'application/json' }, }
            );
            setClinicList(result.data.clinicID);
            // console.log('clinic daa', result)
        } catch (error) {
            console.log(error);
        }
    };

    const handleClinicSelect = (clinic) => {
        console.log("clinic hndlr", clinic)
        setSelectedClinic(clinic);
        setFormData((prev) => ({
            ...prev,
            doctorID: drID,
            clinicID: clinic._id,
        }));
        generateTimeIntervals(clinic?.openTime, clinic?.closeTime)
    };

    const generateTimeIntervals = (openTime, closeTime) => {
        const finalStarttime = extractHour(openTime);
        const finalEndtime = extractHour(closeTime);

        const intervals = [];

        const startTime = new Date();
        startTime.setHours(finalStarttime, 0, 0, 0);

        const endTime = new Date();
        endTime.setHours(finalEndtime, 0, 0, 0);

        let currentTime = new Date(startTime);

        while (currentTime <= endTime) {
            const hours24 = currentTime.getHours();
            const hours12 = hours24 % 12 || 12;
            const minutes = currentTime.getMinutes().toString().padStart(2, '0');
            const ampm = hours24 < 12 ? 'AM' : 'PM';

            intervals.push({
                label: `${hours12}:${minutes} ${ampm}`,
                value: { hours: hours24, minutes: currentTime.getMinutes() },
            });

            currentTime.setMinutes(currentTime.getMinutes() + 15);
        }
        setIntervalArray(intervals);
    }

    const handleScheduleChange = (momentObj) => {

        console.log('DatePicker changed:', momentObj?.format("YYYY-MM-DD"));

        const formattedDate = momentObj.format('YYYY-MM-DD');

        if (!momentObj || !momentObj.isValid()) return;

        setFormData((prev) => ({
            ...prev,
            Bookdate: formattedDate,
        }));
        setShowTimePicker(true)
        getBookedSlots(formattedDate)
    };

    // const isSlotBooked = (time) => {
    //     console.log('intervalArray', time)
    //     return bookedSlots.map(normalizeTime).includes(normalizeTime(time));
    // };

    const isSlotBooked = (time) => bookedSlots.includes(time);

    const getBookedSlots = async (selectedDate) => {
        if (!selectedDate) return;
        console.log("Fetching slots for:", selectedDate);

        try {
            const result = await axios.get(`${process.env.REACT_APP_HOS}/get-booked-slots/${drID}/${selectedDate}`)
            console.log('API get booked slots', result.data)

            const data = result.data
            if (Array.isArray(data)) {
                setBookedSlots(data.map(appt => appt.BookTime));
            } else if (data.appointments) {
                setBookedSlots(data.appointments.map(appt => appt.BookTime));
            } else {
                setBookedSlots([]);
            }
        } catch (error) {
            console.error('Error fetching booked slots:', error);
        }
    }

    const handleSubmit = async () => {
        setSubmitAttempted(true)
        const { patientName, age, gender, Treatmentfor, ProblemDetails, Bookdate, clinicID } = formData;
        if (!patientName.trim() || !age || !gender || !Treatmentfor.trim() || !ProblemDetails.trim() || !Bookdate || !clinicID) {
            toast.error("Please fill all required fields: Name, Age, Gender, Treatment, Problem, Schedule, Clinic.");
            return;
        }
        try {
            const result = await axios.post(`${process.env.REACT_APP_HOS}/book-appointment-without-user`, formData, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (result.data) {
                console.log('axios reslu', result.data)
                resetForm()
                setIsAppointmentModalOpen(false)
                getAllAppointments()
                toast.success('Appointment booked sucsessfully!');
            }
        } catch (error) {
            toast.error("Something went wrong");
            console.log(error)
        }
    };

    const handleUpdate = async () => {
        try {
            const result = await axios.put(`${process.env.REACT_APP_HOS}/update-Appointment-Details/${selectedAppointment._id}`, formData, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (result.data) {
                console.log('axios reslu', result.data)
                resetForm()
                setIsAppointmentModalOpen(false)
                getAllAppointments()
                toast.success('Appointment rescheduled sucsessfully!');
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

    const initialValues = () => {
        const data = selectedAppointment
        setFormData({
            doctorID: data?.doctorID || "",
            userID: data?.userID?._id || "",
            patientName: data?.userID?.name || data?.patientName || "",
            phone: data?.userID?.number || data?.phone || "",
            gender: data?.userID?.gender || data?.gender || "",
            age: data?.userID?.age || data?.age || "",
            Weight: data?.userID?.weight || data?.Weight || "",
            Treatmentfor: data?.Treatmentfor || "",
            ProblemDetails: data?.ProblemDetails || "",
            diabetes: data?.diabetes || "",
            Bloodpressure: data?.Bloodpressure || "",
            plan: data?.plan || "",
            Bookdate: data?.Bookdate || "",
            BookTime: data?.BookTime || "",
            PayType: data?.PayType || "",
            clinicID: data?.clinicID || "",
        })
        setSelectedClinic(data?.clinicID)
        generateTimeIntervals(data?.clinicID?.openTime, data?.clinicID?.closeTime)
    }

    console.log("intervals", intervalArray)
    console.log("selected appotn", selectedAppointment)

    useEffect(() => {
        fetchClinicList();
        if (formType === "edit") {
            initialValues()
        }
    }, [selectedAppointment]);

    return (
        <>
            <Dialog open={isAppointmentModalOpen} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title"> Add Appoinment </DialogTitle>
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
                    <CloseIcon />
                </IconButton>
                <DialogContent
                    sx={{ p: 0, overflow: 'hidden' }} >
                    <MDBox
                        sx={{
                            maxHeight: '80vh',
                            overflowY: 'auto',
                            px: 3,
                            py: 2,
                            borderRadius: '12px',
                        }}
                    >
                        {/* <MDTypography variant="h6" mb={2} fontWeight="bold"> Add Appoinment </MDTypography>

                        <Divider /> */}

                        <Grid container spacing={2}>
                            {/* Name */}
                            <Grid item xs={12} sm={6}>
                                <MDBox display="flex" >
                                    {/* <MDTypography variant="subtitle2"  color="textPrimary" mt={0.5} mr={1}> Name </MDTypography> */}
                                    <TextField fullWidth label="Name" size="small"
                                        value={formData.patientName}
                                        onChange={handleChange('patientName')}
                                        error={submitAttempted && !formData.patientName.trim()}
                                        helperText={submitAttempted && !formData.patientName.trim() && "Required"} />
                                </MDBox>
                            </Grid>
                            {/* Phone Number */}
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

                            {/* Gender */}
                            <Grid item xs={12} sm={4}>
                                <MDBox display="flex">
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

                            {/* Age */}
                            <Grid item xs={12} sm={4}>
                                <TextField size="small" id="outlined-number" label="Age" type="number"
                                    value={formData.age}
                                    onChange={handleChange('age')}
                                    error={submitAttempted && !formData.age}
                                    helperText={submitAttempted && !formData.age && "Required"}
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

                            {/* Weight */}
                            <Grid item xs={12} sm={4}>
                                <MDBox display="flex" justifyContent="flex-end">
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

                            {/* Treatment */}
                            <Grid item xs={12} sm={12}>
                                <MDBox display="flex" mb={1}>
                                    {/* <MDTypography variant="subtitle2" color="textPrimary" mt={0.5} mr={1}> Treatment </MDTypography> */}
                                    <TextField label="Treatment" size="small" fullWidth
                                        value={formData.Treatmentfor}
                                        onChange={handleChange('Treatmentfor')}
                                        error={submitAttempted && !formData.Treatmentfor.trim()}
                                        helperText={submitAttempted && !formData.Treatmentfor.trim() && "Required"} />

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
                                    <StyledToggleButton value="Tooth Pain"> Tooth Pain </StyledToggleButton>
                                    <StyledToggleButton value="Braces"> Brace </StyledToggleButton>
                                    <StyledToggleButton value="Crown"> Crown </StyledToggleButton>
                                    <StyledToggleButton value="Bridges"> Bridge </StyledToggleButton>
                                    <StyledToggleButton value="Tooth Ache"> Tooth Ache </StyledToggleButton>
                                </ToggleButtonGroup>
                            </Grid>

                            {/* Problem */}
                            <Grid item xs={12} sm={12}>
                                {/* <MDTypography variant="subtitle2" mt={0.5} mr={1}>Problem</MDTypography> */}
                                <TextField fullWidth label="Problem" size="small"
                                    value={formData.ProblemDetails}
                                    onChange={handleChange('ProblemDetails')}
                                    error={submitAttempted && !formData.ProblemDetails.trim()}
                                    helperText={submitAttempted && !formData.ProblemDetails.trim() && "Required"}
                                />
                            </Grid>

                            {/* Select Clinic */}
                            <Grid item xs={12} sm={12}>
                                <MDTypography variant="h6" gutterBottom> Clinics </MDTypography>
                                <Grid container spacing={2}>
                                    {clinicList.map((clinic, index) => (
                                        <Grid item xs={12} sm={6} key={index} onClick={() => handleClinicSelect(clinic)}>
                                            <Card
                                                sx={{
                                                    cursor: 'pointer',
                                                    borderRadius: 2,
                                                    border: selectedClinic?._id === clinic._id ? '2px solid #7e57c2' : '1px solid #e0e0e0',
                                                    backgroundColor: selectedClinic?._id === clinic._id ? '#f3e5f5' : '#fff',
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

                            {/* Select Date */}
                            <Grid item xs={12} sm={12}>
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                    <DatePicker
                                        // disablePast
                                        label="Schedule"
                                        value={formData.Bookdate ? moment(formData.Bookdate) : null}
                                        minDate={moment()} // today
                                        maxDate={moment().add(20, "days")} // today + 20 days
                                        onChange={handleScheduleChange}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                fullWidth
                                                error={submitAttempted && !formData.Bookdate}
                                                helperText={submitAttempted && !formData.Bookdate && "Required"}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                            </Grid>

                            {/* Select Slot */}
                            <Grid item xs={12} sm={12}>
                                {showTimePicker && (
                                    <MDBox sx={{ mt: 2 }}>
                                        <MDTypography variant="h6" gutterBottom> Available Slot </MDTypography>
                                        <MDBox sx={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 2,
                                            justifyContent: 'center', // or 'flex-start' for left alignment
                                        }}>
                                            {intervalArray.map((interval, index) => {
                                                const isBooked = isSlotBooked(interval.label);
                                                // console.log('isBooked', isBooked)

                                                return (
                                                    <MDButton
                                                        key={index}
                                                        variant={
                                                            isBooked ? "contained"
                                                                : availableTime === interval.label ? "contained" : "outlined"
                                                        }
                                                        color={isBooked ? "error" : "primary"}
                                                        disabled={isBooked}
                                                        onClick={() => {
                                                            if (!isBooked) {
                                                                setAvailableTime(interval.label);
                                                                setBookTimenew(interval.label);
                                                                setFormData((prev) => ({
                                                                    ...prev,
                                                                    BookTime: interval.label,
                                                                }));
                                                            }
                                                        }}
                                                        sx={{
                                                            width: isBooked ? 160 : 100,
                                                            height: 20,
                                                            fontWeight: isBooked ? 'bold' : 'normal',
                                                            whiteSpace: 'nowrap', flexShrink: 0
                                                        }}
                                                    >
                                                        <MDTypography
                                                            variant="button"
                                                            sx={{
                                                                textDecoration: isBooked ? 'line-through' : 'none',
                                                                fontWeight: 'bold',
                                                                color: isBooked ? '#fff' : availableTime === interval.label ? "#fff" : 'normal',
                                                            }}
                                                        >
                                                            {interval.label}
                                                        </MDTypography>
                                                        {isBooked && (
                                                            <MDBox
                                                                sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    // gap: 0.5,
                                                                    backgroundColor: '#ff6b6b',
                                                                    color: '#fff',
                                                                    borderRadius: '5px',
                                                                    padding: '2px 8px',
                                                                    fontSize: '12px',
                                                                    fontWeight: 'bold',
                                                                    textDecoration: 'none !important',
                                                                    ml: 1,
                                                                }}
                                                            >
                                                                <LockIcon sx={{ fontSize: 14 }} />
                                                                Booked
                                                            </MDBox>
                                                        )}
                                                    </MDButton>
                                                );
                                            })}
                                        </MDBox>
                                    </MDBox>
                                )}
                            </Grid>

                            <Divider />

                            {/* Diabities */}
                            <Grid item xs={12} sm={6}>
                                <MDBox display="flex">
                                    <MDTypography variant="subtitle2" color="Primary" mt={0.5} mr={1}> Diabities </MDTypography>
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

                            {/* Blood Pressure */}
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

                            {/* Plan */}
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

                            {/* Payment */}
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

                            <Divider />

                            {/* Buttons */}
                            <Grid item xs={12} sm={12}>
                                <MDBox display="flex" justifyContent="flex-end" gap={1}>
                                    <MDButton variant="outlined" color="error" size="small" onClick={handleClose}> Cancel </MDButton>
                                    {formType === "add" ? (
                                        <MDButton variant="contained" color="success" size="small" onClick={handleSubmit}> Book </MDButton>
                                    ) : (
                                        <MDButton variant="contained" color="success" size="small" onClick={handleUpdate}> Update </MDButton>
                                    )}
                                </MDBox>
                            </Grid>
                        </Grid>

                    </MDBox>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default AddAppointmentFormModal