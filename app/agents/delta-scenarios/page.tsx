import PageHeader from "@/components/page-header"
import RealDeltaAnalyzer from "@/components/real-delta-analyzer"
import { Button } from "@/components/ui/button"
import { Brain, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function DeltaScenariosPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Real Delta Analysis"
        description="Analyze actual bot configurations to identify specific AI transformation opportunities with calculated ROI"
        badge="AI-Powered Analysis"
        actions={
          <div className="flex gap-2">
            <Link href="/agents">
              <Button>
                <Brain className="mr-2 h-4 w-4" />
                Try Live Agents
              </Button>
            </Link>
            <Link href="/migration">
              <Button variant="outline">
                <ArrowRight className="mr-2 h-4 w-4" />
                Start Migration
              </Button>
            </Link>
          </div>
        }
      />

      <div className="px-6">
        <RealDeltaAnalyzer />
      </div>
    </div>
  )
}
