import React, { useState, useEffect } from "react";
import { AppShell, Header } from "@mantine/core";
import EasyChefHeader from "../../components/Header.jsx";
import { links } from "../../utils/mock.jsx";
import { Outlet } from "react-router-dom";

const Layout = () => {
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
