"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
}

const pathMappings: Record<string, BreadcrumbItem[]> = {
  "/": [{ label: "Dashboard" }],
  "/dashboard": [{ label: "Dashboard" }],
  "/migration": [{ label: "Migration" }],
  "/migration/wizard": [{ label: "Migration", href: "/migration" }, { label: "Migration Wizard" }],
  "/legacy-bots": [{ label: "Migration", href: "/migration" }, { label: "Legacy Bot Showcase" }],
  "/agents": [{ label: "Agents" }],
  "/agents/delta-scenarios": [{ label: "Agents", href: "/agents" }, { label: "Delta Scenarios" }],
  "/governance": [{ label: "Governance" }],
}

export default function Breadcrumb() {
  const pathname = usePathname()
  const breadcrumbs = pathMappings[pathname] || [{ label: "Dashboard" }]

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground px-6 py-3 bg-gray-50 border-b">
      <Link href="/" className="flex items-center hover:text-foreground">
        <Home className="h-4 w-4" />
      </Link>
      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center space-x-1">
          <ChevronRight className="h-4 w-4" />
          {item.href ? (
            <Link href={item.href} className="hover:text-foreground">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
