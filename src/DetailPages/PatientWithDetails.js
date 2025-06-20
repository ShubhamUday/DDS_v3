// /* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, Route, useParams } from "react-router-dom";
import img from "skel2.png";

// @mui material components
import { Card, Divider, Grid } from "@mui/material";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

import AppointmentsList from "./AppointmentsList";
import Chats from "./Chats"

const PatientWithDetails = () => {
  const [Appointmentdata, setAppointmentdata] = useState({});

  const params = useParams();
  const param1 = params.id;

  const getDetails = async () => {
    try {

      const result = await axios.get(
        `${process.env.REACT_APP_HOS}/get-single-appointment-with-details/${param1}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setAppointmentdata(result.data);
      console.log("Patient-with-details", result.data);

    } catch (error) {
      console.log(error);
    }
  };

  console.log(Appointmentdata?.prescriptionID?.length);
  useEffect(() => {
    getDetails();
  }, []);

  return (
    <DashboardLayout>

      <MDBox sx={{ padding: 3 }}>
        <Card sx={{ mt: 1, mx: 1, p: 1, }} >

          <Card sx={{ boxShadow: "none" }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <MDAvatar
                  src={Appointmentdata?.userID?.profile_url || img}
                  alt="profile-image"
                  size="xl"
                  shadow="sm"
                />
              </Grid>
              <Grid item>
                <MDBox height="100%" mt={0.5} lineHeight={1}>
                  <MDTypography variant="h5" fontWeight="medium">
                    {Appointmentdata?.userID?.name || Appointmentdata.patientName || "Name"}
                  </MDTypography>
                  <MDTypography variant="button" color="text" fontWeight="regular">
                    {Appointmentdata?.userID?.gender} / Age {Appointmentdata?.userID?.age}
                  </MDTypography>
                </MDBox>
              </Grid>
              {/* <Grid item xs={12} md={6} lg={4} sx={{ ml: "auto" }}></Grid> */}
            </Grid>
          </Card>

          <Grid container spacing={3}>
            <Grid item xs={12} md={3} xl={3} sx={{ display: "flex" }}>
              <MDBox flex={1} justifyContent="space-between" alignItems="center" pt={1} px={1}>

                <MDTypography
                  display="flex"
                  variant="h6"
                  fontWeight="medium"
                  textTransform="capitalize"
                  color="text"
                >
                  {Appointmentdata?.Treatmentfor}
                </MDTypography>

                <MDBox lineHeight={1}>
                  <MDTypography variant="button" color="text" fontWeight="light">
                    {Appointmentdata?.ProblemDetails}
                  </MDTypography>
                </MDBox>

                <MDBox lineHeight={1}>
                  <MDBox display="flex">
                    <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                      Number : &nbsp;
                    </MDTypography>

                    <MDTypography variant="button" fontWeight="regular" color="text">
                      &nbsp;{Appointmentdata?.userID?.number || "name"}
                    </MDTypography>
                  </MDBox>
                </MDBox>

              </MDBox>
            </Grid>

            <MDBox opacity={1}>
              <Divider orientation="vertical" />
            </MDBox>

            <Grid item xs={12} xl={4} lg={4}>

              <MDBox px={2} display="flex" justifyContent="space-between" alignItems="flex-start">
                <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
                  Appointments
                </MDTypography>
              </MDBox>
              <AppointmentsList appointmentIDs={Appointmentdata?.userID?.appointmentID} />

            </Grid>

            <MDBox opacity={1}>
              <Divider orientation="vertical" />
            </MDBox>

            <Grid item xs={12} xl={4} lg={4}>

              <MDBox px={2} display="flex" justifyContent="space-between" alignItems="flex-start">
                <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
                  Chats
                </MDTypography>
              </MDBox>

              <Chats />

            </Grid>
          </Grid>

        </Card>
      </MDBox>
    </DashboardLayout>
  );
};

export default PatientWithDetails;
