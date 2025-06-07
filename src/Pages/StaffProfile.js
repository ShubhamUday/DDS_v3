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

function StaffrProfile() {
  const [doctorData, setDoctorData] = useState({});
  const [ratingsWithUser, setRatingsWithUser] = useState([]);
  const role = localStorage.getItem("role");
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
            {role === "Co-Helper" ? localStorage.getItem("name") : doctorData?.drname || "Doctor"}
        </MDTypography>
      </MDBox>
    </MDBox>

    <Divider sx={{ mb: 2 }} />
        </MDBox>
        </Card>
      </MDBox>
    </DashboardLayout>
  );
}

export default StaffrProfile;
