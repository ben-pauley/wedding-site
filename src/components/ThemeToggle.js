"use client"
import { useTheme } from "./ThemeProvider"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-neutral-700 p-1">
      <button
        onClick={() => setTheme("light")}
        className={`px-3 py-1 rounded-lg text-sm ${
          theme === "light"
            ? "bg-black text-white dark:bg-white dark:text-black"
            : "hover:bg-gray-100 dark:hover:bg-neutral-800"
        }`}
      >
        ☀️
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`px-3 py-1 rounded-lg text-sm ${
          theme === "dark"
            ? "bg-black text-white dark:bg-white dark:text-black"
            : "hover:bg-gray-100 dark:hover:bg-neutral-800"
        }`}
      >
        🌙
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`px-3 py-1 rounded-lg text-sm ${
          theme === "system"
            ? "bg-black text-white dark:bg-white dark:text-black"
            : "hover:bg-gray-100 dark:hover:bg-neutral-800"
        }`}
      >
        🖥️
      </button>
    </div>
  )
}
