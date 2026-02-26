import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getRestaurantDishes } from '../../shared/api/client'
import { useCart } from '../../shared/cart/CartContext'
import { motion, AnimatePresence } from 'framer-motion'

const CATS = ['Starters', 'Main Course', 'Desserts', 'Smoothies']

export default function RestaurantMenu() {
  const { id } = useParams()
  const [active, setActive] = useState(0)
  const [dishes, setDishes] = useState([])
  const [loading, setLoading] = useState(true)
  const cart = useCart()

  useEffect(() => {
    setLoading(true)
    getRestaurantDishes(id, CATS[active]).then(r => { setDishes(r.dishes || []); setLoading(false) })
  }, [id, active])

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Menu</h1>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px,1fr]">
        <aside className="rounded-md border border-gray-200 bg-white p-2 lg:max-h-[60vh] lg:overflow-y-auto">
          <div className="flex flex-col">
            {CATS.map((c, i) => (
              <button key={c} className={`w-full rounded-md px-3 py-2 text-left ${active === i ? 'bg-brand/10 text-brand' : 'hover:bg-gray-100'}`} onClick={() => setActive(i)}>{c}</button>
            ))}
          </div>
        </aside>
        <AnimatePresence mode="wait">
          <motion.section
            key={CATS[active]}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="mb-3 text-xl font-semibold">{CATS[active]}</h2>
            {loading ? <div>Loading…</div> : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {dishes.map((item, idx) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (idx % 6) * 0.06 }}
                    className="group card overflow-hidden"
                  >
                    {item.img && <img src={item.img} alt={item.name} className="h-32 w-full object-cover" loading="lazy" />}
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <span className="rounded bg-brand/10 px-2 py-1 text-brand">₹{item.price}</span>
                      </div>
                      {cart.qty(item.id) === 0 ? (
                        <button className="btn mt-3" onClick={() => cart.add(item, 1)}>Add</button>
                      ) : (
                        <div className="mt-3 inline-flex items-center gap-2">
                          <button className="btn px-3" onClick={() => cart.dec(item.id)}>-</button>
                          <span className="min-w-[1.5rem] text-center">{cart.qty(item.id)}</span>
                          <button className="btn px-3" onClick={() => cart.add(item, 1)}>+</button>
                        </div>
                      )}
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </motion.section>
        </AnimatePresence>
      </div>
    </div>
  )
}
