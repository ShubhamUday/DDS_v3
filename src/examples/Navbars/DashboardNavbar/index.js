import React, { useState, useEffect } from "react";
import axios from "axios";
import { AppBar, Toolbar, IconButton, InputBase, Badge, Avatar, Menu, MenuItem, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Icon from "@mui/material/Icon";
import { useNavigate } from "react-router-dom";
import { useMaterialUIController, setTransparentNavbar, setMiniSidenav } from "context";
import { navbarMobileMenu } from "examples/Navbars/DashboardNavbar/styles";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';


function DashboardNavbar({ absolute, light, isMini }) {
  const role = localStorage.getItem("role");
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, darkMode } = controller;
  const [doctorData, setDoctorData] = useState({});

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const navigate = useNavigate();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate('/profile');
  };

  const handleLogout = () => {
    handleMenuClose();
    localStorage.clear();
    navigate('/Sign-in');
  };

  const getDoctorDetails = async () => {
    const drID = localStorage.getItem("doctorID");
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_HOS}/get-single-doctor-with-appointment/${drID}`
      );
      setDoctorData(result.data);
    } catch (error) {
      console.error("Error fetching doctor data:", error);
    }
  };

  useEffect(() => {
    getDoctorDetails();
  }, []);

  useEffect(() => {
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    const handleTransparentNavbar = () => {
      setTransparentNavbar(
        dispatch,
        (fixedNavbar && window.scrollY === 0) || !fixedNavbar
      );
    };

    // window.addEventListener("scroll", handleTransparentNavbar);
    // handleTransparentNavbar();

    // return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);

  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;
      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }
      return colorValue;
    },
  });

  // console.log('isSmall', isSmallScreen)
  return (

    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        py: 1,
        top: 5,
        zIndex: 1101,
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        backdropFilter: 'blur(20px)',
        borderRadius: 2,
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
        {/* Welcome Text */}
        <MDTypography
          variant="body1"
          color="primary"
          sx={{ fontFamily: "Poppins, sans-serif" }}
        >
          Welcome,{" "}
          <MDBox component="span" fontWeight={600}>
            {role === "Co-Helper" ? localStorage.getItem("name") || "Unknown" : doctorData?.drname || "Doctor"}
          </MDBox>
        </MDTypography>

        <MDBox display="flex" alignItems="center" gap={2}>
          {!isSmallScreen && (<>
            {/* Search Field */}
            <MDBox
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#f1f1f1",
                borderRadius: "30px",
                px: 2,
                py: 0.5,
                width: "22vw",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              <SearchIcon sx={{ color: "gray", mr: 1 }} />
              <InputBase
                placeholder="Search for anything..."
                fullWidth
                sx={{
                  fontSize: 14,
                  fontFamily: "Poppins, sans-serif",
                }}
              />
            </MDBox>
          </>
          )}

          {/* <MDBox display="flex" alignItems="center" gap={2}></MDBox> */}

          {/* Notification Icon with Badge */}
          <IconButton>
            <Badge variant="dot" color="error" overlap="circular"> <NotificationsIcon /> </Badge>
          </IconButton>

          {/* User Profile Box with Dropdown */}
          <Box
            display="flex"
            alignItems="center"
            bgcolor={!isSmallScreen ? "#f1f1f1" : "transparent"}
            px={!isSmallScreen ? 1.5 : 0}
            py={!isSmallScreen ? 0.5 : 0}
            borderRadius="30px"
            sx={{ fontFamily: "Poppins, sans-serif" }}
          >
            <Avatar
              src={doctorData?.profile_url || "https://i.pravatar.cc/300"}
              alt={role === "Co-Helper" ? localStorage.getItem("name") || "Unknown" : doctorData?.drname || "Doctor"}
              sx={{ width: 32, height: 32, mr: 1 }}
            />
            {!isSmallScreen && (
              <MDBox textAlign="left" mr={1}>
                <MDTypography sx={{ fontSize: 14, fontWeight: 500 }}>
                  {role === "Co-Helper" ? localStorage.getItem("name") || "Unknown" : doctorData?.drname || "Doctor"}
                </MDTypography>
                <MDTypography sx={{ fontSize: 12, color: "gray" }}>
                  {role || "Dr."}
                </MDTypography>
              </MDBox>
            )}
            <IconButton size="small" onClick={handleMenuOpen}> <ArrowDropDownIcon /> </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={handleProfile}><Icon fontSize="small">medical_information</Icon>&nbsp;&nbsp;Profile</MenuItem>
              <MenuItem onClick={handleLogout}><Icon fontSize="small">logout</Icon>&nbsp;&nbsp;Logout</MenuItem>
            </Menu>
          </Box>

          {/* Toggle Menu Icon */}
          {(isSmallScreen || isMini) && (
            <IconButton
              size="small"
              disableRipple
              color="inherit"
              sx={navbarMobileMenu}
              onClick={handleMiniSidenav}
            >
              <Icon sx={iconsStyle} fontSize="medium">
                {miniSidenav ? "menu_open" : "menu"}
              </Icon>
            </IconButton>
          )}
        </MDBox>
      </Toolbar>
    </AppBar>

  );
}

export default DashboardNavbar;
