// src/crm/pages/Reports.tsx
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

// 🔹 Recharts (파이 차트)
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

// ----------------------------------------------------
// 1. API 설정 + 타입 정의 (최신 백엔드 구조 반영)
// ----------------------------------------------------

const API_URL = "http://localhost:8000/reports/";

// [차트 데이터 타입]: Backend에서 JSON 문자열로 저장하는 배열 구조
interface ChartDataArray {
  category: string;
  amount: number;
}

// [차트 JSON 통합 타입]: DB에 저장되는 JSON 문자열의 배열 구조를 가정
type SpendChartJsonType = ChartDataArray[];

// [소비 요약 JSON 구조]: 최신 백엔드 키 반영
interface NewConsumeAnalysisSummary {
  latest_total_spend: string; // "5,400,000"
  total_change_diff: string; // "+600,000원 (12.50%) 변동"
  top_5_categories: string[]; // Top 5 카테고리 리스트
  member_info: any;
}

// [정책 변경 JSON 구조]
interface PolicyChange {
  change_summary: string;
  effective_date: string;
}

// FastAPI ReportRead 에 맞춘 타입 (JSON 필드는 string | object로 유연하게 받음)
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

  // JSON / 숫자 컬럼들 (string | object로 유연하게 받음)
  consume_analysis_summary?: NewConsumeAnalysisSummary | string | null;
  spend_chart_json?: SpendChartJsonType | string | null;
  change_raw_changes?: string[] | string | null;
  policy_changes?: PolicyChange[] | string | null;
  net_profit?: number | null;
  profit_rate?: number | null;
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
        bgcolor: "background.paper",
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
// 3. 파이 차트 컴포넌트 (데이터 타입 수정)
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

  const chartData = items.map((item) => ({
    name: item.category,
    value: item.amount,
  }));

  const COLORS = ["#0074E9", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#6a0dad", "#ff6f61"];

  return (
    <Box sx={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label
          >
            {chartData.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(v: any) => `${Number(v).toLocaleString()} 원`}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

// ----------------------------------------------------
// 4. 리포트 카드 컴포넌트 (목록용)
// ----------------------------------------------------
interface ReportCardProps {
  report: ReportDto;
  onView: (report: ReportDto) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onView }) => {
  const createdDate = new Date(report.create_at);

  return (
    <Card
      elevation={1}
      sx={(theme) => ({
        p: 1.5,
        borderRadius: 2,
        transition: "box-shadow 0.3s, transform 0.2s",
        bgcolor: "background.paper",
        "&:hover": {
          boxShadow: theme.shadows[6],
          transform: "translateY(-2px)",
          cursor: "pointer",
        },
      })}
      onClick={() => onView(report)}
    >
      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Stack direction="column" spacing={1.5}>
          <Typography
            variant="subtitle1"
            fontWeight={700}
            color="#0074E9"
            sx={{ textDecoration: "underline" }}
          >
            {createdDate.getFullYear()}년 {createdDate.getMonth() + 1}월 통합 리포트
          </Typography>

          <Typography variant="body2" color="text.secondary">
            생성일: {createdDate.toLocaleString()}
          </Typography>

          {report.cluster_nickname && (
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", fontWeight: 500 }}
            >
              소비 성향: {report.cluster_nickname}
            </Typography>
          )}

          {report.threelines_summary && (
            <Typography
              variant="body2"
              color="text.primary"
              sx={{ mt: 0.5, lineHeight: 1.6 }}
            >
              {report.threelines_summary}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

// ----------------------------------------------------
// 5. 상세 보기
// ----------------------------------------------------
interface ReportDetailViewProps {
  report: ReportDto;
  onBack: () => void;
}

const ReportDetailView: React.FC<ReportDetailViewProps> = ({
  report,
  onBack,
}) => {
  const createdDate = new Date(report.create_at);

  // 🚨 JSON 필드 파싱 (최신 타입 반영)
  const spendChart = parseJsonField<SpendChartJsonType>(
    report.spend_chart_json as any
  );
  const consumeSummary = parseJsonField<NewConsumeAnalysisSummary>(
    report.consume_analysis_summary as any
  );
  const rawChanges = parseJsonField<string[]>(report.change_raw_changes as any);
  const policyChanges = parseJsonField<PolicyChange[]>(
    report.policy_changes as any
  );

  // 🚨 차트 데이터는 raw array이므로, 배열인지 확인
  const hasCategories = Array.isArray(spendChart) && spendChart.length > 0;

  const hasNetProfit = typeof report.net_profit === "number";
  const hasProfitRate = typeof report.profit_rate === "number";

  const hasConsumeText =
    !!report.consume_report ||
    !!(consumeSummary &&
      (consumeSummary.latest_total_spend ||
        consumeSummary.total_change_diff ||
        (consumeSummary.top_5_categories &&
          consumeSummary.top_5_categories.length > 0)));

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
        sx={{
          mb: 3,
          textTransform: "none",
          fontWeight: 600,
          backgroundColor: "#0074E9",
          color: "white",
          "&:hover": { backgroundColor: "#3399FF" },
        }}
      >
        리포트 목록으로 돌아가기
      </Button>

      {/* 상단 제목/메타 정보 */}
      <Stack direction="row" alignItems="center" spacing={2} mb={1}>
        <Typography variant="h5" fontWeight={600} color="text.primary">
          {createdDate.getFullYear()}년 {createdDate.getMonth() + 1}월 상세 통합 리포트
        </Typography>
        {report.cluster_nickname && (
          <Chip
            label={report.cluster_nickname}
            sx={{
              backgroundColor: "#E3F2FD",
              color: "#0074E9",
              fontWeight: 600,
            }}
          />
        )}
      </Stack>

      <Typography variant="body2" mb={3} color="text.secondary">
        생성일: {createdDate.toLocaleString()}
      </Typography>

      {/* ================= 상단 영역: 소비 관련 3개 카드 ================= */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(3, 1fr)", // ✅ 데스크탑에서는 3등분
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
              {report.consume_report && (
                <Typography
                  variant="body1"
                  sx={{
                    color: "text.primary",
                    lineHeight: 1.8,
                    whiteSpace: "pre-wrap",
                    mb: 1.5,
                  }}
                >
                  {report.consume_report}
                </Typography>
              )}

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
        {/* 소득·부채 변화 */}
        <AnalysisBlock title="소득·부채 변화">
          {report.change_analysis_report ? (
            <Typography
              variant="body1"
              sx={{ mb: 1.5, whiteSpace: "pre-wrap", lineHeight: 1.8 }}
            >
              {report.change_analysis_report}
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

        {/* 투자 수익 분석 */}
        <AnalysisBlock title="투자 수익 분석">
          {report.profit_analysis_report ? (
            <Typography
              variant="body1"
              sx={{ mb: 1.5, whiteSpace: "pre-wrap", lineHeight: 1.8 }}
            >
              {report.profit_analysis_report}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              아직 생성된 투자 수익 분석 결과가 없습니다.
            </Typography>
          )}

          {(hasNetProfit || hasProfitRate) && (
            <Stack direction="row" spacing={4}>
              {hasNetProfit && (
                <Typography variant="body2">
                  • 순이익: {report.net_profit!.toLocaleString()} 원
                </Typography>
              )}
              {hasProfitRate && (
                <Typography variant="body2">
                  • 수익률: {report.profit_rate!.toFixed(2)}%
                </Typography>
              )}
            </Stack>
          )}
        </AnalysisBlock>

        {/* 정책 및 환경 변동 사항 */}
        <AnalysisBlock title="정책 및 환경 변동 사항">
          {report.policy_analysis_report ? (
            <Typography
              variant="body1"
              sx={{ mb: 1.5, whiteSpace: "pre-wrap", lineHeight: 1.8 }}
            >
              {report.policy_analysis_report}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              아직 등록된 정책 및 환경 변동 사항이 없습니다.
            </Typography>
          )}

          {policyChanges && policyChanges.length > 0 && (
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              {policyChanges.map((pc, idx) => (
                <Typography
                  key={idx}
                  component="li"
                  variant="body2"
                  sx={{ lineHeight: 1.8 }}
                >
                  {pc.effective_date ? `[${pc.effective_date}] ` : ""}
                  {pc.change_summary}
                </Typography>
              ))}
            </Box>
          )}
        </AnalysisBlock>

        {/* 3줄 요약 */}
        <AnalysisBlock title="3줄 요약">
          {report.threelines_summary ? (
            <Typography
              variant="body1"
              sx={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}
            >
              {report.threelines_summary}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              아직 3줄 요약이 생성되지 않았습니다.
            </Typography>
          )}
        </AnalysisBlock>

        {/* 전체 통합 보고서 */}
        <AnalysisBlock title="전체 통합 보고서 (Summarize)">
          {report.summarize ? (
            <Typography
              variant="body1"
              sx={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}
            >
              {report.summarize}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              아직 전체 통합 보고서가 생성되지 않았습니다.
            </Typography>
          )}
        </AnalysisBlock>
      </Stack>
    </Box>
  );
};

// ----------------------------------------------------
// 6. 메인 Reports 컴포넌트 (목록 + 상세 전환)
// ----------------------------------------------------

export default function Reports() {
  const { accessToken } = useAuth();
  const [reports, setReports] = React.useState<ReportDto[]>([]);
  const [selectedReport, setSelectedReport] =
    React.useState<ReportDto | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchReports = async () => {
      // 🚨 1. API 요청 시작 시점 로깅
      console.log("--- 리포트 목록 조회 시작 ---");
      console.log(`API_URL: ${API_URL}`);
      console.log(`Access Token 존재 여부: ${!!accessToken}`);

      // Mock Auth 사용 시 토큰 체크는 생략
      if (!accessToken) {
        setLoading(false);
        // return; // 실제 사용 시 주석 해제 필요
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

        const res = await axios.get<ReportDto[]>(API_URL, {
          timeout: 35000,
          headers: headers, // 로깅된 헤더 사용
        });

        // 🚨 3. 요청 성공 시 데이터 로깅
        console.log("리포트 목록 조회 성공. 데이터 개수:", res.data.length);
        setReports(res.data);
      } catch (err: any) {
        // 🚨 4. 요청 실패 시 상세 오류 정보 로깅
        console.error("--- 리포트 목록 조회 실패 상세 ---");

        if (err.response) {
          // HTTP 상태 코드가 2xx 범위를 벗어난 경우 (예: 404, 500)
          console.error("응답 오류 상태 코드:", err.response.status);
          console.error("응답 데이터:", err.response.data);
          setError(`[HTTP Error ${err.response.status}] 리포트 목록을 불러오는 중 오류가 발생했습니다. (백엔드 확인 필요)`);
        } else if (err.request) {
          // 요청이 만들어졌으나 응답을 받지 못한 경우 (예: 네트워크 오류, CORS 문제, 백엔드 서버 다운)
          console.error("요청 오류: 응답을 받지 못함. 서버 또는 네트워크 상태 확인 필요.");
          setError("네트워크 오류 또는 서버 응답 없음. 서버가 실행 중인지 확인하세요.");
        } else {
          // 요청 설정 중 오류가 발생한 경우
          console.error("Axios 설정 오류:", err.message);
          setError(`클라이언트 오류: ${err.message}`);
        }

        // 원본 콘솔 출력도 유지
        console.error("원본 오류 객체:", err);
      } finally {
        // 🚨 5. 요청 완료 시점 로깅
        console.log("--- 리포트 목록 조회 완료 ---");
        setLoading(false);
      }
    };

    fetchReports();
  }, [accessToken]);

  const handleViewReport = (report: ReportDto) => {
    setSelectedReport(report); // ✅ 추가 API 없이 상세 보기
  };

  const handleBack = () => {
    setSelectedReport(null);
    setError(null);
  };

  // ✅ 상세 보기 모드
  if (selectedReport) {
    return <ReportDetailView report={selectedReport} onBack={handleBack} />;
  }

  // ✅ 목록 보기 모드
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
        mx: "auto",
        bgcolor: "background.paper",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4, p: 2 }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ color: "text.primary", fontWeight: 600 }}
        >
          Reports Overview
        </Typography>
        <Button
          startIcon={<DownloadRoundedIcon />}
          sx={{
            backgroundColor: "#0074E9",
            color: "white",
            textTransform: "none",
            fontWeight: 500,
            borderRadius: 2,
            px: 2.5,
            py: 1,
            boxShadow: "0 2px 8px rgba(0, 116, 233, 0.15)",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: "#3399FF",
              boxShadow: "0 4px 12px rgba(0, 116, 233, 0.25)",
            },
          }}
        >
          Export All Reports
        </Button>
      </Stack>

      {loading && (
        <Box sx={{ p: 3 }}>
          <Typography>리포트 데이터를 불러오는 중입니다...</Typography>
        </Box>
      )}

      {error && (
        <Box sx={{ p: 3 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      {!loading && !error && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(1, minmax(0, 1fr))",
              sm: "repeat(2, minmax(0, 1fr))",
              md: "repeat(3, minmax(0, 1fr))",
              lg: "repeat(5, minmax(0, 1fr))",
            },
            gap: 3,
            mb: 4,
            p: 2,
          }}
        >
          {reports.length === 0 && (
            <Typography sx={{ p: 2 }}>
              아직 생성된 리포트가 없습니다.
            </Typography>
          )}
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