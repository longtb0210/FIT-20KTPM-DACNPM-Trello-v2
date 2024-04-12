import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { Box, ClickAwayListener, Grow, MenuList, Paper, Popper, Typography } from '@mui/material'
import { useTheme } from './../../Theme/themeContext'

const SearchMenu = () => {
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
    <Box sx={{ marginRight: '4px' }}>
      <Box
        sx={{ position: 'relative' }}
        ref={anchorRef}
        id='button-workspace'
        aria-controls={open ? 'menu-workspace' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup='true'
        onClick={handleToggle}
      >
        <input
          type='text'
          placeholder='Search'
          style={{
            width: '400px',
            backgroundColor: 'transparent',
            border: '2px solid #9fadbc',
            borderRadius: '4px',
            padding: '4px 10px 4px 30px',
            fontSize: '14px',
            outline: 'none'
          }}
          onFocus={(e) => {
            e.target.style.border = '2px solid #85b8ff' // Thay đổi màu viền khi focus
          }}
          onBlur={(e) => {
            e.target.style.border = '2px solid #9fadbc' // Thay đổi màu viền khi focus
          }}
        />

        <FontAwesomeIcon
          icon={faSearch}
          style={{
            fontSize: '12px',
            position: 'absolute',
            color: colors.text,
            top: '50%',
            left: 0,
            translate: '0 -50%',
            marginLeft: '10px'
          }}
        />
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
              transformOrigin: placement === 'bottom-start' ? 'top' : 'right top'
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
                    width: '400px',
                    marginTop: '8px',
                    transition: 'all 0.1s ease-in',
                    padding: '12px 0 6px 0',
                    backgroundColor: colors.background,
                    minWidth: '224px',
                    borderRadius: '4px'
                  }}
                >
                  <Typography
                    variant='body1'
                    sx={{ fontSize: '11px', fontWeight: 500, color: colors.text, margin: '0 18px 8px 18px' }}
                  >
                    RECENT BOARD
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '4px 18px',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: colors.background === '#ffffff' ? `rgba(0,0,0,0.1)` : `rgba(255,255,255,0.1)`
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          backgroundImage:
                            'url("https://trello-backgrounds.s3.amazonaws.com/SharedBackground/480x320/69360d5ef9e7535cda824ab868bb1628/photo-1708058885492-09ef26cd4af8.jpg")',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          width: '40px',
                          height: '32px',
                          borderRadius: '4px'
                        }}
                      ></Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography
                          variant='body1'
                          sx={{ fontSize: '14px', fontWeight: 500, color: colors.text, marginLeft: '12px' }}
                        >
                          Front-end
                        </Typography>
                        <Typography variant='body1' sx={{ fontSize: '12px', color: colors.text, marginLeft: '12px' }}>
                          Trello Workspaces
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '4px 18px',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: colors.background === '#ffffff' ? `rgba(0,0,0,0.1)` : `rgba(255,255,255,0.1)`
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          backgroundImage:
                            'url("https://trello-backgrounds.s3.amazonaws.com/SharedBackground/480x320/69360d5ef9e7535cda824ab868bb1628/photo-1708058885492-09ef26cd4af8.jpg")',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          width: '40px',
                          height: '32px',
                          borderRadius: '4px'
                        }}
                      ></Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography
                          variant='body1'
                          sx={{ fontSize: '14px', fontWeight: 500, color: colors.text, marginLeft: '12px' }}
                        >
                          Grab
                        </Typography>
                        <Typography variant='body1' sx={{ fontSize: '12px', color: colors.text, marginLeft: '12px' }}>
                          Brab Workspaces
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '4px 18px',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: colors.background === '#ffffff' ? `rgba(0,0,0,0.1)` : `rgba(255,255,255,0.1)`
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          backgroundImage:
                            'url("https://trello-backgrounds.s3.amazonaws.com/SharedBackground/480x320/69360d5ef9e7535cda824ab868bb1628/photo-1708058885492-09ef26cd4af8.jpg")',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          width: '40px',
                          height: '32px',
                          borderRadius: '4px'
                        }}
                      ></Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography
                          variant='body1'
                          sx={{ fontSize: '14px', fontWeight: 500, color: colors.text, marginLeft: '12px' }}
                        >
                          La lá là
                        </Typography>
                        <Typography variant='body1' sx={{ fontSize: '12px', color: colors.text, marginLeft: '12px' }}>
                          Trello Workspaces
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '4px 18px',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: colors.background === '#ffffff' ? `rgba(0,0,0,0.1)` : `rgba(255,255,255,0.1)`
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          backgroundImage:
                            'url("https://trello-backgrounds.s3.amazonaws.com/SharedBackground/480x320/69360d5ef9e7535cda824ab868bb1628/photo-1708058885492-09ef26cd4af8.jpg")',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          width: '40px',
                          height: '32px',
                          borderRadius: '4px'
                        }}
                      ></Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography
                          variant='body1'
                          sx={{ fontSize: '14px', fontWeight: 500, color: colors.text, marginLeft: '12px' }}
                        >
                          Test
                        </Typography>
                        <Typography variant='body1' sx={{ fontSize: '12px', color: colors.text, marginLeft: '12px' }}>
                          Hữu Chính Workspaces
                        </Typography>
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
  )
}

export default SearchMenu
