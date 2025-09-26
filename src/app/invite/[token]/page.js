import React from "react"
import {fetchGuestByToken} from "@/lib/airtable"
import {getAccessLevel} from "@/lib/utils"
import InfoCard from "@/components/InfoCard"
import InvalidInvite from "@/components/InvalidInvite"
import WarningCard from "@/components/WarningCard"

export const dynamic = "force-dynamic"

export default async function InvitePage({params}) {
  const {token} = await params

  const guest = await fetchGuestByToken(token)

  if (!guest) {
    return <InvalidInvite/>
  }

  const firstName = guest.fullName.split(" ")[0]

  const access = getAccessLevel(guest.priority)

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

        <InfoCard
          collapsible={false}
          moreLabel="More details"
          morePath={'/ceremony'}
          showMoreButton={true}
          title="Ceremony 💒"
          token={token}
        >
          11:30 - Stirchley Community Church
        </InfoCard>

        {access === "full"
          ? (
            <InfoCard
              collapsible={false}
              moreLabel="More details"
              morePath={'/reception'}
              showMoreButton={true}
              title="Wedding Reception 🥂"
              token={token}
            >
              14:00 - Redhouse Barn
            </InfoCard>
          )
          : <>
            <InfoCard
              collapsible={false}
              moreLabel="More details"
              morePath={'/evening'}
              showMoreButton={true}
              title="Evening Celebration 🎉"
              token={token}
            >
              18:00 - Redhouse Barn
            </InfoCard>
          </>
        }

        <InfoCard
          collapsible={false}
          moreLabel="More details"
          morePath={'/rsvp'}
          showMoreButton={true}
          title="RSVP Here 📨"
          token={token}
        >
          Please let us know if you&#39;re coming!
        </InfoCard>

        {access === "full"
          ? (
            <InfoCard
              collapsible={false}
              moreLabel="More details"
              morePath={'/meal'}
              showMoreButton={true}
              title="Meal Selection 🍽️"
              token={token}
            >
              Meal picker coming soon! You’ll be able to pick your meal here.
              Put this behind some sort of feature toggle for now? // TODO
            </InfoCard>
          )
          : (
            <WarningCard title="Heads up">
              Your invite is for the ceremony and evening celebrations. If this looks
              wrong, please contact the couple.
            </WarningCard>
          )
        }

        amazon wishlist or place to send money // TODO
        link to download photo dump app? // TODO
      </div>
    </main>
  )
}
