import React, { useState, useEffect } from "react";
import { Paper, Divider, Button, Grid } from '@mui/material';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DownloadIcon from '@mui/icons-material/Download';
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDAvatar from "components/MDAvatar";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import html2canvas from "html2canvas";
import img from "assets/images/abc.jpg";

function PrescriptionWithDetails() {
  const { id: param1 } = useParams();
  const [alldetails, setAllDetails] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem("role");

  const getDetails = async () => {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_HOS}/get-single-appointment-with-details/${param1}`,
        { headers: { 'Content-Type': 'application/json' } }
      );
      setAllDetails(result.data);
      setMedicines(result.data.prescriptionID || []);
      console.log(result.data);
    } catch (error) {
      console.error("Error fetching prescription details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

  const handleDownload = () => {
    const captureElement = document.getElementById('prescription-capture');
    if (captureElement) {
      html2canvas(captureElement, { scale: 2 }).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'prescription.png';
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  return (
    <DashboardLayout>

      {/* Download Button */}
      {role === "Doctor" && (
        <MDBox display="flex" justifyContent="flex-end" p={2} m={2}>
          <MDButton color="primary" variant="contained" startIcon={<DownloadIcon />} onClick={handleDownload}
            sx={{
              borderRadius: '8px', boxShadow: 3,
              '&:hover': {
                boxShadow: 6, backgroundColor: '#cfccc6'
              }
            }}
          >
            Download Prescription
          </MDButton>
        </MDBox>
      )}

      {/* Prescription Content */}
      <MDBox id="prescription-capture" p={4}
        sx={{ maxWidth: 1000, margin: "0 auto", backgroundColor: "#fff", borderRadius: 2, boxShadow: 3, }}>
        <MDBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          {/* Doctor & Patient Info */}
          <MDBox sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <MDTypography fontWeight="bold" color="teal" fontSize="lg">
              {alldetails?.userID?.name}
            </MDTypography>
            <MDTypography fontSize="small">Booking No: {alldetails?.userID?._id?.slice(0, 7)}</MDTypography>
            <MDTypography fontSize="small"><strong>Contact:</strong> {alldetails?.userID?.number}</MDTypography>

            <MDBox mt={2}>
              <MDTypography fontSize="small"><strong>Diabities:</strong> {alldetails?.diabetes}</MDTypography>
              <MDTypography fontSize="small"><strong>Blood Pressure:</strong> {alldetails?.Bloodpressure}</MDTypography>
            </MDBox>
          </MDBox>

          {/* Avatar */}
          <MDBox mx={4}>
            <MDAvatar
              src={img || ""}
              alt={alldetails?.clinicID?.clinicname || "C"}
              size="xxl"
              sx={{ boxShadow: 3, border: '4px solid #fff', }}
            />
          </MDBox>

          {/* Clinic & Appointment Info */}
          <MDBox sx={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
            <MDBox mb={2} sx={{ maxWidth: 200, wordBreak: 'break-word' }}>
              <MDTypography fontWeight="bold" color="green" fontSize="lg"> {alldetails?.clinicID?.clinicname} </MDTypography>
              <MDTypography fontSize="small">Near {alldetails?.clinicID?.clinicAddress} </MDTypography>
              <MDTypography fontSize="small"> <strong>Timing:</strong> {alldetails?.clinicID?.openTime} - {alldetails?.clinicID?.closeTime} </MDTypography>
            </MDBox>
            <MDBox>
              <MDTypography fontSize="small"><strong>Date:</strong> {alldetails?.Bookdate?.slice(0, 10)}, {alldetails?.BookTime} </MDTypography>
              <MDTypography fontSize="small"><strong>Plan:</strong> {alldetails?.Plan} </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>

        <Divider sx={{ my: 2 }} />

        {/* Prescription Title */}
        <MDTypography fontWeight="bold" fontSize="large" mb={1}> Rx </MDTypography>

        {/* Prescription Table */}
        <Paper elevation={2} sx={{ mt: 1, p: 2, borderRadius: 2, boxShadow: 3 }}>
          <MDBox sx={{ display: 'flex', fontWeight: 'bold', backgroundColor: '#f0f0f0', p: 1, borderRadius: 1 }}>
            <MDBox sx={{ flex: 2 }}><MDTypography fontSize="small" color="dark"> Medicine </MDTypography> </MDBox>
            <MDBox sx={{ flex: 1, textAlign: 'center' }}> <MDTypography fontSize="small"> Food </MDTypography> </MDBox>
            <MDBox sx={{ flex: 1, textAlign: 'center' }}> <MDTypography fontSize="small"> Duration </MDTypography> </MDBox>
            <MDBox sx={{ flex: 1, textAlign: 'center' }}> <MDTypography fontSize="small"> M </MDTypography> </MDBox>
            <MDBox sx={{ flex: 1, textAlign: 'center' }}> <MDTypography fontSize="small"> A </MDTypography> </MDBox>
            <MDBox sx={{ flex: 1, textAlign: 'center' }}> <MDTypography fontSize="small"> E </MDTypography> </MDBox>
            <MDBox sx={{ flex: 1, textAlign: 'center' }}> <MDTypography fontSize="small"> N </MDTypography> </MDBox>
          </MDBox>

          <Divider />

          {medicines.map((med, index) => (
            <MDBox key={index}
              sx={{
                display: 'flex', alignItems: 'center', py: 1, borderBottom: '1px solid #eee',
                '&:hover': { backgroundColor: '#f9f9f9', }
              }} >
              <MDBox sx={{ flex: 2 }}><MDTypography fontSize="small">{`${index + 1}. ${med.medicinename}`}</MDTypography></MDBox>
              <MDBox sx={{ flex: 1, textAlign: 'center' }}><MDTypography fontSize="small">{med.foodtime || "-"}</MDTypography></MDBox>
              <MDBox sx={{ flex: 1, textAlign: 'center' }}><MDTypography fontSize="small">{med.days ? `${med.days} Days` : "-"}</MDTypography></MDBox>
              <MDBox sx={{ flex: 1, textAlign: 'center' }}><MDTypography fontSize="small" fontWeight="light">{med.morningdos === "Morning" ? "✔️" : "—"}</MDTypography></MDBox>
              <MDBox sx={{ flex: 1, textAlign: 'center' }}><MDTypography fontSize="small" fontWeight="light">{med.afternoon === "Afternoon" ? "✔️" : "—"}</MDTypography></MDBox>
              <MDBox sx={{ flex: 1, textAlign: 'center' }}><MDTypography fontSize="small" fontWeight="light">{med.evening === "Evening" ? "✔️" : "—"}</MDTypography></MDBox>
              <MDBox sx={{ flex: 1, textAlign: 'center' }}><MDTypography fontSize="small" fontWeight="light">{med.night === "Night" ? "✔️" : "—"}</MDTypography></MDBox>
            </MDBox>
          ))}
        </Paper>

        {/* Advice Section */}
        <MDBox mt={3} display="flex">
          <MDTypography fontSize="small"><strong>Advice:</strong> {alldetails?.advice || "—"}</MDTypography>
          <MDTypography fontSize="small" sx={{ ml: "auto" }}><strong>Note:</strong> {alldetails?.note || "—"}</MDTypography>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default PrescriptionWithDetails;
