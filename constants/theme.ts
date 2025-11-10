import { Platform } from "react-native";

// const tintColorLight = "#0a7ea4";
// const tintColorDark = "#0a7ea4";

// export const Colors = {
//   light: {
//     text: "#0f172a", // slate-900
//     background: "#14a4d0ff", // light yellow background for light theme
//     card: "#FFFFFF",
//     tint: tintColorLight, // primary accent (teal)
//     accent: "#FF6B6B", // secondary accent (coral)
//     muted: "#6B7280",
//     icon: "#6B7280",
//     tabIconDefault: "#9CA3AF",
//     tabIconSelected: tintColorLight,
//   },
//   dark: {
//     text: "#E6EEF6",
//     background: "#0F172A", // slate-900 - deeper dark blue-gray
//     card: "#1E293B", // slate-800
//     tint: tintColorDark,
//     accent: "#FF6B6B",
//     muted: "#9BA1A6",
//     icon: "#9BA1A6",
//     tabIconDefault: "#9BA1A6",
//     tabIconSelected: tintColorDark,
//   },
// };

// export const Fonts = Platform.select({
//   ios: {
//     /** iOS `UIFontDescriptorSystemDesignDefault` */
//     sans: "system-ui",
//     /** iOS `UIFontDescriptorSystemDesignSerif` */
//     serif: "ui-serif",
//     /** iOS `UIFontDescriptorSystemDesignRounded` */
//     rounded: "ui-rounded",
//     /** iOS `UIFontDescriptorSystemDesignMonospaced` */
//     mono: "ui-monospace",
//   },
//   default: {
//     sans: "normal",
//     serif: "serif",
//     rounded: "normal",
//     mono: "monospace",
//   },
//   web: {
//     sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
//     serif: "Georgia, 'Times New Roman', serif",
//     rounded:
//       "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
//     mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
//   },
// });

const ACCENT_COLOR = "#FF6B6B";
const TINT_COLOR = "#0a7ea4";

export const Colors = {
  light: {
    text: "#0f172a",
    background: "#FFFBEB", // light yellowish
    card: "#FFFFFF",
    tint: TINT_COLOR,
    accent: ACCENT_COLOR,
    muted: "#6B7280",
    icon: "#6B7280",
    tabIconDefault: "#9CA3AF",
    tabIconSelected: TINT_COLOR,
  },
  dark: {
    text: "#E6EEF6",
    background: "#0F172A",
    card: "#1E293B",
    tint: TINT_COLOR,
    accent: ACCENT_COLOR,
    muted: "#9BA1A6",
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: TINT_COLOR,
  },
};
export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  android: {
    sans: "Roboto",
    serif: "serif",
    rounded: "sans-serif-rounded",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

