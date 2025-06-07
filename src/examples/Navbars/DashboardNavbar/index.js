import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Badge,
  Avatar,
  Box,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Icon from "@mui/material/Icon";
import { useNavigate } from "react-router-dom";

import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
} from "context";
import { navbarMobileMenu } from "examples/Navbars/DashboardNavbar/styles";

function DashboardNavbar({ absolute, light, isMini }) {
  const role = localStorage.getItem("role");
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, darkMode } = controller;
  const [doctorData, setDoctorData] = useState({});

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const navigate = useNavigate();

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

    window.addEventListener("scroll", handleTransparentNavbar);
    handleTransparentNavbar();

    return () => window.removeEventListener("scroll", handleTransparentNavbar);
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

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        py: 1,
        backgroundColor: "#fff",
        borderRadius: 2,
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Welcome Text */}
        <Typography
          variant="body1"
          color="text.primary"
          sx={{ fontFamily: "Poppins, sans-serif" }}
        >
          Welcome,{" "}
          <Box component="span" fontWeight={600}>
            {role === "Co-Helper" ? localStorage.getItem("name") || "Unknown" : doctorData?.drname || "Doctor"}
          </Box>
        </Typography>

        {!isMini && (
          <Box display="flex" alignItems="center" gap={2}>
            {/* Search Field */}
            <Box
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
            </Box>

            {/* Notification Icon with Badge */}
            <IconButton>
              <Badge variant="dot" color="error" overlap="circular">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {/* User Profile Box with Dropdown */}
            <Box
              display="flex"
              alignItems="center"
              bgcolor="#f5f5f5"
              px={1.5}
              py={0.5}
              borderRadius="30px"
              sx={{ fontFamily: "Poppins, sans-serif" }}
            >
              <Avatar
                src={doctorData?.profile_url || "https://i.pravatar.cc/300"}
                alt={role === "Co-Helper" ? localStorage.getItem("name") || "Unknown" : doctorData?.drname || "Doctor"}
                sx={{ width: 32, height: 32, mr: 1 }}
              />
              <Box textAlign="left" mr={1}>
                <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                {role === "Co-Helper" ? localStorage.getItem("name") || "Unknown" : doctorData?.drname || "Doctor"}
                </Typography>
                <Typography sx={{ fontSize: 12, color: "gray" }}>
                  {role || "Dr."}
                </Typography>
              </Box>
              <IconButton size="small" onClick={handleMenuOpen}><ArrowDropDownIcon /></IconButton>
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
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default DashboardNavbar;
