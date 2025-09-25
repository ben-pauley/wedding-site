const BASE = process.env.AIRTABLE_BASE_ID
const TABLE = encodeURIComponent(process.env.AIRTABLE_TABLE || "Guest List")
const TOKEN = process.env.AIRTABLE_TOKEN

export async function fetchGuestByToken(token) {
  if (!BASE || !TABLE || !TOKEN) {
    throw new Error("Missing env vars: AIRTABLE_BASE_ID / AIRTABLE_TABLE / AIRTABLE_TOKEN")
  }

  // Airtable: filter by {Token} = 'token'
  const formula = encodeURIComponent(`{Token} = '${token}'`)
  const url = `https://api.airtable.com/v0/${BASE}/${TABLE}?maxRecords=1&filterByFormula=${formula}`

  const res = await fetch(url, {
    headers: {Authorization: `Bearer ${TOKEN}`},
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
