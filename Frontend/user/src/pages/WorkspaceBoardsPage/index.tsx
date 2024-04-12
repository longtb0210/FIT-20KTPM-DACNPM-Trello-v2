import { faLock, faMagnifyingGlass, faPen, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useTheme } from '~/components/Theme/themeContext'
import WorkspaceBoardsPageRow from '~/components/WorkspaceBoardsPage/WorkspaceBoardsPageRow'
import { useParams } from 'react-router-dom'
import { BoardApiRTQ } from '~/api'
import { Board } from '@trello-v2/shared/src/schemas/Board'
import { styled } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import SidebarCateWorkSpace from '../CategoryWorkspace/component/SidebarCateWorkspace'

const sortMethods = ['Most recently active', 'Least recently active', 'Alphabetically A-Z', 'Alphabetically Z-A']

const drawerWidth = 250

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  })
}))

export function WorkspaceBoardsPage() {
  const { workspaceId } = useParams()
  const { colors } = useTheme()
  const [selectedSort, setSelectedSort] = useState('Most recently active')
  const [boardsState, setBoardsState] = useState<Board[]>([])
  const [filteredBoardsState, setFilteredBoardsState] = useState<Board[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  //API
  const [getBoardsByWorkspaceIdAPI] = BoardApiRTQ.BoardApiSlice.useLazyGetBoardsByWorkspaceIDQuery()

  function fetchBoardsByWorkspaceId() {
    getBoardsByWorkspaceIdAPI({
      workspace_id: workspaceId!
    })
      .unwrap()
      .then((response) => {
        setBoardsState(response.data)
        setFilteredBoardsState(response.data)
      })
      .catch((error) => {
        console.log('ERROR: fetch boards of workspace', error)
      })
  }

  useEffect(() => {
    fetchBoardsByWorkspaceId()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSelectSort(event: SelectChangeEvent) {
    setSelectedSort(event.target.value as string)
  }

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(event.target.value)
  }

  const [open, setOpen] = useState(true)

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    const filteredList = boardsState.filter((board) => board.name.toLowerCase().includes(searchQuery.toLowerCase()))
    const sortedList = [...filteredList]
    if (selectedSort === 'Alphabetically A-Z') {
      sortedList.sort((a, b) => a.name.localeCompare(b.name))
    } else if (selectedSort === 'Alphabetically Z-A') {
      sortedList.sort((a, b) => b.name.localeCompare(a.name))
    }
    setFilteredBoardsState(sortedList)
  }, [boardsState, searchQuery, selectedSort])

  return (
    <Box sx={{ display: 'flex' }}>
        <Box sx={{ position: 'fixed', top: 60, left: 10, zIndex: 999 }}>
          <CssBaseline />
          {open ? (
            <IconButton onClick={handleDrawerClose} edge="start" color="inherit" aria-label="close" sx={{ color: colors.text }}>
              <ChevronLeftIcon/>
            </IconButton>
          ) : (
            <IconButton onClick={handleDrawerOpen} edge="start" color="inherit" aria-label="open" sx={{ color: colors.text }}>
              <ChevronRightIcon />
            </IconButton>
          )}
        </Box>
        <SidebarCateWorkSpace open={open} handleDrawerClose={handleDrawerClose} />
        <Main open={open} sx={{ padding: 0 }}>
          <Box sx={{width: '100%', height: 'calc(100vh - 50px)', bgcolor: colors.background }} className='flex flex-row'>
            {/* Sidebar */}
            <Box sx={{ width: 260, height: '100%' }}></Box>
            {/* Page body */}
            <Box sx={{ flex: 1, height: '100%' }} className='flex flex-col items-center'>
              {/* START: Header */}
              <Box sx={{ width: 914, height: 124, padding: '32px' }} className='flex flex-row justify-between'>
                <Box sx={{ width: 'fit-content', height: '100%' }} className='flex flex-row'>
                  {/* Workspace avatar */}
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      marginRight: '10px',
                      color: 'rgb(29, 33, 37)',
                      background:
                        'linear-gradient(var(--ds-background-accent-magenta-subtle, #cd5a91), var(--ds-background-accent-magenta-bolder, #b22865));'
                    }}
                    className='flex items-center justify-center rounded-md'
                  >
                    <span style={{ fontSize: 35 }} className='font-bold'>
                      Â
                    </span>
                  </Box>
                  {/* Workspace name */}
                  <Box sx={{ color: colors.text }} className='flex flex-col items-start justify-center'>
                    <Box className='flex flex-row items-center'>
                      <span style={{ fontSize: 20 }} className='font-bold'>
                        Âu Hồng Minh's workspace
                      </span>
                      {/* Edit button */}
                      <Box
                        sx={{ height: 24, width: 24, margin: '4px 0 0 4px', '&:hover': { bgcolor: colors.button } }}
                        className='flex cursor-pointer items-center justify-center rounded'
                      >
                        <FontAwesomeIcon icon={faPen} style={{ fontSize: 10 }} />
                      </Box>
                    </Box>
                    {/* Workspace private */}
                    <Box sx={{ margin: '0 0 0 6px' }} className='flex flex-row items-center'>
                      <FontAwesomeIcon icon={faLock} style={{ fontSize: 10, marginRight: '4px' }} />
                      <span style={{ fontSize: 12 }}>Private</span>
                    </Box>
                  </Box>
                </Box>
                {/* Button invite workspace members */}
                <Box
                  sx={{
                    width: 'fit-content',
                    height: 32,
                    padding: '6px 12px',
                    color: colors.button_primary_text,
                    bgcolor: colors.button_primary
                  }}
                  className='flex flex-row items-center rounded'
                >
                  <FontAwesomeIcon icon={faUserPlus} style={{ fontSize: 12, margin: '2px 4px 0 0px' }} />
                  <span style={{ fontSize: 14 }} className='font-semibold'>
                    Invite Workspace members
                  </span>
                </Box>
              </Box>
              {/* END: Header */}
              <Box sx={{ width: '100%', padding: '0 62px' }} className='flex items-center justify-center'>
                <Box sx={{ width: '100%', height: 1.01, bgcolor: colors.text }}></Box>
              </Box>
              {/* START: Board list section */}
              <Box sx={{ width: '100%', padding: '32px' }} className='flex items-center justify-center'>
                <Box sx={{ width: '100%', padding: '0 156px' }} className='flex flex-col items-center justify-start'>
                  {/* Title */}
                  <Box sx={{ width: '100%', height: 24, marginBottom: '30px', color: colors.text, fontSize: 20 }}>
                    <span className='font-bold'>Boards</span>
                  </Box>
                  {/* Dropdowns & Search bar */}
                  <Box
                    sx={{ width: '100%', height: 104, padding: '20px 0 8px', fontSize: 20, color: colors.text }}
                    className='flex flex-row items-center justify-between'
                  >
                    {/* Dropdowns */}
                    <Box sx={{ width: 'fit-content', height: 104 }} className='flex flex-row items-center'>
                      {/* Select sort method */}
                      <Box sx={{ width: 200, height: '100%', marginRight: '4px', fontSize: 20 }} className='flex flex-col'>
                        <span style={{ fontSize: 12, padding: '12px 0 4px' }} className='font-bold'>
                          Sort by
                        </span>
                        <FormControl fullWidth>
                          <Select
                            value={selectedSort}
                            onChange={handleSelectSort}
                            sx={{
                              height: 36,
                              border: `1px solid ${colors.text}`,
                              '& .MuiOutlinedInput-input': { color: colors.text, fontSize: 14, fontWeight: 450 },
                              '& .MuiSvgIcon-root': { color: colors.text }
                            }}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  background: colors.background_modal_secondary
                                }
                              }
                            }}
                          >
                            {sortMethods.map((sortMethod, index) => (
                              <MenuItem
                                key={index}
                                value={sortMethod}
                                sx={{
                                  background: colors.background_modal_secondary,
                                  color: colors.text,
                                  fontSize: 14,
                                  fontWeight: 400,
                                  '&:hover': { background: colors.button_hover }
                                }}
                              >
                                {sortMethod}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                      {/* Select filter method */}
                      <Box sx={{ width: 200, height: '100%', marginRight: '4px', fontSize: 20 }} className='flex flex-col'>
                        <span style={{ fontSize: 12, padding: '12px 0 4px' }} className='font-bold'>
                          Filter by
                        </span>
                        <FormControl fullWidth>
                          <Select
                            value={'Choose a collection'}
                            onChange={handleSelectSort}
                            sx={{
                              height: 36,
                              border: `1px solid ${colors.text}`,
                              '& .MuiOutlinedInput-input': { color: colors.text, fontSize: 14, fontWeight: 450 },
                              '& .MuiSvgIcon-root': { color: colors.text },
                              '&:hover': { background: colors.button_hover, border: `1px solid ${colors.button_hover}` }
                            }}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  background: colors.background_modal_secondary
                                }
                              }
                            }}
                          >
                            <MenuItem
                              value={'Choose a collection'}
                              sx={{
                                background: colors.background_modal_secondary,
                                color: colors.text,
                                fontSize: 14,
                                fontWeight: 400,
                                '&:hover': { background: colors.button_hover }
                              }}
                            >
                              Choose a collection
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                    {/* Search bar */}
                    <Box sx={{ width: 250, height: '100%', marginRight: '4px', fontSize: 20 }} className='flex flex-col'>
                      <span style={{ fontSize: 12, padding: '0 0 2px' }} className='font-bold'>
                        Search
                      </span>
                      <FormControl variant='outlined'>
                        <OutlinedInput
                          sx={{
                            width: 250,
                            height: 36,
                            padding: '0',
                            border: `1px solid ${colors.text}`,
                            color: colors.text,
                            fontSize: 14
                          }}
                          type={'text'}
                          placeholder='Search boards'
                          value={searchQuery}
                          onChange={handleSearch}
                          startAdornment={
                            <InputAdornment position='start'>
                              <IconButton>
                                <FontAwesomeIcon icon={faMagnifyingGlass} style={{ fontSize: 14, color: colors.text }} />
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                    </Box>
                  </Box>
                  {/* Board list */}
                  <Box sx={{ width: '100%', margin: '16px 0' }}>
                    <WorkspaceBoardsPageRow
                      workspaceBoards={filteredBoardsState!}
                      setWorkspaceBoards={setBoardsState}
                      enableAddBoard={true}
                    />
                  </Box>
                  {/* Button view closed board */}
                  <Box sx={{ width: '100%', height: 32, margin: '50px 0' }} className='flex items-center justify-start'>
                    <Box
                      sx={{
                        height: 32,
                        padding: '6px 12px',
                        bgcolor: colors.button,
                        color: colors.text,
                        '&:hover': { bgcolor: colors.button_hover }
                      }}
                      className='flex cursor-pointer items-center rounded'
                    >
                      <span style={{ fontSize: 14 }} className='font-semibold'>
                        View closed boards
                      </span>
                    </Box>
                  </Box>
                </Box>
              </Box>
              {/* END: Board list section */}
            </Box>
          </Box>
        </Main>
      </Box>
    
  )
}
