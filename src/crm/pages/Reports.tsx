// src/crm/pages/Reports.tsx
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Chip from "@mui/material/Chip";
import axios from "axios";
import { useAuth } from "../../auth/AuthContext";

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

// ⚠️ FastAPI /reports 엔드포인트 주소에 맞게 수정해서 사용하세요.
const API_URL = "http://localhost:8000/reports/";

// (선택) 예전처럼 차트용 JSON을 별도 컬럼으로 가지고 있는 경우
interface SpendByCategory {
  category: string;
  amount: number;
}

interface SpendChartJson {
  period: string;
  total_spend: number;
  by_category: SpendByCategory[];
}

// 새 JSON 구조에 맞는 타입들
interface ConsumeAnalysisSummary {
  total_spend: number;
  risk_message: string;
  recommendation: string;
  main_categories: string[];
}

interface PolicyChange {
  change_summary: string;
  effective_date: string;
}

// FastAPI의 ReportRead 스키마와 맞춘 타입 (신규 키 기준)
interface ReportDto {
  report_id: number;
  user_id: number;
  create_at: string;

  // 1) 소비 관련
  consume_report: string | null;
  cluster_nickname: string | null;
  consume_analysis_summary: ConsumeAnalysisSummary | null;

  // 2) 프로필(소득/부채) 변화
  change_analysis_report: string | null;
  change_raw_changes: string[] | null;

  // 3) 투자 수익 분석
  profit_analysis_report: string | null;
  net_profit: number | null;
  profit_rate: number | null;

  // 4) 정책/환경 변화
  policy_analysis_report: string | null;
  policy_changes: PolicyChange[] | null;

  // 5) 요약
  threelines_summary: string | null;

  // (선택) 기존에 설계했던 전체 요약 컬럼이 있다면
  summarize?: string | null;

  // (선택) 소비 차트용 JSON 컬럼이 있다면
  spend_chart_json?: SpendChartJson | null;
}

// ----------------------------------------------------
// 2. 리포트 카드 컴포넌트 (목록용)
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
            color="#0074E9" // 브랜드 컬러는 그대로 사용
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
// 3. 공통 블록 컴포넌트
// ----------------------------------------------------
const AnalysisBlock: React.FC<{
  title: string;
  content: string | React.ReactNode | null;
}> = ({ title, content }) => {
  if (!content) return null;

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
      {typeof content === "string" ? (
        <Typography
          variant="body1"
          sx={{
            color: "text.primary",
            lineHeight: 1.8,
            whiteSpace: "pre-wrap",
          }}
        >
          {content}
        </Typography>
      ) : (
        content
      )}
    </Box>
  );
};

// ----------------------------------------------------
// 4. 소비 파이 차트 컴포넌트 (있으면 사용, 없으면 자동으로 숨김)
// ----------------------------------------------------
const SpendPieChart: React.FC<{ data: SpendChartJson }> = ({ data }) => {
  const chartData = data.by_category.map((item) => ({
    name: item.category,
    value: item.amount,
  }));

  const COLORS = ["#0074E9", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <Box sx={{ width: "100%", height: 480 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={125}
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any) =>
              `${Number(value).toLocaleString()} 원`
            }
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

// ----------------------------------------------------
// 5. 리포트 상세 뷰
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
  const hasChart = !!report.spend_chart_json;

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
          {createdDate.getFullYear()}년 {createdDate.getMonth() + 1}월 상세 통합 분석 보고서
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
        {/* user_id는 화면에 노출하지 않음 */}
      </Typography>

      {/* ================= 상단 영역 ================= */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: hasChart ? "3fr 3fr 6fr" : "1fr",
            lg: hasChart ? "4fr 4fr 7fr" : "1fr",
          },
          gridAutoRows: "minmax(0, auto)",
          columnGap: 3,
          rowGap: 3,
          mb: 4,
          alignItems: "stretch",
        }}
      >
        {hasChart && report.spend_chart_json && (
          <>
            {/* 파이 차트 */}
            <Box sx={{ gridColumn: { xs: "1", md: "1" }, gridRow: "1" }}>
              <AnalysisBlock
                title="소비 그래프 (파이 차트)"
                content={<SpendPieChart data={report.spend_chart_json} />}
              />
            </Box>

            {/* JSON 데이터 */}
            <Box sx={{ gridColumn: { xs: "1", md: "2" }, gridRow: "1" }}>
              <AnalysisBlock
                title="소비 그래프 데이터 (JSON)"
                content={
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      whiteSpace: "pre-wrap",
                      fontFamily: "monospace",
                    }}
                  >
                    {JSON.stringify(report.spend_chart_json, null, 2)}
                  </Typography>
                }
              />
            </Box>
          </>
        )}

        {/* 소비 분석: 오른쪽에서 파이+JSON 합친 높이만큼 차지 */}
        <Box
          sx={{
            gridColumn: {
              xs: "1",
              md: hasChart ? "3" : "1",
            },
            gridRow: hasChart ? "1 / span 2" : "1",
            height: "100%",
          }}
        >
          <AnalysisBlock
            title="소비 분석 요약"
            content={
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

                {report.consume_analysis_summary && (
                  <Box sx={{ mt: 1.5 }}>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      • 월 총 지출:{" "}
                      {report.consume_analysis_summary.total_spend.toLocaleString()}{" "}
                      원
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      • 위험 메시지:{" "}
                      {report.consume_analysis_summary.risk_message}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      • 권장 사항:{" "}
                      {report.consume_analysis_summary.recommendation}
                    </Typography>
                    {report.consume_analysis_summary.main_categories &&
                      report.consume_analysis_summary.main_categories.length >
                        0 && (
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          • 주요 카테고리:{" "}
                          {report.consume_analysis_summary.main_categories.join(
                            ", "
                          )}
                        </Typography>
                      )}
                  </Box>
                )}
              </>
            }
          />
        </Box>
      </Box>

      {/* ================= 하단 영역 ================= */}
      <Stack spacing={3}>
        {/* 소득/부채 변화 */}
        <AnalysisBlock
          title="사용자 정보 변화 (소득·부채)"
          content={
            report.change_analysis_report || report.change_raw_changes ? (
              <>
                {report.change_analysis_report && (
                  <Typography
                    variant="body1"
                    sx={{ mb: 1.5, whiteSpace: "pre-wrap" }}
                  >
                    {report.change_analysis_report}
                  </Typography>
                )}
                {report.change_raw_changes &&
                  report.change_raw_changes.length > 0 && (
                    <Box component="ul" sx={{ pl: 2, m: 0 }}>
                      {report.change_raw_changes.map((item, idx) => (
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
              </>
            ) : null
          }
        />

        {/* 투자 수익 분석 */}
        <AnalysisBlock
          title="투자 수익 분석"
          content={
            report.profit_analysis_report ||
            report.net_profit != null ||
            report.profit_rate != null ? (
              <>
                {report.profit_analysis_report && (
                  <Typography
                    variant="body1"
                    sx={{ mb: 1.5, whiteSpace: "pre-wrap" }}
                  >
                    {report.profit_analysis_report}
                  </Typography>
                )}
                <Stack direction="row" spacing={4}>
                  {report.net_profit != null && (
                    <Typography variant="body2">
                      • 순이익: {report.net_profit.toLocaleString()} 원
                    </Typography>
                  )}
                  {report.profit_rate != null && (
                    <Typography variant="body2">
                      • 수익률: {(report.profit_rate * 100).toFixed(2)}%
                    </Typography>
                  )}
                </Stack>
              </>
            ) : null
          }
        />

        {/* 정책 및 환경 변동 사항 */}
        <AnalysisBlock
          title="정책 및 환경 변동 사항"
          content={
            report.policy_analysis_report || report.policy_changes ? (
              <>
                {report.policy_analysis_report && (
                  <Typography
                    variant="body1"
                    sx={{ mb: 1.5, whiteSpace: "pre-wrap" }}
                  >
                    {report.policy_analysis_report}
                  </Typography>
                )}
                {report.policy_changes && report.policy_changes.length > 0 && (
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    {report.policy_changes.map((pc, idx) => (
                      <Typography
                        key={idx}
                        component="li"
                        variant="body2"
                        sx={{ lineHeight: 1.8 }}
                      >
                        [{pc.effective_date}] {pc.change_summary}
                      </Typography>
                    ))}
                  </Box>
                )}
              </>
            ) : null
          }
        />

        {/* 3줄 요약 */}
        <AnalysisBlock
          title="3줄 요약"
          content={report.threelines_summary}
        />

        {/* 전체 통합 보고서 (summarize 컬럼이 있을 경우만) */}
        <AnalysisBlock
          title="전체 통합 보고서 (summarize)"
          content={report.summarize ?? null}
        />
      </Stack>
    </Box>
  );
};

// ----------------------------------------------------
// 6. 메인 Reports 컴포넌트 (목록 화면)
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
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get<ReportDto[]>(API_URL, {
          timeout: 15000,
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        });
        setReports(res.data);
      } catch (err: any) {
        console.error(err);
        setError("리포트 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleViewReport = (report: ReportDto) => {
    setSelectedReport(report);
  };

  const handleBack = () => {
    setSelectedReport(null);
  };

  // 상세 보기 모드
  if (selectedReport) {
    return <ReportDetailView report={selectedReport} onBack={handleBack} />;
  }

  // 목록 보기 모드
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
          <Typography>리포트 목록을 불러오는 중입니다...</Typography>
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
