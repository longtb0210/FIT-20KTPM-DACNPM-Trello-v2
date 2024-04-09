import { Grid } from '@mui/material'
import { BoardsPageCard } from './BoardsPageCard'
import { BoardsPageCardAdd } from './BoardsPageCardAdd'
import { Board } from '@trello-v2/shared/src/schemas/Board'

interface BoardsPageRowProps {
  workspaceBoards: Board[]
  setWorkspaceBoards: (newState: Board[]) => void
  allBoards: Board[]
  setAllBoards: (newState: Board[]) => void
  enableAddBoard: boolean
}

export default function BoardsPageRow({
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
          <BoardsPageCardAdd />
        </Grid>
      ) : null}
    </Grid>
  )
}
