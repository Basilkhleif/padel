export const metadata = { title: 'Padel DXB' }

import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <div className="mx-auto max-w-3xl p-4">
          <header className="py-6">
            <h1 className="text-3xl font-semibold">Padel DXB</h1>
            <p className="text-sm text-gray-500">Create a game. Share. Get RSVPs.</p>
          </header>
          {children}
          <footer className="py-12 text-center text-xs text-gray-400">Built for friends 🎾</footer>
        </div>
      </body>
    </html>
  )
}
