import React from "react"
import {Geist, Geist_Mono} from "next/font/google"
import {ThemeProvider} from "@/components/ThemeProvider"
import TopBar from "@/components/TopBar"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata = {
  title: "The Wedding of Praise & Ben",
  description: "Praise & Ben's Wedding Information",
}

export default function RootLayout({children}) {
  return (
    <html lang="en" suppressHydrationWarning>
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col 
              bg-white text-gray-800 dark:bg-neutral-900 dark:text-neutral-100 transition-colors`}>
    <ThemeProvider>
      <TopBar/>
      <div className="flex-1 flex flex-col">{children}</div>
      <footer className="py-6 text-center text-sm
                         text-gray-500 dark:text-gray-400
                         bg-white dark:bg-neutral-900 transition-colors"
      >
        Please get in touch with Praise or Ben if you have any questions.
      </footer>
    </ThemeProvider>
    </body>
    </html>
  )
}
