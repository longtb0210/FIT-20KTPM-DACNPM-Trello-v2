import { Box } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined'
import { useState } from 'react'
import { Board } from '@trello-v2/shared/src/schemas/Board'
import { BoardApiRTQ } from '~/api'
import { Link } from 'react-router-dom'
import { useTheme } from '../Theme/themeContext'

interface BoardsPageCardProps {
  workspaceId: string
  currentBoard: Board
  workspaceBoards: Board[] | null
  setWorkspaceBoards: (newState: Board[]) => void
  allBoards: Board[]
  setAllBoards: (newState: Board[]) => void
}

export function BoardsPageCard({
  workspaceId,
  currentBoard,
  workspaceBoards,
  setWorkspaceBoards,
  allBoards,
  setAllBoards
}: BoardsPageCardProps) {
  const { colors } = useTheme()
  const [isHovered, setIsHovered] = useState(false)

  //API
  const [editBoardByIdAPI] = BoardApiRTQ.BoardApiSlice.useEditBoardByIdMutation()

  function handleToggleStar() {
    editBoardByIdAPI({
      _id: currentBoard._id!,
      is_star: !currentBoard.is_star
    })
      .unwrap()
      .then(() => {
        const updatedWorkspaceBoards = workspaceBoards?.map((board) =>
          board._id === currentBoard._id
            ? {
                ...currentBoard,
                is_star: !currentBoard.is_star
              }
            : board
        )
        setWorkspaceBoards(updatedWorkspaceBoards!)
        const updatedallBoards = allBoards.map((board) =>
          board._id === currentBoard._id
            ? {
                ...currentBoard,
                is_star: !currentBoard.is_star
              }
            : board
        )
        setAllBoards(updatedallBoards)
        setIsHovered(!isHovered)
      })
      .catch((error) => {
        console.error('ERROR: toggle board is_star', error)
      })
  }

  return (
    <Link to={`/workspace/${workspaceId}/board/${currentBoard._id}`}>
      <Box
        sx={{
          maxWidth: 194,
          height: 96,
          padding: '8px',
          backgroundColor: currentBoard.background ? undefined : colors.button_hover,
          backgroundImage: currentBoard.background,
          '&:hover': { filter: 'brightness(90%)' }
        }}
        className='flex cursor-pointer flex-col justify-between rounded'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Box sx={{ width: '100%' }} className='flex place-items-center'>
          <p
            style={{
              color: currentBoard.background ? '#ffffff' : colors.text,
              fontSize: 16,
              height: 40,
              fontWeight: 700,
              lineHeight: '1.2',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
            className='text-white'
          >
            {currentBoard.name}
          </p>
        </Box>
        <Box sx={{ width: '100%', height: 20 }} className='flex items-center justify-end'>
          {(isHovered || currentBoard.is_star) && (
            <Box
              sx={{ marginRight: '4px' }}
              onClick={handleToggleStar}
              color={currentBoard.is_star ? 'primary' : 'default'}
            >
              {currentBoard.is_star ? (
                <StarIcon style={{ color: '#FFD700', fontSize: 18 }} />
              ) : (
                <StarBorderOutlinedIcon style={{ color: 'white', fontSize: 18 }} />
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Link>
  )
}
