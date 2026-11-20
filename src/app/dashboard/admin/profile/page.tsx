"use client"

import { ProfileSettings } from "@/components/ProfileSettings"

export default function AdminProfilePage() {
  return (
    <div className="max-w-4xl mx-auto px-8 py-6">
      <h1 className="text-2xl font-semibold text-foreground mb-2">
        My Profile
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        Update your personal profile information.
      </p>
      <ProfileSettings />
    </div>
  )
}
