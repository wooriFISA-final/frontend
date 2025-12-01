// src/shared-theme/AppTheme.tsx
import * as React from "react";
import {
  ThemeProvider,
  createTheme,
  type ThemeOptions,
  type PaletteMode,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { inputsCustomizations } from "./customizations/inputs";
import { dataDisplayCustomizations } from "./customizations/dataDisplay";
import { feedbackCustomizations } from "./customizations/feedback";
import { navigationCustomizations } from "./customizations/navigation";
import { surfacesCustomizations } from "./customizations/surfaces";
// 💡 light / dark 팔레트를 모두 포함
import { colorSchemes, typography, shadows, shape } from "./themePrimitives";

type Mode = Extract<PaletteMode, "light" | "dark">;

interface AppThemeProps {
  children: React.ReactNode;
  /**
   * This is for the docs site. You can ignore it or remove it.
   */
  disableCustomTheme?: boolean;
  themeComponents?: ThemeOptions["components"];

  // 과거에 CrmDashboard에서 모드를 prop으로 넘기던 용도
  // 이제는 "초기 모드" 정도로만 사용 (선택 사항)
  mode?: Mode;
}

// ================================
//   다크 모드 컨텍스트 정의
// ================================
interface ColorModeContextValue {
  mode: Mode;
  toggleColorMode: () => void;
}

const ColorModeContext =
  React.createContext<ColorModeContextValue | undefined>(undefined);

// 어디서나 쓰는 훅
export const useColorMode = () => {
  const ctx = React.useContext(ColorModeContext);
  if (!ctx) {
    throw new Error("useColorMode는 AppTheme 내부에서만 사용할 수 있습니다.");
  }
  return ctx;
};

// ================================
//   AppTheme 컴포넌트
// ================================
export default function AppTheme(props: AppThemeProps) {
  const { children, disableCustomTheme, themeComponents, mode: modeProp } =
    props;

  // 🔹 전역 다크모드 상태
  const [mode, setMode] = React.useState<Mode>(() => {
    // localStorage에 저장된 모드가 있으면 우선 사용
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("mui-mode") as Mode | null;
      if (saved === "light" || saved === "dark") {
        return saved;
      }
    }
    // 그다음 prop으로 받은 초기 모드, 없으면 light
    return modeProp ?? "light";
  });

  // (선택) 바깥에서 mode prop을 변경했을 때 동기화하고 싶다면
  React.useEffect(() => {
    if (modeProp && modeProp !== mode) {
      setMode(modeProp);
    }
  }, [modeProp]); // eslint-disable-line react-hooks/exhaustive-deps

  const colorMode = React.useMemo(
    () => ({
      mode,
      toggleColorMode: () => {
        setMode((prev) => {
          const next = prev === "light" ? "dark" : "light";
          if (typeof window !== "undefined") {
            window.localStorage.setItem("mui-mode", next);
          }
          return next;
        });
      },
    }),
    [mode]
  );

  // 🔹 현재 모드에 맞는 팔레트 선택 + 다크 모드 배경/텍스트 톤 조정
  const theme = React.useMemo(() => {
    const selectedColorScheme = colorSchemes[mode] ?? colorSchemes.light;

    if (disableCustomTheme) {
      // docs 용도. 실제 앱에서는 거의 사용 안 함.
      return createTheme({ palette: { mode } });
    }

    // base palette (colorSchemes에서 온 값)
    const basePalette = selectedColorScheme.palette ?? {};

    const palette: any =
      mode === "dark"
        ? {
          ...basePalette,
          mode: "dark" as PaletteMode,
          background: {
            ...(basePalette as any).background,
            // 🔹 너무 새까만 느낌 대신 조금 밝은 다크톤
            default: "#111827", // 전체 배경
            paper: "#020617", // 카드/패널 배경
          },
          text: {
            ...(basePalette as any).text,
            primary: "#F9FAFB",
            secondary: "#9CA3AF",
          },
        }
        : {
          ...basePalette,
          mode: "light" as PaletteMode,
          // 라이트 모드는 colorSchemes에 정의된 대로 사용
        };

    return createTheme({
      cssVariables: {
        colorSchemeSelector: "data-mui-color-scheme",
        cssVarPrefix: "template",
      },
      palette,
      typography,
      shadows,
      shape,
      components: {
        ...inputsCustomizations,
        ...dataDisplayCustomizations,
        ...feedbackCustomizations,
        ...navigationCustomizations,
        ...surfacesCustomizations,
        ...themeComponents,
      },
    });
  }, [disableCustomTheme, themeComponents, mode]);

  if (disableCustomTheme) {
    // docs 용: 굳이 ColorModeContext가 필요 없으면 이렇게 둬도 되고,
    // 실제 서비스에서는 보통 false라서 아래 분기만 쓰이게 됨.
    return (
      <ThemeProvider theme={theme} disableTransitionOnChange>
        <CssBaseline />
        {children}
      </ThemeProvider>
    );
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme} disableTransitionOnChange>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
