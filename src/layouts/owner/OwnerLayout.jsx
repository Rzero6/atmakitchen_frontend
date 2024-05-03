import { SidebarComp } from "../../components/Sidebar";
import { Outlet } from "react-router-dom";
import {
  FaUser,
  FaMoneyBillWave,
  FaPeopleCarry,
  FaBoxOpen,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

const routes = [
  {
    path: "/owner",
    name: "Dashboard",
    icon: <MdDashboard />,
  },
  {
    path: "/owner/gaji-bonus",
    name: "Gaji dan Bonus",
    icon: <FaMoneyBillWave />,
  },
];

const OwnerLayout = ({ children }) => {
  return (
    <div className="d-flex">
      <SidebarComp routes={routes} />
      {children ? children : <Outlet />}
    </div>
  );
};

export default OwnerLayout;
