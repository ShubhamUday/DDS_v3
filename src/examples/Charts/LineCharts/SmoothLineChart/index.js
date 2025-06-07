// AppointmentStatusChart.js
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";

// MUI + MD2 Components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

// Dummy data
const data = {
  labels: ["Aug 20", "Aug 21", "Aug 22", "Aug 23", "Aug 24", "Aug 25"],
  datasets: [
    {
      label: "Appointments",
      data: [2, 15, 7, 18, 5, 17],
      fill: false,
      borderColor: "#00BFA6",
      tension: 0.4,
      borderWidth: 3,
      pointBackgroundColor: "#00BFA6",
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      callbacks: {
        label: (ctx) => `${ctx.raw} Appointments`,
      },
    },
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 5,
      },
      grid: {
        drawBorder: false,
      },
    },
    x: {
      grid: {
        drawBorder: false,
      },
    },
  },
};

const SmoothLineChart = () => {
  return (
    <Card sx={{ width: "100%", height: "320px", p: 2, borderRadius: 3, boxShadow: 3 }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <MDBox display="flex" alignItems="center" gap={1}>
          <MDTypography variant="button" fontWeight="medium">
            September 2023
          </MDTypography>
          <IconButton size="small">
            <Icon>chevron_left</Icon>
          </IconButton>
          <IconButton size="small">
            <Icon>chevron_right</Icon>
          </IconButton>
        </MDBox>
        <TextField select size="small" value="Week" sx={{ width: 100 }}>
          <MenuItem value="Day">Day</MenuItem>
          <MenuItem value="Week">Week</MenuItem>
          <MenuItem value="Month">Month</MenuItem>
        </TextField>
      </MDBox>

      <MDTypography variant="h6" mb={1}>
        Appointment Status
      </MDTypography>

      <MDBox height="200px">
        <Line data={data} options={options} />
      </MDBox>
    </Card>
  );
};

export default SmoothLineChart;
