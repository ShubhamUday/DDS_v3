import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Grid, Card, CardContent, Divider } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDTypography from 'components/MDTypography';
import IndianCurrencyFormatter from 'components/IndianCurrencyFormatter';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import MDBox from 'components/MDBox';

const ClinicWithDetails = () => {
  const [clinicDetails, setClinicDetails] = useState({});
  const [clinicArray, setClinicArray] = useState([]);
  const { id: param1 } = useParams();
  const feeLabels = [
    { key: 'MassageFee', label: 'Message Fee' },
    { key: 'CallFee', label: 'Call Fee' },
    { key: 'NormalFee', label: 'Normal Fee' },
    { key: 'EmergencyFee', label: 'Emergency Fee' },
  ];

  const getAllChatList = async () => {
    try {
      const result = await axios.get(`${process.env.REACT_APP_HOS}/get-single-clinic/${param1}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      setClinicDetails(result.data);
      setClinicArray(result.data.imgarry || []);
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllChatList();
  }, []);

  return (
    <DashboardLayout>

      <MDBox sx={{ padding: 3 }}>
        <Grid container spacing={4}>
          {/* Clinic Info */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, borderRadius: 4, boxShadow: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <CardContent>
                <MDBox display="flex" flexDirection="column" gap={1.5}>

                  <MDBox display="flex" alignItems="center" justifyContent="center">
                    <InfoOutlinedIcon sx={{ color: 'info.main', mr: 1 }} />
                    <MDTypography variant="h5" fontWeight="bold"> {clinicDetails.clinicname || 'Clinic Name'} </MDTypography>
                  </MDBox>

                  <MDTypography variant="body2" color="text.secondary" display="flex" alignItems="center" justifyContent="center">
                    {clinicDetails.Details || 'No description available.'}
                  </MDTypography>

                  <Divider />

                  <MDBox display="flex" alignItems="center" justifyContent="center">
                    <LocationOnIcon sx={{ color: 'primary.main', mr: 1 }} />
                    <MDTypography variant="body2" fontWeight="medium"> {clinicDetails.clinicAddress || 'No address provided.'} </MDTypography>
                  </MDBox>

                  <MDBox display="flex" justifyContent="space-between" alignItems="center">
                    <MDBox display="flex" alignItems="center">
                      <AccessTimeIcon sx={{ fontSize: 20, color: 'success.main', mr: 0.5 }} />
                      <MDTypography variant="body2">Opens: {clinicDetails.openTime}</MDTypography>
                    </MDBox>
                    <MDBox display="flex" alignItems="center">
                      <AccessTimeIcon sx={{ fontSize: 20, color: 'error.main', mr: 0.5 }} />
                      <MDTypography variant="body2">Closes: {clinicDetails.closeTime}</MDTypography>
                    </MDBox>
                  </MDBox>

                  <Divider />

                  {/* Fees */}
                  <MDBox>
                    {feeLabels.map(({ key, label }, idx) => (
                      <MDBox key={idx} display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                        <MDBox display="flex" alignItems="center">
                          <MDTypography variant="body2">{label}</MDTypography>
                        </MDBox>
                        <IndianCurrencyFormatter value={clinicDetails[key]} />
                      </MDBox>
                    ))}
                  </MDBox>
                </MDBox>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Image Carousel */}
          <Grid item xs={12} md={6}>
            {clinicArray.length > 0 && (
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                spaceBetween={20}
                slidesPerView={1}
                style={{ height: '430px', borderRadius: '16px', overflow: 'hidden' }}
              >
                {clinicArray.map((imgUrl, index) => (
                  <SwiperSlide key={index}>
                    <MDBox
                      component="img"
                      src={imgUrl?.profile_url}
                      alt={`clinic-img-${index}`}
                      width="100%"
                      height="100%"
                      sx={{ borderRadius: 2, objectFit: 'cover', boxShadow: 3 }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};

export default ClinicWithDetails;
