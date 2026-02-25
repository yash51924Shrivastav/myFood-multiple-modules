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

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'menu', element: <Menu /> },
      { path: 'reservations', element: <Reservations /> },
      { path: 'about', element: <About /> }
      ,{ path: 'admin', element: <Admin /> }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
