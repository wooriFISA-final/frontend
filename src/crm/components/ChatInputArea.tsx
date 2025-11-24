// src/crm/components/ChatInputArea.tsx
import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import SendIcon from "@mui/icons-material/Send";
import Paper from "@mui/material/Paper";

interface ChatInputAreaProps {
  onSendMessage: (message: string) => void;
  suggestedPrompts?: string[];
  onSuggestedPromptClick?: (prompt: string) => void;
  disabled?: boolean;
}

export default function ChatInputArea({
  onSendMessage,
  suggestedPrompts = [],
  onSuggestedPromptClick,
  disabled = false,
}: ChatInputAreaProps) {
  const [inputValue, setInputValue] = React.useState("");

  const handleSend = () => {
    if (inputValue.trim() && !disabled) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePromptClick = (prompt: string) => {
    if (!disabled && onSuggestedPromptClick) {
      onSuggestedPromptClick(prompt);
    }
  };

  return (
    <Box
      sx={(theme) => ({
        // Plan 우측 컬럼 안에서만 고정
        position: "sticky",
        bottom: 0,
        left: 0,
        right: 0,
        // 🔹 위 채팅 박스와 같은 좌우 padding (Plan.tsx의 p: 2 과 맞춤)
        px: 0,
        // 🔹 채팅 영역과의 간격만 살짝
        pt: 1,
        pb: 2,
        bgcolor: theme.palette.background.default,
        zIndex: 1,
      })}
    >
      <Paper
        elevation={0}
        sx={(theme) => ({
          width: "100%",        // 🔹 상단 채팅 Paper와 같은 폭
          borderRadius: 2,      // 🔹 위 채팅 Paper(borderRadius: 2)와 통일
          p: 1.5,
          bgcolor: "background.paper",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        })}
      >
        {/* 추천 프롬프트 */}
        {suggestedPrompts.length > 0 && (
          <Stack
            direction="row"
            spacing={1}
            sx={{
              mb: 1.25,
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            {suggestedPrompts.map((prompt, index) => (
              <Chip
                key={index}
                label={prompt}
                onClick={() => handlePromptClick(prompt)}
                disabled={disabled}
                sx={{
                  bgcolor: "background.paper",
                  color: "text.primary",
                  "&:hover": {
                    bgcolor: disabled ? "background.paper" : "action.hover",
                  },
                  cursor: disabled ? "not-allowed" : "pointer",
                  fontSize: "0.85rem",
                }}
              />
            ))}
          </Stack>
        )}

        {/* 입력창 + 전송 버튼 */}
        <Box sx={{ display: "flex", gap: 1.25, alignItems: "center" }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              disabled
                ? "AI가 답변을 생성하고 있습니다..."
                : "메시지를 입력하세요..."
            }
            disabled={disabled}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 999,
                bgcolor: "background.default",
                "& fieldset": {
                  borderColor: "divider",
                },
                "&:hover fieldset": {
                  borderColor: "action.hover",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "primary.main",
                  borderWidth: 1,
                },
              },
              "& .MuiOutlinedInput-input": {
                // placeholder를 왼쪽 끝 + 수직 가운데 느낌으로
                paddingY: "10px",
                paddingX: "14px",
              },
            }}
          />
          <IconButton
            onClick={handleSend}
            disabled={!inputValue.trim() || disabled}
            sx={(theme) => ({
              bgcolor: theme.palette.mode === "dark" ? "#1F2937" : "#3B82F6",
              color: "#FFFFFF",
              "&:hover": {
                bgcolor:
                  theme.palette.mode === "dark" ? "#374151" : "#2563EB",
              },
              "&:disabled": {
                bgcolor: "action.disabledBackground",
                color: "text.disabled",
              },
              width: 48,
              height: 48,
              borderRadius: "50%",
              flexShrink: 0,
            })}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
}
