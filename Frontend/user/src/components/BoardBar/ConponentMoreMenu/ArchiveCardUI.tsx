import React from 'react'
import { Box, Paper } from '@mui/material'
import { TiArchive } from 'react-icons/ti'
import { CardApiRTQ, CardlistApiRTQ } from '~/api'

interface Card {
  _id: string
  name: string
}

interface ArchiveCardProps {
  card: Card
  switchToLists?: boolean
  boardId: string
  cardListId?: string
}

const ArchiveCard: React.FC<ArchiveCardProps> = ({ card, switchToLists, boardId, cardListId }) => {
  //   const restoreCartToBoard = CardApiRTQ.CardApiSlice.useRestoreCartToBoardMutation()
  //   const deleteCardArchive = CardApiRTQ.CardApiSlice.useDeleteCardArchiveMutation()
  const [getCardListByBoardId] = CardlistApiRTQ.CardListApiSlice.useLazyGetCardlistByBoardIdQuery()
  const [restoreCartListByBoard] = CardlistApiRTQ.CardListApiSlice.useRestoreCartListByBoardMutation()
  const [deleteCardListByBoard] = CardlistApiRTQ.CardListApiSlice.useDeleteCardListByBoardMutation()
  const [restoreCartToBoard] = CardApiRTQ.CardApiSlice.useRestoreCartToBoardMutation()
  //   const [deleteCardArchive] = CardApiRTQ.CardApiSlice.useDeleteCardArchiveMutation()
  const handleSendListCardToBoard = () => {
    // Gọi hàm xử lý sự kiện Send to board từ component cha
    restoreCartListByBoard(boardId).then(() => {
      getCardListByBoardId({ id: boardId })
    })
    // onSendToBoard();
  }

  const handleDelete = () => {
    console.log('delete card ' + boardId)
    // Gọi hàm xử lý sự kiện Delete từ component cha
    deleteCardListByBoard({ board_id: boardId }).then(() => {
      getCardListByBoardId({ id: boardId })
    })
    // onDelete();
  }

  const handleRestoreCard = () => {
    if (cardListId !== undefined) {
      restoreCartToBoard({ card_id: card._id, cardlist_id: cardListId })
    }
  }
  const handleDeleteCard = () => {}

  return (
    <Box
      key={card._id}
      sx={{
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px'
      }}
    >
      <Paper
        sx={{
          width: '100%',
          height: '70px',
          padding: '15px',
          fontSize: '14px',
          ':hover': {
            outline: '1px solid blue'
          }
        }}
      >
        <Box>{card.name}</Box>
        <Box sx={{ display: 'flex', fontSize: '12px', color: '#aa', marginRight: '10px', marginTop: '5px' }}>
          <TiArchive fontSize={18} />
          Archived
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '5px', marginTop: '5px' }}>
        <Box
          sx={{
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            ':hover': { textDecorationLine: 'underline', color: 'blue' }
          }}
          onClick={switchToLists ? handleSendListCardToBoard : handleRestoreCard}
        >
          Send to board
        </Box>
        <Box
          sx={{
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            ':hover': { textDecorationLine: 'underline', color: 'blue' },
            marginLeft: '10px'
          }}
          onClick={switchToLists ? handleDelete : handleDeleteCard}
        >
          Delete
        </Box>
      </Box>
    </Box>
  )
}

export default ArchiveCard
