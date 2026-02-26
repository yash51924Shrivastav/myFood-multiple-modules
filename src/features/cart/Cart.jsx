import { useCart } from '../../shared/cart/CartContext'
import { createReservation } from '../../shared/api/client'
import { useState } from 'react'

export default function Cart() {
  const cart = useCart()
  const [status, setStatus] = useState(null)

  async function checkout() {
    setStatus('Order placed')
    cart.clear()
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-4 text-2xl font-semibold">Your Cart</h1>
      <div className="space-y-3">
        {cart.items.length === 0 && <div className="text-gray-600">Cart is empty</div>}
        {cart.items.map(it => (
          <div key={it.id} className="card p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{it.name}</div>
              <div className="mt-1 inline-flex items-center gap-2">
                <button className="btn px-3" onClick={() => cart.dec(it.id)}>-</button>
                <span className="min-w-[1.5rem] text-center">{it.qty}</span>
                <button className="btn px-3" onClick={() => cart.inc(it.id)}>+</button>
              </div>
            </div>
            <div className="text-brand">₹{it.price * it.qty}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-lg font-semibold">Total: ₹{cart.total()}</div>
        <button className="btn btn-primary" onClick={checkout} disabled={cart.items.length === 0}>Checkout</button>
      </div>
      {status && <div className="mt-3 rounded bg-green-50 p-3 text-green-700">{status}</div>}
    </div>
  )
}
