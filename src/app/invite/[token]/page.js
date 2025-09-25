// Server component: runs only on the server, keeps your Airtable token safe
import React from "react"

const BASE   = process.env.AIRTABLE_BASE_ID
const TABLE  = encodeURIComponent(process.env.AIRTABLE_TABLE || "Guest List")
const TOKEN  = process.env.AIRTABLE_TOKEN

// Optional: ensure this page is dynamic (no cache)
export const dynamic = "force-dynamic"

function accessFromPriority(priority) {
  // Anything that isn't an explicit "Definitely" falls back to limited access.
  return String(priority || "").toLowerCase() === "definitely" ? "full" : "limited"
}

async function fetchGuestByToken(token) {
  if (!BASE || !TABLE || !TOKEN) {
    throw new Error("Missing env vars: AIRTABLE_BASE_ID / AIRTABLE_TABLE / AIRTABLE_TOKEN")
  }

  // Airtable: filter by {Token} = 'token'
  const formula = encodeURIComponent(`{Token} = '${token}'`)
  const url = `https://api.airtable.com/v0/${BASE}/${TABLE}?maxRecords=1&filterByFormula=${formula}`

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}` },
    // Don't cache so changes in Airtable show up immediately
    cache: "no-store",
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Airtable error: ${res.status} – ${text}`)
  }

  const data = await res.json()
  const record = (data.records || [])[0]
  if (!record) return null

  const fields = record.fields || {}
  return {
    id: record.id,
    fullName: fields["Guest"] || "Guest",
    priority: fields["Priority"] || null, // "Definitely" | "Maybe" | null
  }
}

export default async function InvitePage({ params }) {
  const { token } = params

  // 1) Look up the guest
  const guest = await fetchGuestByToken(token)

  if (!guest) {
    return (
      <main className="min-h-screen bg-white text-gray-800 dark:bg-neutral-900 dark:text-neutral-100 flex items-center justify-center px-6">
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

  const access = accessFromPriority(guest.priority) // "full" | "limited"

  return (
    <main className="min-h-screen bg-white text-gray-800 dark:bg-neutral-900 dark:text-neutral-100">
      <div className="mx-auto max-w-3xl px-6 py-12 space-y-10">
        <header className="space-y-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">Welcome</p>
          <h1 className="text-3xl md:text-4xl font-semibold">
            Hello, {guest.fullName.split(" ")[0]}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Access level:{" "}
            <span className="font-medium">
              {access === "full" ? "Full day" : "Ceremony & Evening only"}
            </span>
            {guest.priority ? ` · Priority: ${guest.priority}` : ""}
          </p>
        </header>

        {/* Always visible: Ceremony & Evening */}
        <section className="rounded-2xl border border-gray-200 dark:border-neutral-700 p-6 bg-white dark:bg-neutral-950">
          <h2 className="text-xl font-semibold mb-3">Ceremony</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Time, location, and details go here.
          </p>
        </section>

        <section className="rounded-2xl border border-gray-200 dark:border-neutral-700 p-6 bg-white dark:bg-neutral-950">
          <h2 className="text-xl font-semibold mb-3">Evening Celebration</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Time, location, dress code, parking, etc.
          </p>
        </section>

        {/* Full-day extras only for "Definitely" */}
        {access === "full" ? (
          <>
            <section className="rounded-2xl border border-gray-200 dark:border-neutral-700 p-6 bg-white dark:bg-neutral-950">
              <h2 className="text-xl font-semibold mb-3">Wedding Breakfast</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Reception details for the full-day guests.
              </p>
            </section>

            <section className="rounded-2xl border border-gray-200 dark:border-neutral-700 p-6 bg-white dark:bg-neutral-950">
              <h2 className="text-xl font-semibold mb-4">Meal Selection</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You’ll be able to pick your meal here.
              </p>
              {/* Placeholder – we’ll build the picker next */}
              <div className="rounded-xl border border-dashed border-gray-300 dark:border-neutral-700 p-4 text-gray-600 dark:text-gray-400">
                Meal picker coming soon 🍽️
              </div>
            </section>
          </>
        ) : (
          <section className="rounded-2xl border border-amber-300/70 bg-amber-50 dark:border-amber-400/40 dark:bg-amber-950/20 p-6">
            <h2 className="text-lg font-semibold mb-2">Heads up</h2>
            <p className="text-amber-800 dark:text-amber-200">
              Your invite is for the ceremony and evening celebrations. If this looks
              wrong, please contact the couple.
            </p>
          </section>
        )}
      </div>
    </main>
  )
}
