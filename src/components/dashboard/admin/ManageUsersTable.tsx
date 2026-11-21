"use client"

import { useMemo, useState } from "react"
import { Search, Users } from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { User } from "@/lib/types/service"
import { UserTableActions } from "./UserTableActions"

interface ManageUsersTableProps {
  users: User[]
}

function formatDate(value?: string) {
  if (!value) return "Unknown"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Unknown"
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

export function ManageUsersTable({ users }: ManageUsersTableProps) {
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  const roles = useMemo(
    () => ["all", ...Array.from(new Set(users.map((user) => user.role)))],
    [users]
  )

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase()
    return users.filter((user) => {
      const matchesRole =
        roleFilter === "all" || user.role === roleFilter
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      return matchesRole && matchesSearch
    })
  }, [roleFilter, search, users])

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Users className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-2xl">Manage users</CardTitle>
              <CardDescription className="mt-2">
                {users.length} {users.length === 1 ? "user" : "users"} registered
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="mb-5">
        <CardContent className="grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_220px]">
          <div className="space-y-2">
            <Label htmlFor="user-search">Search</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="user-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name or email..."
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role-filter">Role</Label>
            <select
              id="role-filter"
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground [color-scheme:dark] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {roles.map((role) => (
                <option
                  key={role}
                  value={role}
                  className="bg-background text-foreground"
                >
                  {role === "all" ? "All roles" : role}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-64">User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Verification</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      {user.image && (
                        <AvatarImage src={user.image} alt={user.name} />
                      )}
                      <AvatarFallback>
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">
                        {user.name}
                      </p>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.emailVerified ? "success" : "warning"}>
                    {user.emailVerified ? "Verified" : "Not verified"}
                  </Badge>
                </TableCell>
                <TableCell className="text-foreground">
                  {formatDate(user.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <UserTableActions user={user} />
                </TableCell>
              </TableRow>
            ))}

            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-40 text-center">
                  <p className="font-medium text-foreground">No users found</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try another search or role.
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </>
  )
}
