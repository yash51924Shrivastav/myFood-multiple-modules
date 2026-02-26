const API_URL = import.meta.env.VITE_API_URL || ''

function choosePrice(item) {
  if (typeof item.price === 'number') return item.price
  if (Array.isArray(item.prices) && item.prices.length) return Number(item.prices[0].price)
  return 0
}

function mapCategory(staticCatName, itemName) {
  const n = (staticCatName || '').toLowerCase()
  if (n.includes('starter')) return 'Starters'
  if (n.includes('dessert')) return 'Desserts'
  if (n.includes('shake') || n.includes('beverage')) return 'Smoothies'
  if (n.includes('punjabi three')) {
    if (/milk|lassi/i.test(itemName)) return 'Smoothies'
    return 'Main Course'
  }
  return 'Main Course'
}

function defaultImage(category) {
  const cat = (category || '').toLowerCase()
  if (cat.includes('starter')) return 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1200&auto=format&fit=crop'
  if (cat.includes('dessert')) return 'https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=1200&auto=format&fit=crop'
  if (cat.includes('smooth')) return 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?q=80&w=1200&auto=format&fit=crop'
  return 'https://images.unsplash.com/photo-1604908554061-1f6edc63559f?q=80&w=1200&auto=format&fit=crop'
}

async function loadStatic() {
  const mod = await import('../../data/menu_exotic.json')
  return mod.default
}

export async function getCategories() {
  try {
    const res = await fetch(`${API_URL}/api/categories`)
    if (!res.ok) throw new Error('bad status')
    return res.json()
  } catch {
    return { categories: ['Starters', 'Main Course', 'Desserts', 'Smoothies'] }
  }
}

export async function getDishes(category) {
  try {
    const url = new URL(`${API_URL}/api/dishes`, window.location.origin)
    if (category) url.searchParams.set('category', category)
    const res = await fetch(url)
    if (!res.ok) throw new Error('bad status')
    return res.json()
  } catch {
    const json = await loadStatic()
    const out = []
    let idx = 0
    for (const cat of json.categories) {
      for (const item of cat.items) {
        const c = mapCategory(cat.name, item.name)
        if (category && c !== category) continue
        const rid = `r${(idx % 5) + 1}`
        out.push({
          id: `${item.name}|${c}|${rid}`,
          name: item.name,
          price: choosePrice(item),
          category: c,
          img: item.img || defaultImage(c),
          restaurantId: rid
        })
        idx++
      }
    }
    return { dishes: out }
  }
}

export async function createDish(payload) {
  const res = await fetch(`${API_URL}/api/dishes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  return res.json()
}

export async function createReservation(payload) {
  const res = await fetch(`${API_URL}/api/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  return res.json()
}

export async function getReservations() {
  const res = await fetch(`${API_URL}/api/reservations`)
  return res.json()
}

export async function getRestaurants() {
  try {
    const res = await fetch(`${API_URL}/api/restaurants`)
    if (!res.ok) throw new Error('bad status')
    return res.json()
  } catch {
    return {
      restaurants: [
        { id: 'r1', name: 'Exotic Cuisines', cover: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1200&auto=format&fit=crop' },
        { id: 'r2', name: 'Spice Route', cover: 'https://images.unsplash.com/photo-1600891963938-a0498147305c?q=80&w=1200&auto=format&fit=crop' },
        { id: 'r3', name: 'Urban Bites', cover: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=1200&auto=format&fit=crop' },
        { id: 'r4', name: 'Coastal Cravings', cover: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop' },
        { id: 'r5', name: 'Veggie Vibes', cover: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop' }
      ]
    }
  }
}

export async function getRestaurantDishes(restaurantId, category) {
  try {
    const url = new URL(`${API_URL}/api/restaurants/${restaurantId}/dishes`, window.location.origin)
    if (category) url.searchParams.set('category', category)
    const res = await fetch(url)
    if (!res.ok) throw new Error('bad status')
    return res.json()
  } catch {
    const json = await loadStatic()
    const out = []
    let idx = 0
    for (const cat of json.categories) {
      for (const item of cat.items) {
        const c = mapCategory(cat.name, item.name)
        if (category && c !== category) continue
        const rid = `r${(idx % 5) + 1}`
        if (rid !== restaurantId) { idx++; continue }
        out.push({
          id: `${item.name}|${c}|${rid}`,
          name: item.name,
          price: choosePrice(item),
          category: c,
          img: item.img || defaultImage(c),
          restaurantId: rid
        })
        idx++
      }
    }
    return { dishes: out }
  }
}

export async function createPaymentOrder(amount) {
  try {
    const res = await fetch(`${API_URL}/api/pay/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    })
    if (!res.ok) throw new Error('bad status')
    return res.json()
  } catch {
    return { mock: true, amount: Math.round(Number(amount) * 100), currency: 'INR' }
  }
}

export async function verifyPayment(payload) {
  try {
    const res = await fetch(`${API_URL}/api/pay/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) throw new Error('bad status')
    return res.json()
  } catch {
    return { ok: true, mock: true }
  }
}
