import { Sidebar } from "@/components/Sidebar"
import { PropsWithChildren } from "react"

export const instant = false

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col bg-background overflow-y-auto">
        <div className="px-8 py-6">{children}</div>
      </main>
    </div>
  )
}
