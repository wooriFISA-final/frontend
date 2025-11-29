// src/crm/pages/Plan.tsx
import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import ChatSidebar from "../components/ChatSidebar";
import ChatMessageBubble from "../components/ChatMessageBubble";
import ChatInputArea from "../components/ChatInputArea";
import { useAuth } from "../../auth/AuthContext";

import PlanInputForm, { PlanFormData } from "../components/PlanInputForm";
import PlanInputSummary from "../components/PlanInputSummary";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: string;
  isForm?: boolean;  // 폼 메시지 구분
  formData?: PlanFormData;  // 제출된 폼 데이터
}

interface ConversationHistory {
  id: string;
  title: string;
  timestamp: string;
}

const initialMessages: Message[] = [
  {
    id: "1",
    text: "", // 폼이므로 텍스트는 불필요
    sender: "ai",
    timestamp: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    isForm: true,  // 폼 메시지임을 표시
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
const API_BASE_URL = "http://localhost:8080/chat/plan";

export default function Plan() {
  // ✅ 현재 로그인한 사용자 정보 (AuthContext)
  const { userName } = useAuth();

  const displayName = userName || "로그인 사용자";

  // 나중에 로그인 시 localStorage.setItem("user_email", email) 해두면 여기서 자동 반영됨
  const storedEmail =
    typeof window !== "undefined" ? localStorage.getItem("user_email") : null;
  const displayEmail = storedEmail ?? "";

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
      const response = await fetch(`${API_BASE_URL}`, {
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

  const handleFormSubmit = (formData: PlanFormData) => {
    // 폼을 제거하고 일반 메시지로 전환
    setMessages((prev) => prev.filter((msg) => !msg.isForm));

    // 폼 데이터를 텍스트로 포맷팅 (백엔드 전송용)
    const formattedMessage = `
1. 초기 자산: ${formData.initialAsset}
2. 주택 위치: ${formData.location}
3. 희망 주택 가격: ${formData.targetPrice}
4. 주택 유형: ${formData.housingType}
5. 월 소득 배분 비율: ${formData.monthlyAllocation}
6. 자산 배분 비율: ${formData.assetAllocation.deposit}:${formData.assetAllocation.savings}:${formData.assetAllocation.fund}
    `.trim();

    // 사용자 메시지 추가 (formData 포함)
    const newUserMessage: Message = {
      id: `msg-${Date.now()}`,
      text: formattedMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      formData: formData,  // 요약 카드 렌더링용
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    // 백엔드 API 호출
    fetch(`${API_BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: formattedMessage,
        session_id: activeConversationId,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
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
      })
      .catch((error) => {
        console.error("Error calling chatbot API:", error);
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
      })
      .finally(() => {
        setIsLoading(false);
      });
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
      sx={(theme) => ({
        display: "flex",
        width: "100%",
        height: "100%",
        bgcolor: theme.palette.background.default, // 🔹 다크/라이트 공통 배경
        mt: { xs: 8, md: 0 },
      })}
    >
      {/* 왼쪽 채팅 목록(사이드바) */}
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
            name: displayName, // ✅ 현재 로그인한 사용자 이름
            email: displayEmail, // ✅ (있다면) 현재 사용자 이메일
          }}
          conversationHistory={conversationHistory}
          onNewChat={handleNewChat}
          onSelectConversation={handleSelectConversation}
          onDeleteConversation={handleDeleteConversation}
          activeConversationId={activeConversationId}
        />
      </Box>

      {/* 오른쪽 대화 영역 */}
      <Box
        sx={(theme) => ({
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          bgcolor: theme.palette.background.default,
          p: 2,
        })}
      >
        <Paper
          sx={(theme) => ({
            flexGrow: 1,
            overflow: "auto",
            p: { xs: 2, md: 3 },
            borderRadius: 2,
            pb: 6,
            display: "flex",
            flexDirection: "column",
            bgcolor: theme.palette.background.paper, // 🔹 카드/채팅 영역 배경
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
          })}
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
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 600, color: "text.primary" }}
                >
                  대화를 시작하세요
                </Typography>
                <Typography
                  sx={{ color: "text.secondary", fontSize: "0.95rem" }}
                >
                  무엇이든 물어보세요!
                </Typography>
              </Stack>
            )}
            {messages.map((msg) => (
              msg.isForm ? (
                <PlanInputForm key={msg.id} onSubmit={handleFormSubmit} />
              ) : msg.formData ? (
                <Box key={msg.id} sx={{ display: "flex", justifyContent: "flex-end", mb: 2.5 }}>
                  <PlanInputSummary data={msg.formData} />
                </Box>
              ) : (
                <ChatMessageBubble
                  key={msg.id}
                  message={msg.text}
                  sender={msg.sender}
                  timestamp={msg.timestamp}
                />
              )
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
                <Typography
                  sx={{ color: "text.secondary", fontSize: "0.9rem" }}
                >
                  AI가 답변을 생성하고 있습니다...
                </Typography>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Stack>
        </Paper>

        {/* 하단 입력 영역 */}
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
