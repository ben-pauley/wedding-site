export default function InfoCard({title, children}) {
  return (
    <section className="rounded-2xl border border-gray-200 dark:border-neutral-700 p-6 bg-white dark:bg-neutral-950">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <div className="text-gray-700 dark:text-gray-300">{children}</div>
    </section>
  )
}
