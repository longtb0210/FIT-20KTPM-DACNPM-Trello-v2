import { Grid } from '@mui/material'
import { Board } from '@trello-v2/shared/src/schemas/Board'
import { WorkspaceBoardsPageCard } from './WorkspaceBoardsPageCard'
import { WorkspaceBoardsPageCardAdd } from './WorkspaceBoardsPageCardAdd'

interface WorkspaceBoardsPageRowProps {
  workspaceBoards: Board[]
  setWorkspaceBoards: (newState: Board[]) => void
  enableAddBoard: boolean
}

export default function WorkspaceBoardsPageRow({
  workspaceBoards,
  setWorkspaceBoards,
  enableAddBoard
}: WorkspaceBoardsPageRowProps) {
  return (
    <Grid container spacing={2}>
      {workspaceBoards.map((board: Board, index: number) => (
        <Grid item xs={3} key={index}>
          <WorkspaceBoardsPageCard
            currentBoard={board}
            workspaceBoards={workspaceBoards}
            setWorkspaceBoards={setWorkspaceBoards}
          />
        </Grid>
      ))}
      {enableAddBoard ? (
        <Grid item xs={3}>
          <WorkspaceBoardsPageCardAdd />
        </Grid>
      ) : null}
    </Grid>
  )
}
