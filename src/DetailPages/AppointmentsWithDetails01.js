import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Grid, CircularProgress, Alert, Divider, IconButton, MenuItem, Menu, Checkbox, List, ListItem, ListItemIcon, ListItemText, DialogTitle, DialogContent, Dialog, FormControlLabel } from '@mui/material';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from "components/MDButton";
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import calendarIcon from 'assets/images/schedule-calendar-and-blue-clock-18292.png'
import { EditOutlined, FamilyRestroomOutlined, VisibilityOutlined, PrintOutlined, DownloadOutlined, UpgradeOutlined, MoreVertOutlined, CheckOutlined, Male, Female } from '@mui/icons-material';
import PatientFormModal from 'Pages/patient/PatientFormModal';
import PaymentFormModal from 'Pages/payment/PaymentFormModal';
import moment from 'moment';
import { CloseOutlined } from '@mui/icons-material'
import Switch from '@mui/material/Switch';
import { toast } from 'react-toastify';


const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

// const previousAppointments = [
//     { id: "1", treatmentFor: "Back Pain", date: "2025-06-05", doctor: "Dr. Smith" },
//     { id: "2", treatmentFor: "Migraine", date: "2025-05-22", doctor: "Dr. Lee" },
//     { id: "3", treatmentFor: "Physiotherapy", date: "2025-05-10", doctor: "Dr. Patel" },
// ];

const prescriptions = [
    { date: "2025-06-01" },
    { date: "2025-05-25" },
    { date: "2025-05-15" },
];

const familyMembers = [
    { name: 'John Doe', relation: 'Father', gender: 'Male' },
    { name: 'Jane Doe', relation: 'Mother', gender: 'Female' },
    { name: 'Sarah Doe', relation: 'Sister', gender: 'Female' },
    { name: 'Alex Doe', relation: 'Brother', gender: 'Male' },
];


function AppointmentsWithDetails01() {
    // const params = useParams();
    // const param1 = params.id;
    const { id: param1 } = useParams();
    const [appointmentData, setAppointmentData] = useState({});
    const [isPatientModalOpen, setIsPatientModalOpen] = useState(false)
    const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false)
    const [isPaymentUpdateModalOpen, setIsPaymentUpdateModalOpen] = useState(false)

    const getDetails = async () => {
        if (!param1) return; // avoid calling API if param1 is undefined

        try {
            const result = await axios.get(
                `${process.env.REACT_APP_HOS}/get-single-appointment-with-details/${param1}`,
                { headers: { 'Content-Type': 'application/json' } }
            );
            setAppointmentData(result.data);
        } catch (error) {
            toast.error("Something went wrong")
        }
    };

    useEffect(() => {
        getDetails();
    }, []);


    console.log('Appointment Data', appointmentData)
    console.log('status', appointmentData?.requestStatus)
    console.log("param1", param1)

    return (
        <DashboardLayout>

            {/* IDs Section */}
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <MDTypography variant="button" fontWeight="bold" color='info'>Booking ID</MDTypography>
                    <MDTypography fontSize="medium" color="text">{appointmentData?._id}</MDTypography>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <MDTypography variant="button" fontWeight="bold" color='info'>Patient ID</MDTypography>
                    <MDTypography fontSize="medium" color="text">{appointmentData?.userID?._id}</MDTypography>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <MDTypography variant="button" fontWeight="bold" color='info'>Family ID</MDTypography>
                    <MDTypography fontSize="medium" color="text">{appointmentData?.userID?._id}</MDTypography>
                </Grid>
            </Grid>

            <Divider />

            <MDBox display="flex" justifyContent="space-between">
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <MDBox borderRadius="lg" m={0.5} p={0.5}
                            sx={{ border: '1px solid #d2d4d6', backgroundColor: '#f9f9f9', }} >
                            <MDTypography fontSize="medium" textAlign="center" color="white"
                                sx={{ backgroundColor: '#25408f', borderRadius: 1, fontWeight: 'bold', letterSpacing: '0.5px', }} >
                                Reason / Symptoms
                            </MDTypography>

                            <MDTypography fontSize="medium" sx={{ ml: 1, color: '#333', lineHeight: 1.6 }} >
                                {appointmentData?.ProblemDetails || 'N/A'}
                            </MDTypography>


                        </MDBox>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <MDBox borderRadius="lg" m={0.5} p={0.5}
                            sx={{ border: '1px solid #d2d4d6', backgroundColor: '#f9f9f9', }} >

                            <MDTypography fontSize="medium" textAlign="center" color="white"
                                sx={{ backgroundColor: '#25408f', borderRadius: 1, fontWeight: 'bold', letterSpacing: '0.5px', }} >
                                Treatment
                            </MDTypography>

                            <MDTypography fontSize="medium" sx={{ ml: 1, color: '#333', lineHeight: 1.6 }} >
                                {appointmentData?.Treatmentfor || 'N/A'}
                            </MDTypography>
                        </MDBox>
                    </Grid>

                    <Grid item xs={12} md={12}>
                        <MDBox borderRadius="lg" m={0.5} p={0.5} sx={{ border: '1px solid #d2d4d6' }}>
                            <MDTypography fontSize="medium" textAlign="center" color='white'
                                sx={{ backgroundColor: '#25408f', borderRadius: 1, fontWeight: 'bold', letterSpacing: '0.5px' }}>
                                Last 3 Prescriptions </MDTypography>

                            {appointmentData?.prescriptionID?.length > 0 ? (
                                <>
                                    {appointmentData.prescriptionID.slice(0, 3).map((med, index) => (
                                        <MDTypography key={index} fontSize="medium"
                                            sx={{ color: '#333', lineHeight: 1.6, ml: 2, display: 'flex', alignItems: 'center' }}
                                        >
                                            <MDBox component="span" sx={{ mr: 1 }}>•</MDBox> {med.medicinename}
                                        </MDTypography>
                                    ))}
                                    {appointmentData.prescriptionID.length > 4 && (
                                        <MDTypography fontSize="medium" ml={2}> + {appointmentData.prescriptionID.length - 2} more </MDTypography>
                                    )}
                                    {appointmentData?.prescriptionID?.length > 0 && (
                                        <MDBox mt={2} textAlign="right" mr={1}>
                                            <MDButton
                                                size="small"
                                                href={`/prescription-with-details/${appointmentData._id}`}
                                                color="info"
                                                variant="outlined"
                                                fontWeight="small"
                                                sx={{
                                                    mb: 1,
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                View Full →
                                            </MDButton>
                                        </MDBox>
                                    )}
                                </>
                            ) : (
                                <>

                                </>
                            )}
                        </MDBox>
                    </Grid>
                </Grid>
            </MDBox>



            {isPatientModalOpen && (
                <PatientFormModal
                    selectedAppointment={appointmentData}
                    isPatientModalOpen={isPatientModalOpen}
                    setIsPatientModalOpen={setIsPatientModalOpen}
                    getDetails={getDetails}
                />
            )}

        </DashboardLayout>
    )
}

export default AppointmentsWithDetails01