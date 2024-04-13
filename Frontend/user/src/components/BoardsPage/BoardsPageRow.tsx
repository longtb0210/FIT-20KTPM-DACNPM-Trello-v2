import { Grid } from '@mui/material'
import { BoardsPageCard } from './BoardsPageCard'
import { BoardsPageCardAdd } from './BoardsPageCardAdd'
import { Board } from '@trello-v2/shared/src/schemas/Board'

interface BoardsPageRowProps {
  workspaceId: string
  workspaceBoards: Board[]
  setWorkspaceBoards: (newState: Board[]) => void
  allBoards: Board[]
  setAllBoards: (newState: Board[]) => void
  enableAddBoard: boolean
}

export default function BoardsPageRow({
  workspaceId,
  workspaceBoards,
  setWorkspaceBoards,
  allBoards,
  setAllBoards,
  enableAddBoard
}: BoardsPageRowProps) {
  return (
    <Grid container spacing={2}>
      {workspaceBoards.map((board: Board, index: number) => (
        <Grid item xs={3} key={index}>
          <BoardsPageCard
            workspaceId={workspaceId}
            currentBoard={board}
            workspaceBoards={workspaceBoards}
            setWorkspaceBoards={setWorkspaceBoards}
            allBoards={allBoards}
            setAllBoards={setAllBoards}
          />
        </Grid>
      ))}
      {enableAddBoard ? (
        <Grid item xs={3}>
          <BoardsPageCardAdd workspaceId={workspaceId} />
        </Grid>
      ) : null}
    </Grid>
  )
}
