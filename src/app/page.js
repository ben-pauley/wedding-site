"use client"
import {useEffect, useState} from "react"
import {useRouter} from "next/navigation"

function normalize(s = "") {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/\s+/g, " ")
    .trim()
}

export default function Home() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [picked, setPicked] = useState(null)
  const [error, setError] = useState("")

  const router = useRouter()

  useEffect(() => {
    const handle = setTimeout(async () => {
      if (!name.trim() || name.trim().length < 2) {
        setSuggestions([])
        setPicked(null)
        return
      }
      const res = await fetch(`/api/lookup?q=${encodeURIComponent(name)}`)
      const data = await res.json()
      const list = data.suggestions || []
      setSuggestions(list)

      // if they typed an exact match, auto-pick it (normalized)
      const exact = list.find(s => normalize(s.fullName) === normalize(name))
      setPicked(exact || null)
    }, 250)
    return () => clearTimeout(handle)
  }, [name])

  const nameOk = !!picked && normalize(picked.fullName) === normalize(name)
  // For now, we only require a non-empty email on the client.
  // We'll enforce "email on file must match" in /api/verify.
  const canContinue = nameOk && !!email.trim()

  return (
    <main className="min-h-screen bg-white text-gray-800">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <header className="text-center space-y-3">
          <p className="uppercase tracking-widest text-sm text-gray-500">
            We’re getting married
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold">Praise & Ben</h1>
          <p className="text-gray-600">
            Saturday, 27 June 2026 · Birmingham/Bromsgrove
          </p>
        </header>

        {!open && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setOpen(true)}
              className="rounded-2xl px-6 py-3 bg-black text-white hover:opacity-90 transition"
            >
              Enter →
            </button>
          </div>
        )}

        {open && (
          <section className="mt-12 mx-auto max-w-xl">
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                setError("")

                if (!picked || !email.trim()) {
                  setError("Please select your name and enter your email.")
                  return
                }

                try {
                  const res = await fetch("/api/verify", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({name, email}),
                  })
                  const data = await res.json()

                  if (!res.ok || !data.ok) {
                    if (data.error === "name_not_found") {
                      setError("We couldn't find that name. Please pick from the suggestions.")
                    } else if (data.error === "email_mismatch") {
                      setError("That email doesn't match what we have on file for this name.")
                    } else {
                      setError("Please check your details and try again.")
                    }
                    return
                  }

                  if (!data.token) {
                    alert("Verified, but no token set for this guest yet.")
                    return
                  }

                  router.push(`/invite/${data.token}`)
                } catch (err) {
                  setError("Something went wrong. Please try again.")
                }
              }}
              className="rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6"
            >
              <h2 className="text-xl font-semibold">Welcome</h2>
              <p className="text-gray-600">
                Please enter your full name and email to continue.
              </p>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    setError("")
                  }}
                  placeholder="Start typing your full name"
                  className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                />
                {suggestions.length > 0 && (
                  <ul className="mt-2 divide-y rounded-xl border border-gray-200">
                    {suggestions.map((s) => (
                      <li
                        key={s.id}
                        className={`p-3 hover:bg-gray-50 cursor-pointer ${
                          picked &&
                          normalize(picked.fullName) === normalize(s.fullName)
                            ? "bg-gray-50"
                            : ""
                        }`}
                        onClick={() => {
                          setName(s.fullName)
                          setPicked(s)
                          setSuggestions([])
                          setError("")
                        }}
                      >
                        <div className="font-medium">{s.fullName}</div>
                        <div className="text-sm text-gray-500">
                          {s.hasEmail ? "• email on file" : "• no email on file"}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {!picked && name.trim().length >= 2 && (
                  <p className="mt-2 text-xs text-amber-700">
                    Please pick your name from the list above to continue.
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError("")
                  }}
                  placeholder="you@example.com"
                  className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                />
                {picked && picked.hasEmail && (
                  <p className="mt-2 text-xs text-gray-500">
                    We have an email on file for this name. Please enter that
                    same email to continue (we’ll verify on the next step).
                  </p>
                )}
                {picked && !picked.hasEmail && (
                  <p className="mt-2 text-xs text-gray-500">
                    No email on file — any valid email is fine.
                  </p>
                )}
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={!canContinue}
                className="w-full rounded-2xl px-6 py-3 bg-black text-white hover:opacity-90 disabled:opacity-60"
              >
                Continue
              </button>
            </form>
          </section>
        )}

        <footer className="mt-16 text-center text-sm text-gray-500">
          Built with ❤️
          <br/>
          by Ben & Praise
        </footer>
      </div>
    </main>
  )
}
