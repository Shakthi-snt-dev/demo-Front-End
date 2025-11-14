import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Breadcrumbs() {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter((x) => x)

  return (
    <nav className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-muted-foreground px-4 sm:px-6 py-2 overflow-x-auto">
      <Link
        to="/dashboard"
        className="hover:text-foreground transition-colors shrink-0"
      >
        <Home className="h-3 w-3 sm:h-4 sm:w-4" />
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`
        const isLast = index === pathnames.length - 1
        const label = value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ')

        return (
          <div key={to} className="flex items-center space-x-1 sm:space-x-2 shrink-0">
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            {isLast ? (
              <span className="text-foreground font-medium">{label}</span>
            ) : (
              <Link
                to={to}
                className="hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}

