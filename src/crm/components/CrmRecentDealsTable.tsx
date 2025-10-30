import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import Button from "@mui/material/Button";

// Sample data for recent deals
const recentDeals = [
  {
    id: 1,
    name: "Enterprise Software Package",
    customer: { name: "Acme Corp", avatar: "A" },
    value: 125000,
    stage: "Proposal",
    probability: 75,
    closingDate: "2023-09-30",
  },
  {
    id: 2,
    name: "Cloud Migration Service",
    customer: { name: "TechSolutions Inc", avatar: "T" },
    value: 87500,
    stage: "Negotiation",
    probability: 90,
    closingDate: "2023-10-15",
  },
  {
    id: 3,
    name: "Website Redesign Project",
    customer: { name: "Global Media", avatar: "G" },
    value: 45000,
    stage: "Discovery",
    probability: 60,
    closingDate: "2023-11-05",
  },
  {
    id: 4,
    name: "CRM Implementation",
    customer: { name: "RetailGiant", avatar: "R" },
    value: 95000,
    stage: "Closed Won",
    probability: 100,
    closingDate: "2023-09-15",
  },
  {
    id: 5,
    name: "IT Infrastructure Upgrade",
    customer: { name: "HealthCare Pro", avatar: "H" },
    value: 135000,
    stage: "Negotiation",
    probability: 85,
    closingDate: "2023-10-22",
  },
];

// Function to get color based on deal stage
const getStageColor = (stage: string): { bg: string; color: string } => {
  switch (stage) {
    case "Discovery":
      return { bg: "#E6F0FF", color: "#0074E9" };
    case "Proposal":
      return { bg: "#CDE3FA", color: "#0074E9" };
    case "Negotiation":
      return { bg: "#FEF3E2", color: "#D97706" };
    case "Closed Won":
      return { bg: "#ECFDF5", color: "#059669" };
    default:
      return { bg: "#F3F4F6", color: "#6B7280" };
  }
};

// Format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

// Format date
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

export default function CrmRecentDealsTable() {
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
      <CardContent sx={{ pb: 0 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Typography variant="h6" component="h3" sx={{ color: "#222222", fontWeight: 600 }}>
            Recent Deals
          </Typography>
          <Button
            endIcon={<ArrowForwardRoundedIcon />}
            size="small"
            sx={{
              color: "#0074E9",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgba(0, 116, 233, 0.08)",
              },
            }}
          >
            View All
          </Button>
        </Stack>
      </CardContent>
      <TableContainer sx={{ flexGrow: 1 }}>
        <Table size="small" aria-label="recent deals table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#F9FAFB", borderColor: "#F0F2F5" }}>
              <TableCell sx={{ color: "#666666", fontWeight: 600 }}>Deal Name</TableCell>
              <TableCell sx={{ color: "#666666", fontWeight: 600 }}>Customer</TableCell>
              <TableCell align="right" sx={{ color: "#666666", fontWeight: 600 }}>Value</TableCell>
              <TableCell sx={{ color: "#666666", fontWeight: 600 }}>Stage</TableCell>
              <TableCell align="right" sx={{ color: "#666666", fontWeight: 600 }}>Probability</TableCell>
              <TableCell sx={{ color: "#666666", fontWeight: 600 }}>Closing Date</TableCell>
              <TableCell align="right" sx={{ color: "#666666", fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentDeals.map((deal) => {
              const stageColor = getStageColor(deal.stage);
              return (
                <TableRow key={deal.id} hover sx={{ borderColor: "#F0F2F5" }}>
                  <TableCell sx={{ fontWeight: 500, color: "#222222" }}>{deal.name}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar
                        sx={{ width: 28, height: 28, fontSize: "0.875rem", bgcolor: "#0074E9", color: "#FFFFFF" }}
                      >
                        {deal.customer.avatar}
                      </Avatar>
                      <Typography variant="body2" sx={{ color: "#222222" }}>
                        {deal.customer.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#222222", fontWeight: 500 }}>
                    {formatCurrency(deal.value)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={deal.stage}
                      size="small"
                      sx={{
                        backgroundColor: stageColor.bg,
                        color: stageColor.color,
                        border: "none",
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#222222" }}>{deal.probability}%</TableCell>
                  <TableCell sx={{ color: "#666666" }}>{formatDate(deal.closingDate)}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" aria-label="more options" sx={{ color: "#999999" }}>
                      <MoreVertRoundedIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
