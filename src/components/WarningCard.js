import React from "react"

export default function WarningCard({title, children}) {
  return (
    <section className="rounded-2xl border border-amber-300/70 bg-amber-50
    dark:border-amber-400/40 dark:bg-amber-950/20 p-6">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <div className="text-amber-800 dark:text-amber-200">{children}</div>
    </section>
  )
}
