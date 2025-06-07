import React, { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { Link } from "react-router-dom";
import axios from "axios";

const AppointmentsList = ({ appointmentIDs }) => {
  const [appointments, setAppointments] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const responses = await Promise.all(
          appointmentIDs.map((id) =>
            axios.get(`${process.env.REACT_APP_HOS}/get-single-appointment-with-details/${id}`)
          )
        );
        const data = responses.map((res) => res.data);
        console.log(data);
        setAppointments(data);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      }
    };

    if (appointmentIDs?.length > 0) {
      fetchAppointments();
    }
  }, [appointmentIDs]);

  const validAppointments = appointments.filter((appointment) => appointment.Bookdate);
  const visibleAppointments = showAll ? validAppointments : validAppointments.slice(0, 3);

  return (
    <MDBox p={2}>
      {visibleAppointments.length > 0 ? (
        visibleAppointments.map((appointment, index) => (
          <MDBox key={index} component="li" display="flex" alignItems="center" mb={1}>
            <MDBox
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="center"
            >
              <MDTypography
                variant="caption"
                color="text"
                sx={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "200px",
                }}
              >
                Date:{" "}
                {new Date(appointment.Bookdate).toLocaleDateString("en-GB").replaceAll("/", "-")}{" "}
                Time: {appointment.BookTime}
              </MDTypography>
            </MDBox>
            <MDBox ml="auto">
              <MDButton component={Link} to={`/appointment-with-details/${appointment._id}`}>
                View
              </MDButton>
            </MDBox>
          </MDBox>
        ))
      ) : (
        <MDTypography variant="caption" color="text" textAlign="center">
          No upcoming appointments.
        </MDTypography>
      )}

      {!showAll && validAppointments.length > 3 && (
        <MDBox textAlign="center" mt={2}>
          <MDButton onClick={() => setShowAll(true)} variant="outlined" color="primary">
            View All
          </MDButton>
        </MDBox>
      )}
    </MDBox>
  );
};

export default AppointmentsList;
