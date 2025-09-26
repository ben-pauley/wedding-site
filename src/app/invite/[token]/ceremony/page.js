import React from "react"
import Image from "next/image"
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
          <div className="space-y-4">
            <div>
              Stirchley Community Church <br/>
              Hazelwell St, Stirchley <br/>
              Birmingham <br/>
              B30 2JX
            </div>

            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-neutral-700">
              <Image
                src="/images/church.png"
                alt="Stirchley Community Church"
                width={800}
                height={500}
                className="w-full h-auto object-cover"
              />
            </div>

            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-neutral-700">
              <iframe
                src={"https://www.google.com/maps/embed" +
                  "?pb=!1m18!1m12!1m3!1d2432.7694740006573!2d-1.9251183869338957!3d52.42897454284733!2m3!" +
                  "1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4870be81a2bc5f9d%3A0xba271076200390a4!2s" +
                  "Stirchley%20Community%20Church!5e0!3m2!1sen!2suk!4v1758885742206!5m2!1sen!2suk"}
                width="100%"
                height="500"
                style={{border: 0}}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
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
