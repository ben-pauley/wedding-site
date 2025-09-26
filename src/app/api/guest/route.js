import {NextResponse} from "next/server"
import {fetchGuestById} from "@/lib/airtable"

export async function GET(req) {
  const id = new URL(req.url).searchParams.get("id")
  if (!id) {
    return NextResponse.json({error: "missing_id"}, {status: 400})
  }

  try {
    const guest = await fetchGuestById(id)
    return NextResponse.json({guest})
  } catch (e) {
    return NextResponse.json({error: e.message}, {status: 500})
  }
}
