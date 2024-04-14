import React from 'react'
import { Box, Paper } from '@mui/material'
import { TiArchive } from 'react-icons/ti'
import { CardApiRTQ, CardlistApiRTQ } from '~/api'
import { useParams } from 'react-router-dom'

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
  const [restoreCartToBoard] = CardApiRTQ.CardApiSlice.useRestoreCartToBoardMutation()
  const [updateCardList] = CardlistApiRTQ.CardListApiSlice.useUpdateCardListMutation()
  const [deleteCardListByBoard] = CardlistApiRTQ.CardListApiSlice.useDeleteCardListByBoardMutation()
  const [getCardListByBoardId] = CardlistApiRTQ.CardListApiSlice.useLazyGetCardlistByBoardIdQuery()
  const [getCardListArchiveByBoardId, { data: CardData }] =
    CardlistApiRTQ.CardListApiSlice.useLazyGetCardListArchiveByBoardIdQuery()
  //   const [deleteCardArchive] = CardApiRTQ.CardApiSlice.useDeleteCardArchiveMutation()
  const handleSendListCardToBoard = () => {
    console.log(cardListId)
    // Gọi hàm xử lý sự kiện Send to board từ component cha
    updateCardList({ _id: cardListId, archive_at: null }).then((a) => {
      console.log(a)
      getCardListByBoardId({ id: boardId })
      getCardListArchiveByBoardId(boardId)
    })
    // onSendToBoard();
  }

  const handleDelete = () => {
    // Gọi hàm xử lý sự kiện Delete từ component cha
    if (boardId !== undefined) {
      deleteCardListByBoard({ board_id: boardId }).then((a) => {
        getCardListByBoardId({ id: boardId })
      })
    }
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
          onClick={switchToLists ? handleRestoreCard : handleSendListCardToBoard}
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
          onClick={switchToLists ? handleDeleteCard : handleDelete}
        >
          Delete
        </Box>
      </Box>
    </Box>
  )
}

export default ArchiveCard
