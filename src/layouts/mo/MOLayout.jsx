import { SidebarComp } from "../../components/Sidebar";
import { Outlet } from "react-router-dom";
import {
  FaUser,
  FaMoneyBillWave,
  FaPeopleCarry,
  FaBoxOpen,
  FaMoneyBill,
  FaCalendarCheck,
  FaBox,
} from "react-icons/fa";
import { MdBakeryDining, MdDashboard } from "react-icons/md";
import {
  FaMoneyBillTrendUp,
  FaPeopleGroup,
  FaRankingStar,
} from "react-icons/fa6";
import { GiTakeMyMoney } from "react-icons/gi";
import { RiLockPasswordFill } from "react-icons/ri";
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
  {
    path: "/mo/laporan-pemasukan-pengeluaran",
    name: "Pemasukan & Pengeluaran",
    icon: <FaMoneyBill />,
  },
  {
    path: "/mo/laporan-penjualan",
    name: "Penjualan Tahunan",
    icon: <FaMoneyBillTrendUp />,
  },
  {
    path: "/mo/laporan-penjualan-produk",
    name: "Penjualan Produk Bulanan",
    icon: <MdBakeryDining />,
  },
  {
    path: "/mo/laporan-presensi-gaji",
    name: "Presensi & Gaji",
    icon: <FaCalendarCheck />,
  },
  {
    path: "/mo/laporan-penggunaan-bahan-baku",
    name: "Penggunaan Bahan Baku",
    icon: <FaBoxOpen />,
  },
  {
    path: "/mo/laporan-stok-hari-ini",
    name: "Stok Hari Ini",
    icon: <FaBox />,
  },
  {
    path: "/mo/laporan-rekap-penitip",
    name: "Rekap Penitip",
    icon: <FaPeopleCarry />,
  },
  {
    path: "/mo/change-password",
    name: "Ubah Password",
    icon: <RiLockPasswordFill />,
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
