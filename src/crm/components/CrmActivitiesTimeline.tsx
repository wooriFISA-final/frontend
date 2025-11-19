import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import MeetingRoomRoundedIcon from "@mui/icons-material/MeetingRoomRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";

// Sample activities data
const activities = [
  {
    id: 1,
    type: "email",
    title: "Email sent to Acme Corp",
    description: "Proposal follow-up email sent",
    time: "11:30 AM",
    icon: <EmailRoundedIcon fontSize="small" />,
    bgColor: "#E6F0FF",
    iconColor: "#0074E9",
  },
  {
    id: 2,
    type: "call",
    title: "Call with TechSolutions Inc",
    description: "Discussed implementation timeline",
    time: "10:15 AM",
    icon: <PhoneRoundedIcon fontSize="small" />,
    bgColor: "#ECFDF5",
    iconColor: "#059669",
  },
  {
    id: 3,
    type: "meeting",
    title: "Meeting scheduled",
    description: "Demo for Global Media next Monday",
    time: "Yesterday",
    icon: <MeetingRoomRoundedIcon fontSize="small" />,
    bgColor: "#FEF3E2",
    iconColor: "#D97706",
  },
  {
    id: 4,
    type: "note",
    title: "Note added",
    description: "Added details about RetailGiant requirements",
    time: "Yesterday",
    icon: <EditNoteRoundedIcon fontSize="small" />,
    bgColor: "#E6F0FF",
    iconColor: "#0074E9",
  },
];

export default function CrmActivitiesTimeline() {
  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#FFFFFF",
        borderColor: "#F0F2F5",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        border: "none",
      }}
    >
      <CardContent sx={{ p: 0, "&:last-child": { pb: 0 }, flexGrow: 1 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{ p: 2, pb: 1 }}
        >
          <Typography variant="h6" component="h3" sx={{ color: "#222222", fontWeight: 600 }}>
            Recent Activities
          </Typography>
          <Button
            endIcon={<ArrowForwardRoundedIcon />}
            size="small"
            sx={{
              color: "#0074E9",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgba(0, 116, 233, 0.08)",
              },
            }}
          >
            View All
          </Button>
        </Stack>

        <Box sx={{ p: 2 }}>
          {activities.map((activity) => (
            <Box
              key={activity.id}
              sx={{
                display: "flex",
                mb: 2,
                gap: 2,
                alignItems: "flex-start",
                paddingBottom: 1.5,
                borderBottom: "1px solid #F0F2F5",
                "&:last-child": {
                  borderBottom: "none",
                  mb: 0,
                },
              }}
            >
              <Box
                sx={{
                  bgcolor: activity.bgColor,
                  borderRadius: "50%",
                  p: 0.75,
                  display: "flex",
                  color: activity.iconColor,
                  minWidth: 32,
                  justifyContent: "center",
                }}
              >
                {activity.icon}
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="subtitle2" component="span" sx={{ color: "#222222", fontWeight: 500 }}>
                    {activity.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#999999" }}>
                    {activity.time}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: "#666666" }}>
                  {activity.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
