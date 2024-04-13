import { useRef, useState } from 'react'
import { ButtonType, SidebarButton, buttonTypeIconMap } from './CardSidebarButton'
import { Box } from '@mui/material'
import { CardMemberModal } from '../modals/CardMemberModal'
import { Card } from '@trello-v2/shared/src/schemas/CardList'

interface SidebarButtonMembersProps {
  type: ButtonType
  boardId: string
  cardlistId: string
  cardId: string
  currentCard: Card
  setCurrentCard: (newState: Card) => void
}

export function SidebarButtonMembers({
  type,
  boardId,
  cardlistId,
  cardId,
  currentCard,
  setCurrentCard
}: SidebarButtonMembersProps) {
  const boxRef = useRef(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLDivElement>(null)
  const [isOpenCardMemberModal, setIsOpenCardMemberModal] = useState(false)

  function openCardMemberModal() {
    setIsOpenCardMemberModal(true)
  }

  function handleClose() {
    setIsOpenCardMemberModal(false)
  }

  return (
    <Box ref={boxRef}>
      <SidebarButton
        icon={buttonTypeIconMap[type]}
        title={type}
        onClick={() => {
          setAnchorEl(boxRef.current)
          openCardMemberModal()
        }}
      />
      {/* Modals */}
      {isOpenCardMemberModal && (
        <CardMemberModal
          anchorEl={anchorEl}
          boardId={boardId}
          cardlistId={cardlistId}
          cardId={cardId}
          currentCard={currentCard}
          setCurrentCard={setCurrentCard}
          handleClose={handleClose}
        />
      )}
    </Box>
  )
}
