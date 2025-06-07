// components/StatCard.js
import React from "react";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Icon from "@mui/material/Icon";

const StatCard = ({ title, value, icon, bgColor, gradient, bgImage }) => {
  return (
    <Card
      sx={{
        borderRadius: 4,
        p: 2,
        position: "relative",
        overflow: "hidden",
        color: "#fff",
        background: 'transparent',
        height: '100px',
      }}
    >
      <MDBox display="flex" alignItems="center" height="100%">
        {/* Icon */}
        <MDBox
          bgColor="white"
          p={1.5}
          borderRadius="50%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          mr={2}
        >
          <Icon fontSize="medium" color="inherit">
            {icon}
          </Icon>
        </MDBox>

        {/* Title and Value stacked */}
        <MDBox display="flex" flexDirection="column" justifyContent="center">
          <MDTypography variant="caption" fontWeight="medium" color="light">
            {title}
          </MDTypography>
          <MDTypography variant="h6" fontWeight="bold" color="light">
            {value}
          </MDTypography>
        </MDBox>
      </MDBox>
    </Card>


  );
};

export default StatCard;
