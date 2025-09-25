import {NextResponse} from "next/server"

const BASE = process.env.AIRTABLE_BASE_ID
const TABLE = encodeURIComponent(process.env.AIRTABLE_TABLE || "Guest List")
const TOKEN = process.env.AIRTABLE_TOKEN
// Optional toggle: set to "true" in .env.local if you want to save new emails
const UPDATE_MISSING_EMAIL = (process.env.AIRTABLE_UPDATE_MISSING_EMAIL || "false").toLowerCase() === "true"

// Adjust if your column names differ
const NAME_FIELD = "Guest"     // full name column
const EMAIL_FIELD = "Email"    // email column
const TOKEN_FIELD = "Token"    // invite token column

function normalize(s = "") {
  return s.toLowerCase().trim()
}

function maskEmail(e) {
  if (!e) return ""
  const [user, domain] = e.split("@")
  if (!user || !domain) return e
  return (user[0] || "") + "***@" + domain
}

export async function POST(req) {
  try {
    const {name, email} = await req.json()
    if (!name || !email) {
      return NextResponse.json({ok: false, error: "missing_fields"}, {status: 400})
    }

    // Case-insensitive match on the {Guest} field
    const formula = `LOWER({${NAME_FIELD}})='${normalize(name).replace(/'/g, "\\'")}'`
    const url =
      `https://api.airtable.com/v0/${BASE}/${TABLE}?filterByFormula=${encodeURIComponent(formula)}&pageSize=5`

    const res = await fetch(url, {
      headers: {Authorization: `Bearer ${TOKEN}`},
      cache: "no-store",
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ok: false, error: "airtable_error", details: text}, {status: res.status})
    }

    const data = await res.json()
    const record = (data.records || [])[0]
    if (!record) {
      return NextResponse.json({ok: false, error: "name_not_found"}, {status: 404})
    }

    const fields = record.fields || {}
    const emailOnFile = fields[EMAIL_FIELD] || null

    // If email exists in Airtable, require an exact (case-insensitive) match
    if (emailOnFile) {
      if (normalize(emailOnFile) !== normalize(email)) {
        return NextResponse.json(
          {ok: false, error: "email_mismatch", hint: maskEmail(emailOnFile)}, // optional masked hint
          {status: 401}
        )
      }
    } else if (UPDATE_MISSING_EMAIL) {
      // No email on file → optionally save the provided one
      const patchUrl = `https://api.airtable.com/v0/${BASE}/${TABLE}`
      const patchRes = await fetch(patchUrl, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          records: [{id: record.id, fields: {[EMAIL_FIELD]: email}}],
        }),
      })
      if (!patchRes.ok) {
        // Not fatal for UX you can choose to error instead
        // const text = await patchRes.text()
        // return NextResponse.json({ ok: false, error: "email_update_failed", details: text }, { status: 500 })
      }
    }

    const inviteToken = fields[TOKEN_FIELD] || null
    if (!inviteToken) {
      // You can decide to block here instead:
      // return NextResponse.json({ ok: false, error: "missing_token" }, { status: 500 })
      return NextResponse.json({ok: true, token: null, note: "No token set for this record yet."})
    }

    return NextResponse.json({ok: true, token: inviteToken})
  } catch (e) {
    return NextResponse.json({ok: false, error: "server_error", details: e.message}, {status: 500})
  }
}
