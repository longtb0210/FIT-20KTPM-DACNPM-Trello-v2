import * as React from 'react'
import { Box, Button, ClickAwayListener, Grow, Paper, Popper, MenuList, Stack, Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faStar as starFull } from '@fortawesome/free-solid-svg-icons'
import { faStar } from '@fortawesome/free-regular-svg-icons'
import { useTheme } from './../../Theme/themeContext'

export default function Recent() {
  const [open, setOpen] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)
  const [isHoveredStar, setIsHoveredStar] = React.useState(false)
  const [star, setStar] = React.useState(false)
  const anchorRef = React.useRef<HTMLButtonElement>(null)
  const { colors } = useTheme()

  const savedValuesString = localStorage.getItem('savedValues')
  if (savedValuesString) {
    const savedValues = JSON.parse(savedValuesString)
    console.log(savedValues)
  } else {
    console.log('cc')
  }

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
        <Button
          ref={anchorRef}
          id='button-recent'
          aria-controls={open ? 'menu-recent' : undefined}
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
          Recent
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
                    id='menu-recent'
                    aria-labelledby='button-recent'
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
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '4px',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor:
                            colors.background === '#ffffff' ? `rgba(0,0,0,0.1)` : `rgba(255,255,255,0.1)`,
                          borderRadius: '4px'
                        }
                      }}
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
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
                            sx={{ fontSize: '14px', fontWeight: 600, color: colors.text, marginLeft: '12px' }}
                          >
                            front-end
                          </Typography>
                          <Typography variant='body1' sx={{ fontSize: '12px', color: colors.text, marginLeft: '12px' }}>
                            Trello Workspaces
                          </Typography>
                        </Box>
                      </Box>

                      {isHovered && (
                        <FontAwesomeIcon
                          icon={faStar}
                          style={{
                            color: isHoveredStar ? 'yellow' : colors.text,
                            marginRight: '8px',
                            display: star ? 'none' : 'block',
                            fontSize: isHoveredStar ? '16px' : '14px',
                            transition: 'all 0.1s ease-in'
                          }}
                          onMouseEnter={() => setIsHoveredStar(true)}
                          onMouseLeave={() => setIsHoveredStar(false)}
                          onClick={() => setStar(true)}
                        />
                      )}
                      {star && (
                        <FontAwesomeIcon
                          icon={starFull}
                          style={{
                            color: 'yellow',
                            marginRight: '8px',
                            fontSize: isHoveredStar ? '16px' : '14px',
                            transition: 'all 0.1s ease-in'
                          }}
                          onMouseEnter={() => setIsHoveredStar(true)}
                          onMouseLeave={() => setIsHoveredStar(false)}
                          onClick={() => setStar(false)}
                        />
                      )}
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
