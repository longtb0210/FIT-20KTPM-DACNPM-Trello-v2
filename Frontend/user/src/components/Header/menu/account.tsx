import * as React from 'react'
import { Box, ClickAwayListener, Grow, Paper, Popper, MenuList, Stack, Typography, Avatar } from '@mui/material'
import { Link } from 'react-router-dom'
import { useTheme } from './../../Theme/themeContext'
import { AuthContext } from '~/components/AuthProvider/AuthProvider'
import { stringAvatar } from '~/utils/StringAvatar'

export default function Account() {
  const [open, setOpen] = React.useState(false)
  const [profile, setProfile] = React.useState({ email: '', name: '' })
  const anchorRef = React.useRef<HTMLButtonElement>(null)
  const { darkMode, toggleDarkMode, colors } = useTheme()
  const authContext = React.useContext(AuthContext)

  const storedProfile = localStorage.getItem('profile')
  React.useEffect(() => {
    const profileSave = storedProfile ? JSON.parse(storedProfile) : { email: '', name: '' }
    setProfile({ ...profileSave })
  }, [storedProfile])

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault()
      setOpen(false)
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open)
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus()
    }

    prevOpen.current = open
  }, [open])

  const handleLogout = () => {
    if (authContext) {
      authContext.logout()
    }
  }

  return (
    <Stack direction='row' spacing={2}>
      <Box>
        <Box
          ref={anchorRef}
          id='button-workspace'
          aria-controls={open ? 'menu-workspace' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup='true'
          onClick={handleToggle}
          sx={{
            borderRadius: '50%',
            padding: '5px',
            '&:hover': {
              transition: 'all 0.1s ease-in',
              backgroundColor: colors.bg_button_hover
            },
            cursor: 'pointer'
          }}
        >
          <Avatar {...stringAvatar(profile.name, '9px', 22, 22)} className={`font-bold`} />
        </Box>

        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement='bottom-start'
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom-start' ? 'left top' : 'right top'
              }}
            >
              <Paper sx={{ backgroundColor: 'transparent', boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id='menu-workspace'
                    aria-labelledby='button-workspace'
                    onKeyDown={handleListKeyDown}
                    sx={{
                      marginTop: '8px',
                      transition: 'all 0.1s ease-in',
                      padding: '12px 0 6px 0',
                      backgroundColor: colors.background,
                      minWidth: '224px',
                      borderRadius: '4px'
                    }}
                  >
                    <Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '10px',
                          padding: '0 20px'
                        }}
                      >
                        <Avatar {...stringAvatar(profile.name, '14px', 44, 44)} className={`font-bold`} />

                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant='body1' sx={{ fontSize: '14px', color: colors.text, marginLeft: '12px' }}>
                            {profile.name}
                          </Typography>
                          <Typography variant='body1' sx={{ fontSize: '12px', color: colors.text, marginLeft: '12px' }}>
                            {profile.email}
                          </Typography>
                        </Box>
                      </Box>

                      <Box>
                        <Typography
                          variant='body1'
                          sx={{
                            fontSize: '10px',
                            fontWeight: 700,
                            color: colors.text,
                            marginBottom: '4px',
                            padding: '0 20px'
                          }}
                        >
                          TRELLO
                        </Typography>
                        <Link to={'/profile'}>
                          <Typography
                            variant='body1'
                            sx={{
                              cursor: 'pointer',
                              fontSize: '14px',
                              color: colors.text,
                              marginBottom: '4px',
                              padding: '10px 20px',
                              '&:hover': {
                                backgroundColor: colors.bg_button_hover
                              }
                            }}
                          >
                            Account management
                          </Typography>
                        </Link>
                        <Link to={'/activity'}>
                          <Typography
                            variant='body1'
                            sx={{
                              cursor: 'pointer',
                              fontSize: '14px',
                              color: colors.text,
                              marginBottom: '4px',
                              padding: '10px 20px',
                              '&:hover': {
                                backgroundColor: colors.bg_button_hover
                              }
                            }}
                          >
                            Activity
                          </Typography>
                        </Link>
                        <Typography
                          onClick={toggleDarkMode}
                          variant='body1'
                          sx={{
                            cursor: 'pointer',
                            fontSize: '14px',
                            color: colors.text,
                            marginBottom: '4px',
                            padding: '10px 20px',
                            '&:hover': {
                              backgroundColor: colors.bg_button_hover
                            },
                            borderBottom: '1px solid #b6c2cf'
                          }}
                        >
                          {darkMode ? 'Light Mode' : 'Dark Mode'}
                        </Typography>

                        <Typography
                          onClick={handleLogout}
                          variant='body1'
                          sx={{
                            cursor: 'pointer',
                            fontSize: '14px',
                            color: colors.text,
                            padding: '10px 20px',
                            '&:hover': {
                              backgroundColor: colors.bg_button_hover
                            }
                          }}
                        >
                          Log out
                        </Typography>
                      </Box>
                    </Box>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Box>
    </Stack>
  )
}
