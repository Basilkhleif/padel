'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/src/lib/supabaseClient'
import dayjs from 'dayjs'
import Link from 'next/link'
import clsx from 'clsx'

export default function Home() {
  const [games, setGames] = useState([])
  const [counts, setCounts] = useState({})

  const load = async () => {
    const { data: g } = await supabase
      .from('games')
      .select('*')
      .gte('starts_at', dayjs().startOf('day').toISOString())
      .order('starts_at', { ascending: true })
    setGames(g || [])
    const ids = (g || []).map(x => x.id)
    if (ids.length) {
      const { data: c } = await supabase
        .from('game_rsvp_counts')
        .select('*')
        .in('game_id', ids)
      const map = {}
      ;(c || []).forEach(row => { map[row.game_id] = row })
      setCounts(map)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Upcoming games</h2>
        <Link href="/new" className="rounded-xl bg-black px-4 py-2 text-white">Create game</Link>
      </div>

      <div className="space-y-3">
        {games.length === 0 && <p className="text-gray-500">No games yet. Create one!</p>}
        {games.map(g => {
          const c = counts[g.id] || {}
          const yes = c.yes_count || 0
          const remaining = Math.max((g.players_needed || 0) - yes, 0)
          return (
            <Link key={g.id} href={`/game/${g.id}`} className={clsx('block rounded-2xl border bg-white p-4 shadow-sm', g.is_cancelled && 'opacity-50')}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-medium">{g.title}</div>
                  <div className="text-sm text-gray-500">{dayjs(g.starts_at).format('ddd, D MMM YYYY • h:mm A')}</div>
                  {g.venue && <div className="text-sm text-gray-500">{g.venue}</div>}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-semibold">{remaining}</div>
                  <div className="text-xs text-gray-500">slots left</div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
