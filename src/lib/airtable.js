import {getAccessLevel} from "@/lib/utils"

const BASE = process.env.AIRTABLE_BASE_ID
const TABLE = encodeURIComponent(process.env.AIRTABLE_TABLE || "Guest List")
const TOKEN = process.env.AIRTABLE_TOKEN

function normalizeGuest(record) {
  const fields = record.fields || {}

  return {
    id: record.id,
    fullName: fields["Guest"] || "Guest",
    priority: fields["Priority"] || null,
    access: fields["Priority"] ? getAccessLevel(fields["Priority"]) : "limited",
    responses: {
      ceremony: fields["RSVP Ceremony"] === "Yes"
        ? "yes"
        : fields["RSVP Ceremony"] === "No"
          ? "no"
          : null,
      reception: fields["RSVP Reception"] === "Yes"
        ? "yes"
        : fields["RSVP Reception"] === "No"
          ? "no"
          : null,
      evening: fields["RSVP Evening"] === "Yes"
        ? "yes"
        : fields["RSVP Evening"] === "No"
          ? "no"
          : null,
    },
    meal: fields["Meal choice"] || null,
    dietaryChoice: !fields["Dietary Restrictions"]
      ? null
      : fields["Dietary Restrictions"] === "No"
        ? "no"
        : "yes",
    dietaryText: fields["Dietary Restrictions"] && fields["Dietary Restrictions"] !== "No"
      ? fields["Dietary Restrictions"]
      : "",
  }
}

export async function fetchGuestByToken(token) {
  const formula = encodeURIComponent(`{Token} = '${token}'`)
  const url = `https://api.airtable.com/v0/${BASE}/${TABLE}?maxRecords=1&filterByFormula=${formula}`

  const res = await fetch(url, {
    headers: {Authorization: `Bearer ${TOKEN}`},
    cache: "no-store",
  })

  if (!res.ok) throw new Error(`Airtable error: ${res.status}`)

  const data = await res.json()
  const record = (data.records || [])[0]
  return record ? normalizeGuest(record) : null
}

export async function fetchGuestById(id) {
  const url = `https://api.airtable.com/v0/${BASE}/${TABLE}/${id}`

  const res = await fetch(url, {
    headers: {Authorization: `Bearer ${TOKEN}`},
    cache: "no-store",
  })

  if (!res.ok) throw new Error(`Airtable error: ${res.status}`)

  const record = await res.json()
  return normalizeGuest(record)
}

export async function fetchGuestsByWhoRSVPed(fullName) {
  const formula = encodeURIComponent(`{Who RSVPed} = '${fullName}'`)
  const url = `https://api.airtable.com/v0/${BASE}/${TABLE}?filterByFormula=${formula}`

  const res = await fetch(url, {
    headers: {Authorization: `Bearer ${TOKEN}`},
    cache: "no-store",
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Airtable error: ${res.status} – ${text}`)
  }

  const data = await res.json()
  return (data.records || []).map(normalizeGuest)
}
