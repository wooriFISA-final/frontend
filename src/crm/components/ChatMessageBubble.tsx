// src/crm/components/ChatMessageBubble.tsx
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
        mb: 2.5,
        px: 2,
      }}
    >
      {/* 왼쪽 AI 아바타 */}
      {!isUser && (
        <Avatar
          src="/WIBEE.png"
          alt="WIBEE AI"
          sx={(theme) => ({
            width: 36,
            height: 36,
            mr: 1.5,
            padding: 0.5,
            bgcolor: theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.9)"
              : "#FFFFFF",
            border: `2px solid ${theme.palette.mode === "dark"
              ? "#20C4F4"  // 다크: 밝은 우리은행 블루
              : "#20C4F4"  // 라이트: 우리은행 다크 블루
              }`,
            boxShadow: theme.palette.mode === "dark"
              ? "0 2px 8px rgba(0,0,0,0.3)"
              : "0 2px 4px rgba(0,0,0,0.1)",
          })}
        />
      )}

      <Box
        sx={{
          maxWidth: isUser ? "75%" : "80%",
          display: "flex",
          flexDirection: "column",
          alignItems: isUser ? "flex-end" : "flex-start",
        }}
      >
        {/* 💬 말풍선 */}
        <Box
          sx={(theme) => ({
            px: isUser ? 2.5 : 3,
            py: isUser ? 1.5 : 2,
            borderRadius: isUser ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
            background: isUser
              ? theme.palette.mode === "dark"
                ? "linear-gradient(135deg, #20C4F4 0%, #0078B5 100%)" // 우리은행 블루 그라데이션 (다크)
                : "linear-gradient(135deg, #20C4F4 0%, #0078B5 100%)" // 우리은행 블루 그라데이션 (라이트)
              : theme.palette.mode === "dark"
                ? "rgba(51, 65, 85, 0.6)"
                : "#F8FAFC",
            color: isUser
              ? "#FFFFFF"
              : theme.palette.text.primary,
            boxShadow: isUser
              ? theme.palette.mode === "dark"
                ? "0 4px 12px rgba(0, 120, 181, 0.4)"  // 우리은행 블루 그림자
                : "0 4px 12px rgba(0, 120, 181, 0.3)"  // 우리은행 블루 그림자
              : theme.palette.mode === "dark"
                ? "0 2px 8px rgba(0,0,0,0.4)"
                : "0 2px 8px rgba(15, 23, 42, 0.08)",
            backdropFilter: theme.palette.mode === "dark" ? "blur(8px)" : "none",
            border: isUser
              ? "none"
              : theme.palette.mode === "dark"
                ? "1px solid rgba(148, 163, 184, 0.2)"
                : "1px solid rgba(226, 232, 240, 0.8)",
          })}
        >
          {isUser ? (
            // 사용자 메시지는 일반 텍스트
            <Typography
              variant="body2"
              sx={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                lineHeight: 1.6,
                fontSize: "0.9rem",
              }}
            >
              {message}
            </Typography>
          ) : (
            // AI 메시지는 마크다운 렌더링
            <Box
              sx={(theme) => ({
                "& p": { margin: 0, marginBottom: "0.5em" },
                "& p:last-child": { marginBottom: 0 },
                "& ul, & ol": {
                  margin: "0.5em 0",
                  paddingLeft: "1.5em",
                },
                "& li": { marginBottom: "0.25em" },
                "& code": {
                  backgroundColor: theme.palette.mode === "dark" ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.05)",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "0.9em",
                  fontFamily: "monospace",
                },
                "& pre": {
                  backgroundColor: theme.palette.mode === "dark" ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.05)",
                  padding: "12px",
                  borderRadius: "6px",
                  overflow: "auto",
                  margin: "0.5em 0",
                },
                "& pre code": {
                  backgroundColor: "transparent",
                  padding: 0,
                },
                "& h1, & h2, & h3, & h4, & h5, & h6": {
                  margin: "0.8em 0 0.4em 0",
                  fontWeight: 600,
                },
                "& h1:first-child, & h2:first-child, & h3:first-child": {
                  marginTop: 0,
                },
                "& strong": { fontWeight: 600 },
                "& em": { fontStyle: "italic" },
                "& a": {
                  color: theme.palette.primary.main,
                  textDecoration: "underline",
                },
                "& blockquote": {
                  borderLeft: `3px solid ${theme.palette.primary.main}`,
                  paddingLeft: "1em",
                  margin: "0.5em 0",
                  fontStyle: "italic",
                  opacity: 0.8,
                },
                "& table": {
                  borderCollapse: "collapse",
                  width: "100%",
                  margin: "0.5em 0",
                },
                "& th, & td": {
                  border: `1px solid ${theme.palette.divider}`,
                  padding: "6px 12px",
                  textAlign: "left",
                },
                "& th": {
                  backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
                  fontWeight: 600,
                },
              })}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message}
              </ReactMarkdown>
            </Box>
          )}
        </Box>

        {/* 시간 표시 */}
        <Typography
          variant="caption"
          sx={(theme) => ({
            mt: 0.5,
            px: 0.5,
            fontSize: "0.75rem",
            color: theme.palette.mode === "dark"
              ? "rgba(148,163,184,0.7)"
              : "rgba(100, 116, 139, 0.7)",
          })}
        >
          {timestamp}
        </Typography>
      </Box>
    </Box>
  );
}
