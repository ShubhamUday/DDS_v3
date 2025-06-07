import { useState, useEffect } from "react";
import axios from "axios";

export default function Data() {

  
  const [appointmentdata, setAppointmentdata] = useState([]);

  const getAllAppointments = async () => {
    const drID = localStorage.getItem("doctorID");
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_HOS}/get-single-doctor-with-appointment/${drID}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const appointments = result.data.appointmentID;
      setAppointmentdata(appointments);
      console.log("appointments", appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    getAllAppointments();
  }, []);

  // Define the columns for the DataTable
  const columns = [
    { Header: "Date", accessor: "date", align: "center" },
    { Header: "Patient", accessor: "project", align: "center" },
    { Header: "Doctor", accessor: "status", align: "center" },
    { Header: "Clinic", accessor: "completion", align: "center" },
    { Header: "Gender", accessor: "action", align: "center" },
    { Header: "Age", accessor: "budget", align: "center" },
    { Header: "Status", accessor: "action1", align: "center" },
  ];

  return { appointmentdata, columns };
}
