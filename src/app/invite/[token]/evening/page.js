import React from "react"
import {fetchGuestByToken} from "@/lib/airtable"
import InfoCard from "@/components/InfoCard"
import InvalidInvite from "@/components/InvalidInvite"
import RedhouseBarnLocationInfo from "@/components/RedhouseBarn/RedhouseBarnLocationInfo"
import RedhouseBarnParkingInfo from "@/components/RedhouseBarn/RedhouseBarnParkingInfo"
import RedhouseBarnAccommodationInfo from "@/components/RedhouseBarn/RedhouseBarnAccommodationInfo"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Evening Details · Praise & Ben's Wedding",
  description: "More information about the evening celebration",
}

export default async function EveningPage({params}) {
  const {token} = await params
  const guest = await fetchGuestByToken(token)

  if (!guest) {
    return <InvalidInvite/>
  }

  return (
    <main className="flex-1 bg-white text-gray-800 dark:bg-neutral-900 dark:text-neutral-100">
      <div className="mx-auto max-w-3xl px-6 py-12 space-y-10">

        <header className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-semibold">Evening Celebration 🎉</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Saturday, 27 June 2026 · 18:00
          </p>
        </header>

        <RedhouseBarnLocationInfo/>

        <InfoCard title="Schedule">
          <ul className="list-disc list-inside space-y-1">
            <li>18:00 – Evening guests arrive</li>

            rest of schedule goes here // TODO
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
