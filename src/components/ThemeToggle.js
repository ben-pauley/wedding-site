"use client"

import {useState, useRef, useEffect} from "react"
import {useTheme} from "@/components/ThemeProvider"

export default function ThemeToggle() {
  const {theme, setTheme} = useTheme()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown if clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Desktop inline buttons */}
      <div
        className="hidden md:inline-flex items-center gap-2 rounded-2xl
        border border-gray-200 dark:border-neutral-700 p-1"
      >
        <button
          onClick={() => setTheme("light")}
          className={`px-3 py-1 rounded-lg text-sm ${
            theme === "light"
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-neutral-800"
          }`}
        >
          ☀️
        </button>
        <button
          onClick={() => setTheme("dark")}
          className={`px-3 py-1 rounded-lg text-sm ${
            theme === "dark"
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-neutral-800"
          }`}
        >
          🌙
        </button>
        <button
          onClick={() => setTheme("system")}
          className={`px-3 py-1 rounded-lg text-sm ${
            theme === "system"
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-neutral-800"
          }`}
        >
          🖥️
        </button>
      </div>

      {/* Mobile dropdown */}
      <div className="md:hidden">
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-lg border border-gray-200 dark:border-neutral-700
               text-gray-800 dark:text-gray-100
               hover:bg-gray-100 dark:hover:bg-neutral-800"
        >
          ☰
        </button>
        {open && (
          <div
            className="absolute right-0 mt-2 w-28 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-lg overflow-hidden z-10">
            <button
              onClick={() => {
                setTheme("light")
                setOpen(false)
              }}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-left
                   text-gray-800 dark:text-gray-100
                   hover:bg-gray-100 dark:hover:bg-neutral-800"
            >
              <span>☀️</span>
              <span>Light</span>
            </button>
            <button
              onClick={() => {
                setTheme("dark")
                setOpen(false)
              }}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-left
                   text-gray-800 dark:text-gray-100
                   hover:bg-gray-100 dark:hover:bg-neutral-800"
            >
              <span>🌙</span>
              <span>Dark</span>
            </button>
            <button
              onClick={() => {
                setTheme("system")
                setOpen(false)
              }}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-left
                   text-gray-800 dark:text-gray-100
                   hover:bg-gray-100 dark:hover:bg-neutral-800"
            >
              <span>🖥️</span>
              <span>System</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
