"use client"

import {useState, useEffect, useRef} from "react"

export default function RSVPGuestForm({guest, isLoggedInGuest, onChange}) {
  const [ceremony, setCeremony] = useState(guest.responses?.ceremony || null)
  const [reception, setReception] = useState(guest.responses?.reception || null)
  const [evening, setEvening] = useState(guest.responses?.evening || null)

  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    onChangeRef.current({ceremony, reception, evening})
  }, [ceremony, reception, evening])

  return (
    <div className="rounded-xl border border-gray-200 dark:border-neutral-700 p-4 space-y-6">
      <h2 className="text-lg font-medium">{guest.fullName}</h2>

      {/* Ceremony */}
      <div>
        <p className="mb-2 font-medium">Ceremony 💒</p>
        <div className="flex gap-6">
          {["yes", "no"].map(val => (
            <label key={val} className="flex items-center gap-2">
              <input
                type="radio"
                name={`ceremony-${guest.id}`}
                value={val}
                checked={ceremony === val}
                onChange={() => setCeremony(val)}
                className="accent-pink-500"
              />
              <span>{val === "yes" ? "Attending" : "Not attending"}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Reception (full only) */}
      {guest.access === "full" && (
        <div>
          <p className="mb-2 font-medium">Reception 🥂</p>
          <div className="flex gap-6">
            {["yes", "no"].map(val => (
              <label key={val} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`reception-${guest.id}`}
                  value={val}
                  checked={reception === val}
                  onChange={() => setReception(val)}
                  className="accent-pink-500"
                />
                <span>{val === "yes" ? "Attending" : "Not attending"}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Evening */}
      <div>
        <p className="mb-2 font-medium">Evening Celebration 🎉</p>
        <div className="flex gap-6">
          {["yes", "no"].map(val => (
            <label key={val} className="flex items-center gap-2">
              <input
                type="radio"
                name={`evening-${guest.id}`}
                value={val}
                checked={evening === val}
                onChange={() => setEvening(val)}
                className="accent-pink-500"
              />
              <span>{val === "yes" ? "Attending" : "Not attending"}</span>
            </label>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        Please answer all questions for {!isLoggedInGuest ? guest.fullName : "yourself"}.
      </p>
    </div>
  )
}
