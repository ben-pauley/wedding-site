"use client"

export default function MealGuestForm({guest, onChange}) {
  const {meal, dietaryChoice, dietaryText} = guest

  return (
    <div className="rounded-xl border border-gray-200 dark:border-neutral-700 p-4 space-y-6">
      <h2 className="text-lg font-medium">{guest.fullName}</h2>

      {/* Main course */}
      <div>
        <p className="mb-2 font-medium">Main Course</p>
        <div className="flex gap-6">
          {["chicken", "beef", "veggie"].map(opt => (
            <label key={opt} className="flex items-center gap-2">
              <input
                type="radio"
                name={`meal-${guest.id}`}
                value={opt}
                checked={meal === opt}
                onChange={() => onChange({meal: opt})}
                className="accent-pink-500"
              />
              <span className="capitalize">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Dietary restrictions */}
      <div>
        <p className="mb-2 font-medium">Dietary Restrictions / Allergies</p>
        <div className="flex gap-6 mb-2">
          {["yes", "no"].map(opt => (
            <label key={opt} className="flex items-center gap-2">
              <input
                type="radio"
                name={`dietary-${guest.id}`}
                value={opt}
                checked={dietaryChoice === opt}
                onChange={() => onChange({dietaryChoice: opt, dietaryText: opt === "no" ? "" : dietaryText})}
                className="accent-pink-500"
              />
              <span>{opt === "yes" ? "Yes" : "No"}</span>
            </label>
          ))}
        </div>
        {dietaryChoice === "yes" && (
          <textarea
            value={dietaryText}
            onChange={e => onChange({dietaryText: e.target.value})}
            placeholder="Please specify your restrictions"
            className="w-full rounded-lg border border-gray-300 dark:border-neutral-700 p-2
                       bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100"
          />
        )}
      </div>
    </div>
  )
}
