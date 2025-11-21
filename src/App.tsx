// App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "./auth/AuthContext";
import { PrivateRoute } from "./auth/PrivateRoute";
import MarketingPage from "./marketing-page/MarketingPage";
import CrmDashboard from "./crm/CrmDashboard";
import AuthPage from "./auth/AuthPage.tsx";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <CssBaseline enableColorScheme />
        <Routes>
          {/* 비로그인 시 진입 페이지 */}
          <Route path="/" element={<MarketingPage />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* ✅ 로그인 이후 모든 앱 경로는 CrmDashboard 레이아웃 사용
              /dashboard, /plan, /reports, /settings ... 전부 여기서 처리 */}
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <CrmDashboard />
              </PrivateRoute>
            }
          />
                    {/* <Route path="*" element={<Navigate to="/home" replace />} /> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
