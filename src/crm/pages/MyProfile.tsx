// src/crm/pages/MyProfile.tsx
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { useAuth } from "../../auth/AuthContext";

interface Profile {
  user_name: string;
  nickname?: string;
  email?: string;
  assets?: number;
  created_at?: string;
}

export default function MyProfile() {
  const { accessToken } = useAuth();
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("http://localhost:8000/members/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          throw new Error("사용자 정보를 불러오지 못했습니다.");
        }

        const data = await res.json();
        setProfile(data);
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

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        My Profile
      </Typography>

      <Card sx={{ maxWidth: 600 }}>
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="h6">{profile.user_name}</Typography>
            {profile.nickname && (
              <Typography color="text.secondary">
                닉네임: {profile.nickname}
              </Typography>
            )}
            {profile.email && (
              <Typography color="text.secondary">
                이메일: {profile.email}
              </Typography>
            )}
            {profile.assets !== undefined && (
              <Typography color="text.secondary">
                보유 자산: {profile.assets.toLocaleString()}원
              </Typography>
            )}
            {profile.created_at && (
              <Typography color="text.secondary">
                가입일: {new Date(profile.created_at).toLocaleDateString()}
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
