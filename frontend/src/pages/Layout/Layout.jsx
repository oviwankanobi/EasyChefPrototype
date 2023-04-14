import React, { useState, useEffect } from "react";
import { AppShell, Header } from "@mantine/core";
import EasyChefHeader from "../../components/Header.jsx";
import { links } from "../../utils/mock.jsx";
import { Outlet } from "react-router-dom";
import axios from "axios";

function setAuthToken() {
  const authToken = localStorage.getItem("access_token");
  if (authToken) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
  }
}

const Layout = () => {
  useEffect(() => {
    setAuthToken();
  }, []);

  return (
    <AppShell
      header={
        <Header height={60} p="xs">
          {<EasyChefHeader props={links} />}
        </Header>
      }
    >
      <Outlet />
    </AppShell>
  );
};

export default Layout;
