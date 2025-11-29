// src/crm/components/PlanInputSummary.tsx
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import { useTheme } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface PlanInputSummaryProps {
    data: {
        initialAsset: string;
        location: string;
        targetPrice: string;
        housingType: string;
        monthlyAllocation: string;
        assetAllocation: {
            deposit: string;
            savings: string;
            fund: string;
        };
    };
}

export default function PlanInputSummary({ data }: PlanInputSummaryProps) {
    const theme = useTheme();

    return (
        <Box
            sx={{
                maxWidth: 450,
                p: 2,
                borderRadius: 2,
                background: theme.palette.mode === "dark"
                    ? "rgba(32, 196, 244, 0.08)"
                    : "rgba(32, 196, 244, 0.06)",
                border: theme.palette.mode === "dark"
                    ? "1px solid rgba(32, 196, 244, 0.2)"
                    : "1px solid rgba(32, 196, 244, 0.15)",
            }}
        >
            <Stack spacing={1.5}>
                {/* 헤더 */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                    <CheckCircleIcon sx={{ color: "#0078B5", fontSize: "1.2rem" }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#0078B5" }}>
                        입력 완료
                    </Typography>
                </Box>

                {/* 요약 정보 */}
                <Stack spacing={0.75} sx={{ fontSize: "0.85rem" }}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Typography variant="caption" sx={{ color: "text.secondary", minWidth: 90 }}>
                            초기 자산
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 500 }}>
                            {data.initialAsset}
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Typography variant="caption" sx={{ color: "text.secondary", minWidth: 90 }}>
                            주택 위치
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 500 }}>
                            {data.location}
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Typography variant="caption" sx={{ color: "text.secondary", minWidth: 90 }}>
                            희망 가격
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 500 }}>
                            {data.targetPrice}
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Typography variant="caption" sx={{ color: "text.secondary", minWidth: 90 }}>
                            주택 유형
                        </Typography>
                        <Chip
                            label={data.housingType}
                            size="small"
                            sx={{
                                height: 20,
                                fontSize: "0.7rem",
                                bgcolor: theme.palette.mode === "dark" ? "rgba(32, 196, 244, 0.15)" : "rgba(32, 196, 244, 0.1)",
                                color: "#0078B5",
                            }}
                        />
                    </Box>

                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Typography variant="caption" sx={{ color: "text.secondary", minWidth: 90 }}>
                            월 배분 비율
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 500 }}>
                            {data.monthlyAllocation}%
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Typography variant="caption" sx={{ color: "text.secondary", minWidth: 90 }}>
                            자산 배분
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 500 }}>
                            예금 {data.assetAllocation.deposit} : 적금 {data.assetAllocation.savings} : 펀드 {data.assetAllocation.fund}
                        </Typography>
                    </Box>
                </Stack>
            </Stack>
        </Box>
    );
}
