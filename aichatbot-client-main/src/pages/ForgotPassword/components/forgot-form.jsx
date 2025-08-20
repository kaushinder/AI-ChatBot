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
import { Form, useFetcher, useNavigate } from 'react-router-dom'
import { RxCross2 } from 'react-icons/rx'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'

export function ForgotPasswordForm({ className, ...props }) {
  const fetcher = useFetcher()
  const toastIdRef = useRef(null)
  const navigate = useNavigate()

  // Detect start of form submission
  useEffect(() => {
    if (fetcher.state === 'submitting' && !toastIdRef.current) {
      toastIdRef.current = toast.loading('Sending email...')
    }
  }, [fetcher.state])

  // Detect response
  useEffect(() => {
    if (fetcher.data && toastIdRef.current) {
      // Delay for 2 seconds
      const delay = 2000

      setTimeout(() => {
        if (fetcher.data.success) {
          const { success } = fetcher.data
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
    <div className={cn('flex flex-col gap-4', className)} {...props}>
      <Card className="relative">
        <RxCross2
          className="absolute top-4 right-4 cursor-pointer text-xl"
          onClick={() => navigate('/')}
        />
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Forgot Password?</CardTitle>
          <CardDescription>
            Please provide your email. We'll send you an email to reset your
            password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <fetcher.Form
            method="POST"
            action="/forgot-password"
            replace
            preventScrollReset
          >
            <div className="grid gap-4">
              <div className="grid gap-4">
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
                <Button type="submit" className="w-full">
                  Send Email
                </Button>
              </div>
            </div>
          </fetcher.Form>
        </CardContent>
      </Card>
    </div>
  )
}
