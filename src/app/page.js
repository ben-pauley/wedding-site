"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ThemeToggle from "@/components/ThemeToggle"

// Normalize helper
function normalize(s = "") {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

export default function Home() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [picked, setPicked] = useState(null)
  const [error, setError] = useState("")
  const router = useRouter()

  // 🔍 Lookup suggestions
  useEffect(() => {
    const handle = setTimeout(async () => {
      if (name.trim().length < 2) {
        setSuggestions([])
        setPicked(null)
        return
      }
      try {
        const res = await fetch(`/api/lookup?q=${encodeURIComponent(name)}`)
        const data = await res.json()
        const list = data.suggestions || []
        setSuggestions(list)

        const exact = list.find((s) => normalize(s.fullName) === normalize(name))
        setPicked(exact || null)
      } catch {
        setSuggestions([])
      }
    }, 250)
    return () => clearTimeout(handle)
  }, [name])

  const nameOk = !!picked && normalize(picked.fullName) === normalize(name)
  const canContinue = nameOk && !!email.trim()

  // 🚀 Submit form
  async function handleSubmit(e) {
    e.preventDefault()
    setError("")

    if (!picked || !email.trim()) {
      setError("Please select your name and enter your email.")
      return
    }

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      })
      const data = await res.json()

      if (!res.ok || !data.ok) {
        switch (data.error) {
          case "name_not_found":
            setError("We couldn't find that name. Please pick from the suggestions.")
            break
          case "email_mismatch":
            setError("That email doesn't match what we have on file for this name.")
            break
          default:
            setError("Please check your details and try again.")
        }
        return
      }

      if (!data.token) {
        alert("Verified, but no token set for this guest yet.")
        return
      }

      router.push(`/invite/${data.token}`)
    } catch {
      setError("Something went wrong. Please try again.")
    }
  }

  return (
    <main className="min-h-screen bg-white text-gray-800 dark:bg-neutral-900 dark:text-neutral-100 transition-colors">
      <div className="mx-auto max-w-3xl px-6 py-16">

        {/* Top bar with theme toggle */}
        <div className="flex justify-end mb-6">
          <ThemeToggle />
        </div>

        {/* Header */}
        <header className="text-center space-y-3">
          <p className="uppercase tracking-widest text-sm text-gray-500 dark:text-gray-400">
            We’re getting married
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold">Praise & Ben</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Saturday, 27 June 2026 · Birmingham/Bromsgrove
          </p>
        </header>

        {/* Entry button */}
        {!open && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setOpen(true)}
              className="rounded-2xl px-6 py-3 bg-black text-white hover:opacity-90 transition dark:bg-white dark:text-black"
            >
              Enter →
            </button>
          </div>
        )}

        {/* Form */}
        {open && (
          <section className="mt-12 mx-auto max-w-xl">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-gray-200 dark:border-neutral-700 shadow-sm p-6 space-y-6 bg-white dark:bg-neutral-950 transition-colors"
            >
              <h2 className="text-xl font-semibold">Welcome</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Please enter your full name and email to continue.
              </p>

              {/* Name input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">
                  Full name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    setError("")
                  }}
                  placeholder="Start typing your full name"
                  className="mt-1 w-full rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-neutral-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-colors"
                />
                {suggestions.length > 0 && (
                  <ul className="mt-2 divide-y divide-gray-200 dark:divide-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
                    {suggestions.map((s) => (
                      <li
                        key={s.id}
                        className={`p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800 ${
                          picked && normalize(picked.fullName) === normalize(s.fullName)
                            ? "bg-gray-50 dark:bg-neutral-800"
                            : ""
                        }`}
                        onClick={() => {
                          setName(s.fullName)
                          setPicked(s)
                          setSuggestions([])
                          setError("")
                        }}
                      >
                        <div className="font-medium">{s.fullName}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {s.hasEmail ? "• email on file" : "• no email on file"}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {!picked && name.trim().length >= 2 && (
                  <p className="mt-2 text-xs text-amber-700">
                    Please pick your name from the list above to continue.
                  </p>
                )}
              </div>

              {/* Email input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError("")
                  }}
                  placeholder="you@example.com"
                  className="mt-1 w-full rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-neutral-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-colors"
                />
                {picked && (
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {picked.hasEmail
                      ? "We have an email on file. Please enter that same email."
                      : "No email on file — any valid email is fine."}
                  </p>
                )}
              </div>

              {/* Error */}
              {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}

              {/* Submit */}
              <button
                type="submit"
                disabled={!canContinue}
                className="w-full rounded-2xl px-6 py-3 bg-black text-white dark:bg-white dark:text-black hover:opacity-90 disabled:opacity-60 transition"
              >
                Continue
              </button>
            </form>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
          Built with ❤️ <br /> by Ben & Praise
        </footer>
      </div>
    </main>
  )
}
