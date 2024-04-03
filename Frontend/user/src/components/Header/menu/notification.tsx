import * as React from 'react'
import { Box, ClickAwayListener, Grow, Paper, Popper, MenuList, Stack, Typography, Badge } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-regular-svg-icons'
import { useTheme } from './../../Theme/themeContext'

export default function Notification() {
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLButtonElement>(null)
  const { colors } = useTheme()

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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6px',
            borderRadius: '50%',
            '&:hover': {
              transition: 'all 0.1s ease-in',
              backgroundColor: colors.bg_button_hover
            },
            marginRight: '4px',
            cursor: 'pointer'
          }}
        >
          <Badge badgeContent={1} color='error'>
            <FontAwesomeIcon icon={faBell} style={{ width: '18px', height: '18px' }} />
          </Badge>
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
                transformOrigin: placement === 'bottom-start' ? 'left top' : 'top right'
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
                      backgroundColor: colors.background,
                      minWidth: '424px',
                      borderRadius: '4px'
                    }}
                  >
                    <Box>
                      <Box sx={{ padding: '0 12px' }}>
                        <Typography
                          variant='body1'
                          sx={{
                            fontSize: '20px',
                            fontWeight: 500,
                            color: colors.text,
                            padding: '20px 0',
                            borderBottom: '1px solid #9fadbc'
                          }}
                        >
                          Notifications
                        </Typography>
                      </Box>

                      <Typography
                        variant='body1'
                        sx={{
                          fontSize: '12px',
                          color: colors.text,
                          textAlign: 'right',
                          padding: '12px',
                          cursor: 'pointer',
                          '&:hover': {
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        Mark all as read
                      </Typography>

                      <Box sx={{ display: 'flex', padding: '12px 0 12px 12px', backgroundColor: colors.bg_noti }}>
                        <Box sx={{ width: '90%' }}>
                          <Box
                            sx={{
                              backgroundImage:
                                'url("https://trello-backgrounds.s3.amazonaws.com/SharedBackground/480x320/69360d5ef9e7535cda824ab868bb1628/photo-1708058885492-09ef26cd4af8.jpg")',
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              width: '100%',
                              height: 'auto',
                              borderTopLeftRadius: '4px',
                              borderTopRightRadius: '4px',
                              padding: '10px'
                            }}
                          >
                            <Typography
                              variant='body1'
                              sx={{
                                fontSize: '14px',
                                color: colors.text,
                                cursor: 'pointer',
                                backgroundColor: colors.background,
                                '&:hover': {
                                  backgroundColor: colors.background_menu_header
                                },
                                padding: '10px',
                                borderRadius: '8px'
                              }}
                            >
                              Hihi
                            </Typography>

                            <Typography
                              variant='body1'
                              sx={{
                                fontSize: '14px',
                                color: '#fff',
                                margin: '8px 0'
                              }}
                            >
                              <strong>Project Trello:</strong> Doing
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: 'flex',
                              backgroundColor: colors.background,
                              padding: '10px',
                              borderEndLeftRadius: '4px',
                              borderEndRightRadius: '4px'
                            }}
                          >
                            <Box>
                              <Box
                                sx={{
                                  padding: '8px',
                                  fontSize: '12px',
                                  lineHeight: '15px',
                                  fontWeight: 600,
                                  color: '#fff',
                                  backgroundColor: '#172b4d',
                                  borderRadius: '50%'
                                }}
                              >
                                HT
                              </Box>
                            </Box>
                            <Box sx={{ marginLeft: '10px' }}>
                              <Typography
                                variant='body1'
                                sx={{
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  lineHeight: '20px',
                                  padding: '4px 0',
                                  color: colors.text
                                }}
                              >
                                Hữu Chính Trần
                              </Typography>

                              <Typography
                                variant='body1'
                                sx={{
                                  fontSize: '14px',
                                  color: colors.text,
                                  lineHeight: '20px',
                                  padding: '4px 0'
                                }}
                              >
                                Added you <span>Feb 06 at 4:18 PM</span>
                              </Typography>

                              <Typography
                                variant='body1'
                                sx={{
                                  fontSize: '14px',
                                  color: colors.text,
                                  lineHeight: '20px',
                                  padding: '4px 0'
                                }}
                              >
                                Removed you <span>Feb 06 at 4:18 PM</span>
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            backgroundColor: '#579dff',
                            borderRadius: '50%',
                            width: '16px',
                            height: '16px',
                            margin: '0 auto'
                          }}
                        ></Box>
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
