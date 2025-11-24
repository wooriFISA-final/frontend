// src/crm/components/ChatSidebar.tsx
import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useTheme } from "@mui/material/styles"; // 🔹 테마 사용

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
  const theme = useTheme();

  return (
    <Paper
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: theme.palette.background.paper, // 🔹 다크/라이트 공통 카드 배경
        borderRadius: 2,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        pt: 2.5,
        px: 2,
        overflow: "auto",
        border: `1px solid ${theme.palette.divider}`, // 🔹 구분선도 테마 기반
      }}
      elevation={0}
    >
      <Stack spacing={2} sx={{ flexGrow: 1 }}>
        {/* 사용자 프로필 영역 */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ px: 1 }}>
          <Avatar
            src={userProfile.avatar}
            sx={{
              width: 40,
              height: 40,
              bgcolor: theme.palette.primary.main,
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
                color: theme.palette.text.primary,
              }}
            >
              {userProfile.name}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
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

        {/* 새 채팅 버튼 */}
        <Box
          onClick={onNewChat}
          sx={{
            width: "100%",
            py: 1.2,
            px: 2,
            borderRadius: 2,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
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
              backgroundColor: theme.palette.primary.dark,
              boxShadow: "0 4px 12px rgba(0, 116, 233, 0.25)",
            },
          }}
        >
          <AddRoundedIcon sx={{ fontSize: "1.25rem" }} />
          New Chat
        </Box>

        {/* 최근 대화 목록 */}
        <Box>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.secondary,
              px: 1,
              display: "block",
              mb: 1,
            }}
          >
            Recent Conversations
          </Typography>
          <List sx={{ p: 0 }}>
            {conversationHistory.length > 0 ? (
              conversationHistory.map((conversation) => {
                const selected = activeConversationId === conversation.id;
                return (
                  <ListItem
                    key={conversation.id}
                    disablePadding
                    sx={{
                      mb: 0.5,
                    }}
                  >
                    <ListItemButton
                      selected={selected}
                      onClick={() => onSelectConversation?.(conversation.id)}
                      sx={{
                        borderRadius: 2,
                        py: 1.2,
                        bgcolor: selected
                          ? theme.palette.action.selected
                          : "transparent",
                        color: selected
                          ? theme.palette.primary.main
                          : theme.palette.text.primary,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          bgcolor: selected
                            ? theme.palette.action.selected
                            : theme.palette.action.hover,
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
                          sx: { color: theme.palette.text.secondary },
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })
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
