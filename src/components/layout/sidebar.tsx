import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Wrench,
  Users,
  FileText,
  Settings,
  Menu,
  X,
  ChevronLeft,
  UserCog,
  MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setSidebarCollapsed, toggleSidebar } from '@/features/ui/uiSlice'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'POS', href: '/pos', icon: ShoppingCart },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Repairs', href: '/repairs', icon: Wrench },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Employees', href: '/employees', icon: UserCog },
  { name: 'Messages', href: '/chat', icon: MessageSquare },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
]

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation()
  const dispatch = useAppDispatch()
  const sidebarCollapsed = useAppSelector((state) => state.ui.sidebarCollapsed)

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!sidebarCollapsed && (
          <h1 className="text-xl font-bold text-primary-500">FlowTap</h1>
        )}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(setSidebarCollapsed(!sidebarCollapsed))}
            className="hidden md:flex"
          >
            <ChevronLeft
              className={cn(
                'h-4 w-4 transition-transform',
                sidebarCollapsed && 'rotate-180'
              )}
            />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-500 text-white'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
              title={sidebarCollapsed ? item.name : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!sidebarCollapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export function Sidebar() {
  const dispatch = useAppDispatch()
  const { sidebarOpen, sidebarCollapsed } = useAppSelector((state) => state.ui)

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar())
  }

  return (
    <>
      {/* Mobile Sidebar - Sheet */}
      <Sheet open={sidebarOpen} onOpenChange={handleToggleSidebar}>
        <SheetContent side="left" className="w-64 p-0 sm:w-64">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <SidebarContent onNavigate={handleToggleSidebar} />
        </SheetContent>
      </Sheet>

      {/* Desktop/Tablet Sidebar */}
      <aside
        className={cn(
          'hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:z-30 h-screen bg-card border-r transition-all duration-300',
          sidebarCollapsed ? 'md:w-16' : 'md:w-64'
        )}
      >
        <SidebarContent />
      </aside>
    </>
  )
}

export function SidebarToggle() {
  const dispatch = useAppDispatch()
  return (
    <Button variant="ghost" size="icon" onClick={() => dispatch(toggleSidebar())} className="md:hidden">
      <Menu className="h-5 w-5" />
    </Button>
  )
}

