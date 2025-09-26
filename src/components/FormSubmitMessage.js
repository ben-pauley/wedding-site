"use client"

export default function FormSubmitMessage({message, onDismiss}) {
  if (!message) return null

  const isSuccess = message.startsWith("✅")

  return (
    <div
      className={`mt-4 p-4 rounded-xl border text-sm font-medium relative ${
        isSuccess
          ? "bg-green-50 border-green-200 text-green-800 " +
          "dark:bg-green-950/30 dark:border-green-700 dark:text-green-200"
          : "bg-red-50 border-red-200 text-red-800 " +
          "dark:bg-red-950/30 dark:border-red-700 dark:text-red-200"
      }`}
    >
      <button
        type="button"
        onClick={onDismiss}
        className="absolute top-2 right-2 text-lg leading-none
                   text-gray-500 hover:text-gray-700
                   dark:text-gray-400 dark:hover:text-gray-200"
        aria-label="Dismiss message"
      >
        ×
      </button>
      {message}
    </div>
  )
}
