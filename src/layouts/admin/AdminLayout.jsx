import { SidebarComp } from "../../components/Sidebar";
import { Outlet } from "react-router-dom";
import {
  FaUser,
  FaMoneyBillWave,
  FaPeopleCarry,
  FaBoxOpen,
  FaList,
  FaGift,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { LuCakeSlice } from "react-icons/lu";
const routes = [
  {
    path: "/admin",
    name: "Dashboard",
    icon: <MdDashboard />,
  },
  {
    path: "/admin/pelanggan",
    name: "Pelanggan",
    icon: <FaUser />,
  },
  {
    path: "/admin/produk",
    name: "Produk",
    icon: <LuCakeSlice />,
  },
  {
    path: "/admin/resep",
    name: "Resep",
    icon: <FaList />,
  },
  {
    path: "/admin/bahanbaku",
    name: "Bahan Baku",
    icon: <FaBoxOpen />,
  },
  {
    path: "/admin/hampers",
    name: "Hampers",
    icon: <FaGift />,
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
