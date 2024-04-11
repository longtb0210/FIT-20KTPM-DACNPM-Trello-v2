import * as React from 'react'
import { Box, Button, ClickAwayListener, Grow, Paper, Popper, MenuList, Stack, Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from './../../Theme/themeContext'

const ListTemplate = [
  {
    title: '1-on-1 Meeting Agenda',
    image:
      'https://trello-backgrounds.s3.amazonaws.com/SharedBackground/480x320/350dda08d977f92d756f3d9ec111ea66/photo-1521495084171-3ad639e3d525.jpg'
  },
  {
    title: 'Agile Board Template | Trello',
    image:
      'https://trello-backgrounds.s3.amazonaws.com/53baf533e697a982248cd73f/480x480/96406688eb291c869064290cfb9b0c80/shutterstock_134707556.jpg'
  },
  {
    title: 'Company Overview',
    image:
      'https://trello-backgrounds.s3.amazonaws.com/SharedBackground/480x320/4315f9a5b3c78f696d170e9b626a44d6/e2d2752f.jpg'
  },
  {
    title: 'Design Huddle',
    image:
      'https://trello-backgrounds.s3.amazonaws.com/SharedBackground/320x480/ff001cf6d3206de96d324c4a3646f844/photo-1500462918059-b1a0cb512f1d.jpg'
  },
  {
    title: 'Go To Market Strategy Template',
    image:
      'https://trello-backgrounds.s3.amazonaws.com/5755843411a2cd8c83067c03/480x320/cf2d1e29e8e3a4857a5f58f500fb464c/ian-dooley-407846-unsplash.jpg'
  },
  {
    title: 'Kanban Template',
    image:
      'https://trello-backgrounds.s3.amazonaws.com/SharedBackground/480x322/47f09f0e3910259568294477d0bdedac/photo-1576502200916-3808e07386a5.jpg'
  }
]

export default function Templates() {
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
        <Button
          ref={anchorRef}
          id='button-template'
          aria-controls={open ? 'menu-template' : undefined}
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
          Templates
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
              <Paper sx={{ boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    onKeyDown={handleListKeyDown}
                    autoFocusItem={open}
                    id='menu-recent'
                    aria-labelledby='button-recent'
                    sx={{
                      marginTop: '8px',
                      transition: 'all 0.1s ease-in',
                      padding: '12px',
                      backgroundColor: colors.background_menu_header,
                      minWidth: '304px',
                      borderRadius: '4px'
                    }}
                  >
                    <p
                      style={{
                        fontSize: '12px',
                        fontWeight: 500,
                        color: colors.text,
                        marginBottom: '8px'
                      }}
                    >
                      Top Template
                    </p>
                    {ListTemplate.map((template, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '4px',
                          marginBottom: '4px',
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor:
                              colors.background === '#ffffff' ? `rgba(0,0,0,0.1)` : `rgba(255,255,255,0.1)`,
                            borderRadius: '4px'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            sx={{
                              backgroundImage: `url("${template.image}")`,
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
                              {template.title}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
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
