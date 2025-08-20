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
import { Form, useFetcher, useNavigate, useParams } from 'react-router-dom'
import { RxCross2 } from 'react-icons/rx'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'

export function ResetPasswordForm({ className, ...props }) {
  const fetcher = useFetcher()
  const toastIdRef = useRef(null)
  const navigate = useNavigate()
  const { resetToken } = useParams()

  // Detect start of form submission
  useEffect(() => {
    if (fetcher.state === 'submitting' && !toastIdRef.current) {
      toastIdRef.current = toast.loading('Resetting password...')
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
          navigate('/login')
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
          <CardTitle className="text-xl">Enter New Password</CardTitle>
        </CardHeader>
        <CardContent>
          <fetcher.Form
            method="POST"
            action={`/reset-password/${resetToken}`}
            replace
            preventScrollReset
          >
            <div className="grid gap-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">New Password</Label>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Reset Password
                </Button>
              </div>
            </div>
          </fetcher.Form>
        </CardContent>
      </Card>
    </div>
  )
}
