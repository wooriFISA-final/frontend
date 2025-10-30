import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";

// Sample data for upcoming tasks
const upcomingTasks = [
  {
    id: 1,
    task: "Follow up with TechSolutions Inc on cloud proposal",
    completed: false,
    priority: "high",
    dueDate: "Today, 2:00 PM",
  },
  {
    id: 2,
    task: "Prepare presentation for Global Media website project",
    completed: false,
    priority: "medium",
    dueDate: "Tomorrow, 10:00 AM",
  },
  {
    id: 3,
    task: "Call HealthCare Pro about contract details",
    completed: false,
    priority: "high",
    dueDate: "Today, 4:30 PM",
  },
  {
    id: 4,
    task: "Update CRM implementation timeline for RetailGiant",
    completed: true,
    priority: "medium",
    dueDate: "Yesterday",
  },
  {
    id: 5,
    task: "Send proposal documents to Acme Corp",
    completed: false,
    priority: "low",
    dueDate: "Sep 28, 2023",
  },
];

// Function to get priority color
const getPriorityColor = (priority: string): { bg: string; color: string } => {
  switch (priority) {
    case "high":
      return { bg: "#FEE2E2", color: "#DC2626" };
    case "medium":
      return { bg: "#FEF3E2", color: "#D97706" };
    default:
      return { bg: "#F3F4F6", color: "#6B7280" };
  }
};

export default function CrmUpcomingTasks() {
  const [tasks, setTasks] = React.useState(upcomingTasks);

  const handleToggle = (id: number) => () => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

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
            Upcoming Tasks
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

        <List sx={{ width: "100%", bgcolor: "#FFFFFF" }}>
          {tasks.map((task) => {
            const labelId = `checkbox-list-label-${task.id}`;
            const priorityColor = getPriorityColor(task.priority);

            return (
              <ListItem
                key={task.id}
                secondaryAction={
                  <IconButton edge="end" aria-label="more details" sx={{ color: "#999999" }}>
                    <ArrowForwardRoundedIcon />
                  </IconButton>
                }
                disablePadding
                sx={{ borderBottom: "1px solid #F0F2F5" }}
              >
                <ListItemButton
                  role={undefined}
                  onClick={handleToggle(task.id)}
                  dense
                  sx={{
                    "&:hover": {
                      backgroundColor: "#F9FAFB",
                    },
                  }}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={task.completed}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": labelId }}
                      sx={{
                        color: "#CDE3FA",
                        "&.Mui-checked": {
                          color: "#0074E9",
                        },
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    id={labelId}
                    primary={task.task}
                    secondary={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mt: 0.5,
                        }}
                      >
                        <Chip
                          label={task.priority}
                          size="small"
                          sx={{
                            height: 20,
                            backgroundColor: priorityColor.bg,
                            color: priorityColor.color,
                            border: "none",
                            fontWeight: 500,
                            "& .MuiChip-label": { px: 1, py: 0 },
                          }}
                        />
                        <Typography variant="caption" sx={{ color: "#999999" }}>
                          {task.dueDate}
                        </Typography>
                      </Box>
                    }
                    primaryTypographyProps={{
                      sx: {
                        textDecoration: task.completed
                          ? "line-through"
                          : "none",
                        color: task.completed
                          ? "#999999"
                          : "#222222",
                        fontWeight: task.completed ? 400 : 500,
                      },
                    }}
                    secondaryTypographyProps={{
                      component: "div",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
}
