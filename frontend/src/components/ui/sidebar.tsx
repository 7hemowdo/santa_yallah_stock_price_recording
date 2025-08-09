'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Search, 
  Plus, 
  List, 
  BarChart3, 
  Settings, 
  HelpCircle,
  Package
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { ThemeToggle } from './theme-toggle'

interface SidebarNavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  description?: string
}

const mainNavItems: SidebarNavItem[] = [
  {
    href: '/',
    label: 'Dashboard',
    icon: Home,
    description: 'Overview and recent changes'
  },
  {
    href: '/search',
    label: 'Search Items',
    icon: Search,
    description: 'Find items by serial number'
  },
  {
    href: '/items/add',
    label: 'Add Item',
    icon: Plus,
    description: 'Create new inventory item'
  },
  {
    href: '/items',
    label: 'All Items',
    icon: List,
    description: 'Browse all inventory'
  },
  {
    href: '/analytics',
    label: 'Analytics',
    icon: BarChart3,
    description: 'Price trends and statistics'
  }
]

const secondaryNavItems: SidebarNavItem[] = [
  {
    href: '/settings',
    label: 'Settings',
    icon: Settings,
    description: 'App preferences'
  },
  {
    href: '/help',
    label: 'Help',
    icon: HelpCircle,
    description: 'Documentation and support'
  }
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn(
      "hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-background border-r border-border",
      className
    )}>
      <div className="flex flex-col h-full">
        {/* Logo/Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-semibold">Price Tracker</h1>
          </div>
          <ThemeToggle />
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          <div className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive 
                      ? "bg-accent text-accent-foreground" 
                      : "text-muted-foreground"
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="h-4 w-4" />
                  <div className="flex-1">
                    <div>{item.label}</div>
                    {item.description && (
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {item.description}
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Secondary Navigation */}
        <nav className="px-4 py-4 border-t border-border">
          <div className="space-y-1">
            {secondaryNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive 
                      ? "bg-accent text-accent-foreground" 
                      : "text-muted-foreground"
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </div>
  )
}

// Content wrapper that accounts for sidebar
export function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="lg:pl-64">
      {children}
    </div>
  )
}