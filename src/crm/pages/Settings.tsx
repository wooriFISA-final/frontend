import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";

export default function Settings() {
  const [notifications, setNotifications] = React.useState(true);
  const [emailDigest, setEmailDigest] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false);

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
          state: darkMode,
          setState: setDarkMode,
        },
      ],
    },
  ];

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography variant="h4" component="h1" sx={{ mb: 2, color: "#222222", fontWeight: 600 }}>
        Settings
      </Typography>
      <Typography sx={{ color: "#666666", mb: 4 }}>
        Manage your CRM preferences and account settings.
      </Typography>

      <Stack spacing={2}>
        {settingsSections.map((section, sectionIndex) => (
          <Card
            key={sectionIndex}
            sx={{
              backgroundColor: "#FFFFFF",
              borderColor: "#F0F2F5",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
              border: "none",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ color: "#222222", fontWeight: 600, mb: 2 }}>
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
                      <Typography sx={{ color: "#222222", fontWeight: 500 }}>
                        {item.label}
                      </Typography>
                      <Typography sx={{ color: "#999999", fontSize: "0.875rem", mt: 0.25 }}>
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
                    <Divider sx={{ borderColor: "#F0F2F5" }} />
                  )}
                </Box>
              ))}
            </CardContent>
          </Card>
        ))}

        <Card
          sx={{
            backgroundColor: "#FFFFFF",
            borderColor: "#F0F2F5",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
            border: "none",
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ color: "#222222", fontWeight: 600, mb: 2 }}>
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
                    backgroundColor: "#F5F7FA",
                  },
                }}
              >
                Change Password
              </Button>
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  borderColor: "#F0A0A0",
                  color: "#DC2626",
                  textTransform: "none",
                  fontWeight: 500,
                  "&:hover": {
                    borderColor: "#DC2626",
                    backgroundColor: "#FEE2E2",
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
