"use client"

import Link from "next/link"
import {usePathname} from "next/navigation"
import ThemeToggle from "@/components/ThemeToggle"

export default function TopBar() {
  const pathname = usePathname()
  const isRootPage = pathname === "/"

  return (
    <div className="flex justify-between p-4 bg-white dark:bg-neutral-900 transition-colors">
      {!isRootPage
        ? (
          <Link
            href="/"
            className="rounded-2xl bg-black text-white px-4 py-2 hover:opacity-90 transition
                     dark:bg-white dark:text-black"
          >
            ← Back to Home
          </Link>
        )
        : (
          <div/> // Placeholder div to keep spacing consistent when back button is hidden
        )
      }
      <ThemeToggle/>
    </div>
  )
}
