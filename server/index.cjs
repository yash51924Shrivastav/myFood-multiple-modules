const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()
app.use(cors())
app.use(express.json())

const DATA_PATH = path.resolve('./server/data.json')
const STATIC_PATH = path.resolve('./src/data/menu_exotic.json')

function readDB() {
  try {
    const txt = fs.readFileSync(DATA_PATH, 'utf-8')
    return JSON.parse(txt)
  } catch (e) {
    return { categories: ['Starters', 'Main Course', 'Desserts', 'Smoothies'], dishes: [], reservations: [] }
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

function seedFromStatic(db) {
  try {
    const txt = fs.readFileSync(STATIC_PATH, 'utf-8')
    const json = JSON.parse(txt)
    const existingKey = new Set(db.dishes.map(d => `${d.name}|${d.category}`))
    for (const cat of json.categories) {
      for (const item of cat.items) {
        const category = mapCategory(cat.name, item.name)
        const key = `${item.name}|${category}`
        if (existingKey.has(key)) continue
        const dish = {
          id: Math.random().toString(36).slice(2),
          name: item.name,
          price: choosePrice(item),
          category,
          img: item.img || ''
        }
        db.dishes.push(dish)
        existingKey.add(key)
      }
    }
  } catch (e) {
    // ignore
  }
}

function seedCategory(db, targetCategory) {
  try {
    const txt = fs.readFileSync(STATIC_PATH, 'utf-8')
    const json = JSON.parse(txt)
    const existingKey = new Set(db.dishes.map(d => `${d.name}|${d.category}`))
    for (const cat of json.categories) {
      for (const item of cat.items) {
        const category = mapCategory(cat.name, item.name)
        if (category !== targetCategory) continue
        const key = `${item.name}|${category}`
        if (existingKey.has(key)) continue
        const dish = {
          id: Math.random().toString(36).slice(2),
          name: item.name,
          price: choosePrice(item),
          category,
          img: item.img || ''
        }
        db.dishes.push(dish)
        existingKey.add(key)
      }
    }
  } catch (e) {
    // ignore
  }
}

app.get('/api/categories', (req, res) => {
  const db = readDB()
  if (!db.dishes || db.dishes.length === 0) {
    seedFromStatic(db)
    writeDB(db)
  }
  res.json({ categories: db.categories })
})

app.get('/api/dishes', (req, res) => {
  const db = readDB()
  if (!db.dishes || db.dishes.length === 0) {
    seedFromStatic(db)
    writeDB(db)
  }
  const { category } = req.query
  let dishes = db.dishes
  if (category) {
    seedCategory(db, category)
    writeDB(db)
    dishes = db.dishes.filter(d => d.category === category)
  }
  res.json({ dishes })
})

app.post('/api/dishes', (req, res) => {
  const { name, price, category, img } = req.body
  if (!name || typeof price !== 'number' || !category) {
    return res.status(400).json({ error: 'Invalid payload' })
  }
  const db = readDB()
  if (!db.categories.includes(category)) db.categories.push(category)
  const id = Math.random().toString(36).slice(2)
  const dish = { id, name, price, category, img: img || '' }
  db.dishes.push(dish)
  writeDB(db)
  res.json({ ok: true, dish })
})

app.get('/api/reservations', (req, res) => {
  const db = readDB()
  res.json({ reservations: db.reservations })
})

app.post('/api/reservations', (req, res) => {
  const { name, phone, date, time, partySize } = req.body
  if (!name || !phone || !date || !time || !partySize) {
    return res.status(400).json({ error: 'Invalid payload' })
  }
  const db = readDB()
  const id = Math.random().toString(36).slice(2)
  const entry = { id, name, phone, date, time, partySize, createdAt: new Date().toISOString() }
  db.reservations.unshift(entry)
  writeDB(db)
  res.json({ ok: true, reservation: entry })
})

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`)
})
