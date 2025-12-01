// src/crm/components/ChatSidebar.tsx
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
import PersonIcon from "@mui/icons-material/Person";
import { useTheme } from "@mui/material/styles"; // 🔹 테마 사용


interface ConversationHistory {
  id: string;
  title: string;
  timestamp: string;
}

interface ChatSidebarProps {
  userProfile: {
    name: string;
    avatar?: string;
    email?: string;
  };
  conversationHistory: ConversationHistory[];
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  activeConversationId: string;
}

export default function ChatSidebar({
  userProfile,
  conversationHistory,
  onNewChat,
  onSelectConversation,
  // onDeleteConversation,
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
        bgcolor: theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        pt: 2.5,
        px: 2,
        overflow: "auto",
        border: `1px solid ${theme.palette.divider}`,
      }}
      elevation={0}
    >
      <Stack spacing={2} sx={{ flexGrow: 1 }}>
        {/* 사용자 프로필 영역 */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ px: 1 }}>
          <Avatar
            src="/cocoa_cookie.png"  // 코코아맛 쿠키 이미지
            alt={userProfile.name}
            sx={{
              width: 40,
              height: 40,
              bgcolor: "#FFFFFF",  // 배경을 흰색으로
            }}
          >
            <PersonIcon sx={{ fontSize: 24 }} />
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
            background: "linear-gradient(135deg, #20C4F4 0%, #0078B5 100%)",  // 우리은행 블루 그라데이션
            color: "#FFFFFF",
            fontWeight: 500,
            fontSize: "0.95rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 2px 8px rgba(0, 120, 181, 0.25)",
            "&:hover": {
              background: "linear-gradient(135deg, #1AB0E0 0%, #005A8C 100%)",  // 더 진한 블루
              boxShadow: "0 4px 12px rgba(0, 120, 181, 0.35)",
              transform: "translateY(-1px)",
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
                      sx={(theme) => ({
                        borderRadius: 2,
                        py: 1.2,
                        background: selected
                          ? theme.palette.mode === "dark"
                            ? "rgba(32, 196, 244, 0.12)"  // 다크: 우리은행 블루 틴트
                            : "rgba(32, 196, 244, 0.08)"  // 라이트: 우리은행 블루 틴트
                          : "transparent",
                        color: selected
                          ? theme.palette.mode === "dark"
                            ? "#20C4F4"  // 다크: 밝은 우리은행 블루
                            : "#0078B5"  // 라이트: 우리은행 다크 블루
                          : theme.palette.text.primary,
                        border: selected
                          ? `1px solid ${theme.palette.mode === "dark"
                            ? "rgba(32, 196, 244, 0.3)"
                            : "rgba(32, 196, 244, 0.2)"
                          }`
                          : "1px solid transparent",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          bgcolor: selected
                            ? theme.palette.mode === "dark"
                              ? "rgba(32, 196, 244, 0.18)"
                              : "rgba(32, 196, 244, 0.12)"
                            : theme.palette.mode === "dark"
                              ? "rgba(148, 163, 184, 0.1)"
                              : theme.palette.action.hover,
                          borderColor: theme.palette.mode === "dark"
                            ? "rgba(32, 196, 244, 0.4)"
                            : "rgba(32, 196, 244, 0.3)",
                        },
                      })}
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
                            fontWeight: selected ? 600 : 400,
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
