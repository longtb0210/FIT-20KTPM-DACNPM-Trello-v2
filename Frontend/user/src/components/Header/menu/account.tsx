import * as React from 'react'
import { Box, ClickAwayListener, Grow, Paper, Popper, MenuList, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { useTheme } from './../../Theme/themeContext'
import { AuthContext } from '~/components/AuthProvider/AuthProvider'

export default function Account() {
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLButtonElement>(null)
  const { darkMode, toggleDarkMode, colors } = useTheme()
  const authContext = React.useContext(AuthContext)

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
          <Box
            sx={{
              padding: '4px',
              fontSize: '10px',
              lineHeight: '13px',
              fontWeight: 600,
              color: '#fff',
              backgroundColor: '#172b4d',
              borderRadius: '50%'
            }}
          >
            HT
          </Box>
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
              <Paper sx={{ backgroundColor: 'transparent' }}>
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
                        <Typography
                          variant='h4'
                          sx={{
                            display: 'inline-block',
                            fontSize: '14px',
                            lineHeight: '22px',
                            color: '#fff',
                            fontWeight: 700,
                            padding: '8px 10px',
                            borderRadius: '50%',
                            backgroundImage: 'linear-gradient(to bottom, #E774BB, #943D73)'
                          }}
                        >
                          HT
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant='body1' sx={{ fontSize: '14px', color: colors.text, marginLeft: '12px' }}>
                            Hữu Chính Trần
                          </Typography>
                          <Typography variant='body1' sx={{ fontSize: '12px', color: colors.text, marginLeft: '12px' }}>
                            abc@gmail.com
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
                        <Link to={'/profile/123'}>
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
                        <Link to={'/activity/123'}>
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
