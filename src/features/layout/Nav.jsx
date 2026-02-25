import { NavLink } from 'react-router-dom'

const Link = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-3 py-2 rounded-md ${isActive ? 'text-brand' : 'text-gray-700 hover:text-brand'}`
    }
  >
    {children}
  </NavLink>
)

export default function Nav() {
  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="container flex items-center justify-between py-3">
        <div className="text-xl font-semibold text-brand">Exotic Cuisines</div>
        <nav className="flex items-center gap-2">
          <Link to="/">Home</Link>
          <Link to="/menu">Menu</Link>
          <Link to="/reservations">Reservations</Link>
          <Link to="/about">About</Link>
          <Link to="/admin">Admin</Link>
        </nav>
      </div>
    </header>
  )
}
