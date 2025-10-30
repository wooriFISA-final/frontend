import * as React from "react";
import { Outlet, Routes, Route, useLocation } from "react-router-dom";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import type {} from "@mui/x-charts/themeAugmentation";
import type {} from "@mui/x-data-grid-pro/themeAugmentation";
import type {} from "@mui/x-tree-view/themeAugmentation";
import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import CrmAppNavbar from "./components/CrmAppNavbar";
import CrmHeader from "./components/CrmHeader";
import CrmSideMenu from "./components/CrmSideMenu";
import CrmMainDashboard from "./components/CrmMainDashboard";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Plan from "./pages/Plan";
import AppTheme from "../shared-theme/AppTheme";
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "../dashboard/theme/customizations";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function CrmDashboard() {
  const location = useLocation();
  const isPlanPage = location.pathname === "/plan";

  return (
    <AppTheme themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex", height: "100vh" }}>
        <CrmSideMenu />
        <CrmAppNavbar />
        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            backgroundColor: "#F8F9FB",
            overflow: isPlanPage ? "hidden" : "auto",
          }}
        >
          {!isPlanPage && (
            <Stack
              spacing={2}
              sx={{
                alignItems: "center",
                mx: 3,
                pb: 5,
                mt: { xs: 8, md: 0 },
              }}
            >
              <CrmHeader />
            </Stack>
          )}
          <Routes>
            <Route
              index
              element={
                <Stack
                  spacing={2}
                  sx={{
                    alignItems: "center",
                    mx: 3,
                    pb: 5,
                    mt: { xs: 8, md: 0 },
                  }}
                >
                  <CrmMainDashboard />
                </Stack>
              }
            />
            <Route
              path="reports"
              element={
                <Stack
                  spacing={2}
                  sx={{
                    alignItems: "center",
                    mx: 3,
                    pb: 5,
                    mt: { xs: 8, md: 0 },
                  }}
                >
                  <Reports />
                </Stack>
              }
            />
            <Route path="plan" element={<Plan />} />
            <Route
              path="settings"
              element={
                <Stack
                  spacing={2}
                  sx={{
                    alignItems: "center",
                    mx: 3,
                    pb: 5,
                    mt: { xs: 8, md: 0 },
                  }}
                >
                  <Settings />
                </Stack>
              }
            />
          </Routes>
          <Outlet />
        </Box>
      </Box>
    </AppTheme>
  );
}
