"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { useTemplateDetail, useGenerationDetail } from '@/lib/api'

const staticRoutes = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/cards', label: 'Cards' },
  { path: '/templates', label: 'Templates' },
  { path: '/settings', label: 'Settings' },
]

export function Breadcrumb() {
  const pathname = usePathname()

  const getBreadcrumbs = () => {
    // First check static routes
    const staticBreadcrumbs = staticRoutes.filter(route =>
      pathname.startsWith(route.path)
    )

    // Handle dynamic template and generation routes
    if (pathname.includes('/templates/')) {
      const parts = pathname.split('/')
      const breadcrumbs = [...staticBreadcrumbs]

      if (parts[2]) { // Template ID exists
        breadcrumbs.push({
          path: `/templates/${parts[2]}`,
          label: `Template ${parts[2]}`,
        })

        if (parts[3] === 'generations' && parts[4]) { // Generation ID exists
          breadcrumbs.push({
            path: `/templates/${parts[2]}/generations/${parts[4]}`,
            label: `Generation ${parts[4]}`,
          })
        }
      }

      return breadcrumbs
    }

    return staticBreadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

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
              className={`inline-flex items-center text-sm font-medium ${index === breadcrumbs.length - 1
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

