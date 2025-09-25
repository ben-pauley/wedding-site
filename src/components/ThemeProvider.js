"use client"
import { createContext, useContext, useEffect, useState } from "react"

// Context
const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("system") // "light" | "dark" | "system"

  // Apply to <html>
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

  // Init
  useEffect(() => {
    const stored = localStorage.getItem("theme") || "system"
    setTheme(stored)
    applyTheme(stored)

    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => {
      if ((localStorage.getItem("theme") || "system") === "system") {
        applyTheme("system")
      }
    }
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  // Update + persist
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

// Hook
export function useTheme() {
  return useContext(ThemeContext)
}
