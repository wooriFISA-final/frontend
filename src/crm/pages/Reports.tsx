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
import axios from "axios";

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

// FastAPI reports 엔드포인트
const API_URL = "http://127.0.0.1:8000/reports";

interface SpendByCategory {
  category: string;
  amount: number;
}

interface SpendChartJson {
  period: string;
  total_spend: number;
  by_category: SpendByCategory[];
}

// FastAPI의 ReportRead 스키마와 맞춘 타입
interface ReportDto {
  report_id: number;
  user_id: number;
  created_at: string;
  summarize: string | null;
  spend_chart_json: SpendChartJson | null;
  spend_analysis_text: string | null;
  policy_changes: string | null;
  summary_3lines: string | null;
  user_info_changes: string | null;
}

// ----------------------------------------------------
// 2. 리포트 카드 컴포넌트 (목록용)
// ----------------------------------------------------
interface ReportCardProps {
  report: ReportDto;
  onView: (report: ReportDto) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onView }) => {
  const createdDate = new Date(report.created_at);

  return (
    <Card
      elevation={1}
      sx={{
        p: 1.5,
        borderRadius: 2,
        transition: "box-shadow 0.3s, transform 0.2s",
        backgroundColor: "#FFFFFF !important",
        "&:hover": {
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
          transform: "translateY(-2px)",
          cursor: "pointer",
        },
      }}
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

          {report.summary_3lines && (
            <Typography
              variant="body2"
              color="text.primary"
              sx={{ mt: 0.5, lineHeight: 1.6 }}
            >
              {report.summary_3lines}
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
        border: "1px solid #eee",
        borderRadius: 1,
        backgroundColor: "#fff",
        minHeight: 80,
      }}
    >
      <Typography variant="h6" fontWeight={600} mb={1} sx={{ color: "#444" }}>
        {title}
      </Typography>
      {typeof content === "string" ? (
        <Typography
          variant="body1"
          sx={{ color: "black", lineHeight: 1.8, whiteSpace: "pre-wrap" }}
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
// 4. 소비 파이 차트 컴포넌트 (크게 조정)
// ----------------------------------------------------
const SpendPieChart: React.FC<{ data: SpendChartJson }> = ({ data }) => {
  const chartData = data.by_category.map((item) => ({
    name: item.category,
    value: item.amount,
  }));

  const COLORS = ["#0074E9", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <Box sx={{ width: "100%", height: 480 }}> {/* ⬅️ 높이 키움 */}
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={125} // ⬅️ 반지름 키워서 더 크게
            label
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
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
  const createdDate = new Date(report.created_at);
  const hasChart = !!report.spend_chart_json;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" }, // ⬅️ 전체 폭 넓게
        mx: "auto",
        px: { xs: 2, md: 3 },                    // 좌우 여백 살짝만
        py: { xs: 3, md: 4 },
        backgroundColor: "#FFFFFF !important",
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

      {/* 상단 제목/메타 */}
      <Typography variant="h5" mb={1} fontWeight={600} color="#222222">
        {createdDate.getFullYear()}년 {createdDate.getMonth() + 1}월 상세 통합 분석 보고서
      </Typography>
      <Typography variant="body2" mb={3} color="text.secondary">
        생성일: {createdDate.toLocaleString()} · 회원 ID: {report.user_id}
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
                      color: "gray",
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
          <AnalysisBlock title="소비 분석" content={report.spend_analysis_text} />
        </Box>
      </Box>

      {/* ================= 하단 영역 ================= */}
      <Stack spacing={3}>
        <AnalysisBlock
          title="사용자 정보 변화"
          content={report.user_info_changes}
        />
        <AnalysisBlock
          title="정책 및 환경 변동 사항"
          content={report.policy_changes}
        />
        <AnalysisBlock title="3줄 요약" content={report.summary_3lines} />
        <AnalysisBlock
          title="전체 통합 보고서 (summarize)"
          content={report.summarize}
        />
      </Stack>
    </Box>
  );
};

// ----------------------------------------------------
// 6. 메인 Reports 컴포넌트 (목록 화면)
// ----------------------------------------------------
export default function Reports() {
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
        const res = await axios.get<ReportDto[]>(API_URL, { timeout: 15000 });
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
        backgroundColor: "#FFFFFF !important",
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
          sx={{ color: "#222222", fontWeight: 600 }}
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
