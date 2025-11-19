import * as React from "react";
import { styled } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import CrmMenuContent from "./CrmMenuContent";
import CrmOptionsMenu from "./CrmOptionsMenu";

const drawerWidthExpanded = 240;
const drawerWidthCollapsed = 80;

const Drawer = styled(MuiDrawer)(({ theme }) => ({
  width: drawerWidthExpanded,
  flexShrink: 0,
  boxSizing: "border-box",
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidthExpanded,
    boxSizing: "border-box",
    transition: "width 0.3s ease",
  },
  "&.collapsed": {
    [`& .${drawerClasses.paper}`]: {
      width: drawerWidthCollapsed,
    },
  },
}));

export default function CrmSideMenu() {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
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
        sx={{
          width: "100%",
          backgroundColor: "#FFFFFF",
          borderRight: "1px solid #F0F2F5",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        }}
      >
        {/* Header with collapse button */}
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
            sx={{
              display: "flex",
              alignItems: "center",
              appearance: "none",
              backgroundColor: "rgba(255, 255, 255, 1)",
              borderColor: "rgb(51, 60, 77)",
              borderRadius: "8px",
              borderStyle: "solid",
              borderWidth: "1px",
              color: "rgb(0, 116, 233)",
              fontSize: "18px",
              fontWeight: "500",
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
            }}
          >
            <ChevronLeftRoundedIcon
              sx={{
                fontSize: "16px",
                fontWeight: "500",
                height: "16px",
                width: "16px",
                lineHeight: "24px",
                fill: "rgb(0, 116, 233)",
                transitionDuration: "0.3s",
                transitionProperty: "transform",
                transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </Box>
        </Box>

        {!isCollapsed && <Divider sx={{ borderColor: "#F0F2F5" }} />}

        {/* Menu content */}
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

        {/* User profile footer */}
        {!isCollapsed && <Divider sx={{ borderColor: "#F0F2F5" }} />}
        <Stack
          direction={isCollapsed ? "column" : "row"}
          sx={{
            p: isCollapsed ? 1 : 2,
            gap: 1,
            alignItems: "center",
            borderTop: "1px solid #F0F2F5",
            justifyContent: isCollapsed ? "center" : "flex-start",
          }}
        >
          <Avatar
            sizes="small"
            alt="Alex Thompson"
            src="/static/images/avatar/7.jpg"
            sx={{ width: 36, height: 36, bgcolor: "#0074E9", color: "#FFFFFF" }}
          >
            AT
          </Avatar>
          {!isCollapsed && (
            <>
              <Box sx={{ mr: "auto" }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, lineHeight: "16px", color: "#222222" }}
                >
                  Alex Thompson
                </Typography>
                <Typography variant="caption" sx={{ color: "#999999" }}>
                  alex@acmecrm.com
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
