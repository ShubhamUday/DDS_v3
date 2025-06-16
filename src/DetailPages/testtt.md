
            const drID = localStorage.getItem('doctorID');
    const [clinicList, setClinicList] = useState([]);
    const [selectedClinic, setSelectedClinic] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        gender: "",
        age: "",
        weight: "",
        treatmentFor: "",
        problem: "",
        diabities: "",
        bloodPressure: "",
        plan: "",
        schedule: "",
        payment: "",
    });

    
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
    };

    // Handlers
    const handleClose = () => { setIsAppoinmentModalOpen(false) }

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
        fetchClinicList();
    }, []);


---------------------------------------------------------------------------------------------------------------------------------------------


<Modal open={isAppoinmentModalOpen} onClose={handleClose}>
                <MDBox sx={style}>
                    <MDTypography variant="h6" mb={2} fontWeight="bold"> Add Appoinment</MDTypography>

                    <Divider />
                    <Stack spacing={2}>
                        <Grid container>
                            <Grid item xs={12} sm={6}>
                                <MDBox display="flex" mb={1} mr={2}>
                                    {/* <MDTypography variant="subtitle2"  color="textPrimary" mt={0.5} mr={1}> Name </MDTypography> */}
                                    <TextField label="Name" size="small" fullWidth value={formData.name} onChange={handleToggleChange('name')} />
                                </MDBox>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <MDBox display="flex">
                                    {/* <MDTypography variant="subtitle2" color="textPrimary" mt={0.5} mr={1}> Gender </MDTypography> */}
                                    <ToggleButtonGroup
                                        size="small"
                                        color="primary"
                                        value={formData.gender}
                                        exclusive
                                        onChange={handleToggleChange('gender')}

                                    >
                                        <StyledToggleButton value="Male">Male</StyledToggleButton>
                                        <StyledToggleButton value="Female">Female</StyledToggleButton>
                                    </ToggleButtonGroup>
                                </MDBox>
                            </Grid>
                        </Grid>

                        <Grid container>
                            <Grid item xs={12} sm={6}>
                                {/* <MDTypography variant="subtitle2" color="textPrimary" mt={0.5} mr={1}> Age </MDTypography> */}
                                <TextField size="small" id="outlined-number" label="Age" type="number"
                                    value={formData.age}
                                    onChange={handleChange('age')}
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
                                <MDBox display="flex">
                                    {/* <MDTypography variant="subtitle2" color="textPrimary" mt={0.5} ml={1} mr={1}> Weight </MDTypography> */}
                                    <TextField label="Weight" size="small" type="number"
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
                                        }}
                                    />
                                </MDBox>
                            </Grid>

                        </Grid>


                        <Grid container>
                            <Grid item xs={12} sm={12}>
                                <MDBox display="flex" mb={1}>
                                    {/* <MDTypography variant="subtitle2" color="textPrimary" mt={0.5} mr={1}> Treatment </MDTypography> */}
                                    <TextField label="Treatment" size="small" fullWidth />
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


                        <MDBox display="flex">
                            {/* <MDTypography variant="subtitle2" mt={0.5} mr={1}>Problem</MDTypography> */}
                            <TextField label="Problem" size="small" fullWidth value={formData.problem}
                                onChange={handleChange('problem')} />
                        </MDBox>
                        <MDTypography variant="h6" color="text" fontWeight="medium" gutterBottom> Clinics </MDTypography>
                        <Grid container>
                            <Grid container spacing={2}>
                                {clinicList.map((clinic, index) => (
                                    <Grid item md={6} lg={4} key={index} onClick={() => handleClinicSelect(clinic)}>
                                        <Card
                                            sx={{
                                                cursor: 'pointer', borderRadius: 3, border: selectedClinic === clinic._id ? '2px solid #7e57c2' : '1px solid #e0e0e0', backgroundColor: selectedClinic === clinic._id ? '#f3e5f5' : '#ffffff', transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: 6,
                                                    backgroundColor: '#fafafa',
                                                },
                                            }}
                                        >
                                            <MDBox sx={{ display: 'flex', flexDirection: 'column', padding: 2 }}>
                                                <MDBox sx={{ display: 'flex', gap: 2, marginTop: 1 }}>
                                                    <MDBox sx={{ width: '40%', borderRadius: 5, overflow: 'hidden', height: '135px' }}>
                                                        <img
                                                            src={clinic.imgarry[0]?.profile_url}
                                                            alt={clinic.clinicname}
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        />
                                                    </MDBox>
                                                    <MDBox sx={{ width: '60%', display: 'flex', flexDirection: 'column' }}>
                                                        <MDBox sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                                                            <LocalHospitalIcon sx={{ color: 'primary.main' }} />
                                                            <MDTypography variant="body2" sx={{ marginLeft: 1 }}>{clinic.clinicname}</MDTypography>
                                                        </MDBox>
                                                        <MDBox sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                                                            <PhoneIcon sx={{ color: 'secondary.main' }} />
                                                            <MDTypography variant="body2" sx={{ marginLeft: 1 }}>{clinic.phone || 'Not Provided'}</MDTypography>
                                                        </MDBox>
                                                        <MDBox sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                                                            <AccessTimeIcon sx={{ color: 'success.main' }} />
                                                            <MDTypography variant="body2" sx={{ marginLeft: 1 }}>{clinic.openTime}</MDTypography>
                                                        </MDBox>
                                                        <MDBox sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                                                            <AccessTimeIcon sx={{ color: 'error.main' }} />
                                                            <MDTypography variant="body2" sx={{ marginLeft: 1 }}>{clinic.closeTime}</MDTypography>
                                                        </MDBox>
                                                    </MDBox>
                                                </MDBox>
                                                <Divider />
                                                <MDBox sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <LocationOnIcon sx={{ color: 'info.main' }} />
                                                    <MDTypography
                                                        variant="body2"
                                                        sx={{ marginLeft: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                                    >
                                                        {clinic.clinicAddress}
                                                    </MDTypography>
                                                </MDBox>
                                            </MDBox>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} sm={6}>
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
                            </Grid>
                            <Grid item xs={12} sm={6}>

                                <MDBox display="flex">
                                    <MDTypography variant="subtitle2" color="textPrimary" mt={0.5} mr={1}> Blood Pressure </MDTypography>
                                    <ToggleButtonGroup
                                        size="small"
                                        color="primary"
                                        value={formData.bloodPressure}
                                        exclusive
                                        onChange={handleToggleChange('bloodPressure')}

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
                                        onChange={handleToggleChange('plan')}

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
                                        value={formData.payment}
                                        exclusive
                                        onChange={handleToggleChange('payment')}

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

    ---------------------------------------------------------------------------------------------------------------

    <>
    <MDBox display="flex" justifyContent="space-between" flexWrap="wrap" sx={{ flexDirection: { xs: 'column', md: 'row' } }} >
        {/* Booking ID */}
        <MDBox display="flex" alignItems="center" borderRadius="lg" m={0.5} p={0.5}
            sx={{ border: '1px solid #d2d4d6', width: { xs: '100%', md: '48%' }, }} >
            <MDTypography variant="body2" color="info" mr={1}> <b>Booking ID:</b> </MDTypography>
            <MDTypography variant="body2">{appointmentData?._id}</MDTypography>
        </MDBox>

        {/* Patient ID */}
        <MDBox display="flex" alignItems="center" borderRadius="lg" m={0.5} p={0.5}
            sx={{ border: '1px solid #d2d4d6', width: { xs: '100%', md: '48%' }, justifyContent: { xs: 'flex-start', md: 'flex-end' }, }} >
            <MDTypography variant="body2" color="info" mr={1}> <b>Patient ID:</b> </MDTypography>
            <MDTypography variant="body2">{appointmentData?.userID?._id}</MDTypography>
        </MDBox>
    </MDBox>

    <Grid container>
        <MDBox display="flex" justifyContent="space-between">
            <Grid item xs={12} md={4}>
                <MDBox display="flex" borderRadius="lg" m={0.5} p={0.5} sx={{ border: '1px solid #d2d4d6', minwidth: '100%', alignItems: 'center', flex: 1 }}>
                    <MDTypography variant="body2" >
                        <Box component="span" color="info.main" fontWeight="bold"> Booking ID : </Box>{" "}
                        {appointmentData?._id}
                    </MDTypography>
                </MDBox>
            </Grid>
            <Grid item xs={12} md={4}>
                <MDBox display="flex" borderRadius="lg" m={0.5} p={0.5} sx={{ border: '1px solid #d2d4d6', minWidth: '100%', flex: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                    <MDTypography variant="body2" color='info' sx={{ fontWeight: 'bold', mr: 1 }}> Patient ID: </MDTypography>
                    <MDTypography variant="body2">{appointmentData?.userID?._id}</MDTypography>
                </MDBox>
            </Grid>
        </MDBox>
    </Grid>

    <TextField select size="small" value="Week" sx={{ width: 400 }}>
        <MenuItem value="Day">Day</MenuItem>
        <MenuItem value="Week">Week</MenuItem>
        <MenuItem value="Month">Month</MenuItem>
    </TextField>

    <Select defaultValue="All Dentist" size="small" sx={{ ml: "auto" }}>
        <MenuItem value="All Dentist">All Dentist</MenuItem>
        <MenuItem value="Dr. Olivia">Dr. Olivia</MenuItem>
        <MenuItem value="Dr. Carter">Dr. Carter</MenuItem>
    </Select>
   
    
</>