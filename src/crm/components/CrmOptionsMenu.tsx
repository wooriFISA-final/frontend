// src/crm/components/CrmOptionsMenu.tsx
import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext"; // 🔹 추가

export default function CrmOptionsMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { logout } = useAuth(); // 🔹 AuthContext에서 logout 가져오기

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // 🔹 공통 Sign Out 동작: 로그아웃 + 루트로 이동
  const handleSignOut = () => {
    handleClose();
    logout();                         // 토큰/상태 정리
    navigate("/", { replace: true }); // 마케팅 페이지(/)로 이동
  };

  const handleGoProfile = () => {
    handleClose();
    navigate("/profile");
  };

  const handleGoSettings = () => {
    handleClose();
    navigate("/settings");
  };

  return (
    <Box>
      <IconButton
        aria-label="more options"
        aria-controls={open ? "user-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        size="small"
      >
        <MoreVertRoundedIcon fontSize="small" />
      </IconButton>
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleGoProfile}>
          <ListItemIcon>
            <PersonRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleGoSettings}>
          <ListItemIcon>
            <SettingsRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Account Settings</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <ExitToAppRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Sign Out</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}
