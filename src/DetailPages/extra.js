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