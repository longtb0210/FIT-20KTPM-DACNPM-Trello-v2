import * as React from 'react'
import { Box, Button, ClickAwayListener, Grow, Paper, Popper, MenuList, Stack, Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSynagogue, faUsers } from '@fortawesome/free-solid-svg-icons'
import { faTrello } from '@fortawesome/free-brands-svg-icons'
import CreateBoard from './createBoard'
import { useTheme } from './../../Theme/themeContext'
import CreateWorkspace from './createWorkspace'

export default function Create() {
  const [open, setOpen] = React.useState(false)
  const [openWorkspace, setOpenWorkspace] = React.useState(false)
  const [openItem, setOpenItem] = React.useState({ show: false, type: 'Create' })
  const anchorRef = React.useRef<HTMLButtonElement>(null)
  const { darkMode, colors } = useTheme()

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
    setOpenItem({ show: false, type: 'Create' })
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
        <Button
          ref={anchorRef}
          id='composition-button'
          aria-controls={open ? 'composition-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup='true'
          onClick={handleToggle}
          sx={{
            fontSize: '13px',
            fontWeight: 600,
            textTransform: 'none',
            color: open ? '#579dff' : darkMode ? '#1d2125' : '#fff',
            backgroundColor: open ? 'rgba(86,157,255,0.1)' : '#579dff',
            '&:hover': {
              backgroundColor: open ? 'rgba(86,157,255,0.3)' : '#85B8FF'
            },
            transition: 'all 0.1s ease-in',
            lineHeight: '20px',
            marginLeft: '10px'
          }}
        >
          Create
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
              <Paper
                sx={{
                  backgroundColor: 'transparent',
                  boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'
                }}
              >
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id='composition-menu'
                    aria-labelledby='composition-button'
                    onKeyDown={handleListKeyDown}
                    sx={{
                      marginTop: '8px',
                      transition: 'all 0.1s ease-in',
                      backgroundColor: colors.background_menu_header,
                      width: '304px',
                      padding: '12px 0',
                      borderRadius: '4px'
                    }}
                  >
                    {[
                      !openItem.show && openItem.type === 'Create' && (
                        <Box
                          key='create-board'
                          onClick={() => {
                            setOpenItem({ show: true, type: 'Create board' })
                          }}
                          sx={{
                            padding: '6px 12px',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: colors.bg_button_hover
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex' }}>
                            <FontAwesomeIcon icon={faTrello} style={{ color: colors.text }} />

                            <Typography
                              variant='body1'
                              sx={{ fontSize: '14px', color: colors.text, marginLeft: '4px' }}
                            >
                              Create board
                            </Typography>
                          </Box>

                          <Typography variant='body1' sx={{ fontSize: '12px', color: colors.text, marginTop: '4px' }}>
                            A board is made up of cards ordered on lists. Use it to manage projects, track information,
                            or organize anything.
                          </Typography>
                        </Box>
                      ),
                      !openItem.show && (
                        <Box
                          key='start-template'
                          onClick={() => {
                            setOpen(false)
                          }}
                          sx={{
                            padding: '6px 12px',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: colors.bg_button_hover
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex' }}>
                            <FontAwesomeIcon icon={faSynagogue} style={{ color: colors.text }} />

                            <Typography
                              variant='body1'
                              sx={{ fontSize: '14px', color: colors.text, marginLeft: '4px' }}
                            >
                              Start with a template
                            </Typography>
                          </Box>

                          <Typography variant='body1' sx={{ fontSize: '12px', color: colors.text, marginTop: '4px' }}>
                            Get started faster with a board template.
                          </Typography>
                        </Box>
                      ),
                      !openItem.show && (
                        <Box
                          key='create-workspace'
                          onClick={() => {
                            setOpenItem({ show: false, type: 'Create workspace' }),
                              setOpenWorkspace(true),
                              setOpen(false)
                          }}
                          sx={{
                            padding: '6px 12px',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: colors.bg_button_hover
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex' }}>
                            <FontAwesomeIcon icon={faUsers} style={{ color: colors.text }} />

                            <Typography
                              variant='body1'
                              sx={{ fontSize: '14px', color: colors.text, marginLeft: '4px' }}
                            >
                              Create Workspaces
                            </Typography>
                          </Box>

                          <Typography variant='body1' sx={{ fontSize: '12px', color: colors.text, marginTop: '4px' }}>
                            A Workspace is a group of boards and people. Use it to organize your company, side hustle,
                            family, or friends.
                          </Typography>
                        </Box>
                      ),
                      openItem.show && openItem.type === 'Create board' && (
                        <CreateBoard
                          key='create-board-component'
                          onBack={() => {
                            setOpenItem({ show: false, type: 'Create' })
                          }}
                          onClose={() => {
                            setOpen(false)
                          }}
                        />
                      )
                    ]}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
        {openWorkspace && openItem.type === 'Create workspace' && (
          <CreateWorkspace onClose={() => setOpenWorkspace(false)} />
        )}
      </Box>
    </Stack>
  )
}
