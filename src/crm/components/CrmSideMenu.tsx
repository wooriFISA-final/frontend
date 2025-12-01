// src/crm/components/CrmSideMenu.tsx
import * as React from "react";

import Avatar from "@mui/material/Avatar";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import CrmMenuContent from "./CrmMenuContent";
import CrmOptionsMenu from "./CrmOptionsMenu";
import { useAuth } from "../../auth/AuthContext";

const drawerWidthExpanded = 240;
const drawerWidthCollapsed = 80;

export default function CrmSideMenu() {
  const auth = useAuth();
  const { isLoggedIn, userName } = auth;
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  // 디버깅용
  console.log("CrmSideMenu auth:", auth);

  // userName 기반 이니셜
  const initials = React.useMemo(() => {
    if (userName) {
      const trimmed = userName.trim();
      if (trimmed.length <= 2) return trimmed.toUpperCase();
      return trimmed.slice(-2).toUpperCase();
    }
    return "U";
  }, [userName]);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: { xs: "none", md: "flex" },
        width: isCollapsed ? drawerWidthCollapsed : drawerWidthExpanded,
        transition: "width 0.3s ease",
        flexShrink: 0,
      }}
    >
      <Box
        sx={(theme) => ({
          width: "100%",
          bgcolor: theme.palette.background.paper, // 🔹 사이드바 배경
          borderRight: `1px solid ${theme.palette.divider}`,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          boxShadow: theme.shadows[1],
        })}
      >
        {/* 상단 접기 버튼 */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: "calc(var(--template-frame-height, 0px) + 4px)",
            p: 1.5,
            minHeight: 72,
          }}
        >
          <Box
            component="button"
            onClick={toggleSidebar}
            type="button"
            sx={(theme) => ({
              display: "flex",
              alignItems: "center",
              appearance: "none",
              backgroundColor: theme.palette.background.paper,
              borderColor: theme.palette.divider,
              borderRadius: "8px",
              borderStyle: "solid",
              borderWidth: "1px",
              color: theme.palette.primary.main,
              fontSize: "18px",
              fontWeight: 500,
              height: "36px",
              justifyContent: "center",
              letterSpacing: "normal",
              lineHeight: "27px",
              position: "relative",
              transitionDuration: "0.2s",
              userSelect: "none",
              verticalAlign: "middle",
              width: "36px",
              padding: "4px",
              cursor: "pointer",
            })}
          >
            <ChevronLeftRoundedIcon
              sx={(theme) => ({
                fontSize: "16px",
                fontWeight: 500,
                height: "16px",
                width: "16px",
                lineHeight: "24px",
                fill: theme.palette.primary.main,
                transitionDuration: "0.3s",
                transitionProperty: "transform",
                transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)",
              })}
            />
          </Box>
        </Box>

        {!isCollapsed && <Divider sx={{ borderColor: "divider" }} />}

        {/* 메뉴 영역 */}
        <Box
          sx={{
            overflow: "auto",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          <CrmMenuContent isCollapsed={isCollapsed} />
        </Box>

        {/* 하단 사용자 정보 */}
        {!isCollapsed && <Divider sx={{ borderColor: "divider" }} />}
        <Stack
          direction={isCollapsed ? "column" : "row"}
          sx={(theme) => ({
            p: isCollapsed ? 1 : 2,
            gap: 1,
            alignItems: "center",
            borderTop: `1px solid ${theme.palette.divider}`,
            justifyContent: isCollapsed ? "center" : "flex-start",
          })}
        >
          <Avatar
            sizes="small"
            alt={userName ?? "사용자"}
            sx={(theme) => ({
              width: 36,
              height: 36,
              bgcolor: theme.palette.primary.main,
              color: theme.palette.getContrastText(theme.palette.primary.main),
            })}
          >
            {initials}
          </Avatar>
          {!isCollapsed && (
            <>
              <Box sx={{ mr: "auto" }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    lineHeight: "16px",
                    color: "text.primary",
                  }}
                >
                  {isLoggedIn && userName ? userName : "로그인 사용자"}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {/* 필요하면 나중에 email도 AuthContext에서 넘겨서 사용 */}
                </Typography>
              </Box>
              <CrmOptionsMenu />
            </>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
