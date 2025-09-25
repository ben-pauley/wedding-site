"use client"

import {useState} from "react"
import ThemeToggle from "@/components/ThemeToggle"
import RSVPForm from "@/components/RSVPForm"

export default function Home() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [picked, setPicked] = useState(null)

  return (
    <main className="min-h-screen bg-white text-gray-800 dark:bg-neutral-900 dark:text-neutral-100 transition-colors">
      <div className="mx-auto max-w-3xl px-6 py-16">

        {/* Top bar */}
        <div className="flex justify-end mb-6">
          <ThemeToggle/>
        </div>

        {/* Header */}
        <header className="text-center space-y-3">
          <p className="uppercase tracking-widest text-sm text-gray-500 dark:text-gray-400">
            We’re getting married
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold">Praise & Ben</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Saturday, 27 June 2026 · Birmingham/Bromsgrove
          </p>
        </header>

        {/* Entry button */}
        {!open && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setOpen(true)}
              className="rounded-2xl px-6 py-3 bg-black text-white hover:opacity-90 transition dark:bg-white dark:text-black"
            >
              Enter →
            </button>
          </div>
        )}

        {/* RSVP form */}
        {open && (
          <section className="mt-12 mx-auto max-w-xl">
            <RSVPForm
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              suggestions={suggestions}
              setSuggestions={setSuggestions}
              picked={picked}
              setPicked={setPicked}
            />
          </section>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
          Built with ❤️ <br/> by Ben & Praise
        </footer>
      </div>
    </main>
  )
}
