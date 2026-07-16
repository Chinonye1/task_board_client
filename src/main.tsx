import { StrictMode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./index.css";
import App from "./App.tsx";
import ProjectsPage from "./pages/ProjectsPage.tsx";
import BoardPage from "./pages/BoardPage.tsx";
import { ColorModeContext } from "./colorMode";

function makeTheme(mode: "light" | "dark") {
  const isDark = mode === "dark";
  return createTheme({
    palette: {
      mode,
      primary: { main: "#4f46e5" },
      background: isDark
        ? { default: "#0f172a", paper: "#1e293b" }
        : { default: "#f4f5f7", paper: "#ffffff" },
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: 'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      h4: { fontWeight: 700 },
      h6: { fontWeight: 600 },
    },
  });
}

function Root() {
  const [mode, setMode] = useState<"light" | "dark">(
    () => (localStorage.getItem("theme") as "light" | "dark") || "light",
  );

  const colorMode = useMemo(
    () => ({
      mode,
      toggle: () =>
        setMode((prev) => {
          const next = prev === "light" ? "dark" : "light";
          localStorage.setItem("theme", next);
          return next;
        }),
    }),
    [mode],
  );

  const theme = useMemo(() => makeTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route element={<App />}>
              <Route path="/" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<BoardPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
