import { SidebarComp } from "../../components/Sidebar";
import { Outlet } from "react-router-dom";
import {
  FaUser,
  FaMoneyBillWave,
  FaPeopleCarry,
  FaBoxOpen,
  FaDailymotion,
  FaCalendarCheck,
  FaMoneyBill,
  FaBreadSlice,
  FaBox,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { MdBakeryDining } from "react-icons/md";
const routes = [
  {
    path: "/owner",
    name: "Dashboard",
    icon: <MdDashboard />,
  },
  {
    path: "/owner/laporan-pemasukan-pengeluaran",
    name: "Pemasukan & Pengeluaran",
    icon: <FaMoneyBill />,
  },
  {
    path: "/owner/laporan-penjualan",
    name: "Penjualan Tahunan",
    icon: <FaMoneyBillTrendUp />,
  },
  {
    path: "/owner/laporan-penjualan-produk",
    name: "Penjualan Produk Bulanan",
    icon: <MdBakeryDining />,
  },
  {
    path: "/owner/laporan-presensi-gaji",
    name: "Presensi & Gaji",
    icon: <FaCalendarCheck />,
  },
  {
    path: "/owner/laporan-penggunaan-bahan-baku",
    name: "Penggunaan Bahan Baku",
    icon: <FaBoxOpen />,
  },
  {
    path: "/owner/laporan-stok-hari-ini",
    name: "Stok Hari Ini",
    icon: <FaBox />,
  },
  {
    path: "/owner/laporan-rekap-penitip",
    name: "Rekap Penitip",
    icon: <FaPeopleCarry />,
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
