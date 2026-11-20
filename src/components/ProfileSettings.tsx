"use client"

import { useState } from "react"
import { authClient, useSession } from "@/lib/auth-client"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User } from "lucide-react"

interface UserProfile {
  name?: string | null
  email?: string | null
  image?: string | null
  role?: string
}

export function ProfileSettings() {
  const { data: session, isPending } = useSession()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState<File | null>(null)

  const uploadImage = async (file: File) => {
    const formData = new FormData()
    formData.append("image", file)

    const response = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || "Image upload failed")
    }

    return result.imageUrl as string
  }

  const user = session?.user as unknown as UserProfile

  if (isPending) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const nameValue = formData.get("name")
    const name = typeof nameValue === "string" ? nameValue : ""
    setLoading(true)

    try {
      let imageUrl = user.image || ""

      // Upload image only if user selects a new one
      if (image) {
        imageUrl = await uploadImage(image)
      }

      // Update Better Auth user information
      const { error } = await authClient.updateUser({
        name,
        image: imageUrl,
      })

      if (error) {
        throw new Error(error.message || "Profile update failed")
      }

      setImage(null)

      toast({
        title: "Profile updated",
        description: "Your profile information has been saved.",
      })

    } catch (err) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description:
          err instanceof Error
            ? err.message
            : "Unable to update profile.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: Profile card */}
        <div className="min-w-0 flex-1 space-y-6">
          <div className="rounded-xl border border-border bg-background p-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="relative flex items-center justify-center">
                <img
                  src={
                    user.image ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.name || "User"
                    )}&background=random`
                  }
                  alt={user.name || "Profile"}
                  className="w-24 h-24 rounded-full bg-muted object-cover"
                />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                {user.name || "Customer"}
              </h2>
              <p className="text-sm text-muted-foreground capitalize">
                {user.role === "admin" ? "Administrator" : "Customer"}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Settings form */}
        <div className="flex-1 space-y-6">
          <div className="rounded-xl border border-border bg-background p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Profile Information
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email ?? ""}
                  readOnly
                  className="bg-secondary/50"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed from here.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className="pl-10"
                    defaultValue={user.name ?? ""}
                    name="name"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profileImage">Profile Image</Label>
                <div className="flex h-10 min-w-0 items-center gap-3 rounded-md border border-input bg-background px-2">
                  <Input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    className="peer sr-only"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                    disabled={loading}
                    aria-describedby="profileImageHelp"
                  />
                  <label
                    htmlFor="profileImage"
                    className={`inline-flex h-8 shrink-0 cursor-pointer items-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring ${
                      loading ? "pointer-events-none opacity-50" : ""
                    }`}
                  >
                    Choose file
                  </label>
                  <span
                    className="min-w-0 flex-1 truncate text-sm text-muted-foreground"
                    title={image?.name}
                  >
                    {image?.name || "No file chosen"}
                  </span>
                </div>
                <p id="profileImageHelp" className="text-xs text-muted-foreground">
                  Choose an image to upload with your profile changes.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </div>

          <div className="rounded-xl border border-border bg-background p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Account
            </h3>
            <p className="text-sm text-muted-foreground">
              Your role ({user.role === "admin" ? "Administrator" : "Customer"})
              and account status are managed by the system and cannot be changed
              from your profile settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
