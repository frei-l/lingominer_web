"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

const routes = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/cards', label: 'Cards' },
  { path: '/template', label: 'Template' },
  { path: '/settings', label: 'Settings' },
]

export function Breadcrumb() {
  const pathname = usePathname()

  const breadcrumbs = routes.filter(route => pathname.startsWith(route.path))

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.path} className="inline-flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
            )}
            <Link
              href={breadcrumb.path}
              className={`inline-flex items-center text-sm font-medium ${
                index === breadcrumbs.length - 1
                  ? 'text-gray-700 dark:text-gray-300'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {breadcrumb.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}

