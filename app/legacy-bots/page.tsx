import PageHeader from "@/components/page-header"
import LegacyChatbots from "@/components/legacy-chatbots"
import { Button } from "@/components/ui/button"
import { ArrowRight, Upload } from "lucide-react"
import Link from "next/link"

export default function LegacyBotsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Legacy Chatbot Showcase"
        description="Experience working legacy chatbots to understand transformation potential"
        badge="Demo Environment"
        badgeVariant="outline"
        actions={
          <div className="flex gap-2">
            <Link href="/migration">
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Start Migration
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        }
      />

      <div className="px-6">
        <LegacyChatbots />
      </div>
    </div>
  )
}
