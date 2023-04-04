import React, { useState, useEffect } from "react";
import { AppShell } from "@mantine/core";
import { Outlet } from "react-router-dom";

const Authentication = () => (
    <AppShell padding={0} fixed={true}>
        <Outlet />
    </AppShell>
);

export default Authentication;