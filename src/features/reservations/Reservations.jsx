import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { createReservation } from '../../shared/api/client'

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(7, 'Phone is required'),
  date: z.string().min(10, 'Date is required'),
  time: z.string().min(4, 'Time is required'),
  partySize: z.coerce.number().min(1).max(12)
})

export default function Reservations() {
  const [serverError, setServerError] = useState(null)
  const [success, setSuccess] = useState(null)
  const { register, handleSubmit, formState, reset } = useForm({
    defaultValues: { name: '', phone: '', date: '', time: '', partySize: 2 },
    mode: 'onBlur'
  })

  async function onSubmit(values) {
    const res = schema.safeParse(values)
    if (!res.success) return
    setServerError(null)
    setSuccess(null)
    try {
      const result = await createReservation(res.data)
      if (result.ok) {
        setSuccess(`Reserved for ${result.reservation.name} on ${result.reservation.date} at ${result.reservation.time}`)
        reset()
      } else {
        setServerError(result.error || 'Reservation failed. Please try again.')
      }
    } catch (e) {
      setServerError('Reservation failed. Please try again.')
    }
  }

  const { errors, isSubmitting } = formState

  return (
    <div className="max-w-xl">
      <h1 className="mb-4 text-2xl font-semibold">Make a Reservation</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input className="input mt-1" placeholder="Your name" {...register('name')} />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input className="input mt-1" placeholder="555-1234" {...register('phone')} />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Date</label>
          <input className="input mt-1" type="date" {...register('date')} />
          {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Time</label>
          <input className="input mt-1" type="time" {...register('time')} />
          {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Party Size</label>
          <input className="input mt-1" type="number" min={1} max={12} {...register('partySize')} />
          {errors.partySize && <p className="mt-1 text-sm text-red-600">{errors.partySize.message}</p>}
        </div>
        {serverError && <div className="rounded-md bg-red-50 p-3 text-red-700">{serverError}</div>}
        {success && <div className="rounded-md bg-green-50 p-3 text-green-700">{success}</div>}
        <div className="sm:col-span-2">
          <button className="btn btn-primary w-full sm:w-auto" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting…' : 'Reserve Table'}
          </button>
        </div>
      </form>
    </div>
  )
}
