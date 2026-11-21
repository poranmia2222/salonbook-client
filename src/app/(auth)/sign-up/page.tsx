"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
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
import { Check, Image as ImageIcon, Lock, Mail, User, X as XIcon } from "lucide-react"
import { signIn, signUp } from "@/lib/auth-client"

export default function SignUpPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [loading, setLoading] = useState(false)

  const showRules = passwordFocused || password.length > 0

  const minLength = password.length >= 6
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const passwordValid = minLength && hasUppercase && hasLowercase

  const rules = [
    { label: "Minimum 6 characters", met: minLength },
    { label: "One uppercase letter", met: hasUppercase },
    { label: "One lowercase letter", met: hasLowercase },
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!passwordValid) {
      toast({
        variant: "destructive",
        title: "Invalid password",
        description:
          "Password must be at least 6 characters with one uppercase and one lowercase letter.",
      })
      return
    }

    setLoading(true)

    try {
      const { error } = await signUp.email({
        name,
        email,
        password,
        image: imageUrl || undefined,
      })

      if (error) {
        toast({
          variant: "destructive",
          title: "Sign up failed",
          description: error.message || "Unable to create account.",
        })
        setLoading(false)
        return
      }

      toast({
        title: "Account created",
        description:
          "Your account has been created. Please sign in to continue.",
      })
      router.push("/sign-in")
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description:
          err instanceof Error ? err.message : "Something went wrong.",
      })
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async() => {
      await signIn.social({
        provider: "google",
      })
      toast({
        title: "Google sign in",
        description: "Google authentication is being configured.",
      })
    }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md p-6">
        <CardHeader className="p-0 text-center">
          <CardTitle className="text-2xl font-bold">Create account</CardTitle>
          <CardDescription className="mt-2">
            Join SalonBook to book your next appointment
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-6 p-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  name="name"
                  className="pl-10"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
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
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  disabled={loading}
                />
              </div>
              {showRules && (
                <div className="space-y-1 pt-1">
                  {rules.map((rule) => (
                    <div
                      key={rule.label}
                      className="flex items-center gap-2 text-xs"
                    >
                      {rule.met ? (
                        <Check className="h-3 w-3 text-primary" aria-hidden="true" />
                      ) : (
                        <XIcon className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                      )}
                      <span
                        className={cn(
                          "font-medium",
                          rule.met ? "text-muted-foreground" : "text-muted-foreground/60"
                        )}
                      >
                        {rule.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Profile image URL</Label>
              <div className="relative">
                <ImageIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="imageUrl"
                  type="url"
                  name="image"
                  placeholder="https://example.com/avatar.jpg"
                  className="pl-10"
                  value={imageUrl}
                  onChange={(event) => setImageUrl(event.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            <Button
              type="submit"
              className="h-11 w-full"
              disabled={loading || !passwordValid}
            >
              {loading ? "Creating account..." : "Create account"}
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
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
