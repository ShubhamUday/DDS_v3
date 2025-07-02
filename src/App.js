import { useState, useEffect, useMemo } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import Sidenav from "examples/Sidenav";

// Material Dashboard 2 React themes
import theme from "assets/theme";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";


// Material Dashboard 2 React routes
import routes from "routes";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav } from "context";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Images
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";
import AppointmentWithDetails from "DetailPages/AppointmentsWithDetails";
import Basic from "layouts/authentication/sign-in";
import PatientWithDetails from "DetailPages/PatientWithDetails";
import ClinicWithDetails from "DetailPages/ClinicWithDetails";
import AddStaff from "Pages/staff/AddStaff";
import PrescriptionWithDetails from "DetailPages/PrescriptionWithDetails";
import AddClinic from "Pages/clinic/AddClinic"
import DoctorProfile from "Pages/doctor/DoctorProfile";
import StaffrProfile from "Pages/staff/StaffProfile";


import PrivateComponets from "components/PrivateComponets";
import Test from "DetailPages/Test";

export default function App() {
  const role = localStorage.getItem("role");
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();


  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };


  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      <ToastContainer
        autoClose={2000}
        position="top-center"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
        style={{ width: '350px', font: 'message-box' }}
      />
      {layout === "dashboard" && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
            brandName="DDS"
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
        </>
      )}
      {layout === "vr"}
      <Routes>
        <Route element={<PrivateComponets />}>
          {getRoutes(routes)}
          {
            role === "Co-Helper" ? <Route path="/profile" element={<StaffrProfile />} /> : <Route path="/profile" element={<DoctorProfile />} />
          }
          <Route path="/clinic-with-details/:id" element={<ClinicWithDetails />} />
          <Route path="/add-staff/:id" element={<AddStaff />} />
          <Route path="/add-clinic/:id" element={<AddClinic />} />
          <Route path="/authentication/sign-in" element={<Basic />} />
          <Route path="/patient-with-details/:id" element={<PatientWithDetails />} />
          <Route path="/appointment-with-details/:id" element={<AppointmentWithDetails />} />
          <Route path="/prescription-with-details/:id" element={<PrescriptionWithDetails />} />
          <Route path="/test" element={<Test />} />
          <Route path="*" element={<Navigate to="/sign-in" />} />
        </Route>
        <Route path="/sign-in" element={<Basic />} />
      </Routes>

    </ThemeProvider>
  );
}
