import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getRestaurants } from '../../shared/api/client'

export default function Restaurants() {
  const [rests, setRests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRestaurants().then(r => { setRests(r.restaurants || []); setLoading(false) })
  }, [])

  if (loading) return <div>Loading restaurants…</div>

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Explore Restaurants</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rests.map(r => (
          <Link key={r.id} to={`/restaurants/${r.id}`} className="card overflow-hidden">
            <img src={r.cover || 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1200&auto=format&fit=crop'} alt={r.name} className="h-40 w-full object-cover" loading="lazy" />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{r.name}</h3>
              <p className="text-sm text-gray-600">Curated flavors and quick delivery</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
