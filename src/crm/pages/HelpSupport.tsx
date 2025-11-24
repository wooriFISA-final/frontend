// src/crm/pages/HelpSupport.tsx
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";

import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";

import { Link as RouterLink } from "react-router-dom";
import { useSearch } from "../../search/SearchContext";
import { useTheme } from "@mui/material/styles";

const FAQ_ITEMS = [
  {
    q: "주택 자금 상담은 어디서 시작하나요?",
    a: "왼쪽 메뉴의 Plan 페이지에서 '새 플랜 시작하기' 버튼을 눌러주세요.",
  },
  {
    q: "내 리포트는 어디에서 볼 수 있나요?",
    a: "Reports 페이지에서 월별 리포트를 확인할 수 있습니다.",
  },
  {
    q: "로그인 오류가 나요",
    a: "아이디와 비밀번호를 다시 확인하고, 계속 안되면 관리자에게 문의해주세요.",
  },
];

const GUIDE_ITEMS = [
  {
    title: "주택 자금 플랜 세우는 방법",
    desc: "내 자산과 목표를 기준으로 주택 자금 플랜을 만드는 방법을 안내합니다.",
    to: "/plan",
    icon: <AssessmentRoundedIcon />,
  },
  {
    title: "나의 리포트 보는 방법",
    desc: "소비 분석 및 투자 리포트를 확인하는 방법을 안내합니다.",
    to: "/reports",
    icon: <ArticleRoundedIcon />,
  },
  {
    title: "내 정보 수정",
    desc: "회원 정보와 기본 자산 정보를 수정하는 위치를 안내합니다.",
    to: "/profile", // 또는 /settings 로 변경 가능
    icon: <SettingsRoundedIcon />,
  },
];

// ✅ 비교용 정규화 함수 (소문자 + 공백 제거 + 특수문자 제거)
const normalizeText = (text: string) =>
  text
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9가-힣]/g, "");

const isIncludedChar = (ch: string) => /[a-zA-Z0-9가-힣]/.test(ch);

// ✅ 텍스트 하이라이트용 컴포넌트 (다크/라이트 모드 색 분리)
const HighlightText: React.FC<{ text: string; query: string }> = ({
  text,
  query,
}) => {
  const theme = useTheme();
  const raw = query.trim();
  if (!raw) return <>{text}</>;

  const normText = normalizeText(text);
  const normQuery = normalizeText(raw);
  if (!normQuery) return <>{text}</>;

  const start = normText.indexOf(normQuery);
  if (start === -1) return <>{text}</>; // 매치 없으면 그냥 원본

  // 정규화된 인덱스를 원본 문자열 인덱스로 매핑
  let normPos = 0;
  let startOrig = -1;
  let endOrig = text.length;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (isIncludedChar(ch)) {
      if (normPos === start && startOrig === -1) {
        startOrig = i;
      }
      if (normPos === start + normQuery.length - 1) {
        endOrig = i + 1; // 끝 인덱스는 exclusive
        break;
      }
      normPos += 1;
    }
  }

  if (startOrig === -1) {
    return <>{text}</>;
  }

  const before = text.slice(0, startOrig);
  const match = text.slice(startOrig, endOrig);
  const after = text.slice(endOrig);

  // 🔹 모드에 따라 하이라이트 색 다르게
  const highlightBg =
    theme.palette.mode === "dark"
      ? "rgba(59, 130, 246, 0.55)" // 더 진한 파란색 (다크 모드)
      : "rgba(25, 118, 210, 0.20)"; // 라이트 모드용 옅은 파란색

  const highlightColor =
    theme.palette.mode === "dark" ? "#E5EDFF" : theme.palette.text.primary;

  return (
    <>
      {before}
      <span
        style={{
          backgroundColor: highlightBg,
          color: highlightColor,
          borderRadius: 4,
          padding: "0 3px",
        }}
      >
        {match}
      </span>
      {after}
    </>
  );
};

// 카드 공통 스타일
const cardSx = {
  width: "100%",
  display: "flex",
  flexDirection: "column" as const,
};

const cardContentSx = {
  flex: 1,
  display: "flex",
  flexDirection: "column" as const,
};

const actionButtonSx = {
  mt: 1.5,
  borderRadius: 2,
  fontWeight: 500,
  py: 1,
};

export default function HelpSupport() {
  const { query } = useSearch();

  return (
    <Box sx={{ p: 3 }}>
      {/* 가운데 정렬 + 폭 고정 */}
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        {/* 페이지 타이틀 */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 4 }}>
          <HelpOutlineRoundedIcon />
          <Typography variant="h4" component="h1">
            Help & Support
          </Typography>
        </Stack>

        {/* 🔹 섹션 1: 자주 묻는 질문 */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            자주 묻는 질문
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 2,
            }}
          >
            {FAQ_ITEMS.map((item, idx) => (
              <Card
                key={idx}
                variant="outlined"
                sx={(theme) => ({
                  ...cardSx,
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "#020617"
                      : theme.palette.background.paper,
                  borderColor:
                    theme.palette.mode === "dark"
                      ? "rgba(148,163,184,0.35)"
                      : "#E5E7EB",
                })}
              >
                <CardContent sx={cardContentSx}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mb: 1 }}
                  >
                    <HighlightText text={item.q} query={query} />
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1.5, flexGrow: 1 }}
                  >
                    <HighlightText text={item.a} query={query} />
                  </Typography>

                  <Button
                    size="small"
                    variant="outlined"
                    fullWidth
                    sx={actionButtonSx}
                  >
                    자세히 보기
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        <Divider sx={{ mb: 5 }} />

        {/* 🔹 섹션 2: 사용 가이드 */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            사용 가이드
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 2,
            }}
          >
            {GUIDE_ITEMS.map((item, idx) => (
              <Card
                key={idx}
                variant="outlined"
                sx={(theme) => ({
                  ...cardSx,
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "#020617"
                      : theme.palette.background.paper,
                  borderColor:
                    theme.palette.mode === "dark"
                      ? "rgba(148,163,184,0.35)"
                      : "#E5E7EB",
                })}
              >
                <CardContent sx={cardContentSx}>
                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="flex-start"
                    sx={{ flex: 1 }}
                  >
                    <Box sx={{ mt: 0.5 }}>{item.icon}</Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, mb: 0.5 }}
                      >
                        <HighlightText text={item.title} query={query} />
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1.5 }}
                      >
                        <HighlightText text={item.desc} query={query} />
                      </Typography>
                    </Box>
                  </Stack>

                  <Button
                    size="small"
                    variant="outlined"
                    fullWidth
                    component={RouterLink}
                    to={item.to}
                    sx={actionButtonSx}
                  >
                    이동하기
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* 🔹 섹션 3: 버전 / 시스템 상태 */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          버전 & 시스템 상태
        </Typography>
        <Card
          variant="outlined"
          sx={(theme) => ({
            bgcolor:
              theme.palette.mode === "dark"
                ? "#020617"
                : theme.palette.background.paper,
            borderColor:
              theme.palette.mode === "dark"
                ? "rgba(148,163,184,0.35)"
                : "#E5E7EB",
          })}
        >
          <CardContent>
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  현재 버전
                </Typography>
                <Chip label="v0.1 (Beta)" size="small" />
              </Stack>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  알려진 이슈
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • 리포트 생성에 10~20초 정도 소요될 수 있습니다.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • 처음 로그인 후 데이터 로딩이 약간 느릴 수 있습니다.
                </Typography>
              </Box>

              <Typography variant="caption" color="text.secondary">
                문제가 반복되면 새로고침 후 다시 시도하거나, 관리자에게
                문의해주세요.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
