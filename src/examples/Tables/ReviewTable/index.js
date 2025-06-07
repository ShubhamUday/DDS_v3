import React from "react";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Dummy Data
const reviews = [
  {
    name: "Dr. Sair Naif",
    specialty: "Orthopedics",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    patients: 150,
    rating: 3,
  },
  {
    name: "Dr. Sair Naif",
    specialty: "Orthopedics",
    image: "https://randomuser.me/api/portraits/men/30.jpg",
    patients: 150,
    rating: 5,
  },
  {
    name: "Dr. Sair Naif",
    specialty: "Orthopedics",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    patients: 150,
    rating: 5,
  },
];

const PatientReview = () => {
  return (
    <Card sx={{ borderRadius: 3, p: 2 }}>
      {/* Header */}
      <MDBox display="flex" justifyContent="space-between" mb={2}>
        <MDTypography variant="h6">Patient Review</MDTypography>
        <MDTypography variant="button" color="info" sx={{ cursor: "pointer" }}>
          View all
        </MDTypography>
      </MDBox>

      {/* Review List */}
      {reviews.map((doc, index) => (
        <MDBox
          key={index}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          {/* Left: Avatar & Name */}
          <MDBox display="flex" alignItems="center">
            <Avatar
              src={doc.image}
              alt={doc.name}
              sx={{ width: 40, height: 40, mr: 1.5 }}
            />
            <MDBox>
              <MDTypography variant="button" fontWeight="medium">
                {doc.name}
              </MDTypography>
              <MDTypography variant="caption" color="text">
                {doc.specialty}
              </MDTypography>

              {/* Stars */}
              <MDBox display="flex" alignItems="center" mt={0.5}>
                {[...Array(doc.rating)].map((_, i) => (
                  <Icon key={i} fontSize="small" color="warning">
                    star
                  </Icon>
                ))}
              </MDBox>
            </MDBox>
          </MDBox>

          {/* Right: Patients Count */}
          <MDTypography variant="caption" color="text" fontWeight="regular">
            {doc.patients} Patients
          </MDTypography>
        </MDBox>
      ))}
    </Card>
  );
};

export default PatientReview;
