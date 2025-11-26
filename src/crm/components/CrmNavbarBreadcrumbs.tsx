// src/crm/components/CrmNavbarBreadcrumbs.tsx
import { useLocation, Link as RouterLink } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";

function capitalizeFirstLetter(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function CrmNavbarBreadcrumbs() {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  const lastSegment = segments[segments.length - 1];

  // 🔹 /, /home, /dashboard 를 홈 페이지로 취급
  const isHomePage =
    segments.length === 0 ||
    (segments.length === 1 &&
      (lastSegment === "dashboard" || lastSegment === "home"));

  const subLabel =
    lastSegment &&
    lastSegment !== "dashboard" &&
    lastSegment !== "home"
      ? capitalizeFirstLetter(lastSegment)
      : "";

  return (
    <Breadcrumbs
      separator={<NavigateNextRoundedIcon fontSize="small" />}
      aria-label="breadcrumb"
      sx={{ mb: 1, color: "text.secondary" }} // 🔹 기본 글자색은 보조 텍스트 색
    >
      {/* 항상 나오는 Home 링크 */}
      <Link
        component={RouterLink}
        underline="hover"
        to="/home" // 🔹 홈으로 이동
        sx={(theme) => ({
          display: "flex",
          alignItems: "center",
          color: theme.palette.primary.main, // 🔹 브랜드 블루
        })}
      >
        <HomeRoundedIcon sx={{ mr: 0.5 }} fontSize="small" />
        Home
      </Link>

      {/* 홈 페이지가 아닐 때만 두 번째 crumb 표시 */}
      {!isHomePage && subLabel && (
        <Typography
          sx={{
            color: "text.secondary",
            fontWeight: 500,
          }}
        >
          {subLabel}
        </Typography>
      )}
    </Breadcrumbs>
  );
}
