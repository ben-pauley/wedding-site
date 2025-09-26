"use client"

import {useState, useEffect} from "react"

export default function GuestLookup({onSelect}) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [lookupDone, setLookupDone] = useState(false)

  useEffect(() => {
    const handle = setTimeout(async () => {
      if (query.trim().length < 2) {
        setSuggestions([])
        setLookupDone(false)
        return
      }
      try {
        const res = await fetch(`/api/lookup?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setSuggestions(data.suggestions || [])
      } catch {
        setSuggestions([])
      } finally {
        setLookupDone(true)
      }
    }, 250)
    return () => clearTimeout(handle)
  }, [query])

  async function handleSelect(s) {
    try {
      const res = await fetch(`/api/guest?id=${s.id}`)
      const data = await res.json()
      if (data.guest) {
        onSelect(data.guest)
      }
    } catch (e) {
      console.error("Error fetching guest details", e)
    }
    setQuery("")
    setSuggestions([])
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-1">RSVP for another guest</label>
      <input
        className="mt-1 w-full rounded-xl border border-gray-300 dark:border-neutral-700
        bg-white dark:bg-neutral-900 px-4 py-3"
        onChange={e => setQuery(e.target.value)}
        placeholder="Start typing a name"
        type="text"
        value={query}
      />
      {suggestions.length > 0 && (
        <ul className="mt-2 rounded-xl border border-gray-200 dark:border-neutral-700
        bg-white dark:bg-neutral-900">
          {suggestions.map(s => (
            <li
              key={s.id}
              onClick={() => handleSelect(s)}
              className="p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800"
            >
              {s.fullName}
            </li>
          ))}
        </ul>
      )}
      {lookupDone && suggestions.length === 0 && query.trim().length >= 2 && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400">
          No matching guest found.
        </p>
      )}
    </div>
  )
}
