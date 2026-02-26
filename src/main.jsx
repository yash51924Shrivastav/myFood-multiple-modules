import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Layout from './features/layout/Layout'
import Home from './features/home/Home'
import Menu from './features/menu/Menu'
import Reservations from './features/reservations/Reservations'
import About from './features/about/About'
import Admin from './features/admin/Admin'
import Restaurants from './features/restaurants/Restaurants'
import RestaurantMenu from './features/restaurants/RestaurantMenu'
import Cart from './features/cart/Cart'
import { CartProvider } from './shared/cart/CartContext'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Restaurants /> },
      { path: 'restaurants/:id', element: <RestaurantMenu /> },
      { path: 'menu', element: <Menu /> },
      { path: 'cart', element: <Cart /> },
      { path: 'reservations', element: <Reservations /> },
      { path: 'about', element: <About /> }
      ,{ path: 'admin', element: <Admin /> }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </React.StrictMode>
)
