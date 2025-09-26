import {NextResponse} from "next/server"

const BASE = process.env.AIRTABLE_BASE_ID
const TABLE = encodeURIComponent(process.env.AIRTABLE_TABLE || "Guest List")
const TOKEN = process.env.AIRTABLE_TOKEN

export async function POST(req) {
  try {
    const {responses, who} = await req.json()
    if (!responses || !Array.isArray(responses)) {
      return NextResponse.json({ok: false, error: "invalid_payload"}, {status: 400})
    }

    const patchUrl = `https://api.airtable.com/v0/${BASE}/${TABLE}`
    const updates = responses.map(g => ({
      id: g.id,
      fields: {
        "Meal choice": g.meal,
        "Dietary Restrictions": g.dietaryRestrictions || "None",
        "Who RSVPed": who,
      },
    }))

    const res = await fetch(patchUrl, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({records: updates}),
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ok: false, error: "airtable_error", details: text}, {status: res.status})
    }

    return NextResponse.json({ok: true})
  } catch (err) {
    return NextResponse.json({ok: false, error: "server_error", details: err.message}, {status: 500})
  }
}
