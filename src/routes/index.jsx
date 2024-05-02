import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "../layouts/user/pages/Home";
import UserLayout from "../layouts/user/UserLayout";
import AdminLayout from "../layouts/admin/AdminLayout";
import Dashboard from "../layouts/admin/pages/Dashboard";
import Penitip from "../layouts/admin/pages/Penitip";
import KaryawanProtectedRoutes from "./KaryawanProtectedRoutes";
import { AdminLoginPage } from "../layouts/admin/pages/Login";
import Customer from "../layouts/admin/pages/Pengguna";
import BahanBaku from "../layouts/admin/pages/BahanBaku";
import PengeluaranLain from "../layouts/admin/pages/Pengeluaran";
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
            element: <AdminLoginPage />,
          },
        ],
      },
      {
        path: "/admin",
        element: (
          <KaryawanProtectedRoutes>
            <AdminLayout />
          </KaryawanProtectedRoutes>
        ),
        children: [
          { path: "/admin", element: <Dashboard /> },
          { path: "/admin/penitip", element: <Penitip /> },
          { path: "/admin/bahanbaku", element: <BahanBaku /> },
          { path: "/admin/pengeluaran", element: <PengeluaranLain /> },
          { path: "/admin/pengguna", element: <Customer /> },
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
