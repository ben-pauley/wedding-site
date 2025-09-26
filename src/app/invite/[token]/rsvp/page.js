import React from "react"
import {fetchGuestByToken, fetchGuestsByWhoRSVPed} from "@/lib/airtable"
import {getAccessLevel} from "@/lib/utils"
import InvalidInvite from "@/components/InvalidInvite"
import RSVPForm from "@/components/RSVPForm"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "RSVP · Praise & Ben's Wedding",
  description: "RSVP for Praise & Ben's wedding",
}

export default async function RSVPPage({params}) {
  const {token} = await params
  const loggedInGuest = await fetchGuestByToken(token)

  if (!loggedInGuest) {
    return <InvalidInvite/>
  }

  const household = await fetchGuestsByWhoRSVPed(loggedInGuest.fullName)

  const guests = [
    {
      ...loggedInGuest,
      access: getAccessLevel(loggedInGuest.priority),
      ceremony: loggedInGuest.ceremony,
      reception: loggedInGuest.reception,
      evening: loggedInGuest.evening,
    },
    ...household.filter(g => g.id !== loggedInGuest.id).map(g => ({
      ...g,
      access: getAccessLevel(g.priority),
    })),
  ]

  const firstName = loggedInGuest.fullName.split(" ")[0]

  return (
    <main className="flex-1 bg-white text-gray-800 dark:bg-neutral-900 dark:text-neutral-100">
      <div className="mx-auto max-w-3xl px-6 py-12 space-y-10">
        <header className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-semibold">RSVP 📨</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Hello, {firstName}. Please let us know which parts of our special day you’ll be attending.
          </p>
        </header>
        <RSVPForm initialGuests={guests} loggedInGuest={loggedInGuest}/>
      </div>
    </main>
  )
}
