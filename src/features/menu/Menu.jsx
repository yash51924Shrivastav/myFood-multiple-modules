import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { getCategories, getDishes } from '../../shared/api/client'

export default function Menu() {
  const containerRef = useRef(null)
  const [active, setActive] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [searchParams] = useSearchParams()

  const grouped = useMemo(() => (
    [
      { id: 'starters', name: 'Starters', items: [] },
      { id: 'main-course', name: 'Main Course', items: [] },
      { id: 'desserts', name: 'Desserts', items: [] },
      { id: 'smoothies', name: 'Smoothies', items: [] }
    ]
  ), [])

  useEffect(() => {
    let alive = true
    Promise.all([
      getDishes('Starters'),
      getDishes('Main Course'),
      getDishes('Desserts'),
      getDishes('Smoothies')
    ]).then(([a, b, c, d]) => {
      if (!alive) return
      grouped[0].items = a.dishes
      grouped[1].items = b.dishes
      grouped[2].items = c.dishes
      grouped[3].items = d.dishes
      setLoaded(true)
    })
    return () => { alive = false }
  }, [])

  useEffect(() => {
    const cat = (searchParams.get('cat') || '').toLowerCase()
    const index =
      cat.startsWith('starter') ? 0 :
      cat.startsWith('main') ? 1 :
      cat.startsWith('dessert') ? 2 :
      cat.startsWith('smooth') || cat.startsWith('shake') ? 3 :
      0
    setActive(index)
  }, [searchParams])

  const anchors = useMemo(() => grouped.map(c => ({
    id: c.id,
    name: c.name
  })), [grouped])

  return (
    <div ref={containerRef}>
      <h1 className="mb-4 text-2xl font-semibold">Our Menu</h1>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px,1fr]">
        <aside className="rounded-md border border-gray-200 bg-white p-2 lg:max-h-[60vh] lg:overflow-y-auto">
          <div className="flex flex-col">
            {anchors.map((a, i) => (
              <button
                key={a.id}
                className={`w-full rounded-md px-3 py-2 text-left ${active === i ? 'bg-brand/10 text-brand' : 'hover:bg-gray-100'}`}
                onClick={() => setActive(i)}
                title={a.name}
              >
                <span className="block truncate">{a.name}</span>
              </button>
            ))}
          </div>
        </aside>
        <AnimatePresence mode="wait">
          <motion.section
            key={anchors[active].id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="mb-3 text-xl font-semibold">{grouped[active].name}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(loaded ? grouped[active].items : []).map((item, idx) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (idx % 6) * 0.06 }}
                  className="group card overflow-hidden"
                >
                  {item.img && (
                    <img src={item.img} alt={item.name} className="h-32 w-full object-cover" loading="lazy" />
                  )}
                  <div className="h-1 w-full bg-gradient-to-r from-brand to-brand-light"></div>
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      {item.price !== undefined ? (
                        <span className="rounded bg-brand/10 px-2 py-1 text-brand">₹{item.price}</span>
                      ) : (
                        <div className="space-y-1 text-sm">
                          {item.prices?.map(opt => (
                            <span key={opt.label} className="mr-2 inline-block rounded bg-brand/10 px-2 py-1 text-brand">
                              {opt.label}: ₹{opt.price}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {item.desc && <p className="mt-2 text-sm text-gray-600">{item.desc}</p>}
                  </div>
                  <div className="transition-transform duration-300 group-hover:scale-[1.01]"></div>
                </motion.article>
              ))}
            </div>
          </motion.section>
        </AnimatePresence>
      </div>
    </div>
  )
}
