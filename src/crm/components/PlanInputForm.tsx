// src/crm/components/PlanInputForm.tsx
import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { useTheme } from "@mui/material/styles";

interface PlanInputFormProps {
    onSubmit: (data: PlanFormData) => void;
}

export interface PlanFormData {
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
}

export default function PlanInputForm({ onSubmit }: PlanInputFormProps) {
    const theme = useTheme();

    const [formData, setFormData] = React.useState<PlanFormData>({
        initialAsset: "",
        location: "",
        targetPrice: "",
        housingType: "",
        monthlyAllocation: "",
        assetAllocation: {
            deposit: "",
            savings: "",
            fund: "",
        },
    });

    const handleChange = (field: keyof Omit<PlanFormData, 'assetAllocation'>) => (
        e: React.ChangeEvent<HTMLInputElement | { value: unknown }>
    ) => {
        setFormData({ ...formData, [field]: e.target.value as string });
    };

    const handleAllocationChange = (field: keyof PlanFormData['assetAllocation']) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData({
            ...formData,
            assetAllocation: {
                ...formData.assetAllocation,
                [field]: e.target.value,
            },
        });
    };

    const handleSubmit = () => {
        onSubmit(formData);
    };

    const isFormValid = () => {
        return (
            formData.initialAsset.trim() !== "" &&
            formData.location.trim() !== "" &&
            formData.targetPrice.trim() !== "" &&
            formData.housingType.trim() !== "" &&
            formData.monthlyAllocation.trim() !== "" &&
            formData.assetAllocation.deposit.trim() !== "" &&
            formData.assetAllocation.savings.trim() !== "" &&
            formData.assetAllocation.fund.trim() !== ""
        );
    };

    return (
        <Box
            sx={{
                maxWidth: 600,  // 폼 최대 너비 제한
                p: 3,
                borderRadius: 2,
                background: theme.palette.mode === "dark"
                    ? "rgba(51, 65, 85, 0.6)"
                    : "#F8FAFC",
                border: theme.palette.mode === "dark"
                    ? "1px solid rgba(148, 163, 184, 0.2)"
                    : "1px solid rgba(226, 232, 240, 0.8)",
            }}
        >
            <Typography variant="h6" sx={{ mb: 2.5, fontWeight: 600 }}>
                주택 마련 계획 정보 입력
            </Typography>

            <Stack spacing={2}>
                {/* 1. 초기 자산 */}
                <Box>
                    <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                        1. 현재 보유하신 초기 자산
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder='예: "3천만원", "3000만"'
                        value={formData.initialAsset}
                        onChange={handleChange("initialAsset")}
                        size="small"
                    />
                </Box>

                {/* 2. 주택 위치 */}
                <Box>
                    <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                        2. 희망하시는 주택 위치
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder='예: "서울 동작구", "부산 해운대구"'
                        value={formData.location}
                        onChange={handleChange("location")}
                        size="small"
                    />
                </Box>

                {/* 3. 희망 주택 가격 */}
                <Box>
                    <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                        3. 희망 주택 가격
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder='예: "7억", "5억 5천만"'
                        value={formData.targetPrice}
                        onChange={handleChange("targetPrice")}
                        size="small"
                    />
                </Box>

                {/* 4. 주택 유형 - Select */}
                <Box>
                    <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                        4. 주택 유형
                    </Typography>
                    <FormControl fullWidth size="small">
                        <InputLabel shrink={false}>
                            {formData.housingType === "" ? "유형 선택" : ""}
                        </InputLabel>
                        <Select
                            value={formData.housingType}
                            onChange={(e) => setFormData({ ...formData, housingType: e.target.value as string })}
                        >
                            <MenuItem value="아파트">아파트</MenuItem>
                            <MenuItem value="오피스텔">오피스텔</MenuItem>
                            <MenuItem value="연립다세대">연립다세대</MenuItem>
                            <MenuItem value="단독다가구">단독다가구</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {/* 5. 월 소득 비율 - 숫자 입력 */}
                <Box>
                    <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                        5. 월 소득 중 주택 자금에 사용할 비율 (%)
                    </Typography>
                    <TextField
                        fullWidth
                        type="number"
                        placeholder='예: 30'
                        value={formData.monthlyAllocation}
                        onChange={handleChange("monthlyAllocation")}
                        size="small"
                        inputProps={{ min: 0, max: 100 }}
                    />
                </Box>

                {/* 6. 자산 배분 비율 - 숫자 입력 */}
                <Box>
                    <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                        6. 자산 배분 비율 (예금 : 적금 : 펀드)
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        <TextField
                            fullWidth
                            type="number"
                            placeholder="예금"
                            value={formData.assetAllocation.deposit}
                            onChange={handleAllocationChange("deposit")}
                            size="small"
                            inputProps={{ min: 0, max: 100 }}
                        />
                        <TextField
                            fullWidth
                            type="number"
                            placeholder="적금"
                            value={formData.assetAllocation.savings}
                            onChange={handleAllocationChange("savings")}
                            size="small"
                            inputProps={{ min: 0, max: 100 }}
                        />
                        <TextField
                            fullWidth
                            type="number"
                            placeholder="펀드"
                            value={formData.assetAllocation.fund}
                            onChange={handleAllocationChange("fund")}
                            size="small"
                            inputProps={{ min: 0, max: 100 }}
                        />
                    </Stack>
                    <Typography variant="caption" sx={{ color: "text.secondary", mt: 0.5, display: "block" }}>
                        예: 30, 40, 30
                    </Typography>
                </Box>

                {/* 제출 버튼 */}
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!isFormValid()}
                    sx={{
                        mt: 2,
                        py: 1.5,
                        background: "linear-gradient(135deg, #20C4F4 0%, #0078B5 100%)",
                        color: "#FFFFFF",
                        fontWeight: 600,
                        fontSize: "1rem",
                        boxShadow: "0 2px 8px rgba(0, 120, 181, 0.25)",
                        border: "none",
                        "&:hover": {
                            background: "linear-gradient(135deg, #1AB0E0 0%, #005A8C 100%)",
                            boxShadow: "0 4px 12px rgba(0, 120, 181, 0.35)",
                        },
                        "&:focus, &:focus-visible": {
                            outline: "3px solid #20C4F4",
                            outlineOffset: "2px",
                        },
                        "&:disabled": {
                            background: "linear-gradient(135deg, rgba(32, 196, 244, 0.3) 0%, rgba(0, 120, 181, 0.3) 100%)",
                            color: "rgba(255, 255, 255, 0.5)",
                            boxShadow: "none",
                        },
                    }}
                >
                    정보 입력하기
                </Button>
            </Stack>
        </Box>
    );
}
