"use client"

import {useState} from "react"
import EntryForm from "@/components/EntryForm"

export default function Home() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [picked, setPicked] = useState(null)

  return (
    <main className="flex-1 bg-white text-gray-800 dark:bg-neutral-900 dark:text-neutral-100 transition-colors">
      {/* Content wrapper grows to fill available space */}
      <div className="mx-auto max-w-3xl px-6 pt-16 pb-8 w-full">
        {/* Header */}
        <header className="text-center space-y-3">
          flower design from save-the-dates? // TODO
          copy fonts from save-the-dates? // TODO
          <p className="uppercase tracking-widest text-sm text-gray-500 dark:text-gray-400">
            We’re getting married

            image of me and Praise goes here // TODO
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
            <EntryForm
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
      </div>
    </main>
  )
}
