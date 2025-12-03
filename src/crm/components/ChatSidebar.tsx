// src/crm/components/ChatSidebar.tsx
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import PersonIcon from "@mui/icons-material/Person";
import { useTheme } from "@mui/material/styles"; // 🔹 테마 사용


interface ChatSidebarProps {
  userProfile: {
    name: string;
    avatar?: string;
    email?: string;
  };
  onNewChat: () => void;
}

export default function ChatSidebar({
  userProfile,
  onNewChat,
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

      </Stack>
    </Paper>
  );
}
