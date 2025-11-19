import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { PieChart } from "@mui/x-charts/PieChart";

// Sample lead source data - updated to match blue color scheme
const leadSources = [
  { id: 0, value: 35, label: "Website", color: "#0074E9" },
  { id: 1, value: 25, label: "Referrals", color: "#3399FF" },
  { id: 2, value: 20, label: "Social Media", color: "#66B3FF" },
  { id: 3, value: 15, label: "Email Campaigns", color: "#CDE3FA" },
  { id: 4, value: 5, label: "Other", color: "#E6F0FF" },
];

export default function CrmLeadsBySourceChart() {
  const theme = useTheme();

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#FFFFFF",
        borderColor: "#F0F2F5",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        border: "none",
      }}
    >
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Typography variant="h6" component="h3" sx={{ mb: 2, color: "#222222", fontWeight: 600 }}>
          Leads by Source
        </Typography>

        <Box
          sx={{
            flexGrow: 1,
            width: "100%",
            height: "300px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PieChart
            series={[
              {
                data: leadSources,
                arcLabel: (item) => `${item.value}%`,
                arcLabelMinAngle: 20,
                innerRadius: 60,
                paddingAngle: 2,
                cornerRadius: 4,
                valueFormatter: (value) => `${value}%`,
              },
            ]}
            height={280}
            slotProps={{
              legend: {
                position: { vertical: "middle", horizontal: "right" },
                direction: "column",
              },
            }}
            margin={{ right: 120 }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
