export async function createReservation(payload) {
  await new Promise(r => setTimeout(r, 600))
  const list = JSON.parse(localStorage.getItem('reservations') || '[]')
  const id = Math.random().toString(36).slice(2)
  const entry = { id, ...payload, createdAt: new Date().toISOString() }
  localStorage.setItem('reservations', JSON.stringify([entry, ...list]))
  return { ok: true, data: entry }
}
