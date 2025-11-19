import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import SendIcon from "@mui/icons-material/Send";
import Paper from "@mui/material/Paper";

interface ChatInputAreaProps {
  onSendMessage: (message: string) => void | Promise<void>;
  suggestedPrompts?: string[];
  onSuggestedPromptClick?: (prompt: string) => void | Promise<void>;
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
          p: 2.5,
          borderRadius: 2,
          bgcolor: "#FFFFFF",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
          border: "1px solid #F0F2F5",
        }}
        elevation={0}
      >
        {suggestedPrompts.length > 0 && (
          <Stack
            direction="row"
            spacing={1}
            sx={{
              mb: 2.5,
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
                  bgcolor: "#F5F7FA",
                  color: "#222222",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  borderRadius: 2,
                  border: "1px solid #E5E7EB",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: disabled ? "#F5F7FA" : "#E6F0FF",
                    borderColor: disabled ? "#E5E7EB" : "#0074E9",
                    color: disabled ? "#222222" : "#0074E9",
                  },
                  cursor: disabled ? "not-allowed" : "pointer",
                }}
              />
            ))}
          </Stack>
        )}

        <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-end" }}>
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
                color: "#1F2937",
                transition: "all 0.2s ease",
                "& fieldset": {
                  borderColor: "#E5E7EB",
                },
                "&:hover fieldset": {
                  borderColor: "#D1D5DB",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#0074E9",
                  borderWidth: 2,
                },
              },
              "& .MuiOutlinedInput-input": {
                color: "#1F2937",
              },
              "& .MuiInputBase-input::placeholder": {
                color: "#9CA3AF",
                opacity: 1,
              },
            }}
          />
          <IconButton
            onClick={handleSend}
            disabled={!inputValue.trim() || disabled}
            sx={{
              bgcolor: "#0074E9",
              color: "#FFFFFF",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 8px rgba(0, 116, 233, 0.15)",
              "&:hover": {
                bgcolor: "#3399FF",
                boxShadow: "0 4px 12px rgba(0, 116, 233, 0.25)",
              },
              "&:disabled": {
                bgcolor: "#E5E7EB",
                color: "#9CA3AF",
                boxShadow: "none",
              },
              width: 48,
              height: 48,
              minWidth: 48,
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
}
