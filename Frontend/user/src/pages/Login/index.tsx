import { Box, Button } from '@mui/material'
import { useContext } from 'react'
import { UserApiRTQ } from '~/api'
import { AuthContext } from '~/components/AuthProvider/AuthProvider'

const a = 'https://trello.com/assets/da0d6fb7fd0a5918d5e8.svg'
const b = 'https://trello.com/assets/45d7253154299d327a17.png'

const Login = () => {
  const authContext = useContext(AuthContext)

  const handleLogin = () => authContext?.login()

  return (
    <Box sx={{ position: 'relative', backgroundColor: '#f1f2f4', width: '100vw', height: '100vh' }}>
      <Box
        sx={{
          padding: '200px 0 0 20%',
          height: '100%',
          color: '#172b4d',
          fontFamily:
            '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif'
        }}
      >
        <Box>
          <h1
            style={{
              fontSize: '35px',
              fontWeight: 'bold'
            }}
          >
            Sign in to see this board
          </h1>
          <p style={{ fontSize: '14px', lineHeight: '20px', marginBottom: '56px' }}>
            You’re almost there! The board you are trying to access requires a Trello account.
          </p>

          <Button
            onClick={handleLogin}
            sx={{
              backgroundColor: '#0c66e4',
              color: '#fff',
              textTransform: 'none',
              padding: '6px 14px 2px 14px',
              '&:hover': {
                transition: 'all 0.1s ease-in',
                backgroundColor: '#0055cc'
              },
              marginRight: '4px',
              cursor: 'pointer'
            }}
          >
            Sign in for free
          </Button>

          <p
            style={{
              fontSize: '14px',
              lineHeight: '20px',
              color: '#0c66e4',
              fontWeight: 600,
              marginTop: '16px'
            }}
          >
            <a href=''>Already have an account? Log in</a>
          </p>
        </Box>
      </Box>
      <Box sx={{ position: 'absolute', bottom: 0, right: 0, zIndex: 1 }}>
        <img style={{ width: '351px', height: '332px', margin: '0 66px 48px 0' }} src={a} alt='' />
      </Box>
      <Box sx={{ position: 'absolute', bottom: 0, left: 0 }}>
        <img style={{ width: '100vw', height: 'auto' }} src={b} alt='' />
      </Box>
    </Box>
  )
}

export default Login
