// src/crm/pages/Settings.tsx
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { useColorMode } from "../../shared-theme/AppTheme";

export default function Settings() {
  const [notifications, setNotifications] = React.useState(true);
  const [emailDigest, setEmailDigest] = React.useState(false);

  const navigate = useNavigate();
  const { logout } = useAuth();
  const { mode, toggleColorMode } = useColorMode();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const settingsSections = [
    {
      title: "Notifications",
      items: [
        {
          label: "Email Notifications",
          description: "Receive email updates for important events",
          state: notifications,
          setState: setNotifications,
        },
        {
          label: "Daily Email Digest",
          description: "Get a summary of daily activities",
          state: emailDigest,
          setState: setEmailDigest,
        },
      ],
    },
    {
      title: "Appearance",
      items: [
        {
          label: "Dark Mode",
          description: "Enable dark theme for the application",
          state: mode === "dark",
          setState: () => toggleColorMode(),
        },
      ],
    },
  ];

  return (
    <Box
      sx={(theme) => ({
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
        color: theme.palette.text.primary,
      })}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{ mb: 2, fontWeight: 600 }}
      >
        Settings
      </Typography>
      <Typography sx={{ mb: 4, color: "text.secondary" }}>
        Manage your CRM preferences and account settings.
      </Typography>

      <Stack spacing={2}>
        {settingsSections.map((section, sectionIndex) => (
          <Card
            key={sectionIndex}
            sx={{
              bgcolor: "background.paper",      // 🔹 하얀색 고정 → 테마 카드 색
              borderColor: "divider",
              boxShadow: 1,
              border: "none",
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: "text.primary" }}
              >
                {section.title}
              </Typography>
              {section.items.map((item, itemIndex) => (
                <Box key={itemIndex}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ py: 1.5 }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontWeight: 500, color: "text.primary" }}>
                        {item.label}
                      </Typography>
                      <Typography
                        sx={{
                          color: "text.secondary",
                          fontSize: "0.875rem",
                          mt: 0.25,
                        }}
                      >
                        {item.description}
                      </Typography>
                    </Box>
                    <Switch
                      checked={item.state}
                      onChange={(e) => item.setState(e.target.checked)}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "#0074E9",
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                          backgroundColor: "#0074E9",
                        },
                      }}
                    />
                  </Stack>
                  {itemIndex < section.items.length - 1 && (
                    <Divider sx={{ borderColor: "divider" }} />
                  )}
                </Box>
              ))}
            </CardContent>
          </Card>
        ))}

        <Card
          sx={{
            bgcolor: "background.paper",
            borderColor: "divider",
            boxShadow: 1,
            border: "none",
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 2, color: "text.primary" }}
            >
              Account
            </Typography>
            <Stack spacing={1}>
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  borderColor: "#CDE3FA",
                  color: "#0074E9",
                  textTransform: "none",
                  fontWeight: 500,
                  "&:hover": {
                    borderColor: "#0074E9",
                    backgroundColor: "action.hover",
                  },
                }}
              >
                Change Password
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={handleLogout}
                sx={{
                  borderColor: "#F0A0A0",
                  color: "#DC2626",
                  textTransform: "none",
                  fontWeight: 500,
                  "&:hover": {
                    borderColor: "#DC2626",
                    backgroundColor: "error.lighter",
                  },
                }}
              >
                Logout
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
