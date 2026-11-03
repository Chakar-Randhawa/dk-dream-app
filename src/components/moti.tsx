import React from "react";
import { MotiView as BaseMotiView, AnimatePresence } from "moti";

// Moti 0.30's transition typings do not line up with Reanimated 4's,
// so props are loosened here. Runtime behaviour is unchanged.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MotiView = BaseMotiView as unknown as React.ComponentType<any>;
export { AnimatePresence };
