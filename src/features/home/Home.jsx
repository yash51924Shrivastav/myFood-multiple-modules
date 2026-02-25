import { motion } from 'framer-motion'
import SectionScene from '../three/SectionScene'
import { Link } from 'react-router-dom'
import data from '../../data/menu_exotic.json'

const images = [
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1543353071-10c8ba85a904?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1555993539-1732d1b12730?q=80&w=1600&auto=format&fit=crop'
]

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-lg h-[420px]">
        <img
          src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1600&auto=format&fit=crop"
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-brand via-pink-500 to-yellow-400 opacity-70"></div>
        <div className="absolute left-8 top-10">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-white drop-shadow"
          >
            Welcome to Exotic Cuisines
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="mt-3 max-w-xl text-white/90"
          >
            A legacy of flavor, crafted with heart and served with warmth.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-5 flex gap-3"
          >
            <Link to="/menu" className="btn btn-primary">Explore Menu</Link>
            <Link to="/reservations" className="btn">Reserve a Table</Link>
          </motion.div>
        </div>
      </section>

      {(() => {
        const groups = {
          Starters: [],
          'Main Course': [],
          Desserts: [],
          Smoothies: []
        }
        for (const cat of data.categories) {
          const name = cat.name.toLowerCase()
          if (name.includes('starter')) groups.Starters.push(...cat.items)
          else if (name.includes('main course') || name.includes('biryani') || name.includes('pulao') || name.includes('rice') || name.includes('parathe') || name.includes('bread') || name.includes('punjabi swag')) groups['Main Course'].push(...cat.items)
          else if (name.includes('dessert')) groups.Desserts.push(...cat.items)
          else if (name.includes('shake') || name.includes('beverage')) groups.Smoothies.push(...cat.items)
        }
        const sections = [
          { title: 'Starters', color: '#c2410c', items: groups.Starters.slice(0, 3) },
          { title: 'Main Course', color: '#0ea5e9', items: groups['Main Course'].slice(0, 3) },
          { title: 'Desserts', color: '#16a34a', items: groups.Desserts.slice(0, 3) }
        ]
        return sections.map((sec, idx) => (
          <section key={sec.title} className="relative overflow-hidden rounded-lg bg-white">
            <SectionScene color={sec.color} />
            <div className="relative z-10 p-8">
              <div className="flex items-center justify-between">
                <h2 className="mb-3 text-2xl font-semibold">{sec.title}</h2>
                <Link to={`/menu?cat=${encodeURIComponent(sec.title)}`} className="btn btn-primary">See more</Link>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {sec.items.map((item, i) => (
                  <motion.div
                    key={item.id || i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="card overflow-hidden"
                  >
                    {item.img && <img src={item.img} alt={item.name} className="h-32 w-full object-cover" loading="lazy" />}
                    <div className="p-4">
                      <h3 className="text-lg font-medium">{item.name}</h3>
                      {item.price !== undefined ? (
                        <p className="mt-1 text-sm text-brand">₹{item.price}</p>
                      ) : (
                        <p className="mt-1 text-sm text-gray-600">Multiple options</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 text-sm text-gray-600">Handpicked highlights from our full {sec.title.toLowerCase()} selection.</div>
            </div>
          </section>
        ))
      })()}

      <section className="relative overflow-hidden rounded-lg bg-white">
        <SectionScene color="#374151" />
        <div className="relative z-10 p-8">
          <h2 className="mb-3 text-2xl font-semibold">Our Legacy</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card p-4">
              <h3 className="text-lg font-medium">Craft</h3>
              <p className="mt-2 text-sm text-gray-700">Handcrafted recipes passed down and perfected with local produce.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card p-4">
              <h3 className="text-lg font-medium">Culture</h3>
              <p className="mt-2 text-sm text-gray-700">A celebration of flavors—Punjabi warmth and global inspirations.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card p-4">
              <h3 className="text-lg font-medium">Ambience</h3>
              <p className="mt-2 text-sm text-gray-700">Modern, cozy interiors designed for memorable dining moments.</p>
            </motion.div>
          </div>
          <div className="mt-6">
            <Link to="/menu" className="btn btn-primary">Explore Full Menu</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
