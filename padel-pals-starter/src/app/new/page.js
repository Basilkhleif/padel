'use client'
import { useState } from 'react'
import { supabase } from '@/src/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function NewGame() {
  const r = useRouter()
  const [title, setTitle] = useState('Padel Night')
  const [venue, setVenue] = useState('')
  const [datetime, setDatetime] = useState('')
  const [playersNeeded, setPlayersNeeded] = useState(4)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase.from('games').insert({
      title,
      venue: venue || null,
      starts_at: new Date(datetime).toISOString(),
      players_needed: playersNeeded,
      notes,
    }).select('id').single()
    setLoading(false)
    if (!error && data) r.push(`/game/${data.id}`)
  }

  return (
    <main className="space-y-6">
      <h2 className="text-xl font-semibold">Create a game</h2>
      <form onSubmit={submit} className="space-y-4 rounded-2xl border bg-white p-4 shadow-sm">
        <div className="grid gap-2">
          <label className="text-sm">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-xl border p-2" required />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">Venue</label>
          <input value={venue} onChange={(e) => setVenue(e.target.value)} className="rounded-xl border p-2" placeholder="PadelX Dubai, Court 3" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">Date & time</label>
          <input type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} className="rounded-xl border p-2" required />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">Players needed</label>
          <input type="number" min={2} max={8} value={playersNeeded} onChange={(e) => setPlayersNeeded(parseInt(e.target.value || '0',10))} className="rounded-xl border p-2" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">Notes (optional)</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="rounded-xl border p-2" rows={3} placeholder="Balls provided, arrive 10 min early" />
        </div>
        <button disabled={loading} className="rounded-xl bg-black px-4 py-2 text-white">{loading ? 'Creating…' : 'Create game'}</button>
      </form>
    </main>
  )
}
