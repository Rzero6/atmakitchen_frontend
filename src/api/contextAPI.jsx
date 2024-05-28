import React, { createContext, useState, useEffect } from "react";

export const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <GlobalStateContext.Provider value={{ cart, setCart }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
