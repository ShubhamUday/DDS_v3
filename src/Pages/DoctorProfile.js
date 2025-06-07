import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import StarIcon from '@mui/icons-material/Star';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const arrowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#25408f",
  borderRadius: "50%",
  width: "30px",
  height: "30px",
  zIndex: 2,
  cursor: "pointer",
};

const CustomNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, ...arrowStyle }}
      onClick={onClick}
    >
      <span style={{ color: "#fff", fontWeight: "bold" }}>{'>'}</span>
    </div>
  );
};

const CustomPrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, ...arrowStyle }}
      onClick={onClick}
    >
      <span style={{ color: "#fff", fontWeight: "bold" }}>{'<'}</span>
    </div>
  );
};

function DoctorProfile() {
  const [doctorData, setDoctorData] = useState({});
  const [ratingsWithUser, setRatingsWithUser] = useState([]);

  const getDoctorDetails = async () => {
    const drID = localStorage.getItem("doctorID");
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_HOS}/get-single-doctor-with-appointment/${drID}`
      );
      setDoctorData(result.data);
      const appointments = result.data.appointmentID?.reverse() || [];
      const extractedRatings = appointments
        .filter(app => app?.ratingID && app?.userID)
        .map(app => ({ ...app.ratingID, userId: app.userID }));
      setRatingsWithUser(extractedRatings);
    } catch (error) {
      console.error("Error fetching doctor data:", error);
    }
  };

  useEffect(() => {
    getDoctorDetails();
  }, []);

  const sliderSettings = {
    dots: false,
    arrows: true,
    infinite: false,
    speed: 500,
    slidesToShow: Math.min(3, ratingsWithUser.length),
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, ratingsWithUser.length),
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          arrows: false,
          dots: true,
        },
      },
    ],
  };

  return (
    <DashboardLayout>
      <MDBox sx={{ padding: 3 }}>
        {/* Doctor Info */}
        <Card
          sx={{
            p: 3,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center", // Keeps avatar vertically centered
            gap: 3,
            borderRadius: 4,
            boxShadow: "0px 2px 0px #25408f",
            transition: "transform 0.3s",
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: 2,
            },
          }}
        >
          <MDAvatar
            src="https://png.pngtree.com/png-clipart/20231002/original/pngtree-young-afro-professional-doctor-png-image_13227671.png"
            alt="Doctor Profile"
            size="xl"
            shadow="lg"
            sx={{
              // border: "3px solid #25408f",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              transition: "transform 0.3s",
              '&:hover': { transform: "scale(1.1)" },
            }}
          />

          <MDBox sx={{ flex: 1, width: "100%" }}>
            {/* Name and designation */}
            <MDBox sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", mb: 1 }}>
              <MDBox>
                <MDTypography variant="h5" fontWeight="bold" sx={{ fontSize: "1.6rem", color: "#1a237e" }}>
                  {doctorData?.drname}
                </MDTypography>
                <MDTypography variant="body2" color="text.secondary">
                  {doctorData?.designation}
                </MDTypography>
              </MDBox>

              <MDBox textAlign="right">
                <MDTypography variant="subtitle1" sx={{ color: "#25408f", fontWeight: "medium" }}>
                  {doctorData?.yearsofexperience} yrs experience
                </MDTypography>
                <MDTypography variant="subtitle2" color="text.secondary">
                  Patients Checked: {doctorData?.patientchecked}
                </MDTypography>
              </MDBox>
            </MDBox>

            <Divider sx={{ mb: 2 }} />

            {/* Biography */}
            <MDTypography
              variant="body1"
              sx={{
                lineHeight: 1.6,
                color: "text.secondary",
                textAlign: "justify",
              }}
            >
              {doctorData?.biography || "No biography available."}
            </MDTypography>
            
          </MDBox>
        </Card>



        {/* Ratings Section */}
        {ratingsWithUser.length > 0 && (
          <MDBox mt={6}>
            <MDTypography
              variant="h4"
              fontWeight="bold"
              textAlign="center"
              mb={3}
              sx={{ color: "#5e5873" }}
            >
              What <span style={{ color: "#25408f" }}>Patients Say</span>
            </MDTypography>

            <MDBox mx="auto" width="100%" maxWidth="1200px" px={{ xs: 1, sm: 2 }} py={2}>
              <Slider {...sliderSettings}>
                {ratingsWithUser.map((rating, idx) => (
                  <Card
                    key={idx}
                    sx={{
                      m: 2,
                      width: "100%",
                      maxWidth: 350,
                      height: "auto",
                      p: 3,
                      borderRadius: 4,
                      boxShadow: "0px 2px 0px #25408f",
                      background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.3s ease-in-out",
                      '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: 2,
            },
                    }}
                  >
                    {/* Top section */}
                    <MDBox sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>

                      <MDBox display="flex" justifyContent="space-between" mb={1}>
                        <MDBox display="flex" gap={0.5}>
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              sx={{
                                color: i < rating.ratingCount ? "#ffb400" : "#e0e0e0",
                                fontSize: "20px",
                              }}
                            />
                          ))}
                        </MDBox>
                        <MDTypography variant="caption" color="text.secondary">
                          {rating.RateTime ? rating.RateTime.slice(0, 10).split('-').reverse().join('-') : "—"}
                        </MDTypography>
                      </MDBox>

                      <MDTypography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontStyle: "italic",
                          lineHeight: 1.6,
                          display: "-webkit-box",
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {rating.DiscriptionAppare || "No feedback provided."}
                      </MDTypography>
                      
                    </MDBox>

                    <Divider sx={{ my: 2 }} />

                    {/* User info */}
                    <MDBox sx={{ display: "flex", alignItems: "center" }}>
                      <MDAvatar
                        src={'https://png.pngtree.com/png-clipart/20231002/original/pngtree-young-afro-professional-doctor-png-image_13227671.png'}
                        size="lg"
                      />
                      <MDBox sx={{ ml: 2 }}>
                        <MDTypography variant="h6" fontWeight="medium">
                          {rating.userName || "Anonymous"}
                        </MDTypography>
                        <MDTypography variant="caption" color="text.secondary">Patient</MDTypography>
                      </MDBox>
                    </MDBox>
                  </Card>
                ))}
              </Slider>
            </MDBox>
          </MDBox>
        )}
      </MDBox>
    </DashboardLayout>
  );
}

export default DoctorProfile;
