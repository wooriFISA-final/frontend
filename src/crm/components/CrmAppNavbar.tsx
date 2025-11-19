import * as React from "react";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import MuiToolbar from "@mui/material/Toolbar";
import { tabsClasses } from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import CrmSideMenuMobile from "./CrmSideMenuMobile";
import MenuButton from "../../dashboard/components/MenuButton";
import ColorModeIconDropdown from "../../shared-theme/ColorModeIconDropdown";

const Toolbar = styled(MuiToolbar)({
  width: "100%",
  padding: "12px",
  display: "flex",
  flexDirection: "column",
  alignItems: "start",
  justifyContent: "center",
  gap: "12px",
  flexShrink: 0,
  [`& ${tabsClasses.flexContainer}`]: {
    gap: "8px",
    p: "8px",
    pb: 0,
  },
});

export default function CrmAppNavbar() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        display: { xs: "auto", md: "none" },
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        bgcolor: "#FFFFFF",
        backgroundImage: "none",
        borderBottom: "1px solid #F0F2F5",
        top: "var(--template-frame-height, 0px)",
      }}
    >
      <Toolbar variant="regular">
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            flexGrow: 1,
            width: "100%",
            gap: 1,
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{ justifyContent: "center", mr: "auto" }}
          >
            <CrmLogo />
            <Typography
              variant="h5"
              component="h1"
              sx={{ color: "#222222", fontWeight: 600 }}
            >
              Acme CRM
            </Typography>
          </Stack>
          <ColorModeIconDropdown />
          <MenuButton aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuRoundedIcon />
          </MenuButton>
          <CrmSideMenuMobile open={open} toggleDrawer={toggleDrawer} />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export function CrmLogo() {
  return (
    <Box
      sx={{
        width: "1.75rem",
        height: "1.75rem",
        bgcolor: "#0074E9",
        borderRadius: "8px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        boxShadow: "0px 2px 4px rgba(0, 116, 233, 0.15)",
      }}
    >
      <BusinessRoundedIcon sx={{ color: "#FFFFFF", fontSize: "1.25rem" }} />
    </Box>
  );
}
