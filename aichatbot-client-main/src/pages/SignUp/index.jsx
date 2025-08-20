import { GalleryVerticalEnd } from 'lucide-react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SignupForm } from './components/signup-form'

function SignUp() {
  useEffect(() => {
    document.body.classList.add('no-scroll')
    document.documentElement.classList.add('no-scroll')

    return () => {
      document.body.classList.remove('no-scroll')
      document.documentElement.classList.remove('no-scroll')
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-xs flex flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-2">
        <Link
          to="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          AI CHATBOT
        </Link>
        <SignupForm />
      </div>
    </div>
  )
}

export default SignUp
