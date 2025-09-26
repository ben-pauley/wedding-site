import React from "react"
import InfoCard from "@/components/InfoCard"

export default function RedhouseBarnAccommodationInfo() {
  return (
    <InfoCard title="Accommodation">
      <p className="mb-4">
        Please refer to the Redhouse Barn official website for nearby accommodation,
        where you will find plenty of hotels and other options for a comfortable stay:
      </p>
      <a
        href="https://www.redhousebarn.co.uk/accommodation/guest-accommodation"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block rounded-2xl px-6 py-3 bg-black text-white hover:opacity-90
               transition dark:bg-white dark:text-black"
      >
        Accommodation →
      </a>
    </InfoCard>
  )
}
