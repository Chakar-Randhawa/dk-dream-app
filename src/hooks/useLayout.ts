import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MAX_CONTENT, MAX_WIDE } from "../theme";

export const TAB_ROW = 64;

/**
 * One source of truth for responsive sizing.
 * Works for small phones (320dp), large phones, foldables, tablets and landscape,
 * with both gesture navigation and 3-button navigation (via safe-area insets).
 */
export function useLayout() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const shortSide = Math.min(width, height);
  const isTablet = shortSide >= 600;
  const gutter = width >= 900 ? 32 : isTablet ? 28 : width < 360 ? 14 : 18;
  const contentWidth = Math.min(width - insets.left - insets.right, MAX_CONTENT);
  const wideWidth = Math.min(width - insets.left - insets.right, MAX_WIDE);
  const columns = wideWidth >= 900 ? 4 : wideWidth >= 560 ? 3 : 2;
  const isWide = width - insets.left - insets.right >= 900;
  const tabBarHeight = TAB_ROW + insets.bottom;
  /** Space kept free at the end of scroll content for the floating chat button. */
  const fabSpace = 96;
  return {
    width,
    height,
    insets,
    isTablet,
    isWide,
    gutter,
    contentWidth,
    wideWidth,
    columns,
    tabBarHeight,
    fabSpace,
    /** Responsive font scale */
    fs: (phone: number, tablet: number) => (isTablet ? tablet : phone),
  };
}
