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
// 1. API 설정 + 타입 정의
// ----------------------------------------------------

const API_URL = "http://localhost:8000/reports";

// 소비 차트 JSON 구조
interface SpendByCategory {
  category: string;
  amount: number;
}

interface SpendChartJson {
  period?: string;
  total_spend?: number;
  by_category?: SpendByCategory[];
}

// 소비 요약 JSON 구조
interface ConsumeAnalysisSummary {
  total_spend?: number;
  risk_message?: string;
  recommendation?: string;
  main_categories?: string[];
}

// 정책 변경 JSON 구조
interface PolicyChange {
  change_summary?: string;
  effective_date?: string;
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

  // JSON / 숫자 컬럼들 (여러 형태를 받을 수 있게 any 허용)
  consume_analysis_summary?: ConsumeAnalysisSummary | string | null;
  spend_chart_json?: SpendChartJson | string | null;
  change_raw_changes?: string[] | string | null;
  policy_changes?: PolicyChange[] | string | null;
  net_profit?: number | null;
  profit_rate?: number | null;
}

// ----------------------------------------------------
// 1-1. JSON 파싱 유틸 (string / object 둘 다 처리)
// ----------------------------------------------------
function parseJsonField<T>(value: any): T | null {
  if (value == null) return null;

  if (typeof value === "object") {
    return value as T;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
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
// 3. 파이 차트 컴포넌트
// ----------------------------------------------------
const SpendPieChart: React.FC<{ data: SpendChartJson }> = ({ data }) => {
  const items = Array.isArray(data.by_category) ? data.by_category : [];
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

  const COLORS = ["#0074E9", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

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
            {chartData.map((entry, index) => (
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

  // JSON 필드 파싱
  const spendChart = parseJsonField<SpendChartJson>(
    report.spend_chart_json as any
  ) || {};
  const consumeSummary = parseJsonField<ConsumeAnalysisSummary>(
    report.consume_analysis_summary as any
  );
  const rawChanges = parseJsonField<string[]>(report.change_raw_changes as any);
  const policyChanges = parseJsonField<PolicyChange[]>(
    report.policy_changes as any
  );

  const hasCategories =
    Array.isArray(spendChart.by_category) &&
    spendChart.by_category.length > 0;

  const hasNetProfit = typeof report.net_profit === "number";
  const hasProfitRate = typeof report.profit_rate === "number";

  const hasConsumeText =
    !!report.consume_report ||
    !!(consumeSummary &&
      (typeof consumeSummary.total_spend === "number" ||
        consumeSummary.risk_message ||
        consumeSummary.recommendation ||
        (consumeSummary.main_categories &&
          consumeSummary.main_categories.length > 0)));

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
          {hasCategories ? (
            <SpendPieChart data={spendChart} />
          ) : (
            <Typography variant="body2" color="text.secondary">
              아직 등록된 소비 그래프 데이터가 없습니다.
            </Typography>
          )}
        </AnalysisBlock>

        {/* 2) 소비 그래프 데이터 (카테고리 요약) */}
        <AnalysisBlock title="소비 그래프 데이터">
          {hasCategories ? (
            <>
              {spendChart.by_category!.map((item, idx) => (
                <Typography
                  key={idx}
                  variant="body2"
                  sx={{ lineHeight: 1.8 }}
                >
                  • {item.category}:{" "}
                  {Number(item.amount).toLocaleString()} 원
                </Typography>
              ))}

              {typeof spendChart.total_spend === "number" && (
                <Typography
                  variant="body2"
                  sx={{ mt: 1.5, fontWeight: 600 }}
                >
                  총 지출:{" "}
                  {spendChart.total_spend.toLocaleString()} 원
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

              {consumeSummary && (
                <Box sx={{ mt: 0.5 }}>
                  {typeof consumeSummary.total_spend === "number" && (
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      • 월 총 지출:{" "}
                      {consumeSummary.total_spend.toLocaleString()} 원
                    </Typography>
                  )}
                  {consumeSummary.risk_message && (
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      • 위험 메시지: {consumeSummary.risk_message}
                    </Typography>
                  )}
                  {consumeSummary.recommendation && (
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      • 권장 사항: {consumeSummary.recommendation}
                    </Typography>
                  )}
                  {consumeSummary.main_categories &&
                    consumeSummary.main_categories.length > 0 && (
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        • 주요 카테고리:{" "}
                        {consumeSummary.main_categories.join(", ")}
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
                  • 수익률: {(report.profit_rate! * 100).toFixed(2)}%
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
        <AnalysisBlock title="전체 통합 보고서">
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
      if (!accessToken) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const res = await axios.get<ReportDto[]>(API_URL, {
          timeout: 15000,
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
        });
        setReports(res.data);
      } catch (err: any) {
        console.error("리포트 목록 조회 실패:", err?.response ?? err);
        setError("리포트 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
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
