import Dashboard from "layouts/dashboard";
import Appointments from "layouts/tables";
import Notifications from "layouts/notifications";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import Patients from "Pages/Patients";
import Earning from "Pages/Earnings";
import Clinics from "Pages/clinic/Clinics";
import Calendar from "Pages/Calendar";
import Staffs from "Pages/staff/Staffs";
import DoctorProfile from "Pages/DoctorProfile";
// @mui icons
import Icon from "@mui/material/Icon";
import Test from "DetailPages/Test";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">home</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Appointments",
    key: "appointments",
    icon: <Icon fontSize="small">date_range</Icon>,
    route: "/appointments",
    component: <Appointments />,
  },
  {
    type: "collapse",
    name: "Calendar",
    key: "calendar",
    icon: <Icon fontSize="small">calendar_month</Icon>,
    route: "/calendar",
    component: <Calendar />,
  },
  {
    type: "collapse",
    name: "Patients",
    key: "patients",
    icon: <Icon fontSize="small">group</Icon>,
    route: "/patients",
    component: <Patients />,
  },
  {
    type: "collapse",
    name: "Earnings",
    key: "earnings",
    icon: <Icon fontSize="small">currency_rupee</Icon>,
    route: "/earnings",
    component: <Earning />,
  },
  {
    type: "collapse",
    name: "Clinics",
    key: "clinics",
    icon: <Icon fontSize="small">health_and_safety</Icon>,
    route: "/clinics",
    component: <Clinics />,
  },
  {
    type: "collapse",
    name: "Staffs",
    key: "staffs",
    icon: <Icon fontSize="small">person_apron</Icon>,
    route: "/staffs",
    component: <Staffs />,
  },
  // {
  //   type: "collapse",
  //   name: "Test",
  //   key: "profile",
  //   icon: <Icon fontSize="small">medical_information</Icon>,
  //   route: "/test",
  //   component: <Test />,
  // },
];

export default routes;
