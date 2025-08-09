'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Plus, List, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  {
    href: '/',
    label: 'Home',
    icon: Home,
  },
  {
    href: '/search',
    label: 'Search',
    icon: Search,
  },
  {
    href: '/items/add',
    label: 'Add',
    icon: Plus,
  },
  {
    href: '/items',
    label: 'Items',
    icon: List,
  },
  {
    href: '/analytics',
    label: 'Stats',
    icon: BarChart3,
  },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border lg:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs font-medium transition-colors',
                'min-w-[60px] min-h-[44px]', // Touch-friendly size
                'hover:text-primary',
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className={cn(
                'h-5 w-5',
                isActive && 'fill-current'
              )} />
              <span className="leading-none">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

// Add padding to main content to account for mobile nav
export function MobileNavSpacer() {
  return <div className="h-16 lg:hidden" />
}