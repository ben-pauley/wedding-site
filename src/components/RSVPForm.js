"use client"

import {useCallback, useState} from "react"
import RSVPGuestForm from "./RSVPGuestForm"
import GuestLookup from "./GuestLookup"

export default function RSVPForm({initialGuests, loggedInGuest}) {
  const [guests, setGuests] = useState(initialGuests)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  function addGuest(guest) {
    if (guests.some(g => g.id === guest.id)) return
    setGuests([...guests, guest])
  }

  const handleGuestChange = useCallback((guestId, responses) => {
    setGuests(prev =>
      prev.map(g => (g.id === guestId ? {...g, responses} : g))
    )
  }, [])

  const allComplete = guests.every(g => {
    const r = g.responses || {}
    return g.access === "full"
      ? r.ceremony && r.reception && r.evening
      : r.ceremony && r.evening
  })

  async function handleSubmit(e) {
    e.preventDefault()
    if (!allComplete) return

    setSaving(true)
    setMessage("")

    const responses = guests.map(g => ({
      id: g.id,
      fullName: g.fullName,
      ...g.responses,
    }))

    try {
      const res = await fetch("/api/rsvp/save", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({responses, who: loggedInGuest.fullName}),
      })

      const data = await res.json()

      if (!res.ok || !data.ok) {
        setMessage("❌ Failed to save RSVP. Please try again.")
        return
      }

      setMessage("✅ RSVP saved successfully!")
    } catch (err) {
      console.error(err)
      setMessage("❌ Failed to save RSVP. Please try again.")
    } finally {
      setSaving(false)
    }

  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {guests.map(guest => (
        <RSVPGuestForm
          isLoggedInGuest={loggedInGuest.id === guest.id}
          key={guest.id}
          guest={guest}
          onChange={responses => handleGuestChange(guest.id, responses)}
        />
      ))}

      <GuestLookup onSelect={addGuest}/>

      <button
        type="submit"
        disabled={!allComplete || saving}
        className={`px-6 py-3 rounded-xl transition ${
          allComplete && !saving
            ? "bg-black text-white dark:bg-white dark:text-black hover:opacity-90"
            : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-neutral-700 dark:text-neutral-400"
        }`}
      >
        {saving ? "Saving..." : "Save RSVP"}
      </button>

      {message && (
        <div
          className={`mt-4 p-4 rounded-xl border text-sm font-medium relative ${
            message.startsWith("✅")
              ? "bg-green-50 border-green-200 text-green-800 " +
              "dark:bg-green-950/30 dark:border-green-700 dark:text-green-200"
              : "bg-red-50 border-red-200 text-red-800 " +
              "dark:bg-red-950/30 dark:border-red-700 dark:text-red-200"
          }`}
        >
          <button
            type="button"
            onClick={() => setMessage("")}
            className="absolute top-2 right-2 text-lg leading-none
            text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Dismiss message"
          >
            ×
          </button>
          {message}
        </div>
      )}

    </form>
  )
}
