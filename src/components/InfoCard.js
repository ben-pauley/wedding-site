"use client"

import {useState, useEffect} from "react"
import Link from "next/link"
import {ChevronDown} from "lucide-react"

export default function InfoCard({
                                   title,
                                   children,
                                   showMoreButton = false,
                                   morePath = "",
                                   token,
                                   moreLabel,
                                   collapsible = true,
                                 }) {
  const storageKey = `infoCard-${title.replace(/\s+/g, "-").toLowerCase()}`
  const [collapsed, setCollapsed] = useState(false)

  // Load saved state
  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved !== null) {
      setCollapsed(saved === "true")
    }
  }, [storageKey])

  // Save state whenever it changes
  useEffect(() => {
    localStorage.setItem(storageKey, collapsed)
  }, [collapsed, storageKey])

  return (
    <section
      className={`rounded-2xl border border-gray-200 dark:border-neutral-700 
                  bg-white dark:bg-neutral-950 overflow-hidden flex 
                  ${showMoreButton ? "hover:shadow-md transition-shadow" : ""}`}
    >
      <div className="flex-1 p-6">
        {/* Header with collapse arrow */}
        <div
          className={`flex items-center justify-between mb-3 ${
            collapsible ? "cursor-pointer select-none" : ""
          }`}
          onClick={() => collapsible && setCollapsed(!collapsed)}
        >
          <h2 className="text-xl font-semibold">{title}</h2>
          {collapsible && (
            <ChevronDown
              className={`h-5 w-5 text-gray-600 dark:text-gray-300 transition-transform duration-300 ${
                collapsed ? "-rotate-90" : ""
              }`}
            />
          )}
        </div>

        {/* Collapsible content */}
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            collapsed
              ? "grid-rows-[0fr] opacity-0"
              : "grid-rows-[1fr] opacity-100"
          }`}
        >
          <div className="overflow-hidden">
            <div className="text-gray-700 dark:text-gray-300 space-y-3">
              {children}
            </div>
          </div>
        </div>
      </div>

      {showMoreButton && token && morePath && (
        <Link
          href={`/invite/${token}${morePath}`}
          className="w-[15%] min-w-[100px] flex flex-col items-center justify-center text-center
                     bg-gray-800 text-white dark:bg-white dark:text-black
                     hover:opacity-90 transition-colors"
        >
          <span>{moreLabel}</span>
          <span className="text-xl">→</span>
        </Link>
      )}
    </section>
  )
}
