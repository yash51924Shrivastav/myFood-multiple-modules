const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export async function getCategories() {
  const res = await fetch(`${API_URL}/api/categories`)
  return res.json()
}

export async function getDishes(category) {
  const url = new URL(`${API_URL}/api/dishes`)
  if (category) url.searchParams.set('category', category)
  const res = await fetch(url)
  return res.json()
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
  const res = await fetch(`${API_URL}/api/restaurants`)
  return res.json()
}

export async function getRestaurantDishes(restaurantId, category) {
  const url = new URL(`${API_URL}/api/restaurants/${restaurantId}/dishes`)
  if (category) url.searchParams.set('category', category)
  const res = await fetch(url)
  return res.json()
}
