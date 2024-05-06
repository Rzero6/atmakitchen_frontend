import { Outlet } from "react-router-dom";
// import component
import TopNavbar from "../user/TopNavBar";
//mengatur route yang akan ditampilkan di navbar
const routes = [
  {
    path: "/",
    name: "Home",
  },
  {
    path: "/produk",
    name: "Produk",
  },
  {
    path: "/tentang",
    name: "Tentang",
  },
];
const UserLayout = ({ children }) => {
  return (
    <div className="mt-4 pt-5">
      <TopNavbar routes={routes} />
      {children ? children : <Outlet />}
    </div>
  );
};
export default UserLayout;
