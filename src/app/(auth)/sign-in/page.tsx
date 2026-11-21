"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useSession } from "@/lib/auth-client"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Mail } from "lucide-react"
import { signIn } from "@/lib/auth-client"

export default function SignInPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  // If already authenticated, send to their role dashboard
  useEffect(() => {
    if (session?.user) {
      router.replace("/dashboard")
    }
  }, [session, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await signIn.email({
        email,
        password,
        // Handle redirect manually so we land on the role-based dashboard
      })

      if (error) {
        toast({
          variant: "destructive",
          title: "Sign in failed",
          description: error.message || "Invalid email or password.",
        })
        setLoading(false)
        return
      }

      toast({
        title: "Welcome back",
        description: "You have been signed in successfully.",
      })
      router.push("/dashboard")
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description:
          err instanceof Error ? err.message : "Something went wrong.",
      })
      setLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    toast({
      title: "Google sign in",
      description: "Google authentication is being configured.",
    })
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md p-6">
        <CardHeader className="p-0 text-center">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription className="mt-2">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-6 p-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            <Button type="submit" className="h-11 w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase font-semibold">
            <span className="bg-background px-3 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleGoogleSignIn}
          className="h-11 w-full"
          disabled={loading}
        >
          Sign in with Google
        </Button>
        <CardFooter className="mt-5 justify-center p-0 text-center">
          <p className="text-sm text-muted-foreground">
            Don&rsquo;t have an account?{" "}
            <Link
              href="/sign-up"
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
