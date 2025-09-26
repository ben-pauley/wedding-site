import {NextResponse} from "next/server"

const BASE = process.env.AIRTABLE_BASE_ID
const TABLE = encodeURIComponent(process.env.AIRTABLE_TABLE || "Guest List")
const TOKEN = process.env.AIRTABLE_TOKEN

export async function GET() {
  if (!BASE || !TABLE || !TOKEN) {
    return NextResponse.json(
      {error: "Missing env vars (AIRTABLE_BASE_ID / AIRTABLE_TABLE / AIRTABLE_TOKEN)"},
      {status: 500}
    )
  }

  const url = `https://api.airtable.com/v0/${BASE}/${TABLE}?pageSize=100`

  try {
    let records = []
    let next = url

    // Simple pagination loop, just in case you have >100 rows
    while (next) {
      const res = await fetch(next, {
        headers: {Authorization: `Bearer ${TOKEN}`},
        cache: "no-store",
      })
      if (!res.ok) {
        const text = await res.text()
        return NextResponse.json({error: "Airtable error", details: text}, {status: res.status})
      }
      const data = await res.json()
      records = records.concat(data.records || [])
      next = data.offset ? `${url}&offset=${data.offset}` : null
    }

    // Return a trimmed view (don’t leak everything)
    const guests = records.map(r => ({
      id: r.id,
      fullName: r.fields["Guest"] || "",
      email: r.fields["Email"] || null,
      tokenPresent: !!r.fields["Token"], // just tells us if it's set
    }))

    return NextResponse.json({count: guests.length, guests})
  } catch (e) {
    return NextResponse.json({error: e.message}, {status: 500})
  }
}
