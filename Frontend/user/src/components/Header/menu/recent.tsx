import * as React from 'react'
import { Box, Button, ClickAwayListener, Grow, Paper, Popper, MenuList, Stack, Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronDown
  // faStar as starFull
} from '@fortawesome/free-solid-svg-icons'
// import { faStar } from '@fortawesome/free-regular-svg-icons'
import { useTheme } from './../../Theme/themeContext'
import { BoardApiRTQ, WorkspaceApiRTQ } from '~/api'
import noWorkspace from '~/assets/no_workspace.svg'
import { Link } from 'react-router-dom'

interface Activity {
  workspace_id: string
  content: string
  create_time: Date
  creator_email: string
  _id?: string
  board_id?: string | null
  cardlist_id?: string | null
  card_id?: string | null
}

interface Label {
  name: string
  color: string
  _id?: string
}

interface Board {
  name: string
  workspace_id: string
  watcher_email: string[]
  activities: Activity[]
  background: string
  background_list: string[]
  visibility: 'private' | 'workspace' | 'public'
  members_email: string[]
  labels: Label[]
  is_star: boolean
  _id?: string
}

export default function Recent() {
  const [open, setOpen] = React.useState(false)
  // const [isHovered, setIsHovered] = React.useState(false)
  // const [isHoveredStar, setIsHoveredStar] = React.useState(false)
  // const [star, setStar] = React.useState(false)
  const anchorRef = React.useRef<HTMLButtonElement>(null)
  const { colors } = useTheme()
  const [getBoardById] = BoardApiRTQ.BoardApiSlice.useLazyGetBoardByIdQuery()
  const [getWorkspaceByID, { data: dataWorkspace }] = WorkspaceApiRTQ.WorkspaceApiSlice.useGetWorkspaceByIDMutation()
  const [listBoard, setListBoard] = React.useState<Board[]>([])
  const [listNameWorkspace, setListNameWorkspace] = React.useState<string[]>([])

  const savedValuesString = localStorage.getItem('savedValues')

  React.useEffect(() => {
    if (savedValuesString) {
      const savedValues = JSON.parse(savedValuesString)

      setListBoard([])

      savedValues.map((recent: string) => {
        getBoardById(recent).then((res) => {
          if (res.data && res.data.data) {
            const newBoard: Board = {
              name: res.data.data.name || '',
              workspace_id: res.data.data.workspace_id || '',
              background: res.data.data.background || '',
              background_list: res.data.data.background_list || [],
              activities: res.data.data.activities || [],
              visibility: res.data.data.visibility || 'private',
              members_email: res.data.data.members_email || [],
              labels: res.data.data.labels || [],
              is_star: res.data.data.is_star || false,
              watcher_email: res.data.data.watcher_email || [],
              _id: res.data.data._id || ''
            }
            setListBoard((prev) => [...prev, newBoard])
          }
        })
      })
    }
  }, [getBoardById, savedValuesString])

  React.useEffect(() => {
    if (listBoard) {
      listBoard.map((board) => {
        getWorkspaceByID({ workspace_id: board.workspace_id }).then(() => {
          if (dataWorkspace) {
            const workspaceName = dataWorkspace.data?.name || ''
            setListNameWorkspace((prev) => [workspaceName, ...prev])
          }
        })
      })
    }
  }, [dataWorkspace, getWorkspaceByID, listBoard])

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
                    {listBoard.length !== 0 ? (
                      listBoard.map((board, index) => (
                        <Link
                          key={index}
                          to={`workspace/${board.workspace_id}/board/${board._id}`}
                          onClick={() => setOpen(false)}
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
                            // onMouseEnter={() => setIsHovered(true)}
                            // onMouseLeave={() => setIsHovered(false)}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box
                                sx={{
                                  backgroundImage:
                                    board.background.charAt(0) === 'h'
                                      ? `url("${board.background}")`
                                      : board.background,
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
                                  {board.name}
                                </Typography>
                                <Typography
                                  variant='body1'
                                  sx={{ fontSize: '12px', color: colors.text, marginLeft: '12px' }}
                                >
                                  {listNameWorkspace[index]}
                                </Typography>
                              </Box>
                            </Box>

                            {/* {isHovered && (
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
                            )} */}
                          </Box>
                        </Link>
                      ))
                    ) : (
                      <Box>
                        <img src={noWorkspace} alt='' style={{ backgroundSize: 'cover', width: '100%' }} />

                        <Typography
                          variant='body1'
                          sx={{ fontSize: '14px', color: colors.text, textAlign: 'center', margin: '12px 0 8px 0' }}
                        >
                          No workspace
                        </Typography>
                      </Box>
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
