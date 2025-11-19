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
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        p: 2,
        bgcolor: "transparent",
      }}
    >
      <Paper
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: "#FFFFFF",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        }}
        elevation={0}
      >
        {suggestedPrompts.length > 0 && (
          <Stack
            direction="row"
            spacing={1}
            sx={{
              mb: 2,
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
                  bgcolor: "#F3F4F6",
                  "&:hover": {
                    bgcolor: disabled ? "#F3F4F6" : "#E5E7EB",
                  },
                  cursor: disabled ? "not-allowed" : "pointer",
                  fontSize: "0.875rem",
                }}
              />
            ))}
          </Stack>
        )}

        <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={disabled ? "AI가 답변을 생성하고 있습니다..." : "메시지를 입력하세요..."}
            disabled={disabled}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "#F9FAFB",
                "& fieldset": {
                  borderColor: "#E5E7EB",
                },
                "&:hover fieldset": {
                  borderColor: "#D1D5DB",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#3B82F6",
                },
              },
            }}
          />
          <IconButton
            onClick={handleSend}
            disabled={!inputValue.trim() || disabled}
            sx={{
              bgcolor: "#3B82F6",
              color: "#FFFFFF",
              "&:hover": {
                bgcolor: "#2563EB",
              },
              "&:disabled": {
                bgcolor: "#E5E7EB",
                color: "#9CA3AF",
              },
              width: 48,
              height: 48,
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
}