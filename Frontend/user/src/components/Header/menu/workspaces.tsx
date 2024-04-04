import * as React from 'react'
import { Box, Button, ClickAwayListener, Grow, Paper, Popper, MenuList, Stack, Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

import { Link } from 'react-router-dom'
import { useTheme } from '../../Theme/themeContext'
import { WorkspaceApiRTQ } from '~/api'

export default function WorkSpaces() {
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLButtonElement>(null)
  const { darkMode, colors } = useTheme()
  const [getALlWorkspace, { data: workspaceData }] = WorkspaceApiRTQ.WorkspaceApiSlice.useLazyGetAllWorkspaceQuery()

  React.useEffect(() => {
    getALlWorkspace()
  }, [getALlWorkspace])

  const listWorkspaceData = !workspaceData?.data
    ? []
    : [
        ...workspaceData.data.admin,
        ...workspaceData.data.guest,
        ...workspaceData.data.member,
        ...workspaceData.data.guest
      ]
  const listWorkspaceNotGuestData = !workspaceData?.data
    ? []
    : [...workspaceData.data.admin, ...workspaceData.data.guest, ...workspaceData.data.member]

  const listWorkspaceGuestData = workspaceData?.data.guest || []

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

  const generateRandomColor = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16)
  }

  return (
    <Stack direction='row' spacing={2}>
      <Box>
        <Button
          ref={anchorRef}
          id='button-workspace'
          aria-controls={open ? 'menu-workspace' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup='true'
          onClick={handleToggle}
          endIcon={<FontAwesomeIcon icon={faChevronDown} style={{ fontSize: '12px' }} />}
          sx={{
            fontSize: '13px',
            textTransform: 'none',
            color: open ? '#579dff' : colors.text,
            '&:hover': {
              backgroundColor: open ? colors.bg_button_active_hover : colors.bg_button_hover
            },
            backgroundColor: open ? 'rgba(86,157,255,0.1)' : 'transparent',
            transition: 'all 0.1s ease-in',
            lineHeight: '22px'
          }}
        >
          Workspaces
        </Button>
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
                transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom'
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
                      padding: '12px',
                      backgroundColor: colors.background_menu_header,
                      minWidth: '304px',
                      borderRadius: '4px'
                    }}
                  >
                    {listWorkspaceData && listWorkspaceData.length !== 0 && (
                      <>
                        {listWorkspaceNotGuestData && listWorkspaceNotGuestData.length !== 0 && (
                          <Box>
                            <Typography
                              variant='body1'
                              sx={{ fontSize: '12px', fontWeight: 700, color: colors.text, marginBottom: '8px' }}
                            >
                              Your Workspaces
                            </Typography>

                            {listWorkspaceNotGuestData.map((workspace, index) => (
                              <Link to={`/workspace/${workspace._id}`} key={index}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '8px',
                                    cursor: 'pointer',
                                    '&:hover': {
                                      backgroundColor: !darkMode ? `rgba(0,0,0,0.1)` : `rgba(255,255,255,0.1)`,
                                      borderRadius: '4px'
                                    }
                                  }}
                                >
                                  <Typography
                                    variant='h4'
                                    sx={{
                                      display: 'inline-block',
                                      fontSize: '20px',
                                      fontWeight: 700,
                                      padding: '8px 14px',
                                      borderRadius: '6px',
                                      backgroundImage: `linear-gradient(to bottom, ${generateRandomColor()}, ${generateRandomColor()})`
                                    }}
                                  >
                                    {workspace.name.charAt(0).toUpperCase()}
                                  </Typography>

                                  <Typography
                                    variant='body1'
                                    sx={{ fontSize: '14px', fontWeight: 700, color: colors.text, marginLeft: '12px' }}
                                  >
                                    {workspace.name}
                                  </Typography>
                                </Box>
                              </Link>
                            ))}
                          </Box>
                        )}

                        {listWorkspaceGuestData && listWorkspaceGuestData.length !== 0 && (
                          <Box sx={{ marginTop: '20px' }}>
                            <Typography
                              variant='body1'
                              sx={{ fontSize: '12px', fontWeight: 700, color: colors.text, marginBottom: '8px' }}
                            >
                              Guest Workspaces
                            </Typography>

                            {listWorkspaceGuestData.map((workspace, index) => (
                              <Link to={`/workspace/${workspace._id}`} key={index}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '8px',
                                    cursor: 'pointer',
                                    '&:hover': {
                                      backgroundColor: !darkMode ? `rgba(0,0,0,0.1)` : `rgba(255,255,255,0.1)`,
                                      borderRadius: '4px'
                                    }
                                  }}
                                >
                                  <Typography
                                    variant='h4'
                                    sx={{
                                      display: 'inline-block',
                                      fontSize: '20px',
                                      fontWeight: 700,
                                      padding: '8px 14px',
                                      borderRadius: '6px',
                                      backgroundImage: `linear-gradient(to bottom, ${generateRandomColor()}, ${generateRandomColor()})`
                                    }}
                                  >
                                    {workspace.name.charAt(0).toUpperCase()}
                                  </Typography>

                                  <Typography
                                    variant='body1'
                                    sx={{ fontSize: '14px', fontWeight: 700, color: colors.text, marginLeft: '12px' }}
                                  >
                                    {workspace.name}
                                  </Typography>
                                </Box>
                              </Link>
                            ))}
                          </Box>
                        )}
                      </>
                    )}
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
