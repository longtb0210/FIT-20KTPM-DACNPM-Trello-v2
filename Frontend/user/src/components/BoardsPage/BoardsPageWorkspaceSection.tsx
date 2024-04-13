import { Box, Grid } from '@mui/material'
import { useTheme } from '../Theme/themeContext'
import BoardsPageWorkspaceControl from './BoardsPageWorkspaceControl'
import BoardsPageRow from './BoardsPageRow'
import { Workspace } from '@trello-v2/shared/src/schemas/Workspace'
import { BoardApiRTQ } from '~/api'
import { Board } from '@trello-v2/shared/src/schemas/Board'
import { useEffect, useState } from 'react'

interface BoardsPagegWorkspaceSectionProps {
  currentWorkspace: Workspace
  allBoards: Board[]
  setAllBoards: (newState: Board[]) => void
}

export default function BoardsPagegWorkspaceSection({
  currentWorkspace,
  allBoards,
  setAllBoards
}: BoardsPagegWorkspaceSectionProps) {
  const { colors } = useTheme()
  const [workspaceBoards, setWorkspaceBoards] = useState<Board[]>([])

  // API
  const [getBoardsByWorkspaceIDApi] = BoardApiRTQ.BoardApiSlice.useLazyGetBoardsByWorkspaceIDQuery()

  async function fetchBoardsInWorkspace() {
    getBoardsByWorkspaceIDApi({
      workspace_id: currentWorkspace._id!
    })
      .unwrap()
      .then((response) => {
        setWorkspaceBoards(response.data)
      })
      .catch((error) => {
        console.log('ERROR: fetch workspace boards', error)
      })
  }

  useEffect(() => {
    fetchBoardsInWorkspace()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box sx={{ margin: '0 0 30px 0' }}>
      <Grid container className='flex justify-between'>
        <Grid item xs={4}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{ width: 32, height: 32, color: 'white' }}
              className='my-4 flex items-center justify-center rounded-md bg-gradient-to-b from-green-600 to-green-400'
            >
              <p style={{ fontSize: '16px' }} className='m-0 p-0 font-bold leading-none'>
                Â
              </p>
            </Box>
            <h1 style={{ color: colors.text, fontSize: '16px' }} className='ml-3 p-0 font-semibold'>
              {currentWorkspace.name}
            </h1>
          </Box>
        </Grid>
        <Grid item xs={7} className='flex items-center justify-end'>
          <BoardsPageWorkspaceControl currentWorkspace={currentWorkspace} />
        </Grid>
      </Grid>
      <BoardsPageRow
        workspaceId={currentWorkspace._id!}
        workspaceBoards={workspaceBoards}
        setWorkspaceBoards={setWorkspaceBoards}
        allBoards={allBoards}
        setAllBoards={setAllBoards}
        enableAddBoard={true}
      />
    </Box>
  )
}
