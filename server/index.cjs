const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
let MongoClient = null
try {
  MongoClient = require('mongodb').MongoClient
} catch (e) {
  MongoClient = null
}

const app = express()
app.use(cors())
app.use(express.json())

const DATA_PATH = path.resolve('./server/data.json')
const STATIC_PATH = path.resolve('./src/data/menu_exotic.json')
const CLIENT_DIST = path.resolve('./dist')
let mongoClient
let mongoDb
const useMongo = !!process.env.MONGO_URI && !!MongoClient
async function getMongo() {
  if (!useMongo) return null
  if (!mongoClient) {
    mongoClient = new MongoClient(process.env.MONGO_URI)
    await mongoClient.connect()
    mongoDb = mongoClient.db(process.env.MONGO_DB || 'exotic')
    await mongoDb.collection('restaurants').createIndex({ name: 1 }, { unique: true }).catch(() => {})
    await mongoDb.collection('dishes').createIndex({ name: 1, category: 1, restaurantId: 1 }, { unique: true }).catch(() => {})
  }
  return mongoDb
}

function readDB() {
  try {
    const txt = fs.readFileSync(DATA_PATH, 'utf-8')
    return JSON.parse(txt)
  } catch (e) {
    return { restaurants: [], categories: ['Starters', 'Main Course', 'Desserts', 'Smoothies'], dishes: [], reservations: [] }
  }
}

function writeDB(db) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(db, null, 2))
}

function choosePrice(item) {
  if (typeof item.price === 'number') return item.price
  if (Array.isArray(item.prices) && item.prices.length) return Number(item.prices[0].price)
  return 0
}

function mapCategory(staticCatName, itemName) {
  const n = staticCatName.toLowerCase()
  if (n.includes('starter')) return 'Starters'
  if (n.includes('dessert')) return 'Desserts'
  if (n.includes('shake') || n.includes('beverage')) return 'Smoothies'
  if (n.includes('punjabi three')) {
    if (/milk|lassi/i.test(itemName)) return 'Smoothies'
    return 'Main Course'
  }
  return 'Main Course'
}

function defaultImage(category, name) {
  const cat = (category || '').toLowerCase()
  if (cat.includes('starter')) return 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1200&auto=format&fit=crop'
  if (cat.includes('dessert')) return 'https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=1200&auto=format&fit=crop'
  if (cat.includes('smooth')) return 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?q=80&w=1200&auto=format&fit=crop'
  return 'https://images.unsplash.com/photo-1604908554061-1f6edc63559f?q=80&w=1200&auto=format&fit=crop'
}

function seedFromStatic(db) {
  try {
    const txt = fs.readFileSync(STATIC_PATH, 'utf-8')
    const json = JSON.parse(txt)
    if (!db.restaurants || db.restaurants.length === 0) {
      db.restaurants = [
        { id: 'r1', name: 'Exotic Cuisines', cover: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1200&auto=format&fit=crop' },
        { id: 'r2', name: 'Spice Route', cover: 'https://images.unsplash.com/photo-1600891963938-a0498147305c?q=80&w=1200&auto=format&fit=crop' },
        { id: 'r3', name: 'Urban Bites', cover: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=1200&auto=format&fit=crop' },
        { id: 'r4', name: 'Coastal Cravings', cover: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop' },
        { id: 'r5', name: 'Veggie Vibes', cover: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop' }
      ]
    }
    const existingKey = new Set(db.dishes.map(d => `${d.name}|${d.category}|${d.restaurantId || 'r1'}`))
    let idx = 0
    for (const cat of json.categories) {
      for (const item of cat.items) {
        const category = mapCategory(cat.name, item.name)
        // Distribute dishes round-robin across five demo restaurants
        const rid = `r${(idx % 5) + 1}`
        const key = `${item.name}|${category}|${rid}`
        if (!existingKey.has(key)) {
          const dish = {
            id: Math.random().toString(36).slice(2),
            name: item.name,
            price: choosePrice(item),
            category,
            img: item.img || defaultImage(category, item.name),
            restaurantId: rid
          }
          db.dishes.push(dish)
          existingKey.add(key)
        }
        idx++
      }
    }
  } catch (e) {}
}

function seedCategory(db, targetCategory) {
  try {
    const txt = fs.readFileSync(STATIC_PATH, 'utf-8')
    const json = JSON.parse(txt)
    if (!db.restaurants || db.restaurants.length === 0) {
      db.restaurants = [{ id: 'r1', name: 'Exotic Cuisines', cover: '' }]
    }
    const existingKey = new Set(db.dishes.map(d => `${d.name}|${d.category}|${d.restaurantId || 'r1'}`))
    for (const cat of json.categories) {
      for (const item of cat.items) {
        const category = mapCategory(cat.name, item.name)
        if (category !== targetCategory) continue
        for (const rid of ['r1']) {
          const key = `${item.name}|${category}|${rid}`
          if (existingKey.has(key)) continue
          const dish = {
            id: Math.random().toString(36).slice(2),
            name: item.name,
            price: choosePrice(item),
            category,
            img: item.img || defaultImage(category, item.name),
            restaurantId: rid
          }
          db.dishes.push(dish)
          existingKey.add(key)
        }
      }
    }
  } catch (e) {}
}

app.get('/api/restaurants', async (req, res) => {
  if (useMongo) {
    const db = await getMongo()
    const rows = await db.collection('restaurants').find({}).toArray()
    if (rows.length === 0) {
      const seed = [
        { name: 'Exotic Cuisines', cover: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1200&auto=format&fit=crop' },
        { name: 'Spice Route', cover: 'https://images.unsplash.com/photo-1600891963938-a0498147305c?q=80&w=1200&auto=format&fit=crop' },
        { name: 'Urban Bites', cover: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=1200&auto=format&fit=crop' },
        { name: 'Coastal Cravings', cover: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop' },
        { name: 'Veggie Vibes', cover: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop' }
      ]
      const result = await db.collection('restaurants').insertMany(seed.map(r => ({ ...r })))
      const inserted = await db.collection('restaurants').find({}).toArray()
      return res.json({ restaurants: inserted.map(r => ({ id: String(r._id), name: r.name, cover: r.cover })) })
    }
    return res.json({ restaurants: rows.map(r => ({ id: String(r._id), name: r.name, cover: r.cover })) })
  } else {
    const mem = readDB()
    if (!mem.restaurants || mem.restaurants.length === 0) {
      seedFromStatic(mem)
      writeDB(mem)
    }
    return res.json({ restaurants: mem.restaurants })
  }
})

app.post('/api/restaurants', async (req, res) => {
  const { name, cover } = req.body
  if (!name) return res.status(400).json({ error: 'Invalid payload' })
  if (useMongo) {
    const db = await getMongo()
    const result = await db.collection('restaurants').insertOne({ name, cover: cover || '' })
    return res.json({ ok: true, restaurant: { id: String(result.insertedId), name, cover: cover || '' } })
  } else {
    const mem = readDB()
    const id = Math.random().toString(36).slice(2)
    const rest = { id, name, cover: cover || '' }
    mem.restaurants.push(rest)
    writeDB(mem)
    return res.json({ ok: true, restaurant: rest })
  }
})

app.get('/api/restaurants/:id/dishes', async (req, res) => {
  const { id } = req.params
  const { category } = req.query
  if (useMongo) {
    const db = await getMongo()
    const restId = id
    let q = { restaurantId: restId }
    if (category) q.category = category
    let rows = await db.collection('dishes').find(q).toArray()
    if (rows.length === 0) {
      const staticTxt = fs.readFileSync(STATIC_PATH, 'utf-8')
      const json = JSON.parse(staticTxt)
      const docs = []
      for (const cat of json.categories) {
        for (const item of cat.items) {
          const catName = mapCategory(cat.name, item.name)
          if (category && catName !== category) continue
          docs.push({ name: item.name, price: choosePrice(item), category: catName, img: item.img || '', restaurantId: restId })
        }
      }
      if (docs.length) await db.collection('dishes').insertMany(docs)
      rows = await db.collection('dishes').find(q).toArray()
    }
    return res.json({ dishes: rows.map(d => ({ id: String(d._id), name: d.name, price: d.price, category: d.category, img: d.img || defaultImage(d.category, d.name), restaurantId: d.restaurantId })) })
  } else {
    const mem = readDB()
    if (!mem.restaurants || mem.restaurants.length === 0) {
      seedFromStatic(mem)
      writeDB(mem)
    }
    let dishes = mem.dishes.filter(d => (d.restaurantId || 'r1') === id)
    if (category) dishes = dishes.filter(d => d.category === category)
    if (dishes.length === 0) {
      if (category) seedCategory(mem, category)
      else seedFromStatic(mem)
      writeDB(mem)
      dishes = mem.dishes.filter(d => (d.restaurantId || 'r1') === id && (!category || d.category === category))
    }
    return res.json({ dishes: dishes.map(d => ({ ...d, img: d.img || defaultImage(d.category, d.name) })) })
  }
})

app.get('/api/categories', async (req, res) => {
  if (useMongo) {
    return res.json({ categories: ['Starters', 'Main Course', 'Desserts', 'Smoothies'] })
  } else {
    const mem = readDB()
    if (!mem.dishes || mem.dishes.length === 0) {
      seedFromStatic(mem)
      writeDB(mem)
    }
    return res.json({ categories: mem.categories })
  }
})

app.get('/api/dishes', async (req, res) => {
  const { category } = req.query
  if (useMongo) {
    const db = await getMongo()
    let q = {}
    if (category) q.category = category
    let rows = await db.collection('dishes').find(q).toArray()
    if (rows.length === 0) {
      const staticTxt = fs.readFileSync(STATIC_PATH, 'utf-8')
      const json = JSON.parse(staticTxt)
      const docs = []
      for (const cat of json.categories) {
        for (const item of cat.items) {
          const catName = mapCategory(cat.name, item.name)
          if (category && catName !== category) continue
          docs.push({ name: item.name, price: choosePrice(item), category: catName, img: item.img || '', restaurantId: 'r1' })
        }
      }
      if (docs.length) await db.collection('dishes').insertMany(docs)
      rows = await db.collection('dishes').find(q).toArray()
    }
    return res.json({ dishes: rows.map(d => ({ id: String(d._id), name: d.name, price: d.price, category: d.category, img: d.img || defaultImage(d.category, d.name), restaurantId: d.restaurantId })) })
  } else {
    const mem = readDB()
    if (!mem.dishes || mem.dishes.length === 0) {
      seedFromStatic(mem)
      writeDB(mem)
    }
    let dishes = mem.dishes
    if (category) {
      seedCategory(mem, category)
      writeDB(mem)
      dishes = mem.dishes.filter(d => d.category === category)
    }
    return res.json({ dishes: dishes.map(d => ({ ...d, img: d.img || defaultImage(d.category, d.name) })) })
  }
})

app.post('/api/dishes', async (req, res) => {
  const { name, price, category, img, restaurantId } = req.body
  if (!name || typeof price !== 'number' || !category) {
    return res.status(400).json({ error: 'Invalid payload' })
  }
  if (useMongo) {
    const db = await getMongo()
    const payload = { name, price, category, img: img || defaultImage(category, name), restaurantId: restaurantId || 'r1' }
    const result = await db.collection('dishes').insertOne(payload)
    return res.json({ ok: true, dish: { id: String(result.insertedId), ...payload } })
  } else {
    const mem = readDB()
    if (!mem.categories.includes(category)) mem.categories.push(category)
    const id = Math.random().toString(36).slice(2)
    const dish = { id, name, price, category, img: img || defaultImage(category, name), restaurantId: restaurantId || 'r1' }
    mem.dishes.push(dish)
    writeDB(mem)
    return res.json({ ok: true, dish })
  }
})

app.get('/api/reservations', async (req, res) => {
  if (useMongo) {
    const db = await getMongo()
    const rows = await db.collection('reservations').find({}).sort({ createdAt: -1 }).toArray()
    return res.json({ reservations: rows.map(r => ({ id: String(r._id), ...r })) })
  } else {
    const mem = readDB()
    return res.json({ reservations: mem.reservations })
  }
})

app.post('/api/reservations', async (req, res) => {
  const { name, phone, date, time, partySize } = req.body
  if (!name || !phone || !date || !time || !partySize) {
    return res.status(400).json({ error: 'Invalid payload' })
  }
  if (useMongo) {
    const db = await getMongo()
    const entry = { name, phone, date, time, partySize, createdAt: new Date().toISOString() }
    const result = await db.collection('reservations').insertOne(entry)
    return res.json({ ok: true, reservation: { id: String(result.insertedId), ...entry } })
  } else {
    const mem = readDB()
    const id = Math.random().toString(36).slice(2)
    const entry = { id, name, phone, date, time, partySize, createdAt: new Date().toISOString() }
    mem.reservations.unshift(entry)
    writeDB(mem)
    return res.json({ ok: true, reservation: entry })
  }
})

// Serve built frontend in production
if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST))
  app.use((req, res) => {
    res.sendFile(path.join(CLIENT_DIST, 'index.html'))
  })
}

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`)
})
