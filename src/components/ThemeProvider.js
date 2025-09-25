"use client"
import { createContext, useContext, useEffect, useState } from "react"

// --- Helpers ---
function applyTheme(mode) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)")
  const isDark = mode === "dark" || (mode === "system" && mq.matches)

  document.documentElement.classList.toggle("dark", isDark)

  if (mode === "system") {
    document.documentElement.removeAttribute("data-theme")
  } else {
    document.documentElement.setAttribute("data-theme", mode)
  }
}

// --- Context ---
const ThemeContext = createContext({
  theme: "system",
  setTheme: () => {},
})

// --- Provider ---
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("system")

  // Init theme from localStorage or system
  useEffect(() => {
    const stored = localStorage.getItem("theme") || "system"
    setTheme(stored)
    applyTheme(stored)

    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => {
      const current = localStorage.getItem("theme") || "system"
      if (current === "system") applyTheme("system")
    }
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  const setThemeAndPersist = (next) => {
    setTheme(next)
    localStorage.setItem("theme", next)
    applyTheme(next)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeAndPersist }}>
      {children}
    </ThemeContext.Provider>
  )
}

// --- Hook for convenience ---
export function useTheme() {
  return useContext(ThemeContext)
}
