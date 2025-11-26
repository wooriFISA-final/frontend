// src/marketing-page/MarketingPage.tsx
// import { useAuth } from "../auth/useAuth";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

export default function MarketingPage() {
  // const { login } = useAuth();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        backgroundColor: "#F5F7FA",
      }}
    >
      <Typography variant="h3" sx={{ mb: 2, fontWeight: 600 }}>
        Welcome to WOORI-ZIP
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: "gray" }}>
        고객 관리를 더 효율적으로! 지금 바로 시작해보세요.
      </Typography>
      <Button
        variant="contained"
        size="large"
        sx={{ px: 5, py: 1.5, borderRadius: 3 }}
        onClick={() => navigate("/auth")} // ✅ auth 페이지로 이동
      >
        회원가입 / 로그인 하기
      </Button>
    </Box>
  );
}
