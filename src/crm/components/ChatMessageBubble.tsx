import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";

interface ChatMessageBubbleProps {
  message: string;
  sender: "user" | "ai";
  timestamp?: string;
  avatarUrl?: string;
}

export default function ChatMessageBubble({
  message,
  sender,
  timestamp,
  avatarUrl,
}: ChatMessageBubbleProps) {
  const isUser = sender === "user";

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        justifyContent: isUser ? "flex-end" : "flex-start",
        mb: 2,
        alignItems: "flex-end",
      }}
    >
      {!isUser && (
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: "#0074E9",
            fontSize: "0.75rem",
            color: "#FFFFFF",
          }}
        >
          AI
        </Avatar>
      )}
      <Paper
        sx={{
          maxWidth: "70%",
          px: 2.5,
          py: 1.75,
          bgcolor: isUser ? "#0074E9" : "#F5F7FA",
          color: isUser ? "#FFFFFF" : "#1F2937",
          borderRadius: 2.5,
          boxShadow: isUser
            ? "0 2px 8px rgba(0, 116, 233, 0.15)"
            : "0 1px 3px rgba(0, 0, 0, 0.05)",
          border: isUser ? "none" : "1px solid #E5E7EB",
          transition: "all 0.2s ease",
        }}
        elevation={0}
      >
        <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
          {message}
        </Typography>
        {timestamp && (
          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 0.5,
              opacity: 0.7,
            }}
          >
            {timestamp}
          </Typography>
        )}
      </Paper>
      {isUser && (
        <Avatar
          src={avatarUrl}
          sx={{
            width: 32,
            height: 32,
            bgcolor: "#0074E9",
            color: "#FFFFFF",
          }}
        >
          U
        </Avatar>
      )}
    </Stack>
  );
}
