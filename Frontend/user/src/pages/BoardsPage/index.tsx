import React, { useEffect, useState } from 'react'
import BoardsPageRowTemplate from '~/components/BoardsPage/BoardsPageRowTemplate'
import { faTrello } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//import AccessTimeIcon from '@mui/icons-material/AccessTime'
import StarIcon from '@mui/icons-material/Star'
import { Box, FormControl, Grid, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { Workspace } from '@trello-v2/shared/src/schemas/Workspace'
import { BoardApiRTQ, WorkspaceApiRTQ } from '~/api'
import BoardsPagegWorkspaceSection from '~/components/BoardsPage/BoardsPageWorkspaceSection'
import { useTheme } from '~/components/Theme/themeContext'
import { Board } from '@trello-v2/shared/src/schemas/Board'
import { BoardsPageCard } from '~/components/BoardsPage/BoardsPageCard'
import PageWithSidebar from '../Templates'

export type BoardTemplate = {
  [x: string]: unknown
  _id: string
  name: string
  is_star: boolean
}

const data1: BoardTemplate[] = [
  { _id: '0', name: 'Project Management', is_star: false },
  { _id: '1', name: 'Kanban Template', is_star: false }
]

const categories = [
  'Popular',
  'Small business',
  'Design',
  'Education',
  'Engineering-IT',
  'Marketing',
  'Human Resources',
  'Operations',
  'Sales CRM'
]

interface BoardsPageLabelProps {
  title: string
}

export function BoardsPageLabel({ title }: BoardsPageLabelProps) {
  return (
    <div>
      <h1>{title}</h1>
    </div>
  )
}

export function BoardsPage() {
  const { colors } = useTheme()
  const [category, setCategory] = useState('')
  const [allWorkspaces, setAllWorkspaces] = useState<Workspace[]>([])
  const [allBoards, setAllBoards] = useState<Board[]>([])

  //API
  const [getAllWorkspacesAPI] = WorkspaceApiRTQ.WorkspaceApiSlice.useLazyGetAllWorkspaceQuery()
  const [getAllBoardsAPI, { data: allBoardsData }] = BoardApiRTQ.BoardApiSlice.useLazyGetAllBoardQuery()

  function handleChange(event: SelectChangeEvent) {
    setCategory(event.target.value as string)
  }

  function fetchAllWorkspaces() {
    getAllWorkspacesAPI()
      .unwrap()
      .then((response) => {
        setAllWorkspaces([...response.data.owner, ...response.data.member])
      })
      .catch((error) => {
        console.log('ERROR: get all workspaces', error)
      })
  }

  useEffect(() => {
    fetchAllWorkspaces()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function fetchAllBoards() {
    getAllBoardsAPI()
      .unwrap()
      .then((response) => {
        setAllBoards(response.data)
      })
      .catch((error) => {
        console.log('ERROR: get all boards', error)
      })
  }

  useEffect(() => {
    fetchAllBoards()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allBoardsData])

  return (
    <PageWithSidebar>
      <Box sx={{ width: '100%' }} className='flex flex-row justify-start'>
        <Box sx={{ width: '825px', minHeight: 'calc(100vh - 50px)' }}>
          {/* START: Board Templates section */}
          {/* Title */}
          <Box style={{ color: colors.text }} className='mb-1 mt-3 flex items-center'>
            <FontAwesomeIcon icon={faTrello} style={{ fontSize: 20 }} />
            <h2 style={{ fontSize: 20 }} className='ml-2 p-0 font-bold'>
              Most popular templates
            </h2>
          </Box>
          {/* Select category */}
          <Box style={{ color: colors.text }} className='mb-5 flex items-center'>
            <h2 style={{ fontSize: 14 }} className='font-medium'>
              Get going faster with a template from the Trello community or
            </h2>
            <FormControl sx={{ marginLeft: '6px', marginTop: '4px' }}>
              <Select
                sx={{
                  width: 240,
                  height: 36,
                  border: `1px solid ${colors.text}`,
                  background: colors.background,
                  color: colors.text,
                  '& .MuiSelect-icon': {
                    color: colors.text // Set the color of the arrow icon
                  },
                  fontSize: 14
                }}
                className='font-medium'
                value={category}
                onChange={handleChange}
                displayEmpty
                renderValue={(selected) => (selected === '' ? <p>choose a category</p> : selected)}
                MenuProps={{
                  PaperProps: {
                    style: {
                      background: colors.background,
                      color: colors.text,
                      fontSize: 14
                    }
                  }
                }}
              >
                {categories.map((category, index) => (
                  <MenuItem key={index} value={category} sx={{ fontSize: 14 }}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <BoardsPageRowTemplate boards={data1} />
          <p
            style={{ color: '#579DFF', fontSize: 14, marginTop: '16px' }}
            className='cursor-pointer font-medium'
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = 'underline'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = 'none'
            }}
          >
            Browse the full template gallery
          </p>
          {/* END: Board Templates section */}
          {/* START: Starred Boards section */}
          <Box sx={{ height: 28 }}></Box>
          {allBoards.filter((board) => board.is_star === true).length != 0 && (
            <React.Fragment>
              {/* Title */}
              <Box style={{ color: colors.text }} className='my-3 flex items-center'>
                <StarIcon style={{ fontSize: 24 }} />
                <h2 style={{ fontSize: 16 }} className='ml-2 p-0 text-center font-bold'>
                  Starred boards
                </h2>
              </Box>
              {/* Board list */}
              <Grid container spacing={2}>
                {allBoards
                  .filter((board) => board.is_star === true)
                  .map((board: Board, index: number) => (
                    <Grid item xs={3} key={index}>
                      <BoardsPageCard
                        workspaceId={''}
                        currentBoard={board}
                        workspaceBoards={null}
                        setWorkspaceBoards={() => {}}
                        allBoards={allBoards}
                        setAllBoards={setAllBoards}
                      />
                    </Grid>
                  ))}
              </Grid>
            </React.Fragment>
          )}
          {/* END: Starred Boards section */}
          {/* <Box sx={{ height: 28 }}></Box> */}
          {/* START: Recently Viewed Boards section */}
          {/* Title */}
          {/* <Box style={{ color: colors.text }} className='my-3 flex items-center'>
            <AccessTimeIcon style={{ fontSize: 24 }} />
            <h2 style={{ fontSize: 16 }} className='ml-2 p-0 text-center font-bold'>
              Recently viewed
            </h2>
          </Box> */}
          {/* Board list */}
          {/* <BoardsPageRow
            boards={recentlyViewBoardsState}
            setBoards={setRecentlyViewBoardsState}
            enableAddBoard={true}
          /> */}
          {/* END: Recently Viewed Boards section */}
          {/* START: My Workspaces section */}
          <Box sx={{ height: 70 }}></Box>
          <h1 style={{ color: colors.text, fontSize: '16px' }} className='p-0 font-bold'>
            YOUR WORKSPACES
          </h1>
          {allWorkspaces &&
            allWorkspaces.map((workspace, index) => (
              <BoardsPagegWorkspaceSection
                key={index}
                currentWorkspace={workspace}
                allBoards={allBoards}
                setAllBoards={setAllBoards}
              />
            ))}
          {/* END: My Workspaces section */}
        </Box>
      </Box>
    </PageWithSidebar>
  )
}
