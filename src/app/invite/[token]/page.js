import React from "react"
import {fetchGuestByToken} from "@/lib/airtable"
import InfoCard from "@/components/InfoCard";
import WarningCard from "@/components/WarningCard";

export const dynamic = "force-dynamic"

function accessFromPriority(priority) {
  return String(priority || "").toLowerCase() === "definitely" ? "full" : "limited"
}

export default async function InvitePage({params}) {
  const {token} = params

  const guest = await fetchGuestByToken(token)

  if (!guest) {
    return (
      <main
        className={"min-h-screen bg-white text-gray-800 dark:bg-neutral-900 dark:text-neutral-100 " +
          "flex items-center justify-center px-6"}
      >
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold mb-2">Invalid or expired link</h1>
          <p className="text-gray-600 dark:text-gray-400">
            We couldn’t find an invite for this link. Please double-check your URL
            or contact the couple to request a new one.
          </p>
        </div>
      </main>
    )
  }

  const access = accessFromPriority(guest.priority)

  const firstName = guest.fullName.split(" ")[0]

  return (
    <main className="flex-1 bg-white text-gray-800 dark:bg-neutral-900 dark:text-neutral-100">
      <div className="mx-auto max-w-3xl px-6 py-12 space-y-10">
        <header className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-semibold">
            Hello, {firstName}! You are invited to Praise & Ben&#39;s wedding.
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Saturday, 27 June 2026 · Birmingham/Bromsgrove
          </p>
        </header>

        <InfoCard title="Ceremony 💒">
          11:30 - Stirchley Community Church, Hazelwell St, Stirchley, Birmingham, B30 2JX
        </InfoCard>

        {access === "full"
          ? <>
            <InfoCard title="Wedding Reception 🥂">
              14:00 - Redhouse Barn, Shaw Ln, Stoke Prior, Bromsgrove, Worcestershire, B60 4BG
            </InfoCard>

            <InfoCard title="Meal Selection 🍽️">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You’ll be able to pick your meal here.
              </p>
              <div
                className={"rounded-xl border border-dashed border-gray-300 " +
                  "dark:border-neutral-700 p-4 text-gray-600 dark:text-gray-400"}
              >
                Meal picker coming soon!
              </div>
            </InfoCard>
          </>
          : <>
            <InfoCard title="Evening Celebration">
              18:00 - Redhouse Barn, Shaw Ln, Stoke Prior, Bromsgrove, Worcestershire, B60 4BG
            </InfoCard>

            <WarningCard title="Heads up">
              Your invite is for the ceremony and evening celebrations. If this looks
              wrong, please contact the couple.
            </WarningCard>
          </>
        }
      </div>
    </main>
  )
}
