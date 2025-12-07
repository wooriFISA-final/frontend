// src/auth/AuthPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Stack, Paper, Tabs, Tab } from "@mui/material";
import { useAuth } from "./AuthContext";

// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";
const BACKEND_URL = "http://localhost:8000";


export default function AuthPage() {
  const [tab, setTab] = useState(0); // 0: 로그인, 1: 회원가입
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (tab === 1) {
        // ✅ 회원가입
        const res = await fetch(`${BACKEND_URL}/members/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        });

        if (!res.ok) throw new Error(`회원가입 실패 (${res.status})`);
        const data = await res.json();
        console.log("회원가입 성공:", data);

        // 회원가입 성공 후 자동 로그인 시도 (또는 안내 메시지 후 로그인 탭으로 전환)
        alert("회원가입이 완료되었습니다. 로그인해주세요.");
        setTab(0);
        return;
      }

      // ✅ 로그인 로직 (예시 — 실제 백엔드 로그인 API에 맞게 조정)
      const res = await fetch(`${BACKEND_URL}/login/access-token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username: email,
          password: password,
        }),
      });

      if (!res.ok) throw new Error(`로그인 실패 (${res.status})`);
      const data = await res.json();

      // ✅ 토큰 저장
      localStorage.setItem("access_token", data.access_token);

      login(data.access_token); // AuthContext 상태 갱신
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      alert("요청 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F5F7FA",
      }}
    >
      <Paper sx={{ p: 4, width: 400, textAlign: "center", borderRadius: 3 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          WOORI-ZIP
        </Typography>

        <Tabs value={tab} onChange={(_e, v) => setTab(v)} sx={{ mb: 3 }}>
          <Tab label="로그인" />
          <Tab label="회원가입" />
        </Tabs>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="이메일"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="비밀번호"
              type="password"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {tab === 1 && (
              <TextField
                label="이름"
                fullWidth
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}

            <Button type="submit" variant="contained" size="large" sx={{ mt: 1 }}>
              {tab === 0 ? "로그인" : "회원가입"}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
