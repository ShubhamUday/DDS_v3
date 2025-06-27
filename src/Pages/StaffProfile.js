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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Checkbox, Grid, Icon, IconButton, Menu, MenuItem, Switch, Tooltip } from '@mui/material';
import { LocalActivityOutlined, LogoutOutlined, PrivacyTipOutlined, ShareOutlined, WorkOutlineOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PrivacyPolicy from './extra/PrivacyPolicy';
import ShareModal from './extra/ShareModal';
import AddTicketModal from './extra/AddTicketModal';

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
  const stID = localStorage.getItem("CoHelperID")
  const role = localStorage.getItem("role");
  const [doctorData, setDoctorData] = useState({});
  const [ratingsWithUser, setRatingsWithUser] = useState([]);
  const [singleStaff, setSingleStaff] = useState()
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false)
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const navigate = useNavigate()

  const handleMenuClose = () => { setAnchorEl(null); };
  const handleMenuOpen = (event) => { setAnchorEl(event.currentTarget); };

  const handleLogout = () => {
    handleMenuClose();
    localStorage.clear();
    navigate('/Sign-in');
  };

  const getDetails = async () => {
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

      const result3 = await axios.get(`${process.env.REACT_APP_HOS}/get-one-staff-with-details/${stID}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      setSingleStaff(result3.data)

    } catch (error) {
      console.error("Error fetching doctor data:", error);
    }
  };

  useEffect(() => {
    getDetails();
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
      {singleStaff ? (
        <MDBox sx={{ padding: 3 }}>
          {/* Staff Info */}
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
            <MDBox sx={{ flex: 1, width: "100%" }}>
              <MDBox sx={{ mb: 1 }}>
                <Grid container spacing={2} >
                  <Grid item >
                    <MDAvatar
                      src="https://png.pngtree.com/png-clipart/20231002/original/pngtree-young-afro-professional-doctor-png-image_13227671.png"
                      alt="Staff Profile"
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

                  {/* Name and Designation */}
                  <Grid item sx={{ mr: "auto" }}>
                    <MDBox>
                      <MDTypography variant="h5" fontWeight="medium" >
                        {singleStaff?.name}
                        {/* <MDButton variant="text" color="secondary" title="Edit doctor details" startIcon={<Edit />}
                        onClick={() => { setIsEditModalOpen(true); }} /> */}
                      </MDTypography>
                      <MDTypography variant="button" color="text" fontWeight="regular">
                        {singleStaff?.gender} | {singleStaff?.assignAs}
                      </MDTypography>
                    </MDBox>
                  </Grid>

                  {/* Clinic Details */}
                  <Grid item xs={12} md={6} xl={4} sx={{ ml: "auto" }}>
                    <MDBox sx={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
                      <MDTypography fontWeight="bold" color="success" fontSize="lg"> {singleStaff?.clinicID?.clinicname} </MDTypography>
                      <MDTypography fontSize="small">Near {singleStaff?.clinicID?.clinicAddress} </MDTypography>
                      <MDTypography fontSize="small"> <strong>Timing:</strong> {singleStaff?.clinicID?.openTime} - {singleStaff?.clinicID?.closeTime} </MDTypography>
                    </MDBox>
                  </Grid>

                  {/* More options */}
                  <Grid item>
                    <MDBox>
                      <IconButton onClick={handleMenuOpen} size="small"> <MoreVertIcon /> </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={menuOpen}
                        onClose={handleMenuClose}
                      >
                        {/* <MenuItem onClick={() => { }}> <StarOutlineOutlined /> &nbsp;&nbsp;Read Reviews </MenuItem> */}
                        <MenuItem onClick={() => { setIsShareModalOpen(true) }}> <ShareOutlined /> &nbsp;&nbsp;Share with friends </MenuItem>

                        {singleStaff?.CanSendTickets === "Yes" && (
                          <MenuItem onClick={() => { setIsTicketModalOpen(true) }}> <LocalActivityOutlined /> &nbsp;&nbsp;Add Ticket </MenuItem>
                        )}

                        <MenuItem onClick={() => { setIsPrivacyModalOpen(true) }}> <PrivacyTipOutlined /> &nbsp;&nbsp;Privacy Policy </MenuItem>
                        <MenuItem onClick={handleLogout}> <LogoutOutlined /> &nbsp;&nbsp;Log Out </MenuItem>
                      </Menu>
                    </MDBox>
                  </Grid>
                </Grid>

                <Divider sx={{ mb: 2 }} />

                <Grid container>
                  {/* Profile Information */}
                  <Grid item xs={12} md={6} xl={6} sx={{ display: "flex" }}>

                    <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>

                      <MDBox display="flex" justifyContent="space-between" alignItems="center" >
                        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                          profile information
                        </MDTypography>
                        {/* <MDTypography   variant="body2" color="secondary">
                        <Tooltip title="Edit profile" placement="top">
                          <Icon>edit</Icon>
                        </Tooltip>
                      </MDTypography> */}
                      </MDBox>

                      <MDBox pt={1} pb={2} px={2}>
                        <MDBox display="flex" py={1} pr={2}>
                          <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                            Full Name: &nbsp;
                          </MDTypography>
                          <MDTypography variant="button" fontWeight="regular" color="text">
                            &nbsp;{singleStaff?.name}
                          </MDTypography>
                        </MDBox>
                        <MDBox display="flex" py={1} pr={2}>
                          <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                            Mobile: &nbsp;
                          </MDTypography>
                          <MDTypography variant="button" fontWeight="regular" color="text">
                            &nbsp;{singleStaff?.number}
                          </MDTypography>
                        </MDBox>
                        <MDBox display="flex" py={1} pr={2}>
                          <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                            Email: &nbsp;
                          </MDTypography>
                          <MDTypography variant="button" fontWeight="regular" color="text">
                            &nbsp;{singleStaff?.email}
                          </MDTypography>
                        </MDBox>
                        <MDBox display="flex" py={1} pr={2}>
                          <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                            Check-In: &nbsp;
                          </MDTypography>
                          <MDTypography variant="button" fontWeight="regular" color="text">
                            &nbsp;{singleStaff?.checkInTime}
                          </MDTypography>
                        </MDBox>
                        <MDBox display="flex" py={1} pr={2}>
                          <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                            Check-Out: &nbsp;
                          </MDTypography>
                          <MDTypography variant="button" fontWeight="regular" color="text">
                            &nbsp;{singleStaff?.checkOutTime}
                          </MDTypography>
                        </MDBox>
                      </MDBox>
                    </MDBox>

                  </Grid>


                  {/* Access */}
                  <Grid item xs={12} md={6} xl={6} sx={{ display: "flex" }}>
                    <Divider orientation="vertical" sx={{ ml: 0, mr: 0 }} />
                    <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>

                      <MDBox display="flex" justifyContent="space-between" alignItems="center" >
                        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                          access
                        </MDTypography>
                        {/* <MDTypography   variant="body2" color="secondary">
                        <Tooltip title="Edit profile" placement="top">
                          <Icon>edit</Icon>
                        </Tooltip>
                      </MDTypography> */}
                      </MDBox>

                      <MDBox pt={1} pb={2} px={2}>
                        <MDBox display="flex" alignItems="center">
                          <Checkbox checked={singleStaff?.CanAcceptAppointment === "Yes"} disabled />
                          <MDTypography variant="button" fontWeight="regular" color="text">
                            Can accept appointment
                          </MDTypography>
                        </MDBox>
                        <MDBox display="flex" alignItems="center">
                          <Checkbox checked={singleStaff?.CanAddAppointment === "Yes"} disabled />
                          <MDTypography variant="button" fontWeight="regular" color="text">
                            Can add appointment
                          </MDTypography>
                        </MDBox>
                        <MDBox display="flex" alignItems="center">
                          <Checkbox checked={singleStaff?.CanUpdateRecievedPaymentAppointment === "Yes"} disabled />
                          <MDTypography variant="button" fontWeight="regular" color="text">
                            Can update payment details
                          </MDTypography>
                        </MDBox>
                        <MDBox display="flex" alignItems="center">
                          <Checkbox checked={singleStaff?.CanSendTickets === "Yes"} disabled />
                          <MDTypography variant="button" fontWeight="regular" color="text">
                            Can send tickets
                          </MDTypography>
                        </MDBox>
                      </MDBox>
                    </MDBox>

                  </Grid>


                </Grid>
              </MDBox>
            </MDBox>
          </Card>
        </MDBox>
      ) : (
        <></>
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

      {isTicketModalOpen && (
        <AddTicketModal
          isTicketModalOpen={isTicketModalOpen}
          setIsTicketModalOpen={setIsTicketModalOpen}
          handleMenuClose={handleMenuClose}
        />
      )}


    </DashboardLayout>
  );
}

export default StaffrProfile;
