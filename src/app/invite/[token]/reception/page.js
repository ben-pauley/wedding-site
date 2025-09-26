import React from "react"
import {fetchGuestByToken} from "@/lib/airtable"
import {getAccessLevel} from "@/lib/utils"
import InfoCard from "@/components/InfoCard"
import InvalidInvite from "@/components/InvalidInvite"
import RedhouseBarnParkingInfo from "@/components/RedhouseBarn/RedhouseBarnParkingInfo"
import RedhouseBarnAccommodationInfo from "@/components/RedhouseBarn/RedhouseBarnAccommodationInfo"
import RedhouseBarnLocationInfo from "@/components/RedhouseBarn/RedhouseBarnLocationInfo"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Reception Details · Praise & Ben's Wedding",
  description: "More information about the wedding reception",
}

export default async function ReceptionPage({params}) {
  const {token} = await params
  const guest = await fetchGuestByToken(token)
  const access = getAccessLevel(guest.priority)

  if (!guest || access !== "full") {
    return <InvalidInvite/>
  }

  return (
    <main className="flex-1 bg-white text-gray-800 dark:bg-neutral-900 dark:text-neutral-100">
      <div className="mx-auto max-w-3xl px-6 py-12 space-y-10">

        <header className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-semibold">Wedding Reception 🥂</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Saturday, 27 June 2026 · 14:00
          </p>
        </header>

        <RedhouseBarnLocationInfo/>

        <InfoCard title="Schedule">
          <ul className="list-disc list-inside space-y-1">
            <li>14:00 – Guests arrive, welcome drinks</li>
            <li>16:00 – Wedding breakfast begins</li>
            <li>18:00 – Evening guests begin to arrive</li>
          </ul>
        </InfoCard>

        <RedhouseBarnParkingInfo/>
        <RedhouseBarnAccommodationInfo/>

        <InfoCard title="Other Information">
          <p className="text-gray-700 dark:text-gray-300">
            Dress code: formal.
          </p>
        </InfoCard>

      </div>
    </main>
  )
}
