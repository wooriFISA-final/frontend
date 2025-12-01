// src/crm/components/CrmMenuContent.tsx
import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";

const mainListItems = [
  // 🔹 실제 라우트에 맞게 /home 으로 수정
  { text: "Home", icon: <HomeRoundedIcon />, path: "/home" },
  { text: "Plan", icon: <SmartToyRoundedIcon />, path: "/plan" },
  { text: "Reports", icon: <AssessmentRoundedIcon />, path: "/reports" },
];

const secondaryListItems = [
  { text: "Settings", icon: <SettingsRoundedIcon />, path: "/settings" },
  { text: "Help & Support", icon: <HelpOutlineRoundedIcon />, path: "/help" },
];

interface CrmMenuContentProps {
  isCollapsed?: boolean;
}

export default function CrmMenuContent({
  isCollapsed = false,
}: CrmMenuContentProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const menuButton = (item: (typeof mainListItems)[0], selected: boolean) => (
    <Tooltip title={isCollapsed ? item.text : ""} placement="right">
      <ListItemButton
        selected={selected}
        onClick={() => handleNavigation(item.path)}
        sx={(theme) => ({
          borderRadius: 1.5,
          px: isCollapsed ? 1.5 : 2,
          py: 1.5,
          justifyContent: isCollapsed ? "center" : "flex-start",
          minHeight: 44,
          transition: "all 0.2s ease",
          // 🔹 기본 글자색: 보조 텍스트 색
          color: selected
            ? theme.palette.text.primary
            : theme.palette.text.secondary,
          backgroundColor: selected
            ? theme.palette.action.selected
            : "transparent",
          "&:hover": {
            backgroundColor: selected
              ? theme.palette.action.selected
              : theme.palette.action.hover,
          },
          "& .MuiListItemIcon-root": {
            minWidth: isCollapsed ? 0 : 40,
            fontSize: "1.3rem",
            // 🔹 아이콘도 선택 시 primary, 아니면 보조 텍스트 색
            color: selected
              ? theme.palette.primary.main
              : theme.palette.text.secondary,
          },
        })}
      >
        <ListItemIcon>{item.icon}</ListItemIcon>
        {!isCollapsed && (
          <ListItemText
            primary={item.text}
            primaryTypographyProps={{
              sx: { fontWeight: 500 },
            }}
          />
        )}
      </ListItemButton>
    </Tooltip>
  );

  return (
    <Stack
      sx={{
        flexGrow: 1,
        p: isCollapsed ? 0.5 : 1,
        justifyContent: "space-between",
      }}
    >
      <List dense sx={{ p: 0 }}>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block", mb: 0.5 }}>
            {menuButton(item, location.pathname === item.path)}
          </ListItem>
        ))}
      </List>
      <Box>
        {!isCollapsed && <Divider sx={{ my: 1, borderColor: "divider" }} />}
        <List dense sx={{ p: 0 }}>
          {secondaryListItems.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ display: "block", mb: 0.5 }}>
              {menuButton(item, location.pathname === item.path)}
            </ListItem>
          ))}
        </List>
      </Box>
    </Stack>
  );
}