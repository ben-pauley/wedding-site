import {NextResponse} from "next/server"
import {normalize} from "@/lib/utils"

const BASE = process.env.AIRTABLE_BASE_ID
const TABLE = encodeURIComponent(process.env.AIRTABLE_TABLE || "Guest List")
const TOKEN = process.env.AIRTABLE_TOKEN

function lev(a, b) {
  const m = a.length, n = b.length
  const d = Array.from({length: m + 1}, () => Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) d[i][0] = i
  for (let j = 0; j <= n; j++) d[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + cost
      )
    }
  }
  return d[m][n]
}

function similarity(a, b) {
  const distance = lev(a, b)
  const maxLen = Math.max(a.length, b.length)
  return maxLen === 0 ? 0 : 1 - distance / maxLen
}

function maxDistance(len) {
  if (len <= 4) return 1
  if (len <= 7) return 3
  if (len <= 12) return 4
  return 5
}

export async function GET(req) {
  const q = new URL(req.url).searchParams.get("q") || ""
  const nq = normalize(q)
  if (nq.length < 2) return NextResponse.json({suggestions: []})

  try {
    const all = []
    let offset = null
    for (let i = 0; i < 3; i++) {
      const params = new URLSearchParams({pageSize: "100"})
      if (offset) params.set("offset", offset)

      const res = await fetch(
        `https://api.airtable.com/v0/${BASE}/${TABLE}?${params.toString()}`,
        {headers: {Authorization: `Bearer ${TOKEN}`}, cache: "no-store"}
      )
      if (!res.ok) {
        const text = await res.text()
        return NextResponse.json({error: "Airtable error", details: text}, {status: res.status})
      }

      const data = await res.json()
      all.push(...(data.records || []))
      if (!data.offset) break
      offset = data.offset
    }

    const candidates = all
      .map(r => ({
        id: r.id,
        fullName: r.fields["Guest"] || "",
        hasEmail: !!r.fields["Email"],
      }))
      .filter(c => c.fullName)

    const threshold = maxDistance(nq.length)

    const scored = candidates
      .map(c => {
        const normName = normalize(c.fullName)
        const rawDist = lev(nq, normName)

        // similarity check per word (good for "priise" vs "praise")
        const wordSims = normName.split(" ").map(w => similarity(nq, w))
        const bestWordSim = Math.max(...wordSims)

        let score = rawDist
        if (normName === nq) score -= 5
        else if (normName.startsWith(nq)) score -= 3
        else if (normName.includes(nq)) score -= 1

        return {c, score, rawDist, bestWordSim, normName}
      })
      .filter(x => {
        const {normName, rawDist, bestWordSim} = x

        // ✅ Always keep strong literal matches
        if (normName === nq || normName.startsWith(nq) || normName.includes(nq)) {
          return true
        }

        // ✅ Otherwise, allow fuzzy matches if:
        //   - edit distance is reasonable, OR
        //   - word similarity is moderate
        return rawDist <= threshold || bestWordSim >= 0.7
      })
      .sort((a, b) => a.score - b.score)
      .slice(0, 5)
      .map(x => x.c)

    return NextResponse.json({suggestions: scored})
  } catch (e) {
    return NextResponse.json({error: e.message}, {status: 500})
  }
}
