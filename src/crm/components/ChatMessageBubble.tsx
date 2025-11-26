// src/crm/components/ChatMessageBubble.tsx
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";

interface ChatMessageBubbleProps {
  message: string;
  sender: "user" | "ai";
  timestamp: string;
}

export default function ChatMessageBubble({
  message,
  sender,
  timestamp,
}: ChatMessageBubbleProps) {
  const isUser = sender === "user";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        mb: 1.5,
        px: 1,
      }}
    >
      {/* 왼쪽 AI 아바타 */}
      {!isUser && (
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: "primary.main",
            fontSize: "0.8rem",
            mr: 1.5,
          }}
        >
          AI
        </Avatar>
      )}

      <Box
        sx={{
          maxWidth: "70%",
          display: "flex",
          flexDirection: "column",
          alignItems: isUser ? "flex-end" : "flex-start",
        }}
      >
        {/* 💬 말풍선 (타원형) */}
        <Box
          sx={(theme) => ({
            px: 2.5,
            py: 1.2,
            borderRadius: "999px", // 🔹 완전 타원형 모양
            bgcolor: isUser
              ? theme.palette.mode === "dark"
                ? theme.palette.primary.main
                : "#3B82F6"
              : theme.palette.mode === "dark"
              ? "rgba(148, 163, 184, 0.24)" // slate-400 약한 투명
              : "#F3F4F6",
            color: isUser ? "#FFFFFF" : theme.palette.text.primary,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 2px 4px rgba(0,0,0,0.35)"
                : "0 1px 2px rgba(15,23,42,0.15)",
            backdropFilter: theme.palette.mode === "dark" ? "blur(4px)" : "none",
          })}
        >
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              lineHeight: 1.6,
            }}
          >
            {message}
          </Typography>
        </Box>

        {/* 시간 표시 */}
        <Typography
          variant="caption"
          sx={(theme) => ({
            mt: 0.5,
            color:
              theme.palette.mode === "dark"
                ? "rgba(148,163,184,0.9)"
                : "text.secondary",
          })}
        >
          {timestamp}
        </Typography>
      </Box>

      {/* 오른쪽 유저 아바타 */}
      {isUser && (
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: "primary.main",
            fontSize: "0.8rem",
            ml: 1.5,
          }}
        >
          나
        </Avatar>
      )}
    </Box>
  );
}
