import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

interface ConversationHistory {
  id: string;
  title: string;
  timestamp: string;
}

interface ChatSidebarProps {
  userProfile?: {
    name: string;
    avatar?: string;
    email?: string;
  };
  conversationHistory?: ConversationHistory[];
  onNewChat?: () => void;
  onSelectConversation?: (id: string) => void;
  onDeleteConversation?: (id: string) => void;
  activeConversationId?: string;
}

export default function ChatSidebar({
  userProfile = {
    name: "John Doe",
    email: "john@example.com",
  },
  conversationHistory = [],
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  activeConversationId,
}: ChatSidebarProps) {
  return (
    <Paper
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#FFFFFF",
        borderRadius: 2,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        pt: 2.5,
        px: 2,
        overflow: "auto",
        border: "1px solid #F0F2F5",
      }}
      elevation={0}
    >
      <Stack spacing={2} sx={{ flexGrow: 1 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ px: 1 }}>
          <Avatar
            src={userProfile.avatar}
            sx={{
              width: 40,
              height: 40,
              bgcolor: "primary.main",
            }}
          >
            {userProfile.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </Avatar>
          <Stack spacing={0.25} sx={{ minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {userProfile.name}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {userProfile.email}
            </Typography>
          </Stack>
        </Stack>

        <Divider sx={{ my: 1 }} />

        <Box
          onClick={onNewChat}
          sx={{
            width: "100%",
            py: 1.2,
            px: 2,
            borderRadius: 2,
            backgroundColor: "#0074E9",
            color: "#FFFFFF",
            fontWeight: 500,
            fontSize: "0.95rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 2px 8px rgba(0, 116, 233, 0.15)",
            "&:hover": {
              backgroundColor: "#3399FF",
              boxShadow: "0 4px 12px rgba(0, 116, 233, 0.25)",
            },
          }}
        >
          <AddRoundedIcon sx={{ fontSize: "1.25rem" }} />
          New Chat
        </Box>

        <Box>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              color: "text.secondary",
              px: 1,
              display: "block",
              mb: 1,
            }}
          >
            Recent Conversations
          </Typography>
          <List sx={{ p: 0 }}>
            {conversationHistory.length > 0 ? (
              conversationHistory.map((conversation) => (
                <ListItem
                  key={conversation.id}
                  disablePadding
                  sx={{
                    mb: 0.5,
                  }}
                >
                  <ListItemButton
                    selected={activeConversationId === conversation.id}
                    onClick={() => onSelectConversation?.(conversation.id)}
                    sx={{
                      borderRadius: 2,
                      py: 1.2,
                      bgcolor: activeConversationId === conversation.id ? "#E6F0FF" : "transparent",
                      color: activeConversationId === conversation.id ? "#0074E9" : "#222222",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: "#F5F7FA",
                      },
                    }}
                  >
                    <ListItemText
                      primary={conversation.title}
                      secondary={conversation.timestamp}
                      primaryTypographyProps={{
                        variant: "body2",
                        sx: {
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        },
                      }}
                      secondaryTypographyProps={{
                        variant: "caption",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ px: 1, py: 2, textAlign: "center" }}
              >
                No conversations yet
              </Typography>
            )}
          </List>
        </Box>
      </Stack>
    </Paper>
  );
}
