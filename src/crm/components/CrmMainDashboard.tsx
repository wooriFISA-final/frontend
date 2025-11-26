// src/crm/components/CrmMainDashboard.tsx

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import Copyright from "../../dashboard/internals/components/Copyright";
import CrmStatCard from "./CrmStatCard";
import CrmRecentDealsTable from "./CrmRecentDealsTable";
import CrmUpcomingTasks from "./CrmUpcomingTasks";
import CrmSalesChart from "./CrmSalesChart";
import CrmLeadsBySourceChart from "./CrmLeadsBySourceChart";

// Sample data for stat cards
const statCardsData = [
  {
    title: "Total Customers",
    value: "2,543",
    interval: "Last 30 days",
    trend: "up",
    trendValue: "+15%",
    data: [
      200, 240, 260, 280, 300, 320, 340, 360, 380, 400, 420, 440, 460, 480, 500,
      520, 540, 560, 580, 600, 620, 640, 660, 680, 700, 720, 740, 760, 780, 800,
    ],
  },
  {
    title: "Deals Won",
    value: "$542K",
    interval: "Last 30 days",
    trend: "up",
    trendValue: "+23%",
    data: [
      400, 420, 440, 460, 480, 500, 520, 540, 560, 580, 600, 620, 640, 660, 680,
      700, 720, 740, 760, 780, 800, 820, 840, 860, 880, 900, 920, 940, 960, 980,
    ],
  },
  {
    title: "New Leads",
    value: "456",
    interval: "Last 30 days",
    trend: "up",
    trendValue: "+12%",
    data: [
      300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440,
      450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590,
    ],
  },
  {
    title: "Conversion Rate",
    value: "28%",
    interval: "Last 30 days",
    trend: "down",
    trendValue: "-5%",
    data: [
      35, 33, 32, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 22, 23, 24, 25, 26,
      27, 28, 29, 30, 29, 28, 27, 26, 25, 24, 23, 22,
    ],
  },
];

export default function CrmMainDashboard() {
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* Header with action buttons */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3, display: { xs: "none", sm: "flex" } }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{ color: "text.primary", fontWeight: 600 }} // 🔹 다크/라이트 공통으로 잘 보이게
        >
          Overview
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            sx={{
              backgroundColor: "#0074E9",
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
            New Lead
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddRoundedIcon />}
            sx={{
              borderColor: "#CDE3FA",
              color: "#0074E9",
              textTransform: "none",
              fontWeight: 500,
              borderRadius: 2,
              px: 2.5,
              py: 1,
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "#0074E9",
                backgroundColor: "#F5F7FA",
              },
            }}
          >
            New Deal
          </Button>
        </Box>
      </Stack>

      {/* Stats Cards row */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        {statCardsData.map((card, index) => (
          <CrmStatCard
            key={index}
            title={card.title}
            value={card.value}
            interval={card.interval}
            trend={card.trend as "up" | "down"}
            trendValue={card.trendValue}
            data={card.data}
          />
        ))}
      </Box>

      {/* Charts row */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            md: "repeat(12, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Box sx={{ gridColumn: { xs: "span 1", md: "span 8" } }}>
          <CrmSalesChart />
        </Box>
        <Box sx={{ gridColumn: { xs: "span 1", md: "span 4" } }}>
          <CrmLeadsBySourceChart />
        </Box>
      </Box>

      {/* Tables & Other content */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            lg: "repeat(12, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Box sx={{ gridColumn: { xs: "span 1", lg: "span 8" } }}>
          <CrmRecentDealsTable />
        </Box>
        <Box sx={{ gridColumn: { xs: "span 1", lg: "span 4" } }}>
          <Stack spacing={2}>
            <CrmUpcomingTasks />
          </Stack>
        </Box>
      </Box>

      <Copyright sx={{ mt: 3, mb: 4 }} />
    </Box>
  );
}
