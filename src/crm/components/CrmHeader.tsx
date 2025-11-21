// src/crm/components/CrmHeader.tsx
import * as React from "react";
import { useLocation } from "react-router-dom";   // ✅ 추가
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import MenuButton from "../../dashboard/components/MenuButton";
import CrmSearch from "./CrmSearch";
import CrmNavbarBreadcrumbs from "./CrmNavbarBreadcrumbs";

export default function CrmHeader() {
  const location = useLocation();

  // ✅ 경로별로 보여줄 제목 매핑
  const titleMap: Record<string, string> = {
    "/home": "Home",
    "/plan": "Plan",
    "/reports": "Reports",
    "/": "Home",          // 필요하면 루트도 처리
  };

  // 현재 path에 맞는 제목, 없으면 기본값 Home
  const title = titleMap[location.pathname] ?? "Home";

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
      <Stack direction="column" spacing={1}>
        <CrmNavbarBreadcrumbs />
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: 600, color: "#222222" }}
        >
          {title}
        </Typography>
      </Stack>
      <Stack direction="row" sx={{ gap: 1 }}>
        <CrmSearch />
        <MenuButton showBadge aria-label="Open notifications">
          <NotificationsRoundedIcon />
        </MenuButton>
      </Stack>
    </Stack>
  );
}
