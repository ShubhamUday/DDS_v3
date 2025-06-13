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