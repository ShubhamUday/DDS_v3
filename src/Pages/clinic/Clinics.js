import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import MDBox from "components/MDBox";
import { Card, Grid, Divider } from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneIcon from '@mui/icons-material/Phone';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { useNavigate } from 'react-router-dom';
import MDButton from "components/MDButton";
import AddIcon from '@mui/icons-material/Add';

function Clinics() {
    const role = localStorage.getItem("role");
    const [list, setList] = useState([]);
    const navigate = useNavigate();
    const drID = localStorage.getItem('doctorID');

    const handleAddClinic = () => {
        navigate(`/add-clinic/${drID}`);
    };

    const clinicList = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_HOS}/get-single-doctor/${drID}`, {
                headers: { 'Content-Type': 'application/json' },
            });
            setList(result.data.clinicID);
            console.log("data", result.data.clinicID);
        }
        catch (error) {
            console.log(error);
        }
    };

    const handleClick = (Id) => {
        if (role === "Doctor") {
            navigate(`/clinic-with-details/${Id}`);
        }
    };

    useEffect(() => {
        clinicList();
    }, []);

    return (
        <DashboardLayout>
            <DashboardNavbar />
            {/* Add Clinic Button */}
            <MDBox sx={{ padding: 3 }}>
                {role === "Doctor" && (
                    <MDBox display="flex" justifyContent="flex-end" mb={2} mx={2}>
                        <MDButton
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleAddClinic}
                            sx={{ textTransform: "none", borderRadius: 2 }}
                        >
                            Add Clinic
                        </MDButton>
                    </MDBox>
                )}

                <Grid container spacing={3}>
                    {list.map((e, index) => (
                        <Grid item xs={12} sm={6} key={index} onClick={() => handleClick(e._id)}>
                            <Card
                                sx={{
                                    padding: 2,
                                    backgroundColor: '#fff',
                                    borderRadius: 4,
                                    boxShadow: "0px 2px 0px #25408f",
                                    transition: "transform 0.3s, box-shadow 0.3s",
                                    transformOrigin: 'center',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: 2,
                                    },
                                }}>
                                <MDBox sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <MDBox sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
                                        <MDBox
                                            sx={{
                                                width: '40%',
                                                height: '135px',
                                                borderRadius: 3,
                                                overflow: 'hidden',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                backgroundColor: '#f5f5f5',
                                            }}
                                        >
                                            <img
                                                src={e?.imgarry[0]?.profile_url}
                                                alt={e.clinicname}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        </MDBox>

                                        <MDBox sx={{ width: '60%', display: 'flex', flexDirection: 'column' }}>
                                            {/* Clinic Name */}
                                            <MDBox sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                                                <LocalHospitalIcon sx={{ color: 'primary.main' }} />
                                                <MDTypography variant="body2" fontWeight="bold" sx={{ marginLeft: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {e.clinicname}
                                                </MDTypography>
                                            </MDBox>

                                            {/* Phone Number */}
                                            <MDBox sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                                                <PhoneIcon sx={{ color: 'secondary.main' }} />
                                                <MDTypography variant="body2" color="text" sx={{ marginLeft: 1 }}>
                                                    {e.phoneNumber || '9856214520'}
                                                </MDTypography>
                                            </MDBox>

                                            {/* Open Time */}
                                            <MDBox sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                                                <AccessTimeIcon sx={{ color: 'success.main' }} />
                                                <MDTypography variant="body2" color="text" sx={{ marginLeft: 1 }}>
                                                    {e.openTime}
                                                </MDTypography>
                                            </MDBox>

                                            {/* Close Time */}
                                            <MDBox sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                                                <AccessTimeIcon sx={{ color: 'error.main' }} />
                                                <MDTypography variant="body2" color="text" sx={{ marginLeft: 1 }}>
                                                    {e.closeTime}
                                                </MDTypography>
                                            </MDBox>
                                        </MDBox>
                                    </MDBox>
                                    <Divider sx={{ marginY: 2 }} />
                                    <MDBox sx={{ display: 'flex', alignItems: 'center' }}>
                                        <LocationOnIcon sx={{ color: 'primary.main' }} />
                                        <MDTypography
                                            variant="body2"
                                            color="text"
                                            sx={{
                                                marginLeft: 1,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {e.clinicAddress}
                                        </MDTypography>
                                    </MDBox>
                                </MDBox>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </MDBox>
        </DashboardLayout>
    );
}

export default Clinics;
