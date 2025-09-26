import React from "react"
import {fetchGuestByToken, fetchGuestsByWhoRSVPed} from "@/lib/airtable"
import InvalidInvite from "@/components/InvalidInvite"
import MealForm from "@/components/MealForm"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Meal Selection · Praise & Ben's Wedding",
  description: "Choose your meal and let us know about dietary restrictions",
}

export default async function MealPage({params}) {
  const {token} = await params
  const loggedInGuest = await fetchGuestByToken(token)
  if (!loggedInGuest) return <InvalidInvite/>

  const household = await fetchGuestsByWhoRSVPed(loggedInGuest.fullName)

  const guests = [
    loggedInGuest,
    ...household.filter(g => g.id !== loggedInGuest.id),
  ]

  return (
    <main className="flex-1 bg-white text-gray-800 dark:bg-neutral-900 dark:text-neutral-100">
      <div className="mx-auto max-w-3xl px-6 py-12 space-y-10">
        <header>
          <h1 className="text-3xl md:text-4xl font-semibold">Meal Selection 🍽️</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Please choose your main course and let us know about any dietary restrictions.
          </p>
        </header>

        <MealForm initialGuests={guests} loggedInGuest={loggedInGuest}/>
      </div>
    </main>
  )
}
