import { Outlet } from "react-router-dom";
// import component
import TopNavbar from "../user/TopNavBar";
import { useState } from "react";
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
];
const UserLayout = ({ children }) => {
  const [cart, setCart] = useState([]);
  const addToCart = (item) => {
    setCart((prevCart) => [...prevCart, item]);
  };
  return (
    <div className="mt-4 pt-5">
      <TopNavbar routes={routes} cart={cart} addToCart={addToCart} />
      {children ? children : <Outlet />}
    </div>
  );
};
export default UserLayout;
