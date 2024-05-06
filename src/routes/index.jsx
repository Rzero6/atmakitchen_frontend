import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "../layouts/user/pages/Home";
import UserLayout from "../layouts/user/UserLayout";
import AdminLayout from "../layouts/admin/AdminLayout";
import Dashboard from "../layouts/admin/pages/Dashboard";
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
import CustomerProtectedRoutes from "./CustomerProtectedRoutes";
import Profile from "../layouts/user/pages/Profile";
import RiwayatPesanan from "../layouts/user/pages/RiwayatPesanan";
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
        children: [{ path: "/", element: <Home /> }],
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
          { path: "/riwayat-pesanan", element: <RiwayatPesanan /> },
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
          { path: "/admin", element: <Dashboard /> },
          { path: "/admin/pelanggan", element: <Customer /> },
          { path: "/admin/bahanbaku", element: <BahanBaku /> },
          // { path: "/admin/produk", element: <Produk /> },
          // { path: "/admin/resep", element: <Resep /> },
          // { path: "/admin/hampers", element: <Hampers /> },
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
          { path: "/mo", element: <Dashboard /> },
          // { path: "/mo/jabatan", element: <Customer /> },
          { path: "/mo/karyawan", element: <Karyawan /> },
          { path: "/mo/penitip", element: <Penitip /> },
          // { path: "/mo/pembelian-bahanbaku", element: <PengeluaranLain /> },
          { path: "/mo/pengeluaran-lain", element: <PengeluaranLain /> },
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
          { path: "/owner", element: <Dashboard /> },
          // { path: "/owner/gaji-bonus", element: <Penitip /> },
        ],
      },
    ],
  },
]);
const AppRouter = () => {
  return (
    <>
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
    </>
  );
};
export default AppRouter;
