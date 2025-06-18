import { Badge } from "@/components/ui/badge"
import type { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  description?: string
  badge?: string
  badgeVariant?: "default" | "secondary" | "destructive" | "outline"
  actions?: ReactNode
  children?: ReactNode
}

export default function PageHeader({
  title,
  description,
  badge,
  badgeVariant = "secondary",
  actions,
  children,
}: PageHeaderProps) {
  return (
    <div className="border-b bg-white">
      <div className="px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{title}</h1>
              {badge && <Badge variant={badgeVariant}>{badge}</Badge>}
            </div>
            {description && <p className="text-muted-foreground">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  )
}
