import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import Copyright from "../../dashboard/internals/components/Copyright";

export default function CrmMainDashboard() {
  const navigate = useNavigate();
  // 요청하신 블루 그라데이션 배경색
  const gradientBackground = "linear-gradient(135deg, #20C4F4 0%, #0078B5 100%)";

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{ color: "text.primary", fontWeight: 600 }}
        >
          Overview
        </Typography>
      </Stack>

      {/* 🏡 서비스 소개 섹션 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          mb: 4,
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          boxShadow: "0px 10px 40px rgba(0, 120, 181, 0.15)",
          background: gradientBackground,
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 배경 장식 (선택 사항) */}
        <Box
          sx={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
            zIndex: 0,
          }}
        />

        <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" gap={3} sx={{ zIndex: 1 }}>
          {/* 로고 이미지 */}
          <Box
            component="img"
            src="/logo.png"
            alt="WON-PI Logo"
            sx={{
              width: { xs: 80, sm: 100 },
              height: { xs: 80, sm: 100 },
              objectFit: "contain",
              filter: "drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.2))",
              bgcolor: "white",
              borderRadius: "50%",
              p: 1,
            }}
          />

          {/* 서비스명 및 슬로건 */}
          <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
            <Typography variant="h3" sx={{ fontWeight: 800, color: "white", mb: 0.5, letterSpacing: "-0.5px" }}>
              우리집으로 가자
            </Typography>
            <Typography variant="h6" sx={{ color: "#E0F7FA", fontWeight: 600, opacity: 0.9 }}>
              당신의 목표 달성을 위한 AI agent 파트너
            </Typography>
          </Box>
        </Stack>

        {/* 서비스 내용 */}
        <Box sx={{ zIndex: 1, mt: 1, mx: { xs: 2, md: 0 } }}>
          <Typography variant="body1" sx={{ color: "white", lineHeight: 1.8, fontSize: "1.05rem" }}>
            우리집으로 가자는 <strong>주택 마련 목표 달성</strong>을 위해 설계된 <strong>맞춤형 금융 솔루션</strong>입니다.
            고객님의 목표에 도달하기 위한 <strong>최적의 저축 및 투자 실행 플랜</strong>을 수립해 드립니다.
            특히, 매월 제공되는 <strong>정기 리포트</strong>를 통해 사용자의 <strong>소비 패턴과 투자 실황</strong>을 정밀하게 분석하고, <strong>최신 주택 및 금융 정책 변동사항</strong>을 함께 제공하여,
            고객님께서 목표를 달성할 때까지 <strong>중단 없이 실질적인 도움</strong>을 드립니다.
          </Typography>
        </Box>
      </Box>

      {/* 🚀 주요 기능 바로가기 버튼 (2열 그리드) */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
          mb: 4,
        }}
      >
        {/* 1. 계획 짜러 가기 */}
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
            transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0px 12px 30px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <CardActionArea
            onClick={() => navigate("/plan")}
            sx={{ height: "100%", p: 3 }}
          >
            <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  bgcolor: "rgba(32, 196, 244, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#0078B5",
                  mb: 1,
                }}
              >
                <EditNoteRoundedIcon sx={{ fontSize: 36 }} />
              </Box>
              <Box>
                <Typography variant="h5" component="div" sx={{ fontWeight: 700, mb: 1 }}>
                  계획 짜러 가기
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  AI 챗봇과 대화하며 나만의 주거 및 금융 계획을 세워보세요.<br />
                  목표 설정부터 실현 가능한 로드맵까지 함께합니다.
                </Typography>
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>

        {/* 2. 레포트 보러 가기 */}
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
            transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0px 12px 30px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <CardActionArea
            onClick={() => navigate("/reports")}
            sx={{ height: "100%", p: 3 }}
          >
            <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  bgcolor: "rgba(32, 196, 244, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#0078B5",
                  mb: 1,
                }}
              >
                <AssessmentRoundedIcon sx={{ fontSize: 36 }} />
              </Box>
              <Box>
                <Typography variant="h5" component="div" sx={{ fontWeight: 700, mb: 1 }}>
                  레포트 보러 가기
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  분석된 데이터를 바탕으로 생성된 상세 리포트를 확인하세요.<br />
                  소비 패턴, 투자 수익률, 정책 변동 사항을 한눈에 볼 수 있습니다.
                </Typography>
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>
      </Box>

      <Copyright sx={{ mt: 3, mb: 4 }} />
    </Box>
  );
}