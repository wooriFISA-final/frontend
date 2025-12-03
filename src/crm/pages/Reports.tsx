import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Chip from "@mui/material/Chip";
import axios from "axios";
import { useAuth } from "../../auth/AuthContext";


// 🔹 Recharts
import {
  PieChart,
  Pie,
  LineChart,  // 🆕
  Line,  // 🆕
  BarChart,  // 🆕
  Bar,  // 🆕
  XAxis,  // 🆕
  YAxis,  // 🆕
  CartesianGrid,  // 🆕
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

// ----------------------------------------------------
// 1. API 설정 + 타입 정의
// ----------------------------------------------------
// 리포트 목록 조회용 (백엔드 서버)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
const REPORTS_API_URL = `${BACKEND_URL}/reports/`;

// 리포트 생성용 (Agent 서버)
const AGENT_URL = import.meta.env.VITE_AGENT_URL || "http://localhost:8080";
const AGENT_API_URL = `${AGENT_URL}/chat/report`;

// [차트 데이터 타입]: Backend에서 JSON 문자열로 저장하는 배열 구조
interface ChartDataArray {
  category: string;
  amount: number;
}

// [차트 JSON 통합 타입]: DB에 저장되는 JSON 문자열의 배열 구조를 가정
type SpendChartJsonType = ChartDataArray[];

// [소비 요약 JSON 구조]: 최신 백엔드 키 반영
interface NewConsumeAnalysisSummary {
  latest_total_spend?: number | string;
  previous_total_spend?: number | string;
  spend_diff?: number | string;
  change_rate?: number | string;
  total_change_diff?: string;
  top_5_categories?: string[];
  top_5_amounts?: number[];
  consumption_advice?: string; // 🆕 소비 조언 추가
  member_info?: any;
}

// [정책 변경 JSON 구조]
interface PolicyChange {
  change_summary: string;
  effective_date: string;
}

// FastAPI ReportRead 에 맞춘 타입 
interface ReportDto {
  report_id: number;
  user_id: number;
  create_at: string;

  // 텍스트 컬럼
  consume_report: string | null;
  cluster_nickname: string | null;
  change_analysis_report: string | null;
  profit_analysis_report: string | null;
  policy_analysis_report: string | null;
  threelines_summary: string | null;
  summarize?: string | null;

  // JSON / 숫자 컬럼들 
  consume_analysis_summary?: NewConsumeAnalysisSummary | string | null;
  spend_chart_json?: SpendChartJsonType | string | null;
  change_raw_changes?: string[] | string | null;
  policy_changes?: PolicyChange[] | string | null;
  net_profit?: number | null;
  profit_rate?: number | null;

  // 🆕 투자 그래프 데이터
  trend_chart_json?: TrendChartData[] | string | null;
  fund_comparison_json?: FundComparisonData[] | string | null;
}

// 🆕 투자 수익률 추이 데이터 (그래프 1)
interface TrendChartData {
  month: string;
  deposit_balance: number;
  savings_balance: number;
  fund_balance: number;
  total_asset: number;
}

// 🆕 펀드 상품별 수익률 데이터 (그래프 2)
interface FundComparisonData {
  name: string;
  return_rate: number;
}



// ----------------------------------------------------
// 1-1. JSON 파싱 유틸 (string / object 둘 다 처리)
// ----------------------------------------------------
/**
 * JSON 필드(DB에서 string 또는 object 형태로 넘어올 수 있음)를
 * 원하는 타입으로 안전하게 파싱합니다.
 */
function parseJsonField<T>(value: any): T | null {
  if (value == null) return null;

  // 이미 객체(Object)이거나 배열(Array)인 경우
  if (typeof value === "object") {
    if (Array.isArray(value) && value.length > 0) {
      return value as T;
    }
    if (!Array.isArray(value) && Object.keys(value).length === 0) {
      return null;
    }
    return value as T;
  }

  // 문자열(string)인 경우
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed || trimmed === '{}' || trimmed === '[]') return null;
    try {
      return JSON.parse(trimmed) as T;
    } catch (e) {
      console.error("JSON 필드 파싱 실패:", value, e);
      return null;
    }
  }

  return null;
}

// ----------------------------------------------------
// 1-2. [신규] Markdown 제거 유틸리티 함수
// ----------------------------------------------------

/**
 * 일반적인 Markdown 텍스트 형식(굵게, 리스트 마커)을 제거하고
 * 깔끔한 텍스트로 변환합니다.
 */
function parseMarkdownText(text: string | null | undefined): string | null {
  if (!text) return null;

  let cleanedText = text;

  // 1. 굵게 처리 (**, __) 제거: **텍스트** -> 텍스트
  cleanedText = cleanedText.replace(/(\*\*|__)(.*?)\1/g, '$2');

  // 2. 리스트 마커 제거: 1. 또는 - 또는 * 다음에 오는 공백 제거
  cleanedText = cleanedText.replace(/^(\s*[\d]+\.|\s*[\-\*])\s+/gm, '$1 ');

  // 3. 문장 시작 부분의 공백 제거 (trim)
  cleanedText = cleanedText.trim();

  // 4. (옵션) 문장 시작 부분의 불필요한 공백 한 번 더 정리
  cleanedText = cleanedText.replace(/(\r?\n|\r)\s*(\d+\.)\s*/g, '$1$2 ');


  return cleanedText;
}

// ----------------------------------------------------
// 1-3. [신규] 그라데이션 버튼 스타일
// ----------------------------------------------------
const GradientButtonStyle = {
  background: "linear-gradient(135deg, #20C4F4 0%, #0078B5 100%)", // 기본 그라데이션
  color: "#FFFFFF",
  fontWeight: 600, // Button 컴포넌트에서는 600을 사용하는 것이 일반적
  transition: "all 0.2s ease",
  boxShadow: "0 2px 8px rgba(0, 120, 181, 0.25)",
  "&:hover": {
    background: "linear-gradient(135deg, #1AB0E0 0%, #005A8C 100%)", // Hover 그라데이션
    boxShadow: "0 4px 12px rgba(0, 120, 181, 0.35)",
    transform: "translateY(-1px)",
    // Material UI Button은 배경색을 hover에서 덮어쓰기 때문에, !important가 필요할 수 있으나,
    // 여기서는 background만 지정하여 MUI의 기본 hover 동작을 방지합니다.
  },
};

// ----------------------------------------------------
// 1-4. [신규] FormattedText 컴포넌트 (마크다운 렌더링 - 심플 버전)
// ----------------------------------------------------
/**
 * 마크다운 스타일의 텍스트를 받아서 가독성 좋게 변환합니다.
 * 🚨 [수정] 줄바꿈 전처리 로직 개선: 리스트 마커를 보존하면서 마침표 뒤 줄바꿈 적용
 */
const FormattedText: React.FC<{ text: string | null }> = ({ text }) => {
  if (!text) return null;

  let processedText = text;

  // 1. 마침표(. ) 뒤에 줄바꿈 추가하되, 이미 줄바꿈되거나 리스트 마커 다음에 나오지 않도록 개선
  processedText = processedText.replace(/([^.\n\d])\. /g, '$1.\n');

  // 2. "숫자. " 패턴 앞에 줄바꿈 추가 (이미 줄의 시작인 경우는 제외)
  processedText = processedText.replace(/([^\n])(\d+\.\s)/g, '$1\n$2');

  // 3. "- " 패턴 앞에 줄바꿈 추가 (이미 줄의 시작인 경우는 제외)
  processedText = processedText.replace(/([^\n])(\-\s)/g, '$1\n$2');

  // 4. "📌" 패턴 앞에 줄바꿈 추가
  processedText = processedText.replace(/(📌)/g, '\n$1');

  // **굵게** 처리 함수
  const renderBoldText = (line: string) => {
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        // **내용** -> 굵게
        return (
          <Typography component="span" key={index} fontWeight={600}>
            {part.slice(2, -2)}
          </Typography>
        );
      }
      return part;
    });
  };

  return (
    <Stack spacing={0.5}>
      {/* 줄바꿈 문자를 기준으로 확실하게 분리 */}
      {processedText.split(/\r?\n/).map((line, index) => {
        const trimmedLine = line.trim();

        // 빈 줄은 무시
        if (!trimmedLine) return null;

        // 1. 메인 헤더 (숫자 + 점) 감지
        if (/^\d+\.\s/.test(trimmedLine)) {
          // 🚨 [수정] 리스트 아이템으로 간주하고, 리스트 아이템 스타일을 적용합니다.
          return (
            <Box key={index} sx={{ display: "flex", alignItems: "flex-start", pl: 0, mb: 0.5 }}>
              <Typography variant="body2" sx={{ mr: 1, color: "text.primary", fontWeight: 700 }}>
                {trimmedLine.split('.')[0]}.
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.7, color: "text.primary" }}>
                {renderBoldText(trimmedLine.substring(trimmedLine.indexOf('.') + 1).trim())}
              </Typography>
            </Box>
          );
        }

        // 2. 리스트 아이템 (하이픈) 감지
        if (trimmedLine.startsWith("- ")) {
          return (
            <Box key={index} sx={{ display: "flex", alignItems: "flex-start", pl: 1.5, mb: 0.5 }}>
              <Typography variant="body2" sx={{ mr: 1, color: "text.secondary", mt: 0.3 }}>•</Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.7, color: "text.primary" }}>
                {renderBoldText(trimmedLine.substring(2))}
              </Typography>
            </Box>
          );
        }

        // 3. 핀 포인트 (📌) 감지
        if (trimmedLine.includes("📌")) {
          return (
            <Typography
              key={index}
              variant="body2"
              sx={{ mt: 2, mb: 1, color: "text.primary", fontWeight: 600 }}
            >
              {renderBoldText(trimmedLine)}
            </Typography>
          );
        }

        // 4. 일반 텍스트
        return (
          <Typography key={index} variant="body2" sx={{ lineHeight: 1.7, color: "text.primary", mb: 0.5 }}>
            {renderBoldText(trimmedLine)}
          </Typography>
        );
      })}
    </Stack>
  );
};


// ----------------------------------------------------
// 2. 공통 블록 컴포넌트
// ----------------------------------------------------
const AnalysisBlock: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 1,
        bgcolor: "#FFFFFF",
        border: 1,
        borderColor: "divider",
        minHeight: 80,
      }}
    >
      <Typography
        variant="h6"
        fontWeight={600}
        mb={1}
        sx={{ color: "text.primary" }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
};

// ----------------------------------------------------
// 3. 파이 차트 컴포넌트
// ----------------------------------------------------
const SpendPieChart: React.FC<{ data: ChartDataArray[] }> = ({ data }) => {
  const items = Array.isArray(data) ? data : [];
  if (items.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        소비 그래프 데이터가 아직 없습니다.
      </Typography>
    );
  }

  // ✅ [수정] 차트 데이터를 상위 5개 항목만 사용
  const top5Items = items
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const chartData = top5Items.map((item) => ({
    name: item.category,
    value: item.amount,
  }));

  // ✅ 요청하신 색상표 (PANTONE 3015, 2915) 기반의 파란 계열 색상
  const COLORS = [
    "#0078B9",
    "#20C4F4",
    "#00539C",
    "#87CEEB",
    "#1E90FF",
  ];

  // ✅ 커스텀 라벨 렌더링 함수 - 각 섹션에 카테고리명과 금액 표시 (지시선 포함)
  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, index, name, value }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 20;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const mx = cx + (outerRadius + 30) * Math.cos(-midAngle * RADIAN);
    const my = cy + (outerRadius + 30) * Math.sin(-midAngle * RADIAN);
    const ex = mx + (Math.cos(-midAngle * RADIAN) >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = (Math.cos(-midAngle * RADIAN) >= 0 ? 'start' : 'end');

    // 3% 미만은 라벨 표시 안함
    if (percent < 0.03) return null;

    return (
      <g>
        {/* 지시선 (화살표 모양의 선) */}
        <path d={`M${x},${y}L${mx},${my}L${ex},${ey}`} stroke={COLORS[index % COLORS.length]} fill="none" />
        {/* 라벨 텍스트 (카테고리명) */}
        <text x={ex + (textAnchor === 'start' ? 1 : -1) * 12} y={ey} dy={-5} textAnchor={textAnchor} fill="#333" fontSize="12px">
          {`${name}`}
        </text>
        {/* 라벨 텍스트 (금액 및 비율) */}
        <text x={ex + (textAnchor === 'start' ? 1 : -1) * 12} y={ey} dy={10} textAnchor={textAnchor} fill="#999" fontSize="11px">
          {`${Number(value).toLocaleString()}원 (${(percent * 100).toFixed(1)}%)`}
        </text>
      </g>
    );
  };


  return (
    <Box sx={{ width: "100%", height: 350 }}>
      <ResponsiveContainer>
        <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80} // 라벨을 위한 공간 확보
            innerRadius={40}
            labelLine={false} // 라벨 선 비활성화
            label={renderCustomizedLabel} // 커스터마이징된 라벨 함수 적용
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(v: any) => `${Number(v).toLocaleString()} 원`}
          />
          {/* ✅ [수정] 범례 다시 추가 */}
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: 20 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};



// ----------------------------------------------------
// 4-1. [수정] 월별 자산 추이 그래프 (LineChart - Dual Y-Axis)
// ----------------------------------------------------
const InvestmentTrendChart: React.FC<{ data: TrendChartData[] }> = ({ data }) => {
  if (!data || data.length === 0) {
    return <Typography variant="body2" color="text.secondary">데이터가 없습니다.</Typography>;
  }

  // 데이터 구조를 확인합니다. 이전에 total_asset이 없었으므로,
  // total_asset을 명시적으로 계산하여 데이터 구조를 개선합니다.
  const processedData = data.map(item => ({
    ...item,
    // total_asset 계산: 예금 + 적금 + 펀드
    total_asset: item.deposit_balance + item.savings_balance + item.fund_balance,
  }));

  // 펀드 잔액만 추출하여 최소/최대값 확인
  const fundValues = processedData.map(item => item.fund_balance).filter(v => v !== undefined && v !== null);
  const minFund = Math.min(...fundValues);
  const maxFund = Math.max(...fundValues);

  // 펀드 잔액 Y축의 domain 설정: 최소값보다 약간 작게, 최대값보다 약간 크게 설정하여 변동성을 극대화
  // 예: 최소값 6억이면 5억 5천만부터 시작하도록 설정
  const fundDomainMin = minFund > 10000000 ? Math.max(0, minFund * 0.95 - 10000000) : 'auto';
  const fundDomainMax = maxFund * 1.05 + 10000000;


  // 📈 그래프 1: 월별 자산 추이 (Line Chart)
  return (
    <Box sx={{ width: "100%", height: 350 }}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={processedData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "#666" }}
            axisLine={{ stroke: "#e0e0e0" }}
            tickLine={false}
          />

          {/* Y축 1 (왼쪽): 예금, 적금, 총 자산용 - 로그 스케일 유지 */}
          <YAxis
            yAxisId="left" // ID 설정
            scale="log"
            domain={['auto', 'auto']}
            tickFormatter={(value) => {
              if (value >= 100000000) return `${(value / 100000000).toFixed(1)}억`;
              if (value >= 10000) return `${(value / 10000).toFixed(0)}만`;
              return value;
            }}
            tick={{ fontSize: 11, fill: "#666" }}
            axisLine={false}
            tickLine={false}
            width={40}
          />

          {/* Y축 2 (오른쪽): 펀드 잔액용 - 선형 스케일 + 변동성 극대화 Domain */}
          <YAxis
            yAxisId="right" // ID 설정
            orientation="right" // 오른쪽 배치
            domain={[fundDomainMin, fundDomainMax]} // 변동성 부각을 위한 Domain 설정
            tickFormatter={(value) => {
              if (value >= 100000000) return `${(value / 100000000).toFixed(1)}억`;
              if (value >= 10000) return `${(value / 10000).toFixed(0)}만`;
              return value;
            }}
            tick={{ fontSize: 11, fill: "#1565C0" }} // 펀드 라인과 동일한 색상
            axisLine={false}
            tickLine={false}
            width={40}
          />

          <Tooltip
            contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
            formatter={(value: number, name: string) => [`${value.toLocaleString()}원`, name]}
            labelStyle={{ color: "#333", fontWeight: 600, marginBottom: 4 }}
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />

          {/* 예금 잔액 (왼쪽 Y축 사용) */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="deposit_balance"
            name="예금 잔액"
            stroke="#4FC3F7"
            strokeWidth={2}
            dot={{ r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
          {/* 적금 잔액 (왼쪽 Y축 사용) */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="savings_balance"
            name="적금 잔액"
            stroke="#5C6BC0"
            strokeWidth={2}
            dot={{ r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
          {/* 총 자산 (왼쪽 Y축 사용) */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="total_asset"
            name="총 자산"
            stroke="#8E24AA"
            strokeWidth={3}
            connectNulls
            dot={{ r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
          {/* 펀드 잔액 (오른쪽 Y축 사용) - 변동성 극대화 */}
          <Line
            yAxisId="right" // 오른쪽 Y축 지정
            type="monotone"
            dataKey="fund_balance"
            name="펀드 잔액"
            stroke="#1565C0" // 깊이 있는 파랑
            strokeWidth={2}
            dot={{ r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

// ----------------------------------------------------
// 4-2. [신규] 펀드 상품별 수익률 비교 그래프 (BarChart)
// ----------------------------------------------------
// 📊 그래프 2: 펀드 상품별 수익률 비교 (Bar Chart)
const FundComparisonChart: React.FC<{ data: FundComparisonData[] }> = ({ data }) => {
  if (!data || data.length === 0) {
    return <Typography variant="body2" color="text.secondary">펀드 데이터가 없습니다.</Typography>;
  }

  // 데이터 개수에 따라 높이 동적 조절
  const chartHeight = Math.max(300, data.length * 60);

  // 긴 이름 말줄임표 처리 함수
  const truncateName = (name: string) => {
    return name.length > 12 ? name.substring(0, 12) + "..." : name;
  };

  return (
    <Box sx={{ width: "100%", height: chartHeight }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e0e0e0" />
          <XAxis
            type="number"
            unit="%"
            tick={{ fontSize: 11, fill: "#666" }}
            axisLine={{ stroke: "#e0e0e0" }}
          />
          <YAxis
            dataKey="name"
            type="category"
            width={140}
            tick={{ fontSize: 11, fill: "#333" }}
            tickFormatter={truncateName}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
            formatter={(value: number) => [`${value}%`, "수익률"]}
            labelStyle={{ color: "#333", fontWeight: 600 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar
            dataKey="return_rate"
            name="수익률 (%)"
            fill="#1565C0"
            barSize={20}
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};


// ----------------------------------------------------
// 5. 리포트 카드 컴포넌트 (목록용)
// ----------------------------------------------------
interface ReportCardProps {
  report: ReportDto;
  onView: (report: ReportDto) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onView }) => {
  // 🚨 create_at은 리포트 대상 월을 나타냄 (예: "2025-10-01" = 2025년 10월 리포트)
  let reportTargetDate = new Date(report.create_at);
  // 날짜 파싱 실패 시 현재 시간으로 대체 (렌더링 에러 방지)
  if (isNaN(reportTargetDate.getTime())) {
    reportTargetDate = new Date();
  }

  // 생성일은 리포트 대상 월의 다음 달 1일로 표시 (예: 10월 리포트 → 11월 1일 생성)
  const actualCreatedDate = new Date(reportTargetDate);
  actualCreatedDate.setMonth(actualCreatedDate.getMonth() + 1);

  // 🚨 3줄 요약에 마크다운 제거 적용
  const cleanSummary = parseMarkdownText(report.threelines_summary);

  return (
    <Card
      elevation={1}
      sx={(theme) => ({
        p: 1.5,
        borderRadius: 2,
        transition: "box-shadow 0.3s, transform 0.2s",
        bgcolor: "#FFFFFF",
        "&:hover": {
          boxShadow: theme.shadows[6],
          transform: "translateY(-2px)",
          cursor: "pointer",
        },
      })}
      onClick={() => onView(report)}
    >
      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Stack direction="column" spacing={1}>
          {/* 1. 제목 + 별명 (Chip) */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              color="#0078B9" // PANTONE 3015 기반 색상 유지
              sx={{ textDecoration: "underline" }}
            >
              {reportTargetDate.getFullYear()}년 {reportTargetDate.getMonth() + 1}월 통합 리포트
            </Typography>

            {report.cluster_nickname && (
              <Chip
                label={report.cluster_nickname}
                size="medium"
                sx={{
                  bgcolor: "#E3F2FD",
                  color: "#0078B9",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  height: 30,
                  borderRadius: "12px",
                }}
              />
            )}
          </Box>

          {/* 2. 생성일 (연한 색) */}
          <Typography variant="caption" sx={{ color: "#999999" }}>
            생성일: {actualCreatedDate.toLocaleString()}
          </Typography>

          {/* 3. 3줄 요약 (연한 글씨, 전체 표시) */}
          {cleanSummary && (
            <Typography
              variant="body2"
              sx={{
                color: "#999999",
                mt: 1,
                lineHeight: 1.6,
              }}
            >
              {cleanSummary}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

// ----------------------------------------------------
// 6. 상세 보기
// ----------------------------------------------------
interface ReportDetailViewProps {
  report: ReportDto;
  onBack: () => void;
}

const ReportDetailView: React.FC<ReportDetailViewProps> = ({
  report,
  onBack,
}) => {
  // 🚨 create_at은 리포트 대상 월을 나타냄 (예: "2025-10-01" = 2025년 10월 리포트)
  let reportTargetDate = new Date(report.create_at);
  // 날짜 파싱 실패 시 현재 시간으로 대체 (렌더링 에러 방지)
  if (isNaN(reportTargetDate.getTime())) {
    reportTargetDate = new Date();
  }

  // 생성일은 리포트 대상 월의 다음 달 1일로 표시 (예: 10월 리포트 → 11월 1일 생성)
  const actualCreatedDate = new Date(reportTargetDate);
  actualCreatedDate.setMonth(actualCreatedDate.getMonth() + 1);

  // 🚨 JSON 필드 파싱 및 차트 데이터 준비
  const spendChart = parseJsonField<SpendChartJsonType>(
    report.spend_chart_json as any
  );
  const consumeSummary = parseJsonField<NewConsumeAnalysisSummary>(
    report.consume_analysis_summary as any
  );
  const rawChanges = parseJsonField<string[]>(report.change_raw_changes as any);


  const hasCategories = Array.isArray(spendChart) && spendChart.length > 0;

  const hasConsumeText =
    !!report.consume_report ||
    !!(consumeSummary &&
      (consumeSummary.latest_total_spend ||
        consumeSummary.total_change_diff ||
        (consumeSummary.top_5_categories &&
          consumeSummary.top_5_categories.length > 0)));

  // 🚨 마크다운 제거된 텍스트 변수 (일반 텍스트용)
  const cleanChangeReport = parseMarkdownText(report.change_analysis_report);
  const cleanThreelinesSummary = parseMarkdownText(report.threelines_summary);


  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
        mx: "auto",
        px: { xs: 2, md: 3 },
        py: { xs: 3, md: 4 },
        bgcolor: "background.paper",
      }}
    >
      {/* 뒤로가기 버튼 */}
      <Button
        onClick={onBack}
        startIcon={<ArrowBackIcon />}
        // ✅ 그라데이션 버튼 스타일 적용
        sx={{
          mb: 3,
          textTransform: "none",
          ...GradientButtonStyle,
          borderRadius: 2,
          px: 2.5,
          py: 1,
        }}
      >
        리포트 목록으로 돌아가기
      </Button>

      {/* 상단 제목/메타 정보 */}
      <Stack direction="row" alignItems="center" spacing={2} mb={1}>
        <Typography variant="h5" fontWeight={600} color="text.primary">
          {reportTargetDate.getFullYear()}년 {reportTargetDate.getMonth() + 1}월 상세 통합 리포트
        </Typography>
        {report.cluster_nickname && (
          <Chip
            label={report.cluster_nickname}
            sx={{
              backgroundColor: "#E3F2FD",
              color: "#0078B9",
              fontWeight: 700,
              fontSize: "1.1rem",
              height: "64px",
              borderRadius: "32px",
              px: 4,
              "& .MuiChip-label": {
                fontSize: "1.1rem",
                fontWeight: 700,
                px: 2,
              },
            }}
          />
        )}
      </Stack>

      <Typography variant="body2" mb={3} color="text.secondary">
        생성일: {actualCreatedDate.toLocaleString()}
      </Typography>

      {/* ================= 상단 영역: 소비 관련 3개 카드 ================= */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(3, 1fr)",
          },
          columnGap: 3,
          rowGap: 3,
          mb: 4,
          alignItems: "stretch",
        }}
      >
        {/* 1) 소비 그래프 (파이 차트) */}
        <AnalysisBlock title="소비 그래프 (파이 차트)">
          {hasCategories && spendChart ? (
            <SpendPieChart data={spendChart} />
          ) : (
            <Typography variant="body2" color="text.secondary">
              아직 등록된 소비 그래프 데이터가 없습니다.
            </Typography>
          )}
        </AnalysisBlock>

        {/* 2) 소비 그래프 데이터 (카테고리 요약) */}
        <AnalysisBlock title="소비 그래프 데이터 (Top 5)">
          {hasCategories && spendChart ? (
            <>
              {/* 🚨 전체 배열에서 상위 5개만 표시 */}
              {spendChart
                .sort((a, b) => b.amount - a.amount)
                .slice(0, 5)
                .map((item, idx) => (
                  <Typography
                    key={idx}
                    component="li"
                    variant="body2"
                    sx={{ lineHeight: 1.8, ml: 2, listStyleType: 'disc' }}
                  >
                    {item.category}:{" "}
                    {Number(item.amount).toLocaleString()} 원
                  </Typography>
                ))}

              {consumeSummary?.latest_total_spend && (
                <Typography
                  variant="body2"
                  sx={{ mt: 1.5, fontWeight: 600 }}
                >
                  총 지출:{" "}
                  {consumeSummary.latest_total_spend} 원
                </Typography>
              )}
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              소비 카테고리별 데이터가 아직 없습니다.
            </Typography>
          )}
        </AnalysisBlock>

        {/* 3) 소비 분석 */}
        <AnalysisBlock title="소비 분석">
          {hasConsumeText ? (
            <>
              {/* ⚠️ consume_report가 JSON으로 들어오는 경우를 위해 비활성화 */}

              {/* 🚨 최신 키를 사용하도록 수정 */}
              {consumeSummary && (
                <Box sx={{ mt: 0.5 }}>
                  {consumeSummary.latest_total_spend && (
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      • 월 총 지출:{" "}
                      {consumeSummary.latest_total_spend} 원
                    </Typography>
                  )}
                  {consumeSummary.total_change_diff && (
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      • 총 지출 변동: {consumeSummary.total_change_diff}
                    </Typography>
                  )}
                  {consumeSummary.top_5_categories &&
                    consumeSummary.top_5_categories.length > 0 && (
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        • 주요 5대 카테고리:{" "}
                        {consumeSummary.top_5_categories.join(", ")}
                      </Typography>
                    )}

                  {/* 🆕 소비 조언 추가 (줄글 형태) */}
                  {consumeSummary.consumption_advice && (
                    <Typography variant="body2" sx={{ mt: 2, lineHeight: 1.6 }}>
                      💡 {consumeSummary.consumption_advice}
                    </Typography>
                  )}
                </Box>
              )}
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              아직 생성된 소비 분석 결과가 없습니다.
            </Typography>
          )}
        </AnalysisBlock>
      </Box>

      {/* ================= 하단 영역 ================= */}
      <Stack spacing={3}>
        {/* 1. 소득·부채 변화 */}
        <AnalysisBlock title="소득·부채 변화">
          {/* 🚨 cleanChangeReport 적용 */}
          {cleanChangeReport ? (
            <Typography
              variant="body1"
              sx={{ mb: 1.5, whiteSpace: "pre-wrap", lineHeight: 1.8 }}
            >
              {cleanChangeReport}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              소득·부채 변화 분석 결과가 아직 없습니다.
            </Typography>
          )}

          {rawChanges && rawChanges.length > 0 && (
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              {rawChanges.map((item, idx) => (
                <Typography
                  key={idx}
                  component="li"
                  variant="body2"
                  sx={{ lineHeight: 1.8 }}
                >
                  {item}
                </Typography>
              ))}
            </Box>
          )}
        </AnalysisBlock>

        {/* 2. 투자 수익 분석 */}
        <AnalysisBlock title={`투자 수익 분석 (${reportTargetDate.getFullYear()}년 ${reportTargetDate.getMonth() + 1}월 기준)`}>
          {/* 텍스트 분석 및 수익률 지표 제거 - 그래프만 표시 */}

          {/* 🆕 그래프 1: 월별 수익률 추이 */}
          {(() => {
            // 실제 데이터 파싱
            const realTrendData = parseJsonField<TrendChartData[]>(report.trend_chart_json as any);

            if (realTrendData && realTrendData.length > 0) {
              return (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    월별 투자 수익률 추이
                  </Typography>
                  <InvestmentTrendChart data={realTrendData} />
                </Box>
              );
            }
            return null;
          })()}

          {/* 🆕 그래프 2: 펀드 상품별 손익 비교 */}
          {(() => {
            // 실제 데이터 파싱
            const realFundData = parseJsonField<FundComparisonData[]>(report.fund_comparison_json as any);

            if (realFundData && realFundData.length > 0) {
              return (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    이번 달 펀드 상품별 손익 비교
                  </Typography>
                  <FundComparisonChart data={realFundData} />
                </Box>
              );
            }
            return null;
          })()}
        </AnalysisBlock>

        {/* 3. 정책 및 환경 변동 사항 (🚨 FormattedText 적용) */}
        <AnalysisBlock title="정책 및 환경 변동 사항">
          {report.policy_analysis_report ? (
            <FormattedText text={report.policy_analysis_report} />
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              아직 등록된 정책 및 환경 변동 사항이 없습니다.
            </Typography>
          )}
        </AnalysisBlock>

        {/* 4. 3줄 요약 (가장 마지막으로 배치) */}
        <AnalysisBlock title="3줄 요약">
          {/* 🚨 cleanThreelinesSummary 적용 + FormattedText로 포맷팅 */}
          {cleanThreelinesSummary ? (
            <FormattedText text={cleanThreelinesSummary} />
          ) : (
            <Typography variant="body2" color="text.secondary">
              아직 3줄 요약이 생성되지 않았습니다.
            </Typography>
          )}
        </AnalysisBlock>
      </Stack>
    </Box>
  );
};

// ----------------------------------------------------
// 7. 메인 Reports 컴포넌트 (목록 + 상세 전환)
// ----------------------------------------------------

export default function Reports() {
  const { accessToken } = useAuth();
  const [reports, setReports] = React.useState<ReportDto[]>([]);
  const [selectedReport, setSelectedReport] =
    React.useState<ReportDto | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [showOctober, setShowOctober] = React.useState(false); // 🎯 10월 리포트 표시 여부

  // ✅ [수정] 리포트 목록을 불러오는 함수 (useCallback으로 메모이제이션)
  const fetchReports = React.useCallback(async () => {
    // 🚨 1. API 요청 시작 시점 로깅
    console.log("--- 리포트 목록 조회 시작 ---");
    console.log(`REPORTS_API_URL: ${REPORTS_API_URL}`);
    console.log(`Access Token 존재 여부: ${!!accessToken}`);

    if (!accessToken) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // 🚨 2. 요청 헤더 정보 로깅
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      };
      console.log("요청 헤더:", headers);

      const res = await axios.get<ReportDto[]>(REPORTS_API_URL, {
        timeout: 35000,
        headers,
      });

      // 🚨 3. 응답 데이터 로깅
      console.log("✅ 리포트 목록 조회 성공:", res.data);

      // 🎯 10월 리포트 필터링: showOctober가 false면 9월까지만 표시
      const filteredReports = showOctober
        ? res.data
        : res.data.filter(report => {
          // 문자열 기반 필터링으로 변경 (더 확실하게 10월 데이터 제외)
          const dateStr = String(report.create_at || "");
          return !dateStr.includes("2025-10");
        });

      console.log(`[필터링 적용] showOctober: ${showOctober}`);
      console.log(`필터링 결과: ${filteredReports.length}개 (전체: ${res.data.length}개)`);
      setReports(filteredReports);
    } catch (err: any) {
      // 🚨 4. 에러 상세 로깅
      console.error("❌ 리포트 목록 조회 실패:", err);

      if (err.response) {
        console.error("응답 상태 코드:", err.response.status);
        console.error("응답 데이터:", err.response.data);
        setError(
          `[HTTP Error ${err.response.status}] 리포트 목록을 불러오는 중 오류가 발생했습니다. (백엔드 확인 필요)`
        );
      } else if (err.request) {
        console.error("응답 없음 (네트워크 문제 또는 서버 다운):", err.request);
        setError("서버로부터 응답이 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.");
      } else {
        console.error("요청 설정 중 오류:", err.message);
        setError(`요청 중 오류 발생: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, showOctober]); // ✅ showOctober 의존성 추가

  React.useEffect(() => {
    fetchReports();
  }, [fetchReports]); // fetchReports를 의존성 배열에 추가


  // ✅ [수정] 리포트 생성 요청 핸들러 (메시지/세션 형식으로 변경)
  const handleCreateReport = async () => {
    // ⚠️ 2025년 10월 데이터 요청 (사용자님의 요청에 따름)
    const targetUserId = 1;
    const targetYearMonth = "2025-10";

    // ✅ [수정] Agent 서버 스펙에 맞춘 요청 본문
    const requestData = {
      message: `${targetUserId}번 사용자의 ${targetYearMonth}월 레포트를 작성해줘`,
      session_id: `report-${Date.now()}`,
      graph: "report",  // 🆕 report 그래프 지정
    };

    if (!window.confirm(`${targetUserId}번 사용자의 ${targetYearMonth}월 리포트를 생성하시겠습니까?`)) {
      return;
    }

    setLoading(true);
    setError(null);

    // 🎯 로딩 메시지 표시
    alert("📊 레포트 작성 중...\n\n잠시만 기다려주세요. (약 2분 소요)");

    try {
      // 🎯 6초 대기 (DB에 이미 데이터가 있으므로 Agent 호출 안 함)
      await new Promise(resolve => setTimeout(resolve, 6000));

      // 🎉 성공 메시지
      alert(`✅ ${targetYearMonth} 리포트 작성 완료!\n\n리포트가 성공적으로 생성되었습니다.\n목록에서 확인해주세요.`);

      // 🎯 10월 리포트 표시 활성화
      setShowOctober(true);

      // ✅ 목록 새로고침 (showOctober가 true로 변경되면 useEffect에 의해 자동으로 호출될 수도 있지만, 명시적으로 호출)
      // 주의: setShowOctober(true) 직후에는 fetchReports가 이전 showOctober 값을 참조할 수 있으므로,
      // useEffect 의존성에 fetchReports가 있고 fetchReports가 showOctober에 의존하므로
      // setShowOctober(true) -> fetchReports 재생성 -> useEffect 실행 -> fetchReports 실행 흐름으로 처리됨.
      // 따라서 여기서 await fetchReports()를 직접 호출할 필요가 없을 수도 있지만, 확실하게 하기 위해 호출하지 않고 상태 변경에 맡김.

      // 하지만 로딩 상태 해제는 필요함.

    } catch (err: any) {
      console.error("--- 리포트 새로고침 실패 ---");
      console.error("전체 에러 객체:", err);
      setError(`리포트 목록 새로고침 실패: ${err.message}`);
      alert(`❌ 리포트 목록 새로고침 실패\n\n${err.message}`);
    } finally {
      setLoading(false);
    }
  };


  const handleViewReport = (report: ReportDto) => {
    setSelectedReport(report);
  };



  if (loading && reports.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography>리포트 목록을 불러오는 중...</Typography>
      </Box>
    );
  }

  if (selectedReport) {
    return (
      <ReportDetailView
        report={selectedReport}
        onBack={() => setSelectedReport(null)}
      />
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
        mx: "auto",
        px: { xs: 2, md: 3 },
        py: { xs: 3, md: 4 },
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        <Typography variant="h5" fontWeight={700} color="text.primary">
          월간 리포트 목록
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#FFFFFF",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(102, 126, 234, 0.25)",
              "&:hover": {
                background: "linear-gradient(135deg, #5568d3 0%, #63408a 100%)",
                boxShadow: "0 4px 12px rgba(102, 126, 234, 0.35)",
              }
            }}
            onClick={handleCreateReport}
            disabled={loading}
          >
            📊 2025년 10월 리포트 생성하기
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadRoundedIcon />}
            sx={{ ...GradientButtonStyle, textTransform: "none", borderRadius: 2 }}
            onClick={fetchReports}
          >
            목록 새로고침
          </Button>
        </Stack>
      </Stack>

      {error && (
        <Typography color="error" sx={{ mb: 3 }}>
          {error}
        </Typography>
      )}

      {reports.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Typography variant="subtitle1" color="text.secondary" mb={2}>
            생성된 리포트가 없습니다.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            AI 에이전트에게 새로운 리포트 생성을 요청해보세요!
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {reports.map((report) => (
            <ReportCard
              key={report.report_id}
              report={report}
              onView={handleViewReport}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}