import { useCart } from '../../shared/cart/CartContext'
import { createPaymentOrder, verifyPayment } from '../../shared/api/client'
import { useState } from 'react'

export default function Cart() {
  const cart = useCart()
  const [status, setStatus] = useState(null)

  async function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve(true)
      const s = document.createElement('script')
      s.src = src
      s.onload = () => resolve(true)
      s.onerror = () => reject(new Error('Failed to load script'))
      document.body.appendChild(s)
    })
  }

  async function checkout() {
    try {
      const total = cart.total()
      if (total <= 0) return
      setStatus('Initializing payment...')
      const order = await createPaymentOrder(total)
      if (order.mock) {
        setStatus('Payment simulated — configure Razorpay keys for live checkout')
        cart.clear()
        return
      }
      await loadScript('https://checkout.razorpay.com/v1/checkout.js')
      const opts = {
        key: order.key,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'Exotic Cuisines',
        description: 'Order payment',
        order_id: order.id,
        handler: async function (resp) {
          const result = await verifyPayment(resp)
          if (result?.ok) {
            setStatus('Payment successful — order placed')
            cart.clear()
          } else {
            setStatus('Payment verification failed')
          }
        },
        theme: { color: '#a855f7' }
      }
      const rz = new window.Razorpay(opts)
      rz.on('payment.failed', function () {
        setStatus('Payment failed — please try again')
      })
      rz.open()
    } catch (e) {
      setStatus('Unable to start payment')
    }
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
