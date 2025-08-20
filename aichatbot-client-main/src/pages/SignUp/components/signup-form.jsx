import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Form, Link, useFetcher, useNavigate } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import { RxCross2 } from 'react-icons/rx'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'

export function SignupForm({ className, ...props }) {
  const [showPassword, setShowPassword] = useState(false)

  const fetcher = useFetcher()
  const toastIdRef = useRef(null)
  const navigate = useNavigate()

  const { handleLogin } = useAuth()

  // Detect start of form submission
  useEffect(() => {
    if (fetcher.state === 'submitting' && !toastIdRef.current) {
      toastIdRef.current = toast.loading('Signing up...')
    }
  }, [fetcher.state])

  // Detect response
  useEffect(() => {
    if (fetcher.data && toastIdRef.current) {
      // Delay for 2 seconds
      const delay = 2000

      setTimeout(() => {
        if (fetcher.data.success) {
          const { response, success } = fetcher.data
          console.log(response)
          handleLogin(
            response.token,
            response.user._id,
            response.conversationId,
            response.user.name
          )
          toast.success(success, { id: toastIdRef.current })
          navigate('/')
        } else if (fetcher.data.error) {
          toast.error(fetcher.data.error, { id: toastIdRef.current })
        }
        toastIdRef.current = null
      }, delay)
    }
  }, [fetcher.data])

  return (
    <div className={cn('flex flex-col gap-3', className)} {...props}>
      <Card className="relative">
        <RxCross2
          className="absolute top-4 right-4 cursor-pointer text-xl"
          onClick={() => navigate('/')}
        />
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome</CardTitle>
          <CardDescription>Signup with your account</CardDescription>
        </CardHeader>
        <CardContent>
          <fetcher.Form
            method="POST"
            action="/signup"
            replace
            preventScrollReset
          >
            <div className="grid gap-3">
              <div className="grid gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="john"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="link"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword((prev) => !prev)}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Signup
                </Button>
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div className="flex flex-col gap-3">
                <Button variant="outline" className="w-full">
                  <FcGoogle /> Signup with Google
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{' '}
                <Link to="/login" className="underline underline-offset-4">
                  Login
                </Link>
              </div>
            </div>
          </fetcher.Form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{' '}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
