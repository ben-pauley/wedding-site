"use client"

export default function FormSubmitButton({disabled, saving, label}) {
  return (
    <button
      type="submit"
      disabled={disabled || saving}
      className={`px-6 py-3 rounded-xl transition ${
        !disabled && !saving
          ? "bg-black text-white dark:bg-white dark:text-black hover:opacity-90"
          : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-neutral-700 dark:text-neutral-400"
      }`}
    >
      {saving ? "Saving..." : label}
    </button>
  )
}
