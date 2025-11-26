import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import { CrmLogo } from "./CrmAppNavbar";

const mainListItems = [
  { text: "Home", icon: <HomeRoundedIcon />, path: "/dashboard" },
  { text: "Reports", icon: <AssessmentRoundedIcon />, path: "/reports" },
  { text: "Plan", icon: <SmartToyRoundedIcon />, path: "/plan" },
];

const secondaryListItems = [
  { text: "Settings", icon: <SettingsRoundedIcon />, path: "/settings" },
  { text: "Help & Support", icon: <HelpOutlineRoundedIcon />, path: "/help" },
];

interface CrmSideMenuMobileProps {
  open: boolean;
  toggleDrawer: (open: boolean) => () => void;
}

export default function CrmSideMenuMobile({
  open,
  toggleDrawer,
}: CrmSideMenuMobileProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
    toggleDrawer(false)();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawer(false)}
      slotProps={{
        backdrop: { invisible: false },
      }}
      sx={{
        zIndex: 1300,
        "& .MuiDrawer-paper": {
          width: "280px",
          boxSizing: "border-box",
          backgroundColor: "#FFFFFF",
          borderRight: "1px solid #F0F2F5",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          mx: 2,
          my: 2,
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 2,
          }}
        >
          <CrmLogo />
          <Typography variant="h6" component="div" sx={{ color: "#222222", fontWeight: 600 }}>
            Acme CRM
          </Typography>
        </Box>

        <List dense>
          {mainListItems.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 1,
                  backgroundColor: location.pathname === item.path ? "#E6F0FF" : "transparent",
                  color: location.pathname === item.path ? "#0074E9" : "#222222",
                  "&:hover": {
                    backgroundColor: "#F5F7FA",
                  },
                  "& .MuiListItemIcon-root": {
                    color: location.pathname === item.path ? "#0074E9" : "#222222",
                    minWidth: 40,
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 1, borderColor: "#F0F2F5" }} />

        <List dense>
          {secondaryListItems.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 1,
                  backgroundColor: location.pathname === item.path ? "#E6F0FF" : "transparent",
                  color: location.pathname === item.path ? "#0074E9" : "#222222",
                  "&:hover": {
                    backgroundColor: "#F5F7FA",
                  },
                  "& .MuiListItemIcon-root": {
                    color: "inherit",
                    minWidth: 40,
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
