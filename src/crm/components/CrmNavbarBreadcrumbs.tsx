import * as React from "react";
import { useLocation, Link as RouterLink } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function CrmNavbarBreadcrumbs() {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  // 현재 위치의 마지막 세그먼트 (예: /dashboard → "dashboard", /plan → "plan")
  const lastSegment = segments[segments.length - 1];

  // "홈 페이지인지" 판별: / 또는 /dashboard 같은 경우
  const isHomePage =
    segments.length === 0 || (segments.length === 1 && lastSegment === "dashboard");

  // Plan / Reports 등 서브 페이지 라벨
  const subLabel =
    lastSegment && lastSegment !== "dashboard"
      ? capitalizeFirstLetter(lastSegment)
      : "";

  return (
    <Breadcrumbs
      separator={<NavigateNextRoundedIcon fontSize="small" />}
      aria-label="breadcrumb"
      sx={{ mb: 1, color: "#666666" }}
    >
      {/* 항상 나오는 Home 링크 */}
      <Link
        component={RouterLink}
        underline="hover"
        color="inherit"
        to="/dashboard" // Home 누르면 /dashboard 로 이동
        sx={{ display: "flex", alignItems: "center", color: "#0074E9" }}
      >
        <HomeRoundedIcon sx={{ mr: 0.5 }} fontSize="small" />
        Home
      </Link>

      {/* 홈 페이지가 아닐 때만 두 번째 crumb 표시 */}
      {!isHomePage && subLabel && (
        <Typography sx={{ color: "#666666", fontWeight: 500 }}>
          {subLabel}
        </Typography>
      )}
    </Breadcrumbs>
  );
}
