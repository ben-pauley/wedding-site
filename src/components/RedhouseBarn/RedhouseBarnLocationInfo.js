import React from "react"
import Image from "next/image"
import InfoCard from "@/components/InfoCard"

export default function RedhouseBarnLocationInfo() {
  return (
    <InfoCard title="Location">
      <div>
        Redhouse Barn <br/>
        Shaw Ln, Stoke Prior <br/>
        Bromsgrove, Worcestershire <br/>
        B60 4BG <br/>
      </div>

      <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-neutral-700">
        <Image
          src="/images/rhb.jpg"
          alt="Redhouse Barn"
          width={800}
          height={500}
          className="w-full h-auto object-cover"
        />
      </div>

      <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-neutral-700">
        <iframe
          src={"https://www.google.com/maps/embed" +
            "?pb=!1m18!1m12!1m3!1d2440.449219780991!2d-2.0924216869387915!3d52.289700553136726!2m3!1f0" +
            "!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4870ec6629e2e50d%3A0xc37e1f33602c1a98!2s" +
            "Redhouse%20Barn!5e0!3m2!1sen!2suk!4v1758891287542!5m2!1sen!2suk"}
          width="100%"
          height="500"
          style={{border: 0}}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </InfoCard>
  )
}
