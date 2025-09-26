import {NextResponse} from "next/server"

const BASE = process.env.AIRTABLE_BASE_ID
const TABLE = encodeURIComponent(process.env.AIRTABLE_TABLE || "Guest List")
const TOKEN = process.env.AIRTABLE_TOKEN

// Field names in your Airtable
const RSVP_FIELDS = {
  ceremony: "RSVP Ceremony",
  reception: "RSVP Reception",
  evening: "RSVP Evening",
  who: "Who RSVPed",
}

export async function POST(req) {
  try {
    const {responses, who} = await req.json()
    if (!responses || !Array.isArray(responses)) {
      return NextResponse.json({ok: false, error: "invalid_payload"}, {status: 400})
    }

    // Map responses to Airtable record updates
    const records = responses.map(g => {
      const fields = {}

      if (g.ceremony) fields[RSVP_FIELDS.ceremony] = g.ceremony === "yes" ? "Yes" : "No"
      if (g.reception) fields[RSVP_FIELDS.reception] = g.reception === "yes" ? "Yes" : "No"
      if (g.evening) fields[RSVP_FIELDS.evening] = g.evening === "yes" ? "Yes" : "No"

      // Always update Who RSVPed with the logged-in guest’s full name
      fields[RSVP_FIELDS.who] = who

      return {
        id: g.id,
        fields,
      }
    })

    const res = await fetch(`https://api.airtable.com/v0/${BASE}/${TABLE}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({records}),
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ok: false, error: "airtable_error", details: text}, {status: res.status})
    }

    return NextResponse.json({ok: true})
  } catch (e) {
    return NextResponse.json({ok: false, error: e.message}, {status: 500})
  }
}
