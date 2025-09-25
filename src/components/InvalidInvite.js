export default function InvalidInvite() {
  return (
    <main className="flex-1 flex items-center justify-center px-6
                     bg-white text-gray-800 dark:bg-neutral-900 dark:text-neutral-100">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold mb-2">Invalid or expired link</h1>
        <p className="text-gray-600 dark:text-gray-400">
          We couldn’t find an invite for this link. Please double-check your URL
          or contact the couple to request a new one.
        </p>
      </div>
    </main>
  )
}
