// src/crm/components/CrmHeader.tsx
import { useLocation } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import CrmSearch from "./CrmSearch";
import CrmNavbarBreadcrumbs from "./CrmNavbarBreadcrumbs";

export default function CrmHeader() {
  const location = useLocation();

  // 현재 경로에서 첫 세그먼트 추출: /home, /plan, /reports ...
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const firstSegment = pathSegments[0] ?? "home";

  // 경로별로 헤더 타이틀 매핑
  const titleMap: Record<string, string> = {
    home: "Home",
    plan: "Plan",
    reports: "Reports",
    settings: "",
    help: "",
    profile: "",
  };

  const pageTitle = titleMap[firstSegment] ?? "Home";

  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: "none", md: "flex" },
        width: "100%",
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
        maxWidth: { sm: "100%", md: "1700px" },
        pt: 1.5,
      }}
      spacing={2}
    >
      {/* 왼쪽: breadcrumb + 페이지 타이틀 */}
      <Stack direction="column" spacing={1}>
        <CrmNavbarBreadcrumbs />
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 600,
            color: "text.primary", // 🔹 라이트/다크 모드 모두에서 잘 보이게
          }}
        >
          {pageTitle}
        </Typography>
      </Stack>

      {/* 오른쪽: 검색창 + 알림 아이콘 등 */}
      <Stack
        direction="row"
        spacing={1.5}
        sx={{
          alignItems: "center",
        }}
      >
        <CrmSearch />
        <IconButton
          size="small"
          sx={{
            borderRadius: 2,
          }}
        >
          <NotificationsRoundedIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Stack>
  );
}
