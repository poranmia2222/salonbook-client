"use client"

import { useState } from "react"
import { AlertTriangle, Loader2, Pencil, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { deleteService } from "@/lib/api/services"
import { Service } from "@/lib/types/service"

interface ServiceTableActionsProps {
  service: Service
  onEdit: () => void
  onDelete: (serviceId: string) => void
}

export function ServiceTableActions({
  service,
  onEdit,
  onDelete,
}: ServiceTableActionsProps) {
  const [deleting, setDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteError, setDeleteError] = useState("")

  const handleDelete = async () => {
    if (!service._id) return

    setDeleting(true)
    setDeleteError("")
    try {
      await deleteService(service._id)
      onDelete(service._id)
      setShowDeleteModal(false)
    } catch (error) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : "Unable to delete this service."
      )
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="gap-1.5"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            setDeleteError("")
            setShowDeleteModal(true)
          }}
          className="gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </Button>
      </div>

      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-service-title"
        >
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="flex-row items-start justify-between space-y-0 border-b border-border">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle id="delete-service-title" className="text-lg">
                    Delete service
                  </CardTitle>
                  <CardDescription className="mt-2">
                    This action cannot be undone.
                  </CardDescription>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                aria-label="Close"
                className="-mr-2 -mt-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent className="pt-5">
              <p className="text-sm text-foreground">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{service.serviceName}</span>?
              </p>

              {deleteError && (
                <p
                  role="alert"
                  className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                  {deleteError}
                </p>
              )}
            </CardContent>

            <CardFooter className="justify-end gap-3 border-t border-border pt-5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="gap-2 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
                {deleting ? "Deleting..." : "Delete service"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  )
}
