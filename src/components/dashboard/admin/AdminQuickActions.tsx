import { CalendarDays, Plus, Scissors } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function AdminQuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick actions</CardTitle>
        <CardDescription>Common admin tasks</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        <Button href="/dashboard/admin/add-service" className="justify-start gap-2">
          <Plus className="h-4 w-4" />
          Add a service
        </Button>
        <Button
          href="/dashboard/admin/manage-service"
          variant="outline"
          className="justify-start gap-2"
        >
          <Scissors className="h-4 w-4" />
          Manage services
        </Button>
        <Button
          href="/dashboard/admin/manage-appointment"
          variant="outline"
          className="justify-start gap-2"
        >
          <CalendarDays className="h-4 w-4" />
          Manage appointments
        </Button>
      </CardContent>
    </Card>
  )
}
