"use client"

import {useState} from "react"
import MealGuestForm from "./MealGuestForm"
import FormSubmitMessage from "@/components/FormSubmitMessage"
import FormSubmitButton from "@/components/FormSubmitButton";

export default function MealForm({initialGuests, loggedInGuest}) {
  const [guests, setGuests] = useState(initialGuests)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  const handleGuestChange = (guestId, updates) => {
    setGuests(prev =>
      prev.map(g => (g.id === guestId ? {...g, ...updates} : g))
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()

    setSaving(true)
    setMessage("")

    try {
      const res = await fetch("/api/meal/save", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          who: loggedInGuest.fullName,
          responses: guests.map(g => ({
            id: g.id,
            fullName: g.fullName,
            meal: g.meal,
            dietaryRestrictions: g.dietaryChoice === "yes" ? g.dietaryText : "None",
          })),
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setMessage("❌ Failed to save. Please try again.")
      } else {
        setMessage("✅ Meal choices saved!")
      }
    } catch (err) {
      console.error(err)
      setMessage("❌ Failed to save. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {guests.map(g => (
        <MealGuestForm
          key={g.id}
          guest={g}
          onChange={updates => handleGuestChange(g.id, updates)}
        />
      ))}
      <FormSubmitButton label={"Save Choices"} saving={saving}/>
      <FormSubmitMessage message={message} onDismiss={() => setMessage("")}/>
    </form>
  )
}
