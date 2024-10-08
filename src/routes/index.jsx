import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "../layouts/user/pages/Home";
import UserLayout from "../layouts/user/UserLayout";
import AdminLayout from "../layouts/admin/AdminLayout";
import Penitip from "../layouts/mo/pages/Penitip";
import AdminProtectedRoutes from "./AdminProtectedRoutes";
import MOProtectedRoutes from "./MOProtectedRoutes";
import OwnerProtectedRoutes from "./OwnerProctectedRoutes";
import { LoginPage } from "../layouts/Login";
import Customer from "../layouts/admin/pages/Customer";
import BahanBaku from "../layouts/admin/pages/BahanBaku";
import PengeluaranLain from "../layouts/mo/pages/Pengeluaran";
import { ResetPasswordPage } from "../layouts/ResetPassword";
import OwnerLayout from "../layouts/owner/OwnerLayout";
import MOLayout from "../layouts/mo/MOLayout";
import Karyawan from "../layouts/mo/pages/Karyawan";
import Produk from "../layouts/admin/pages/Produk";
import Hampers from "../layouts/admin/pages/Hampers";
import CustomerProtectedRoutes from "./CustomerProtectedRoutes";
import Profile from "../layouts/user/pages/Profile";
import PembelianBahanBaku from "../layouts/mo/pages/PembelianBahanBaku";
import Resep from "../layouts/admin/pages/Resep";
import { ChangePasswordPage } from "../layouts/changePassword";
import GajiDanBonus from "../layouts/owner/pages/GajiDanBonus";
import ShowAllProduk from "../layouts/user/pages/ProdukShowRoom/ShowAllProduk";
import { GlobalStateProvider } from "../api/contextAPI";
import PesananTabs from "../layouts/user/pages/pesanan/Pesanan";
import DashboardAdmin from "../layouts/admin/pages/Dashboard";
import DashboardMO from "../layouts/mo/pages/Dashboard";
import DashboardOwner from "../layouts/owner/pages/Dashboard";
import Cart from "../layouts/user/pages/pesanan/Cart";
import PenarikanSaldo from "../layouts/user/pages/TarikSaldo";
import KonfirmasiTarikSaldo from "../layouts/admin/pages/KonfirmasiTarikSaldo";
import LaporanPresensidanGaji from "../layouts/owner/pages/LaporanPresensidanGaji";
import LaporanPemasukandanPengeluaran from "../layouts/owner/pages/LaporanPemasukandanPengeluaran";
import LaporanRekapPenitip from "../layouts/owner/pages/LaporanRekapTransaksiPenitip";
import LaporanPenjualan from "../layouts/owner/pages/LaporanPenjualan";
import LaporanStokHariIni from "../layouts/owner/pages/LaporanStokHariIni";
import LaporanPenjualanProduk from "../layouts/owner/pages/LaporanPenjualanProduk";
import LaporanPenggunaanBahanBaku from "../layouts/owner/pages/LaporanPenggunaanBahanBaku";

const router = createBrowserRouter([
  {
    path: "*",
    element: <div>Routes Not Found!</div>,
  },
  {
    children: [
      {
        path: "/",
        element: <UserLayout />,
        children: [
          { path: "/", element: <Home /> },
          {
            path: "/produk",
            element: <ShowAllProduk />,
          },
        ],
      },
      {
        children: [
          {
            path: "/login",
            element: <LoginPage />,
          },
          {
            path: "/password/reset",
            element: <ResetPasswordPage />,
          },
        ],
      },
      {
        path: "/",
        element: (
          <CustomerProtectedRoutes>
            <UserLayout />
          </CustomerProtectedRoutes>
        ),
        children: [
          { path: "/profile", element: <Profile /> },
          { path: "/pesanan", element: <PesananTabs /> },
          { path: "/change-password", element: <ChangePasswordPage /> },
          {
            path: "/cart",
            element: <Cart />,
          },
          {
            path: "/saldo",
            element: <PenarikanSaldo />,
          },
        ],
      },
      {
        path: "/admin",
        element: (
          <AdminProtectedRoutes>
            <AdminLayout />
          </AdminProtectedRoutes>
        ),
        children: [
          { path: "/admin", element: <DashboardAdmin /> },
          { path: "/admin/pelanggan", element: <Customer /> },
          { path: "/admin/bahanbaku", element: <BahanBaku /> },
          { path: "/admin/produk", element: <Produk /> },
          { path: "/admin/resep", element: <Resep /> },
          { path: "/admin/hampers", element: <Hampers /> },
          { path: "/admin/change-password", element: <ChangePasswordPage /> },
          {
            path: "/admin/konfirmasi-tarik-saldo",
            element: <KonfirmasiTarikSaldo />,
          },
        ],
      },
      {
        path: "/mo",
        element: (
          <MOProtectedRoutes>
            <MOLayout />
          </MOProtectedRoutes>
        ),
        children: [
          { path: "/mo", element: <DashboardMO /> },
          // { path: "/mo/jabatan", element: <Customer /> },
          { path: "/mo/karyawan", element: <Karyawan /> },
          { path: "/mo/penitip", element: <Penitip /> },
          { path: "/mo/pembelian-bahanbaku", element: <PembelianBahanBaku /> },
          { path: "/mo/pengeluaran-lain", element: <PengeluaranLain /> },
          { path: "/mo/change-password", element: <ChangePasswordPage /> },
          {
            path: "/mo/laporan-presensi-gaji",
            element: <LaporanPresensidanGaji />,
          },
          {
            path: "/mo/laporan-pemasukan-pengeluaran",
            element: <LaporanPemasukandanPengeluaran />,
          },
          {
            path: "/mo/laporan-rekap-penitip",
            element: <LaporanRekapPenitip />,
          },
          {
            path: "/mo/laporan-penjualan",
            element: <LaporanPenjualan />,
          },
          {
            path: "/mo/laporan-stok-hari-ini",
            element: <LaporanStokHariIni />,
          },
          {
            path: "/mo/laporan-penggunaan-bahan-baku",
            element: <LaporanPenggunaanBahanBaku />,
          },
          {
            path: "/mo/laporan-penjualan-produk",
            element: <LaporanPenjualanProduk />,
          },
        ],
      },
      {
        path: "/owner",
        element: (
          <OwnerProtectedRoutes>
            <OwnerLayout />
          </OwnerProtectedRoutes>
        ),
        children: [
          { path: "/owner", element: <DashboardOwner /> },
          { path: "/owner/change-password", element: <ChangePasswordPage /> },
          { path: "/owner/gaji-bonus", element: <GajiDanBonus /> },
          {
            path: "/owner/laporan-presensi-gaji",
            element: <LaporanPresensidanGaji />,
          },
          {
            path: "/owner/laporan-pemasukan-pengeluaran",
            element: <LaporanPemasukandanPengeluaran />,
          },
          {
            path: "/owner/laporan-rekap-penitip",
            element: <LaporanRekapPenitip />,
          },
          {
            path: "/owner/laporan-penjualan",
            element: <LaporanPenjualan />,
          },
          {
            path: "/owner/laporan-stok-hari-ini",
            element: <LaporanStokHariIni />,
          },
          {
            path: "/owner/laporan-penggunaan-bahan-baku",
            element: <LaporanPenggunaanBahanBaku />,
          },
          {
            path: "/owner/laporan-penjualan-produk",
            element: <LaporanPenjualanProduk />,
          },
        ],
      },
    ],
  },
]);
const AppRouter = () => {
  return (
    <GlobalStateProvider>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <RouterProvider router={router} />
    </GlobalStateProvider>
  );
};
export default AppRouter;
