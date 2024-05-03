import { SidebarComp } from "../../components/Sidebar";
import { Outlet } from "react-router-dom";
import {
  FaUser,
  FaMoneyBillWave,
  FaPeopleCarry,
  FaBoxOpen,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { FaPeopleGroup, FaRankingStar } from "react-icons/fa6";
import { GiTakeMyMoney } from "react-icons/gi";
const routes = [
  {
    path: "/mo",
    name: "Dashboard",
    icon: <MdDashboard />,
  },
  {
    path: "/mo/jabatan",
    name: "Jabatan",
    icon: <FaRankingStar />,
  },
  {
    path: "/mo/karyawan",
    name: "Karyawan",
    icon: <FaPeopleGroup />,
  },
  {
    path: "/mo/penitip",
    name: "Penitip",
    icon: <FaPeopleCarry />,
  },
  {
    path: "/mo/pembelian-bahanbaku",
    name: "Pembelian Bahan Baku",
    icon: <GiTakeMyMoney />,
  },
  {
    path: "/mo/pengeluaran-lain",
    name: "Pengeluaran Lain",
    icon: <FaMoneyBillWave />,
  },
];

const MOLayout = ({ children }) => {
  return (
    <div className="d-flex">
      <SidebarComp routes={routes} />
      {children ? children : <Outlet />}
    </div>
  );
};

export default MOLayout;
