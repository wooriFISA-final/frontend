// src/main.tsx 또는 src/index.tsx
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// 🔹 전역 테마 & 다크모드 컨텍스트
import AppTheme from "./shared-theme/AppTheme";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {/* 앱 전체를 AppTheme로 한 번만 감싸기 */}
    <AppTheme>
      <App />
    </AppTheme>
  </React.StrictMode>
);
