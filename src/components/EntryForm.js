"use client"

import {useState, useEffect} from "react"
import {useRouter} from "next/navigation"
import {normalize} from "@/lib/utils"

export default function EntryForm({
                                   name,
                                   setName,
                                   email,
                                   setEmail,
                                   picked,
                                   setPicked,
                                   suggestions,
                                   setSuggestions,
                                 }) {
  const [error, setError] = useState("")
  const [lookupDone, setLookupDone] = useState(false) // ✅ track if API finished
  const router = useRouter()

  const nameOk = !!picked && normalize(picked.fullName) === normalize(name)
  const canContinue = nameOk && !!email.trim()

// 🔍 Lookup suggestions
  useEffect(() => {
    const handle = setTimeout(async () => {
      if (name.trim().length < 2) {
        setSuggestions([])
        setPicked(null)
        setLookupDone(false)
        return
      }
      try {
        const res = await fetch(`/api/lookup?q=${encodeURIComponent(name)}`)
        const data = await res.json()
        const list = data.suggestions || []

        // find an exact match (normalized)
        const exact = list.find(
          (s) => normalize(s.fullName) === normalize(name)
        )

        if (exact) {
          // ✅ auto-pick and hide suggestions if exact match
          setPicked(exact)
          setSuggestions([])
        } else {
          setSuggestions(list)
          setPicked(null)
        }
      } catch {
        setSuggestions([])
      } finally {
        setLookupDone(true)
      }
    }, 250)
    return () => clearTimeout(handle)
  }, [name, setPicked, setSuggestions])

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
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name, email}),
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
          autoComplete={'off'}
          type="text"
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setError("")
            setLookupDone(false) // reset when user types again
          }}
          placeholder="Start typing your full name"
          className="mt-1 w-full rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-neutral-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-colors"
        />

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <ul
            className="mt-2 divide-y divide-gray-200 dark:divide-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
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

        {/* No matches */}
        {lookupDone && suggestions.length === 0 && !picked && name.trim().length >= 2 && (
          <p className="mt-2 text-xs text-red-600 dark:text-red-400">
            We couldn’t find any matching names. Please check your spelling or try again.
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
  )
}
