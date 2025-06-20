import { useState } from "react";
import { Radio, FormControlLabel, RadioGroup } from "@mui/material";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/appointment.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function Basic() {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState("doctor");
  const [mail, setmail] = useState("");
  const [pass, setpass] = useState("");
const [submitAttempted, setSubmitAttempted] = useState(false);

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handlesubmit = () => {
    setSubmitAttempted(true)
    if (selectedRole !== "" && mail !== "" && pass !== "") {
      if (selectedRole === "doctor") {
        handleSubmit();
      } else {
        handleforcoHelperSubmit();
      }
    } else {
      console.log("All Fields are required");
    }
  };

  const handleSubmit = async () => {
    if (mail && pass) {
      const dremail = mail;
      const drpassword = pass;
      try {
        const result = await axios.post(
          `${process.env.REACT_APP_HOS}/login-dental-doctor`,{ dremail, drpassword },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        console.log(result.data);

        if (result.data.status === "login") {
          localStorage.setItem("user", JSON.stringify(result.data));
          localStorage.setItem("role", "Doctor");
          localStorage.setItem("name", result.data.drname);
          localStorage.setItem("doctorID", result.data._id);

          const fcmToken = localStorage.getItem("fcm_token");
          const values = { fcmToken };

          try {
            const updateFcm = await axios.put(
              `${process.env.REACT_APP_HOS}/update-doctor-detail/${result.data._id}`,
              values,
              {
                headers: { "Content-Type": "application/json" },
              }
            );
            if (updateFcm.data) {
              console.log("Doctor login successful!");
              navigate("/dashboard");
            } else {
              console.log("Something went wrong!");
            }
          } catch (error) {
            console.error("Error updating FCM:", error);
            console.log("Error updating FCM");
          }
        } else if (result.data === "no data found") {
          console.log("Wrong username or password! Please try again.");
        }
      } catch (error) {
        console.error("Error submitting doctor login:", error);
        console.log("An error occurred. Please try again.");
      }
    } else {
      console.log("Please enter Email ID & Password!");
    }
  };

  const handleforcoHelperSubmit = async () => {
    if (mail && pass) {
      const email = mail;
      const password = pass;
      const values = { email, password };
      try {
        const result = await axios.post(
          `${process.env.REACT_APP_HOS}/login-dental-staff`,
          values,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        console.log(result.data);

        if (result.data.status === "login") {
          localStorage.setItem("user", JSON.stringify(result.data));
          localStorage.setItem("role", "Co-Helper");
          localStorage.setItem("name", result.data.name);
          localStorage.setItem("CoHelperID", result.data._id);
          localStorage.setItem("doctorID", result.data.doctorID);
          localStorage.setItem("CanAcceptAppointment", result.data.CanAcceptAppointment);
          localStorage.setItem("CanAddAppointment", result.data.CanAddAppointment);
          localStorage.setItem("CanSendTickets", result.data.CanSendTickets);
          console.log("Co-Helper login successful!");
          navigate("/dashboard");
        } else if (result.data === "no data found") {
          console.log("Wrong username or password! Please try again.");
        }
      } catch (error) {
        console.error("Error submitting co-helper login:", error);
        console.log("An error occurred. Please try again.");
      }
    } else {
      console.log("Please enter Email ID & Password!");
    }
  };




  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
          onClick={handlesubmit}
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                fullWidth
                // helperText="Incorrect entry."
                error={submitAttempted && !mail}
                onChange={({ target }) => setmail(target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                fullWidth
                error={submitAttempted && !pass}
                onChange={({ target }) => setpass(target.value)}
              />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth onClick={handlesubmit}>
                Sign in
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                You are a?{" "}
              </MDTypography>
              <RadioGroup
                aria-label="role"
                name="role"
                value={selectedRole}
                onChange={handleRoleChange}
                row
                sx={{
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <FormControlLabel value="doctor" control={<Radio />} label="Doctor" />
                <FormControlLabel value="staff" control={<Radio />} label="Staff" />
              </RadioGroup>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
