import React from "react";
import { useState } from "react";
import { FaBars, FaTimesCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./sidebar.css";
import { Sidebar, Menu, MenuItem, menuClasses } from "react-pro-sidebar";
import { Button, Row, Col, Stack } from "react-bootstrap";
import LogoutConfirmation from "./modals/LogoutConfirmation";
import { Icon } from "@mui/material";

export const SidebarComp = ({ routes }) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("user")));
  const [role, setRole] = useState(sessionStorage.getItem("role"));
  const [selectedRoute, setSelectedRoute] = useState("");
  const [showTitle, setShowTitle] = useState(true);
  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
    setShowTitle(false);
    setTimeout(() => {
      setShowTitle(true);
    }, 150);
  };

  const menuItemStyles = {
    root: {
      fontSize: "16px",
      fontWeight: 400,
    },
    icon: {
      [`&.${menuClasses.disabled}`]: {
        color: "#163f5a",
      },
      "&:hover": {
        backgroundColor: "#6EC5FF",
        color: "#040404",
      },
      "&:active": {
        color: "#2EACFF",
      },
    },
    SubMenuExpandIcon: {
      color: "#b6b7b9",
    },
    button: {
      [`&.${menuClasses.disabled}`]: {
        color: "#163f5a",
      },
      "&:hover": {
        backgroundColor: "#6EC5FF",
        color: "#040404",
      },
      "&:active": {
        color: "#2EACFF",
      },
    },
    selected: {
      backgroundColor: "#006E90",
      color: "#FFFFFF",
    },
  };

  return (
    <div className="sidebar-container">
      <Sidebar collapsed={collapsed}>
        <Row
          className={`sidebar-header ${
            collapsed
              ? "justify-content-center"
              : "justify-content-between px-4"
          }`}
        >
          {!collapsed && showTitle && (
            <Col sm="auto" style={{ fontSize: "larger", fontWeight: "bold" }}>
              {role}
            </Col>
          )}
          <Col sm="auto" className="">
            <Icon
              variant="light"
              className="collapse-button"
              onClick={handleToggleSidebar}
              style={{ display: "flex", alignItems: "center" }}
            >
              {collapsed ? <FaBars /> : <FaTimesCircle />}
            </Icon>
          </Col>
        </Row>
        <Menu menuItemStyles={menuItemStyles}>
          {routes?.map((route, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                navigate(route.path);
                setSelectedRoute(route.path);
              }}
              icon={route.icon}
              style={
                selectedRoute === route.path ? menuItemStyles.selected : null
              }
            >
              {route.name}
            </MenuItem>
          ))}
          <LogoutConfirmation />
        </Menu>
      </Sidebar>
    </div>
  );
};
