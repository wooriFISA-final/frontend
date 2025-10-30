import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import ChatSidebar from "../components/ChatSidebar";
import ChatMessageBubble from "../components/ChatMessageBubble";
import ChatInputArea from "../components/ChatInputArea";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: string;
}

interface ConversationHistory {
  id: string;
  title: string;
  timestamp: string;
}

const initialMessages: Message[] = [
  {
    id: "1",
    text: "안녕하세요! AI 어시스턴트입니다. 무엇을 도와드릴까요?",
    sender: "ai",
    timestamp: "12:00 PM",
  },
];

const conversationHistory: ConversationHistory[] = [
  {
    id: "conv-1",
    title: "Q3 Sales Analysis",
    timestamp: "Today",
  },
  {
    id: "conv-2",
    title: "Customer Insights Discussion",
    timestamp: "Yesterday",
  },
  {
    id: "conv-3",
    title: "Revenue Forecasting",
    timestamp: "2 days ago",
  },
  {
    id: "conv-4",
    title: "Market Trends Overview",
    timestamp: "1 week ago",
  },
];

const suggestedPrompts = [
  "안녕하세요!",
  "오늘 날씨가 어떤가요?",
  "Python에 대해 설명해주세요",
  "재미있는 이야기 해주세요",
];

// 백엔드 API URL
const API_BASE_URL = "http://localhost:8000";

export default function Plan() {
  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const [activeConversationId, setActiveConversationId] = React.useState(
    "conv-1"
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    // 사용자 메시지 추가
    const newUserMessage: Message = {
      id: `msg-${Date.now()}`,
      text: message,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // 백엔드 API 호출
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          session_id: activeConversationId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // AI 응답 추가
      const aiResponse: Message = {
        id: `msg-${Date.now() + 1}`,
        text: data.response,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error calling chatbot API:", error);
      
      // 에러 메시지 표시
      const errorMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        text: "죄송합니다. 서버와의 연결에 문제가 발생했습니다. 백엔드 서버가 실행 중인지 확인해주세요.",
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages(initialMessages);
    setActiveConversationId(`conv-new-${Date.now()}`);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setMessages(initialMessages);
  };

  const handleDeleteConversation = (id: string) => {
    console.log("Deleted conversation:", id);
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
        bgcolor: "#F8F9FB",
        mt: { xs: 8, md: 0 },
      }}
    >
      <Box
        sx={{
          width: 280,
          flexShrink: 0,
          display: { xs: "none", md: "block" },
          overflow: "hidden",
          p: 2,
        }}
      >
        <ChatSidebar
          userProfile={{
            name: "Sarah Johnson",
            email: "sarah@acme.com",
          }}
          conversationHistory={conversationHistory}
          onNewChat={handleNewChat}
          onSelectConversation={handleSelectConversation}
          onDeleteConversation={handleDeleteConversation}
          activeConversationId={activeConversationId}
        />
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          bgcolor: "#F8F9FB",
          p: 2,
        }}
      >
        <Paper
          sx={{
            flexGrow: 1,
            overflow: "auto",
            p: { xs: 2, md: 3 },
            borderRadius: 2,
            mb: { xs: 14, sm: 11, md: 10 },
            display: "flex",
            flexDirection: "column",
            bgcolor: "#FFFFFF",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
          }}
          elevation={0}
        >
          <Stack spacing={2} sx={{ flex: 1 }}>
            {messages.length === 0 && (
              <Stack
                spacing={2}
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  textAlign: "center",
                  py: 8,
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 600, color: "#1F2937" }}>
                  대화를 시작하세요
                </Typography>
                <Typography sx={{ color: "#6B7280", fontSize: "0.95rem" }}>
                  무엇이든 물어보세요!
                </Typography>
              </Stack>
            )}
            {messages.map((msg) => (
              <ChatMessageBubble
                key={msg.id}
                message={msg.text}
                sender={msg.sender}
                timestamp={msg.timestamp}
              />
            ))}
            {isLoading && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  p: 2,
                }}
              >
                <CircularProgress size={20} />
                <Typography sx={{ color: "#6B7280", fontSize: "0.9rem" }}>
                  AI가 답변을 생성하고 있습니다...
                </Typography>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Stack>
        </Paper>

        <ChatInputArea
          onSendMessage={handleSendMessage}
          suggestedPrompts={suggestedPrompts}
          onSuggestedPromptClick={(prompt) => handleSendMessage(prompt)}
          disabled={isLoading}
        />
      </Box>
    </Box>
  );
}
