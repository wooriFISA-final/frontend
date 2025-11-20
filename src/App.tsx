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
          <Route path="/auth" element={<AuthPage />} /> {/* ✅ 로그인/회원가입 */}

          {/* 로그인된 사용자만 접근 가능 */}
          <Route
            path="/dashboard/*"
            element={
              <PrivateRoute>
                <CrmDashboard />
              </PrivateRoute>
            }
          />

          {/* fallback */}
          <Route
            path="*"
            element={<div style={{ padding: 40 }}>404: Page Not Found</div>}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}