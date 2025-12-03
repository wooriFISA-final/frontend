// src/crm/pages/Profile.tsx
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

interface ProfileData {
  user_name: string;   // 화면에서 사용할 최종 이름
  email: string;
  nickname?: string;
  bio?: string;
}

export default function Profile() {
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = React.useState<ProfileData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchProfile = async () => {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${BACKEND_URL}/members/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          throw new Error("프로필 정보를 불러오지 못했습니다.");
        }

        const data = await res.json();
        console.log("members/me data 👉", data); // 한 번 찍어봐도 좋음

        // 🔹 백엔드가 어떤 키로 이름을 주든 최대한 다 받아서 사용
        const nameFromBackend =
          data.user_name ??
          data.username ??
          data.name ??
          (data.full_name ?? null) ??
          (data.email ? data.email.split("@")[0] : "");

        const merged: ProfileData = {
          user_name: nameFromBackend || "",     // 최종 이름
          email: data.email,
          nickname: data.nickname,
          bio: data.bio ?? "2030 내 집 마련 준비 중입니다.",
        };

        setProfile(merged);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchProfile();
    }
  }, [accessToken]);

  const handleEditClick = () => {
    navigate("/settings");
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !profile) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error ?? "프로필 정보가 없습니다."}</Alert>
      </Box>
    );
  }

  const displayName = profile.user_name || "이름 미등록";

  return (
    <Box sx={{ width: "100%", px: 4, pt: 2 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        My Profile
      </Typography>

      <Stack spacing={2}>
        {/* 1️⃣ 기본 정보 카드 */}
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: "0px 4px 16px rgba(15, 23, 42, 0.08)",
          }}
        >
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              {/* 아바타: 이름 끝 두 글자 */}
              <Avatar
                src="/cocoa_cookie.png"  // 코코아맛 쿠키 이미지
                alt={displayName}
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: "#FFFFFF",  // 배경을 흰색으로
                }}
              />

              {/* 이름 + 이메일 */}
              <Box sx={{ flexGrow: 1 }}>
                <Stack spacing={0.25}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {displayName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {profile.email}
                  </Typography>
                </Stack>
              </Box>

              {/* 편집 아이콘 */}
              <IconButton
                aria-label="프로필 편집"
                onClick={handleEditClick}
                sx={{ alignSelf: "flex-start" }}
              >
                <EditOutlinedIcon />
              </IconButton>
            </Stack>
          </CardContent>
        </Card>

        {/* 2️⃣ 한 줄 소개 카드 */}
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: "0px 4px 16px rgba(15, 23, 42, 0.04)",
          }}
        >
          <CardContent>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, color: "text.secondary" }}
            >
              한 줄 소개
            </Typography>
            <Typography variant="body2" color="text.primary">
              {profile.bio ?? "자기소개를 등록해 보세요."}
            </Typography>
          </CardContent>
        </Card>

        {/* 3️⃣ 계정 관리 카드 */}
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: "0px 4px 16px rgba(15, 23, 42, 0.04)",
          }}
        >
          <CardContent>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  계정 관리
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  프로필 정보와 비밀번호 등 계정 설정을 변경합니다.
                </Typography>
              </Box>
              <Button
                endIcon={<ArrowForwardIosRoundedIcon sx={{ fontSize: 14 }} />}
                onClick={() => navigate("/settings")}
                size="small"
              >
                설정 열기
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
