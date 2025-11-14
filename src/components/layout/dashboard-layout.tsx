import { Outlet } from 'react-router-dom'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { Breadcrumbs } from './breadcrumbs'
import { useAppSelector } from '@/store/hooks'
import { cn } from '@/lib/utils'

export function DashboardLayout() {
  const sidebarCollapsed = useAppSelector((state) => state.ui.sidebarCollapsed)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div 
        className={cn(
          "flex flex-1 flex-col overflow-hidden transition-all duration-300",
          sidebarCollapsed ? "md:ml-16" : "md:ml-64"
        )}
      >
        <Header />
        <Breadcrumbs />
        <main className="flex-1 overflow-y-auto bg-muted/30 p-4 sm:p-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

