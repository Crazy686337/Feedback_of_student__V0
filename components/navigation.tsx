"use client"
import { Button } from "@/components/ui/button"
import { BarChart3, MessageSquare, Users, Settings } from "lucide-react"

interface NavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "feedback", label: "Submit Feedback", icon: MessageSquare },
    { id: "analytics", label: "Analytics", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <nav className="bg-card border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="text-xl font-bold text-primary">SFS</div>
            <div className="flex space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    onClick={() => onTabChange(item.id)}
                    className="flex items-center space-x-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
