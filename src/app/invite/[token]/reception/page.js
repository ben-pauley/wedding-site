import React from "react"
import {fetchGuestByToken} from "@/lib/airtable"
import {getAccessLevel} from "@/lib/utils"
import InfoCard from "@/components/InfoCard"
import InvalidInvite from "@/components/InvalidInvite"
import Image from "next/image";

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

        <InfoCard title="Location">
          <div>
            Redhouse Barn <br/>
            Shaw Ln, Stoke Prior <br/>
            Bromsgrove, Worcestershire <br/>
            B60 4BG <br/>
          </div>

          <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-neutral-700">
            <Image
              src="/images/rhb.jpg"
              alt="Redhouse Barn"
              width={800}
              height={500}
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-neutral-700">
            <iframe
              src={"https://www.google.com/maps/embed" +
                "?pb=!1m18!1m12!1m3!1d2440.449219780991!2d-2.0924216869387915!3d52.289700553136726!2m3!1f0" +
                "!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4870ec6629e2e50d%3A0xc37e1f33602c1a98!2s" +
                "Redhouse%20Barn!5e0!3m2!1sen!2suk!4v1758891287542!5m2!1sen!2suk"}
              width="100%"
              height="500"
              style={{border: 0}}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </InfoCard>

        <InfoCard title="Schedule">
          <ul className="list-disc list-inside space-y-1">
            <li>14:00 – Guests arrive, welcome drinks</li>
            <li>16:00 – Wedding breakfast begins</li>
            <li>18:00 – Evening guests begin to arrive</li>
          </ul>
        </InfoCard>

        <InfoCard title="Parking">
          There is plenty of parking available at Redhouse Barn.
          Please follow signage and the directions of venue staff on arrival.
        </InfoCard>

        <InfoCard title="Accommodation">
          <p className="mb-4">
            Please refer to the Redhouse Barn official website for nearby accommodation,
            where you will find plenty of hotels and other options for a comfortable stay:
          </p>
          <a
            href="https://www.redhousebarn.co.uk/accommodation/guest-accommodation"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-2xl px-6 py-3 bg-black text-white hover:opacity-90
               transition dark:bg-white dark:text-black"
          >
            Accommodation →
          </a>
        </InfoCard>


        <InfoCard title="Other Information">
          <p className="text-gray-700 dark:text-gray-300">
            Dress code: formal.
          </p>
        </InfoCard>

      </div>
    </main>
  )
}
