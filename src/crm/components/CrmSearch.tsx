import * as React from "react";
import InputBase from "@mui/material/InputBase";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { alpha, styled } from "@mui/material/styles";

const SearchWrapper = styled("div")({
  position: "relative",
  borderRadius: "8px",
  backgroundColor: "#F5F7FA",
  border: "1px solid #CDE3FA",
  "&:hover": {
    backgroundColor: "#F9FAFB",
    borderColor: "#0074E9",
  },
  marginLeft: 0,
  width: "100%",
  "@media (min-width: 600px)": {
    width: "auto",
    marginLeft: "8px",
  },
});

const SearchIconWrapper = styled("div")({
  padding: "0 16px",
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#999999",
});

const StyledInputBase = styled(InputBase)({
  color: "#222222",
  "& .MuiInputBase-input": {
    padding: "8px 8px 8px 0",
    paddingLeft: "calc(1em + 48px)",
    transition: "width 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    width: "100%",
    "@media (min-width: 600px)": {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
    "&::placeholder": {
      color: "#999999",
      opacity: 1,
    },
  },
});

export default function CrmSearch() {
  return (
    <SearchWrapper>
      <SearchIconWrapper>
        <SearchRoundedIcon fontSize="small" />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search…"
        inputProps={{ "aria-label": "search" }}
      />
    </SearchWrapper>
  );
}
