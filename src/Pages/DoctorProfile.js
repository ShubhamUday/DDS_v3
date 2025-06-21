import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDButton from 'components/MDButton';
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import StarIcon from '@mui/icons-material/Star';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Grid, Icon, IconButton, Menu, MenuItem } from '@mui/material';
import Rating from "@mui/material/Rating";
import img from "skel2.png";
import { Edit, LocalActivityOutlined, LogoutOutlined, MoreVertOutlined, PrivacyTipOutlined, ShareOutlined, StarOutlineOutlined, WorkOutlineOutlined } from '@mui/icons-material';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DoctorEditFormModal from './doctor/DoctorEditFormModal';
import DoctorManageModal from './doctor/DoctorManageModal';
import ShareModal from './extra/ShareModal';
import PrivacyPolicy from './extra/PrivacyPolicy';
import { toast } from 'react-toastify';


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
    <div className={className} style={{ ...style, ...arrowStyle }} onClick={onClick}>
      <span style={{ color: "#fff", fontWeight: "bold" }}>{'>'}</span>
    </div>
  );
};

const CustomPrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div className={className} style={{ ...style, ...arrowStyle }} onClick={onClick}>
      <span style={{ color: "#fff", fontWeight: "bold" }}>{'<'} </span>
    </div>
  );
};

function DoctorProfile() {
  const [doctorData, setDoctorData] = useState({});
  const [ratingsWithUser, setRatingsWithUser] = useState([]);
  const [averageRating, setAverageRating] = useState()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isManageModalOpen, setIsManageModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);


  const handleMenuClose = () => { setAnchorEl(null); };

  const handleMenuOpen = (event) => { setAnchorEl(event.currentTarget); };


  const generateAverageRating = () => {
    const averageRating = ratingsWithUser.length
      ? ratingsWithUser.reduce((sum, r) => sum + r.ratingCount, 0) / ratingsWithUser.length : 0;

    const roundedRating = Math.round(averageRating * 10) / 10; // e.g., 4.3

    setAverageRating(roundedRating)
  }

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

      console.log('single-doc-app result', result)
      console.log('extracted rating', extractedRatings)

    } catch (error) {
      console.error("Error fetching doctor data:", error);
    }
  };

  const handleLogout = () => {
    handleMenuClose();
    localStorage.clear();
    navigate('/Sign-in');
  };

  console.log('average Ratig', averageRating)
  console.log('doctors data', doctorData)

  useEffect(() => {
    getDoctorDetails();
    generateAverageRating()
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
            // alignItems: "center", // Keeps avatar vertically centered
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
          <MDBox sx={{ flex: 1, width: "100%" }}>
            <MDBox sx={{ mb: 1 }}>
              <Grid container spacing={2}>

                <Grid item>
                  <MDAvatar
                    src={doctorData.profile_url}
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
                </Grid>

                {/* Name and designation */}
                <Grid item sx={{ mr: "auto" }}>
                  <MDBox>
                    <MDTypography variant="h5" fontWeight="bold" sx={{ fontSize: "1.6rem", color: "#1a237e" }}>
                      {doctorData?.drname}
                      <MDButton variant="text" color="secondary" title="Edit doctor details" startIcon={<Edit />}
                        onClick={() => { setIsEditModalOpen(true); }} />
                    </MDTypography>
                    <MDTypography variant="body2" sx={{ color: "#1a237e" }}>
                      {doctorData?.designation}
                    </MDTypography>
                  </MDBox>
                </Grid>

                <Grid item >
                  <MDBox textAlign="right">

                    <MDTypography variant="subtitle1" sx={{ color: "#25408f", fontWeight: "medium" }}>
                      {doctorData?.yearsofexperience} Years of experience
                    </MDTypography>
                    <MDTypography variant="subtitle2" sx={{ color: "#1a237e" }}>
                      Patients Checked: {doctorData?.patientchecked}
                    </MDTypography>
                  </MDBox>
                </Grid>

                <Grid item>
                  <MDBox>
                    <IconButton onClick={handleMenuOpen} size="small"> <MoreVertIcon /> </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={menuOpen}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={() => { setIsManageModalOpen(true) }}> <WorkOutlineOutlined /> &nbsp;&nbsp;Manage Job </MenuItem>
                      {/* <MenuItem onClick={() => { }}> <StarOutlineOutlined /> &nbsp;&nbsp;Read Reviews </MenuItem> */}
                      <MenuItem onClick={() => { setIsShareModalOpen(true) }}> <ShareOutlined /> &nbsp;&nbsp;Share with friends </MenuItem>
                      <MenuItem onClick={() => { }}> <LocalActivityOutlined /> &nbsp;&nbsp;Add Ticket </MenuItem>
                      <MenuItem onClick={() => { setIsPrivacyModalOpen(true) }}> <PrivacyTipOutlined /> &nbsp;&nbsp;Privacy Policy </MenuItem>
                      <MenuItem onClick={() => { handleLogout }}> <LogoutOutlined /> &nbsp;&nbsp;Log Out </MenuItem>
                    </Menu>
                  </MDBox>
                </Grid>
              </Grid>
            </MDBox>

            <Divider sx={{ mb: 2 }} />

            {/* Biography */}
            <MDTypography
              variant="body1"
              sx={{
                lineHeight: 1.6,
                color: "#1a237e",
                textAlign: "justify",
              }}
            >
              {doctorData?.biography || "No biography available."}
            </MDTypography>

            <MDBox display="flex" alignItems="center" gap={1}>
              <MDTypography> Average Rating </MDTypography>
              <Rating
                value={averageRating}
                precision={0.1}
                readOnly
                emptyIcon={<StarIcon style={{ opacity: 0.3 }} fontSize="inherit" />}
              />
              <MDTypography variant="body2"> {averageRating} ({ratingsWithUser.length} reviews) </MDTypography>
            </MDBox>
          </MDBox>
        </Card>



        {/* Ratings Section */}
        {ratingsWithUser.length > 0 && (
          <MDBox mt={6}  >
            <MDTypography
              variant="h4"
              fontWeight="bold"
              textAlign="center"
              mb={3}
              sx={{ color: "#5e5873" }}
            >
              What <span style={{ color: "#25408f" }}>Patients Say</span>
            </MDTypography>

            {/* Slide Card */}
            <Grid container spacing={2}>
              <MDBox mx="auto" width="100%" maxWidth="1200px" px={{ xs: 1, sm: 2 }} py={2}>
                <Slider {...sliderSettings}>
                  {ratingsWithUser.map((rating, idx) => (
                    <Grid item lg={12} key={idx}>
                      <Card
                        key={idx}
                        sx={{
                          m: 1,
                          // width: "100%",
                          maxWidth: 300,
                          height: "auto",
                          p: 3,
                          borderRadius: 4,
                          boxShadow: "0px 2px 0px #25408f",
                          background: "#fff",
                          display: "flex",
                          flexDirection: "column",
                          transition: "transform 0.3s ease-in-out",
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: 2,
                          },
                        }}
                      >
                        <MDBox>
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
                              <MDTypography variant="caption" sx={{ color: "#1a237e" }}>
                                {rating.RateTime ? rating.RateTime.slice(0, 10).split('-').reverse().join('-') : "—"}
                              </MDTypography>
                            </MDBox>

                            <MDTypography
                              variant="body2"
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
                              src={rating?.userId?.profile_url || img}
                              size="lg"
                            />
                            <MDBox sx={{ ml: 2 }}>
                              <MDTypography variant="h6" fontWeight="medium"> {rating?.userId?.name || "Anonymous"} </MDTypography>
                              <MDTypography variant="caption"> Patient </MDTypography>
                            </MDBox>
                          </MDBox>
                        </MDBox>
                      </Card>

                    </Grid>
                  ))}
                </Slider>
              </MDBox>
            </Grid>
          </MDBox>
        )}
      </MDBox>

      {isEditModalOpen && (
        <DoctorEditFormModal
          isEditModalOpen={isEditModalOpen}
          setIsEditModalOpen={setIsEditModalOpen}
          doctorDetails={doctorData}
          getDoctorDetails={getDoctorDetails}
        />
      )}

      {isManageModalOpen && (
        <DoctorManageModal
          isManageModalOpen={isManageModalOpen}
          setIsManageModalOpen={setIsManageModalOpen}
          doctorDetails={doctorData}
          getDoctorDetails={getDoctorDetails}
          handleMenuClose={handleMenuClose}
        />
      )}

      {isShareModalOpen && (
        <ShareModal
          isShareModalOpen={isShareModalOpen}
          setIsShareModalOpen={setIsShareModalOpen}
          handleMenuClose={handleMenuClose}
        />
      )}

      {isPrivacyModalOpen && (
        <PrivacyPolicy
          isPrivacyModalOpen={isPrivacyModalOpen}
          setIsPrivacyModalOpen={setIsPrivacyModalOpen}
          handleMenuClose={handleMenuClose}
        />
      )}

    </DashboardLayout>
  );
}

export default DoctorProfile;
