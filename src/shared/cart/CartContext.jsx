import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const Ctx = createContext()

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart') || '[]') } catch { return [] }
  })
  useEffect(() => { localStorage.setItem('cart', JSON.stringify(items)) }, [items])

  const api = useMemo(() => ({
    items,
    add(dish, qty = 1) {
      setItems(prev => {
        const i = prev.findIndex(p => p.id === dish.id)
        if (i >= 0) {
          const copy = [...prev]
          copy[i] = { ...copy[i], qty: copy[i].qty + qty }
          return copy
        }
        return [...prev, { ...dish, qty }]
      })
    },
    inc(id, qty = 1) {
      setItems(prev => prev.map(p => p.id === id ? { ...p, qty: p.qty + qty } : p))
    },
    dec(id, qty = 1) {
      setItems(prev => {
        const next = prev.map(p => p.id === id ? { ...p, qty: p.qty - qty } : p)
        return next.filter(p => p.qty > 0)
      })
    },
    remove(id) { setItems(prev => prev.filter(p => p.id !== id)) },
    clear() { setItems([]) },
    total() { return items.reduce((s, it) => s + it.price * it.qty, 0) },
    qty(id) { return items.find(p => p.id === id)?.qty || 0 }
  }), [items])

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export function useCart() {
  return useContext(Ctx)
}
