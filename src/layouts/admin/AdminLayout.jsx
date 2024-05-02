import { SidebarComp } from "../admin/Sidebar";
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
    path: "/admin",
    name: "Dashboard",
    icon: <MdDashboard />,
  },
  {
    path: "/admin/pengguna",
    name: "Pengguna",
    icon: <FaUser />,
  },
  {
    path: "/admin/penitip",
    name: "Penitip",
    icon: <FaPeopleCarry />,
  },
  {
    path: "/admin/bahanbaku",
    name: "Bahan Baku",
    icon: <FaBoxOpen />,
  },
  {
    path: "/admin/pengeluaran",
    name: "Pengeluaran",
    icon: <FaMoneyBillWave />,
  },
];

const AdminLayout = ({ children }) => {
  return (
    <div className="d-flex">
      <SidebarComp routes={routes} />
      {children ? children : <Outlet />}
    </div>
  );
};

export default AdminLayout;
