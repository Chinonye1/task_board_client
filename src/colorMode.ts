import { createContext } from "react";

export const ColorModeContext = createContext<{
  mode: "light" | "dark";
  toggle: () => void;
}>({ mode: "light", toggle: () => {} });
