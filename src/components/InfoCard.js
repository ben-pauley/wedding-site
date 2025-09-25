import Link from "next/link"

export default function InfoCard({title, children, showMoreButton = false, morePath = "", token, moreLabel}) {
  return (
    <section
      className={`rounded-2xl border border-gray-200 dark:border-neutral-700 
                  bg-white dark:bg-neutral-950 overflow-hidden flex 
                  ${showMoreButton ? "hover:shadow-md transition-shadow" : ""}`}
    >
      <div className="flex-1 p-6">
        <h2 className="text-xl font-semibold mb-3">{title}</h2>
        <div className="text-gray-700 dark:text-gray-300 space-y-3">{children}</div>
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
