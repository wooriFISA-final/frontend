import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import Card from "@mui/material/Card"; 
import CardContent from "@mui/material/CardContent"; 
import IconButton from "@mui/material/IconButton"; 
import VisibilityIcon from "@mui/icons-material/Visibility"; 
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; 
import axios from 'axios'; 

// ----------------------------------------------------
// 🚨 1. API 설정 및 인터페이스 정의
// ----------------------------------------------------
const API_URL = 'http://127.0.0.1:8001/api/v1/generate-report'; 

// 💡 1. AgentResult 상세 구조 정의 (main_orchestrator의 final_json_data 구조)
interface ConsumptionResult {
    pie_chart_data: any;
    category_analysis: string;
    nickname_and_cluster: string;
    fixed_variable_detail: string;
}

interface ProfitResult {
    time_series_data: any;
    month_over_month_analysis: string;
    insights_advice: string;
    total_net_profit_loss: number;
}

interface CompareResult {
    policy_change_analysis: string;
    user_index_change: string;
    real_estate_trend: string;
}

interface ReportDataPayload {
    consume: ConsumptionResult;
    profit: ProfitResult;
    compare: CompareResult;
    metadata: { member_id: number; generated_at: string; };
    full_report_string?: string; // 전체 텍스트도 포함 가능
}

// 💡 2. FastAPI 최종 응답 인터페이스
interface AgentResponse {
  status: 'success' | 'error';
  report_data?: ReportDataPayload; // ⬅️ 구조화된 JSON 객체를 받습니다.
  summary?: string; 
  detail?: string; 
}


// ----------------------------------------------------
// 🚨 2. 가상의 리포트 데이터 정의
// ----------------------------------------------------
const reportDates = [
  { id: 1, month: "2025년 3월", date: "2025-03-31", status: "Completed" },
  { id: 2, month: "2025년 2월", date: "2025-02-28", status: "Completed" },
  { id: 3, month: "2025년 1월", date: "2025-01-31", status: "Completed" }, // API 호출 대상
];

// ----------------------------------------------------
// 🚨 3. 리포트 카드 컴포넌트 (유지)
// ----------------------------------------------------
interface ReportCardProps {
  report: typeof reportDates[0];
  onView: (id: number) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onView }) => {
  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card
        elevation={1} 
        sx={{
          p: 1.5,
          borderRadius: 2,
          transition: "box-shadow 0.3s",
          backgroundColor: '#FFFFFF !important', 
          "&:hover": {
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
            cursor: "pointer",
          },
        }}
        onClick={() => onView(report.id)} 
      >
        <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
          <Stack direction="column" spacing={1.5}>
            <Typography variant="subtitle1" fontWeight={700} color="#0074E9">
              {report.month} 통합 리포트
            </Typography>
            <Typography variant="body2" color="text.secondary">
              생성일: {report.date}
            </Typography>
            
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 1 }}>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
};


// ----------------------------------------------------
// 🚨 4. 리포트 상세 뷰 컴포넌트 (API 호출 및 구조화된 데이터 처리)
// ----------------------------------------------------
interface ReportDetailViewProps {
    report: typeof reportDates[0];
    onBack: () => void;
}

const ReportDetailView: React.FC<ReportDetailViewProps> = ({ report, onBack }) => {
    // 🚨 [수정] reportText 대신 구조화된 데이터를 담을 상태 추가
    const [reportData, setReportData] = React.useState<ReportDataPayload | null>(null);
    const [loading, setLoading] = React.useState(true); 
    const [error, setError] = React.useState<string | null>(null);

    // 💡 더미 데이터 로직 (API 호출 없는 2월/3월 리포트용)
    const getDummyReport = (month: string): ReportDataPayload => ({
        consume: { 
            pie_chart_data: [], 
            category_analysis: `(더미) ${month}의 식비 지출이 크게 증가했습니다.`, 
            nickname_and_cluster: `핵심 소비 세대 (더미)`,
            fixed_variable_detail: `고정비 비중 30%, 변동비 비중 70%로 분석됨.`,
        },
        profit: { 
            time_series_data: [], 
            month_over_month_analysis: "전월 대비 주요 변동 없음.", 
            insights_advice: "안정적인 저축 전략 유지 권고.",
            total_net_profit_loss: 500000,
        },
        compare: {
            policy_change_analysis: "정책 변동 사항 없음 (더미).",
            user_index_change: "DSR/LTV 변동 없음.",
            real_estate_trend: "서울 송파구 주택 가격 안정세 (더미).",
        },
        metadata: { member_id: 1004, generated_at: new Date().toISOString() }
    });


    // 💡 [핵심] API 호출 및 데이터 가져오기 로직
    React.useEffect(() => {
        // ID 1, 2인 경우 (더미 리포트)
        if (report.id !== 3) {
            setReportData(getDummyReport(report.month));
            setLoading(false);
            return;
        }

        // ID 3인 경우 (API 호출)
        const fetchReport = async () => {
            setLoading(true);
            setError(null);
            try {
                // 🚨 FastAPI에 POST 요청
                const response = await axios.post<AgentResponse>(
                    API_URL, 
                    { member_id: 1004, user_id: 500 }, 
                    { timeout: 800000 } 
                );
                
                // 🚨 [핵심 수정] report_data 필드에 구조화된 JSON이 있는지 확인
                if (response.data.status === 'success' && response.data.report_data) {
                    // JSON 객체 전체를 상태에 저장
                    setReportData(response.data.report_data); 
                } else {
                    const errMsg = response.data.detail || 'FastAPI에서 유효한 리포트 필드를 받지 못했습니다.';
                    setError(errMsg);
                }
            } catch (err: any) {
                const msg = err.code === 'ECONNABORTED' ? '요청 시간 초과' : '서버 통신 실패';
                setError(`🚨 ${msg}`);
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [report.id]); 

    // 💡 개별 분석 블록 컴포넌트 정의 (UI 가독성 향상)
    const AnalysisBlock: React.FC<{ title: string, content: string | number | React.ReactNode }> = ({ title, content }) => (
        <Box sx={{ 
            p: 3, 
            border: '1px solid #eee', 
            borderRadius: 1, 
            backgroundColor: '#fff',
            minHeight: 100, 
        }}>
            <Typography variant="h6" fontWeight={600} mb={1} sx={{ color: '#444' }}>
                {title}
            </Typography>
            {typeof content === 'string' || typeof content === 'number' ? (
                <Typography variant="body1" sx={{ color: 'black', lineHeight: 1.8 }}>
                    {content}
                </Typography>
            ) : (
                content
            )}
        </Box>
    );

    // ----------------------------------------------------
    // 🚨 렌더링 시작
    // ----------------------------------------------------

    return (
        <Box sx={{ p: 4, backgroundColor: '#FFFFFF !important' }}>
            {/* 뒤로가기 버튼 */}
            <Button 
                onClick={onBack} 
                startIcon={<ArrowBackIcon />}
                sx={{ mb: 3, textTransform: 'none', fontWeight: 600, backgroundColor: '#0074E9', color: 'white', '&:hover': { backgroundColor: '#3399FF' } }}
            >
                리포트 목록으로 돌아가기
            </Button>
            
            <Typography variant="h5" mb={3} fontWeight={600} color="#222222">
                {report.month} 상세 통합 분석 보고서
            </Typography>
            
            {/* 로딩/오류 메시지 */}
            {(loading || error) && (
                <Box sx={{ p: 3, border: '1px solid #ddd', borderRadius: 2, backgroundColor: '#f9f9f9' }}>
                    {loading && <Typography sx={{ color: 'black' }}>분석 에이전트 실행 중... (LLM 분석 대기 중)</Typography>}
                    {error && <Typography color="error">🚨 {error}</Typography>}
                </Box>
            )}

            {/* 🚨 [핵심] 리포트 내용 표시 (구조화된 데이터 사용) */}
            {!loading && !error && reportData && (
                <Grid container spacing={3}>
                    
                    {/* 1. 상단 요약 (순수익/별명) */}
                    <Grid item xs={12}>
                        <Stack direction="row" spacing={3} sx={{ p: 2, backgroundColor: '#E3F2FD', borderRadius: 2 }}>
                            <Typography variant="subtitle1" fontWeight={700} sx={{ color: 'black' }}>
                                순수익/손실: {reportData.profit.total_net_profit_loss.toLocaleString()} 원
                            </Typography>
                            <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#0074E9' }}>
                                군집 유형: {reportData.consume.nickname_and_cluster}
                            </Typography>
                        </Stack>
                    </Grid>

                    {/* 2. 소비 분석 및 투자 분석 */}
                    <Grid item xs={12} md={6}>
                        <AnalysisBlock title="소비 분석 (군집 및 상세 내역)" content={
                            <Stack spacing={1.5}>
                                <Typography variant="body1" fontWeight={600} sx={{ color: '#0074E9' }}>{reportData.consume.nickname_and_cluster}</Typography>
                                <Typography variant="body2">{reportData.consume.category_analysis}</Typography>
                                <Typography variant="caption" sx={{ mt: 1 }}>{reportData.consume.fixed_variable_detail}</Typography>
                            </Stack>
                        } />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <AnalysisBlock title="투자 분석 (인사이트 및 방향성)" content={
                            <Typography variant="body2">{reportData.profit.insights_advice}</Typography>
                        } />
                    </Grid>

                    {/* 3. 환경 변화 분석 */}
                    <Grid item xs={12}>
                        <AnalysisBlock title="정책 및 환경 변동 사항" content={
                            <Stack spacing={1}>
                                <Typography variant="body2">
                                    **정책 변동:** {reportData.compare.policy_change_analysis}
                                </Typography>
                                <Typography variant="body2">
                                    **개인 지수 변동:** {reportData.compare.user_index_change}
                                </Typography>
                                <Typography variant="body2">
                                    **부동산 트렌드:** {reportData.compare.real_estate_trend}
                                </Typography>
                            </Stack>
                        } />
                    </Grid>
                    
                    {/* 4. 전체 보고서 String (디버깅 또는 전체 텍스트용) */}
                    <Grid item xs={12}>
                        <AnalysisBlock 
                            title="전체 통합 보고서 텍스트 (Raw Data)" 
                            content={
                                <Typography variant="body2" sx={{ color: 'gray', whiteSpace: 'pre-wrap' }}>
                                    {reportData.full_report_string || '전체 원본 텍스트 필드 누락'}
                                </Typography>
                            }
                        />
                    </Grid>

                </Grid>
            )}
        </Box>
    );
};


// ----------------------------------------------------
// 5. 메인 Reports 컴포넌트 및 ReportCard (유지)
// ----------------------------------------------------
export default function Reports() {
  // ... (Reports 컴포넌트 JSX 및 로직 유지) ...
  const [selectedReportId, setSelectedReportId] = React.useState<number | null>(null);

  const handleViewReport = (id: number) => {
    setSelectedReportId(id);
  };

  const report = reportDates.find(r => r.id === selectedReportId);

  if (selectedReportId !== null && report) {
      return <ReportDetailView report={report} onBack={() => setSelectedReportId(null)} />;
  }


  return (
    <Box 
      sx={{ 
        width: "100%", 
        maxWidth: { sm: "100%", md: "1700px" },
        backgroundColor: '#FFFFFF !important'
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4, p: 2 }}>
        <Typography variant="h4" component="h1" sx={{ color: "#222222", fontWeight: 600 }}>
          Reports Overview
        </Typography>
        <Button
          startIcon={<DownloadRoundedIcon />}
          sx={{
            backgroundColor: "#0074E9",
            color: 'white',
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

      <Grid container spacing={4} sx={{ mb: 4, p: 2 }}>
        {reportDates.map((report) => (
          <ReportCard key={report.id} report={report} onView={handleViewReport} />
        ))}
      </Grid>
    </Box>
  );
}
