// src/crm/CrmDashboard.tsx
import * as React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import type {} from "@mui/x-charts/themeAugmentation";
import type {} from "@mui/x-data-grid-pro/themeAugmentation";
import type {} from "@mui/x-tree-view/themeAugmentation";

import { ThemeProvider, createTheme, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import CrmAppNavbar from "./components/CrmAppNavbar";
import CrmHeader from "./components/CrmHeader";
import CrmSideMenu from "./components/CrmSideMenu";
import CrmMainDashboard from "./components/CrmMainDashboard";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Plan from "./pages/Plan";
import Profile from "./pages/Profile";
import HelpSupport from "./pages/HelpSupport";

import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "../dashboard/theme/customizations";

// 🔹 이 페이지에서만 사용할 MUI X 컴포넌트 커스터마이징
const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function CrmDashboard() {
  const location = useLocation();
  const isPlanPage = location.pathname === "/plan";

  // 🔹 AppTheme에서 내려준 전역 theme (light/dark 모드 포함)
  const baseTheme = useTheme();

  // 🔹 baseTheme를 바탕으로, 이 화면에서만 MUI X 커스터마이징 추가
  const crmTheme = React.useMemo(
    () =>
      createTheme({
        ...baseTheme,
        components: {
          ...baseTheme.components,
          ...xThemeComponents,
        },
      }),
    [baseTheme]
  );

  return (
    <ThemeProvider theme={crmTheme}>
      <Box sx={{ display: "flex", height: "100vh" }}>
        <CrmSideMenu />
        <CrmAppNavbar />
        {/* Main content */}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            // 🔹 라이트/다크 모드에 따라 자동으로 바뀌게
            backgroundColor: theme.palette.background.default,
            overflow: isPlanPage ? "hidden" : "auto",
          })}
        >
          {/* Plan 페이지 빼고는 공통 헤더 노출 */}
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
            {/* ✅ /home 이 기존 대시보드(Home) 화면 */}
            <Route
              path="/home"
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

            {/* ✅ 예전 주소 /dashboard 로 들어오면 /home 으로 리다이렉트 */}
            <Route path="/dashboard" element={<Navigate to="/home" replace />} />

            <Route
              path="/reports"
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

            <Route path="/plan" element={<Plan />} />

            <Route
              path="/settings"
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

            <Route
              path="/profile"
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
                  <Profile />
                </Stack>
              }
            />

            {/* 🔹 Help & Support 페이지 라우트 */}
            <Route
              path="/help"
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
                  <HelpSupport />
                </Stack>
              }
            />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
