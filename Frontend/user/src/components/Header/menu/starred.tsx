import * as React from 'react'
import { Box, Button, ClickAwayListener, Grow, Paper, Popper, MenuList, Stack, Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faStar as starFull } from '@fortawesome/free-solid-svg-icons'
import noneStar from '~/assets/noneStar.svg'
import { useTheme } from './../../Theme/themeContext'
import { BoardApiRTQ, WorkspaceApiRTQ } from '~/api'
import { Link } from 'react-router-dom'

interface Board {
  name: string
  workspace_id: string
  background: string
  background_list: string[]
  activities: {
    workspace_id: string
    content: string
    create_time: Date
    creator_email: string
    _id?: string | undefined
    board_id?: string | undefined
    cardlist_id?: string | undefined
    card_id?: string | undefined
  }[]
  _id?: string | undefined
  workspace_name: string
  is_star: boolean
}

export default function Starred() {
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLButtonElement>(null)
  const { colors } = useTheme()
  const [getAllBoardById] = BoardApiRTQ.BoardApiSlice.useLazyGetBoardsByWorkspaceIDQuery()
  const [getAllWorkspace, { data: dataWorkspace }] = WorkspaceApiRTQ.WorkspaceApiSlice.useLazyGetAllWorkspaceQuery()
  const [editBoardByIdAPI] = BoardApiRTQ.BoardApiSlice.useEditBoardByIdMutation()
  const [listBoard, setListBoard] = React.useState<Board[]>([])

  React.useEffect(() => {
    getAllWorkspace()
  }, [getAllWorkspace])

  React.useEffect(() => {
    dataWorkspace?.data.owner.forEach(async (item) => {
      try {
        if (item?._id !== undefined) {
          const res = await getAllBoardById({ workspace_id: item._id })
          const responseData = res.data
          const workspaceName = item.name

          console.log(responseData)

          if (responseData && responseData.data) {
            const boardsWithWorkspaceName = responseData.data.map((board) => ({
              ...board,
              workspace_name: workspaceName
            })) as Partial<Board>[]

            const updatedBoards: Board[] = boardsWithWorkspaceName.map((board) => ({
              name: board.name ?? '',
              workspace_id: board.workspace_id ?? '',
              background: board.background ?? '',
              background_list: board.background_list ?? [],
              activities: board.activities ?? [],
              _id: board._id ?? '',
              workspace_name: board.workspace_name ?? '',
              is_star: board.is_star ?? false
            }))

            setListBoard((prevList) => [...prevList, ...updatedBoards.filter((board) => board?.is_star)])
          }
        }
      } catch (error) {
        console.error('Error fetching boards:', error)
      }
    })

    dataWorkspace?.data.admin.forEach(async (item) => {
      try {
        if (item?._id !== undefined) {
          const res = await getAllBoardById({ workspace_id: item._id })
          const responseData = res.data
          const workspaceName = item.name

          console.log(responseData)

          if (responseData && responseData.data) {
            const boardsWithWorkspaceName = responseData.data.map((board) => ({
              ...board,
              workspace_name: workspaceName
            })) as Partial<Board>[]

            const updatedBoards: Board[] = boardsWithWorkspaceName.map((board) => ({
              name: board.name ?? '',
              workspace_id: board.workspace_id ?? '',
              background: board.background ?? '',
              background_list: board.background_list ?? [],
              activities: board.activities ?? [],
              _id: board._id ?? '',
              workspace_name: board.workspace_name ?? '',
              is_star: board.is_star ?? false
            }))

            setListBoard((prevList) => [...prevList, ...updatedBoards.filter((board) => board?.is_star)])
          }
        }
      } catch (error) {
        console.error('Error fetching boards:', error)
      }
    })

    dataWorkspace?.data.member.forEach(async (item) => {
      try {
        if (item?._id !== undefined) {
          const res = await getAllBoardById({ workspace_id: item._id })
          const responseData = res.data
          const workspaceName = item.name

          console.log(responseData)

          if (responseData && responseData.data) {
            const boardsWithWorkspaceName = responseData.data.map((board) => ({
              ...board,
              workspace_name: workspaceName
            })) as Partial<Board>[]

            const updatedBoards: Board[] = boardsWithWorkspaceName.map((board) => ({
              name: board.name ?? '',
              workspace_id: board.workspace_id ?? '',
              background: board.background ?? '',
              background_list: board.background_list ?? [],
              activities: board.activities ?? [],
              _id: board._id ?? '',
              workspace_name: board.workspace_name ?? '',
              is_star: board.is_star ?? false
            }))

            setListBoard((prevList) => [...prevList, ...updatedBoards.filter((board) => board?.is_star)])
          }
        }
      } catch (error) {
        console.error('Error fetching boards:', error)
      }
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataWorkspace, getAllBoardById, getAllWorkspace])

  console.log(listBoard)

  const updateStar = (index: number, item: Board) => {
    const boardId = listBoard && listBoard[index] ? listBoard[index]._id : undefined

    if (boardId) {
      editBoardByIdAPI({
        _id: boardId,
        is_star: false
      })
        .then(() => {
          if (item?._id !== undefined) {
            getAllBoardById({ workspace_id: item._id })
              .then((res) => {
                const responseData = res.data
                if (responseData && responseData.data) {
                  const updatedListBoard = responseData.data.map((board) => ({
                    name: board.name ?? '',
                    workspace_id: board.workspace_id ?? '',
                    background: board.background ?? '',
                    background_list: board.background_list ?? [],
                    activities: board.activities ?? [],
                    _id: board._id ?? '',
                    workspace_name: item.name ?? '',
                    is_star: board.is_star ?? false
                  }))
                  setListBoard(updatedListBoard as Board[])
                }
              })
              .catch((error) => {
                console.error('Error fetching boards:', error)
              })
          }
        })
        .catch((error) => {
          console.error('Error updating board:', error)
        })
    }
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
          id='button-starred'
          aria-controls={open ? 'menu-starred' : undefined}
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
          Starred
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
                    id='menu-starred'
                    aria-labelledby='button-starred'
                    onKeyDown={handleListKeyDown}
                    sx={{
                      marginTop: '8px',
                      transition: 'all 0.1s ease-in',
                      backgroundColor: colors.background_menu_header,
                      width: '280px',
                      padding: '12px',
                      borderRadius: '4px'
                    }}
                  >
                    {listBoard && listBoard?.length === 0 ? (
                      <Box>
                        <img src={noneStar} alt='' style={{ backgroundSize: 'cover', width: '100%' }} />

                        <Typography
                          variant='body1'
                          sx={{ fontSize: '14px', color: colors.text, textAlign: 'center', margin: '12px 0 8px 0' }}
                        >
                          Star important boards to access them quickly and easily.
                        </Typography>
                      </Box>
                    ) : (
                      listBoard?.map((board, index) => (
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
                                  {board.workspace_name}
                                </Typography>
                              </Box>
                            </Box>

                            <FontAwesomeIcon
                              onClick={() => updateStar(index, board)}
                              icon={starFull}
                              style={{
                                color: 'orange',
                                marginRight: '8px',
                                fontSize: '16px',
                                transition: 'all 0.1s ease-in'
                              }}
                            />
                          </Box>
                        </Link>
                      ))
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
