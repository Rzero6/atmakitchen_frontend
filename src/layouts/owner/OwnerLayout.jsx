import { SidebarComp } from "../../components/Sidebar";
import { Outlet } from "react-router-dom";
import {
  FaUser,
  FaMoneyBillWave,
  FaPeopleCarry,
  FaBoxOpen,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
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
  {
    path: "/owner/change-password",
    name: "Ubah Password",
    icon: <RiLockPasswordFill />,
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
