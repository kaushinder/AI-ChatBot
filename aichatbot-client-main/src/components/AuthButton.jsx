import { useAuth } from '@/hooks/useAuth'
import { Button } from './ui/button'
import { BiLogIn, BiLogOut } from 'react-icons/bi'
import { Link } from 'react-router-dom'

function AuthButton() {
  const { isLoggedIn, handleLogOut } = useAuth()
  return (
    <>
      {isLoggedIn ? (
        <Button onClick={handleLogOut}>
          <BiLogOut /> Log Out
        </Button>
      ) : (
        <Link to="/login">
          <Button>
            Log In <BiLogIn />
          </Button>
        </Link>
      )}
    </>
  )
}

export default AuthButton
