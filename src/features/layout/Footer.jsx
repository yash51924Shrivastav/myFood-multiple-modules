export default function Footer() {
  return (
    <footer className="mt-8 border-t border-gray-200">
      <div className="container py-6 text-sm text-gray-600">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} Exotic Cuisines. All rights reserved.</p>
          <p className="text-gray-500">Open daily 10:00–22:00</p>
        </div>
      </div>
    </footer>
  )
}
