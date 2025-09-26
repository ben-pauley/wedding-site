import React from "react"
import {fetchGuestByToken} from "@/lib/airtable"
import InfoCard from "@/components/InfoCard"
import InvalidInvite from "@/components/InvalidInvite"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Ceremony Details · Praise & Ben's Wedding",
  description: "More information about the wedding ceremony",
}

export default async function CeremonyPage({params}) {
  const {token} = await params
  const guest = await fetchGuestByToken(token)

  if (!guest) {
    return <InvalidInvite/>
  }

  return (
    <main className="flex-1 bg-white text-gray-800 dark:bg-neutral-900 dark:text-neutral-100">
      <div className="mx-auto max-w-3xl px-6 py-12 space-y-10">

        <header className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-semibold">Ceremony 💒</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Saturday, 27 June 2026 · 11:30
          </p>
        </header>

        <InfoCard title="Location">
          Stirchley Community Church <br/>
          Hazelwell St, Stirchley <br/>
          Birmingham <br/>
          B30 2JX <br/>

          image of church and google maps goes here // TODO
        </InfoCard>

        <InfoCard title="Schedule">
          <ul className="list-disc list-inside space-y-1">
            <li>11:00 – Guests arrive</li>
            <li>11:30 – Ceremony begins</li>
            <li>13:00 – Light refreshments served</li>
          </ul>
        </InfoCard>

        <InfoCard title="Parking">
          Parking right next to the church is very limited.
          Avoid parking on Bournville Ln, as you parking restrictions apply on Saturdays
          and we don&#39;t want you to get a parking ticket! <br/><br/>
          There is street parking available off of Bournville Ln on Bond St, Lea House Rd,
          Regent St, Victoria Rd and Oxford St, but please avoid blocking driveways and entrances.
          There is also some parking available at Aldi round the back of the church, but be aware of restrictions.
        </InfoCard>

        <InfoCard title="Other Information">
          <p className="text-gray-700 dark:text-gray-300">
            Dress code: formal. <br/>
            Please arrive by 11:20.
          </p>
        </InfoCard>
      </div>
    </main>
  )
}
