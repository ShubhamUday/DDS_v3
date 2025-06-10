import React from 'react';
import { Button } from '@mui/material';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DefaultNavbar from 'examples/Navbars/DefaultNavbar';
import MDBox from "components/MDBox";
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import StaffCard from './staffCard';
import MDButton from 'components/MDButton';

function StaffList() {
  const drID = localStorage.getItem('doctorID');
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const handleAddStaff = () => {
    navigate(`/add-staff/${drID}`);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox sx={{ padding: 3 }}>
        {
          role === "Doctor" &&
          <MDBox display="flex" justifyContent="flex-end" mb={3}>
            <MDButton
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddStaff}
              sx={{ textTransform: "none", borderRadius: 2 }}
            >
              Add Staff
            </MDButton>
          </MDBox>
        }

        {/* Staff Cards */}
        <StaffCard />
      </MDBox>
    </DashboardLayout>
  );
}

export default StaffList;
