import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { getCategories, createDish } from '../../shared/api/client'

export default function Admin() {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { name: '', price: '', category: '', img: '' }
  })
  const [categories, setCategories] = useState([])
  const [status, setStatus] = useState(null)

  useEffect(() => {
    getCategories().then(({ categories }) => setCategories(categories))
  }, [])

  async function onSubmit(values) {
    setStatus(null)
    const payload = {
      name: values.name,
      price: Number(values.price),
      category: values.category || categories[0],
      img: values.img
    }
    const res = await createDish(payload)
    if (res.ok) {
      setStatus('Dish added successfully')
      reset()
    } else {
      setStatus(res.error || 'Failed to add dish')
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="mb-4 text-2xl font-semibold">Admin: Add Dish</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input className="input mt-1" {...register('name', { required: true })} />
        </div>
        <div>
          <label className="block text-sm font-medium">Price</label>
          <input className="input mt-1" type="number" step="1" min="0" {...register('price', { required: true })} />
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select className="input mt-1" {...register('category')}>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Image URL</label>
          <input className="input mt-1" placeholder="https://..." {...register('img')} />
        </div>
        {status && <div className="rounded-md bg-green-50 p-3 text-green-700">{status}</div>}
        <button className="btn btn-primary" type="submit">Add Dish</button>
      </form>
    </div>
  )
}
