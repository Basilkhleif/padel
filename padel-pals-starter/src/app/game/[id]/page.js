'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/src/lib/supabaseClient'
import dayjs from 'dayjs'
import { useParams } from 'next/navigation'

export default function GameDetail() {
  const { id } = useParams()
  const [game, setGame] = useState(null)
  const [rsvps, setRsvps] = useState([])
  const [name, setName] = useState('')
  const [status, setStatus] = useState('yes')
  const [error, setError] = useState('')

  const load = async () => {
    const { data: g } = await supabase.from('games').select('*').eq('id', id).single()
    setGame(g)
    const { data: r } = await supabase.from('rsvps').select('*').eq('game_id', id).order('created_at', { ascending: true })
    setRsvps(r || [])
  }

  useEffect(() => {
    load()
    const ch = supabase.channel('rsvps')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rsvps', filter: `game_id=eq.${id}` }, () => load())
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [id])

  const addRsvp = async (e) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) return
    // prevent duplicate by name client-side; server still has unique constraint
    if (rsvps.some(r => r.display_name.toLowerCase() === name.trim().toLowerCase())) {
      setError('That name is already on the list for this game.')
      return
    }
    const { error } = await supabase.from('rsvps').insert({ game_id: id, display_name: name.trim(), status })
    if (error) setError(error.message)
    setName('')
    setStatus('yes')
    load()
  }

  const shareText = game ? `Padel game: ${game.title} at ${game.venue || 'TBA'} on ${dayjs(game.starts_at).format('ddd D MMM, h:mm A')} — join here: ${typeof window !== 'undefined' ? window.location.href : ''}` : ''

  return (
    <main className="space-y-6">
      {game && (
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <h2 className="text-xl font-semibold">{game.title}</h2>
          <div className="text-sm text-gray-500">{dayjs(game.starts_at).format('dddd, D MMM YYYY • h:mm A')}</div>
          {game.venue && <div className="text-sm text-gray-500">{game.venue}</div>}
          {game.notes && <p className="mt-2 text-sm">{game.notes}</p>}
          <div className="mt-4 flex gap-2">
            <a className="rounded-xl border px-3 py-2" href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} target="_blank">Share on WhatsApp</a>
            <button className="rounded-xl border px-3 py-2" onClick={() => navigator.clipboard.writeText(shareText)}>Copy invite</button>
          </div>
        </div>
      )}

      <section className="rounded-2xl border bg-white p-4 shadow-sm">
        <h3 className="mb-2 text-lg font-medium">RSVPs</h3>
        <ul className="space-y-1">
          {rsvps.map(r => (
            <li key={r.id} className="flex items-center justify-between">
              <span>{r.display_name}</span>
              <span className="text-sm capitalize text-gray-500">{r.status}</span>
            </li>
          ))}
          {rsvps.length === 0 && <li className="text-gray-500">No RSVPs yet.</li>}
        </ul>

        <form onSubmit={addRsvp} className="mt-4 grid gap-2 sm:grid-cols-3">
          <input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl border p-2" />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border p-2">
            <option value="yes">Yes</option>
            <option value="maybe">Maybe</option>
            <option value="no">No</option>
          </select>
          <button className="rounded-xl bg-black px-4 py-2 text-white">RSVP</button>
        </form>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </section>
    </main>
  )
}
