"use client"

import {useCallback, useState} from "react"
import RSVPGuestForm from "./RSVPGuestForm"
import GuestLookup from "./GuestLookup"
import FormSubmitMessage from "@/components/FormSubmitMessage"
import FormSubmitButton from "@/components/FormSubmitButton";

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
      <FormSubmitButton disabled={!allComplete} label={"Save RSVP"} saving={saving}/>
      <FormSubmitMessage message={message} onDismiss={() => setMessage("")}/>
    </form>
  )
}
