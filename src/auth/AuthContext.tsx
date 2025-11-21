// src/auth/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  accessToken: string | null;      // 토큰 상태
  userName: string | null;         // 로그인한 사용자 이름
  login: (token?: string) => void; // 토큰(옵션)
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // 앱 시작 시 localStorage에서 토큰 로드
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    return localStorage.getItem("access_token");
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return !!localStorage.getItem("access_token");
  });

  const [userName, setUserName] = useState<string | null>(null);

  // 현재 사용자 정보 불러오기
  const fetchCurrentUser = async (token: string) => {
    try {
      const res = await fetch("http://localhost:8000/members/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        console.error("failed to fetch current user", res.status);
        return;
      }

      const data = await res.json();
      console.log("members/me 응답:", data); // 디버깅용

      // ✅ 백엔드 응답 필드명(id, name, email)에 맞게 name 사용
      setUserName(data.name || data.user_name || null);
    } catch (err) {
      console.error("fetchCurrentUser error:", err);
    }
  };

  // 앱 시작 시 localStorage에 토큰이 있으면 로그인 상태 유지 + 사용자 정보 로드
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsLoggedIn(true);
      setAccessToken(token);
      fetchCurrentUser(token);
    }
  }, []);

  const login = (token?: string) => {
    // 실제 토큰이 없으면 로그인 처리하지 않음
    if (!token) {
      console.error("login() called without token");
      return;
    }

    localStorage.setItem("access_token", token);
    setAccessToken(token);
    setIsLoggedIn(true);

    fetchCurrentUser(token);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setAccessToken(null);
    setIsLoggedIn(false);
    setUserName(null);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, accessToken, userName, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
