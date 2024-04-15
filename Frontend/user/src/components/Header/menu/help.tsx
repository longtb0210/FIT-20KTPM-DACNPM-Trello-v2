import * as React from 'react'
import { Box, ClickAwayListener, Grow, Paper, Popper, MenuList, Stack, Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons'
import bgHelp from '~/assets/bg_help.png'
import { useTheme } from './../../Theme/themeContext'

export default function Help() {
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

  function handleListKeyDown(event: React.KeyboardEvent) {
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
          id='button-starred'
          aria-controls={open ? 'menu-starred' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup='true'
          onClick={handleToggle}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            padding: '6px',
            '&:hover': {
              transition: 'all 0.1s ease-in',
              backgroundColor: colors.bg_button_hover
            },
            marginRight: '4px',
            cursor: 'pointer'
          }}
        >
          <FontAwesomeIcon icon={faQuestionCircle} style={{ fontSize: '18px' }} />
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
                    id='menu-starred'
                    aria-labelledby='button-starred'
                    onKeyDown={handleListKeyDown}
                    sx={{
                      marginTop: '8px',
                      transition: 'all 0.1s ease-in',
                      backgroundColor: colors.background_menu_header,
                      width: '377px',
                      padding: '20px',
                      borderRadius: '4px'
                    }}
                  >
                    <Box>
                      <img
                        src={bgHelp}
                        alt=''
                        style={{ backgroundSize: 'cover', width: '100%', borderRadius: '4px' }}
                      />

                      <Typography
                        variant='body1'
                        sx={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: colors.text,
                          textAlign: 'center',
                          padding: '0 12px',
                          margin: '16px 0'
                        }}
                      >
                        It’s easy to get your team up and running with Trello playbooks
                      </Typography>

                      <Typography
                        variant='body1'
                        sx={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#579dff',
                          textAlign: 'center',
                          paddingBottom: '16px',
                          borderBottom: '1px solid #9fadbc'
                        }}
                      >
                        Get a new tip.
                      </Typography>

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '10px',
                          marginTop: '10px',
                          color: colors.text
                        }}
                      >
                        <Box
                          sx={{
                            padding: '4px 8px',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: colors.bg_button_hover,
                              borderRadius: '4px'
                            }
                          }}
                        >
                          Pricing
                        </Box>
                        <Box
                          sx={{
                            padding: '4px 8px',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: colors.bg_button_hover,
                              borderRadius: '4px'
                            }
                          }}
                        >
                          Apps
                        </Box>
                        <Box
                          sx={{
                            padding: '4px 8px',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: colors.bg_button_hover,
                              borderRadius: '4px'
                            }
                          }}
                        >
                          Blog
                        </Box>
                        <Box
                          sx={{
                            padding: '4px 8px',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: colors.bg_button_hover,
                              borderRadius: '4px'
                            }
                          }}
                        >
                          Privacy
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '10px',
                          marginTop: '10px',
                          color: colors.text
                        }}
                      >
                        <Box
                          sx={{
                            padding: '4px 8px',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: colors.bg_button_hover,
                              borderRadius: '4px'
                            }
                          }}
                        >
                          Notice at Collection
                        </Box>
                        <Box
                          sx={{
                            fontWeight: 600,
                            padding: '4px 8px',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: colors.bg_button_hover,
                              borderRadius: '4px'
                            }
                          }}
                        >
                          More...
                        </Box>
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
