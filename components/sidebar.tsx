"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BarChart3, Bot, Zap, Building2 } from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: BarChart3,
  },
  {
    title: "Migration",
    href: "/migration",
    icon: Bot,
  },
  {
    title: "Agents",
    href: "/agents",
    icon: Zap,
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/")

  return (
    <div className="w-64 border-r bg-white h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b">
        <Link href="/" className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-purple-600">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">Copilot Migration</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                isActive(item.href) ? "bg-purple-50 text-purple-700" : ""
              }`}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.title}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  )
}