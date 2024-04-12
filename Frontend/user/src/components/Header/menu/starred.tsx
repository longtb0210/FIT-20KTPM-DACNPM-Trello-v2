import * as React from 'react'
import { Box, Button, ClickAwayListener, Grow, Paper, Popper, MenuList, Stack, Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faStar as starFull } from '@fortawesome/free-solid-svg-icons'
import noneStar from '~/assets/noneStar.svg'
import { useTheme } from './../../Theme/themeContext'
import { BoardApiRTQ, WorkspaceApiRTQ } from '~/api'

export default function Starred() {
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLButtonElement>(null)
  const { colors } = useTheme()
  const [getAllBoard, { data: allBoardsData }] = BoardApiRTQ.BoardApiSlice.useLazyGetAllBoardQuery()
  const [getALlWorkspace, { data: dataWorkspace }] = WorkspaceApiRTQ.WorkspaceApiSlice.useLazyGetAllWorkspaceQuery()
  const [editBoardByIdAPI] = BoardApiRTQ.BoardApiSlice.useEditBoardByIdMutation()
  const [workspaceName, setWorkspaceName] = React.useState<string[]>([])

  const listStarBoard = allBoardsData?.data.filter((board) => board?.is_star)

  React.useEffect(() => {
    getAllBoard()
    getALlWorkspace()
  }, [getALlWorkspace, getAllBoard])

  const findWorkspaceById = (workspaceId: string): { name: string } | undefined => {
    const workspace =
      dataWorkspace?.data.owner.find((item) => item._id === workspaceId) ||
      dataWorkspace?.data.member.find((item) => item._id === workspaceId) ||
      dataWorkspace?.data.guest.find((item) => item._id === workspaceId) ||
      dataWorkspace?.data.admin.find((item) => item._id === workspaceId)

    return workspace
  }

  React.useEffect(() => {
    const names: string[] = []

    listStarBoard?.forEach((board: { workspace_id: string }) => {
      const workspace = findWorkspaceById(board.workspace_id)

      if (workspace && workspace.name) {
        names.push(workspace.name)
      }
    })
    setWorkspaceName(names)
  }, [dataWorkspace, allBoardsData])

  const updateStar = (index: number) => {
    const boardId = listStarBoard && listStarBoard[index] ? listStarBoard[index]._id : undefined

    if (boardId) {
      editBoardByIdAPI({
        _id: boardId,
        is_star: false
      }).then(() => getAllBoard())
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
                    {listStarBoard && listStarBoard?.length === 0 ? (
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
                      listStarBoard?.map((board, index) => (
                        <Box
                          key={index}
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
                                {board.name}
                              </Typography>
                              <Typography
                                variant='body1'
                                sx={{ fontSize: '12px', color: colors.text, marginLeft: '12px' }}
                              >
                                {workspaceName[index]}
                              </Typography>
                            </Box>
                          </Box>

                          <FontAwesomeIcon
                            onClick={() => updateStar(index)}
                            icon={starFull}
                            style={{
                              color: 'orange',
                              marginRight: '8px',
                              fontSize: '16px',
                              transition: 'all 0.1s ease-in'
                            }}
                          />
                        </Box>
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
