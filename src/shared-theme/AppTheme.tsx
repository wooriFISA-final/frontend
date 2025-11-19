import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import type { ThemeOptions } from "@mui/material/styles";
import { inputsCustomizations } from "./customizations/inputs";
import { dataDisplayCustomizations } from "./customizations/dataDisplay";
import { feedbackCustomizations } from "./customizations/feedback";
import { navigationCustomizations } from "./customizations/navigation";
import { surfacesCustomizations } from "./customizations/surfaces";
// 💡 colorSchemes는 light와 dark 두 가지 팔레트를 모두 포함하고 있습니다.
import { colorSchemes, typography, shadows, shape } from "./themePrimitives";

interface AppThemeProps {
  children: React.ReactNode;
  /**
   * This is for the docs site. You can ignore it or remove it.
   */
  disableCustomTheme?: boolean;
  themeComponents?: ThemeOptions["components"];

  // 💡 CrmDashboard에서 현재 테마 모드를 받을 수 있도록 합니다.
  mode?: 'light' | 'dark';

}

export default function AppTheme(props: AppThemeProps) {
  // 💡 prop으로 mode를 받고, 기본값을 'light'로 설정하여 라이트 모드를 기본으로 만듭니다.
  const { children, disableCustomTheme, themeComponents, mode = 'light' } = props;
  
  const theme = React.useMemo(() => {
    // 💡 colorSchemes에서 현재 설정된 mode에 해당하는 팔레트 정보를 선택합니다.
    const selectedColorScheme = colorSchemes[mode];

    return disableCustomTheme
      ? {}
      : createTheme({
          cssVariables: {
            colorSchemeSelector: "data-mui-color-scheme",
            cssVarPrefix: "template",
          },
          // defaultColorScheme: "light" (이 설정만으로는 부족하여 아래 palette를 직접 설정합니다.)
          
          // 💡 colorSchemes 대신, 선택된 모드의 팔레트만 적용하여 위젯이 해당 모드의 색상을 사용하도록 강제합니다.
          palette: {
            ...selectedColorScheme.palette,
            mode: mode, // 현재 모드를 다시 한 번 명시합니다.
          },
          
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
  }, [disableCustomTheme, themeComponents, mode]); // 💡 mode가 바뀔 때마다 테마가 재생성되도록 의존성 배열에 추가

  if (disableCustomTheme) {
    return <React.Fragment>{children}</React.Fragment>;
  }
  return (
    <ThemeProvider theme={theme} disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}