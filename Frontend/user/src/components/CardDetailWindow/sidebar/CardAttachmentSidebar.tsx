import { useRef, useState } from 'react'
import { ButtonType, SidebarButton, buttonTypeIconMap } from './CardSidebarButton'
import { Box } from '@mui/material'
import { CardAttachmentModal } from '../modals/CardAttachmentModal'
import { Card } from '@trello-v2/shared/src/schemas/CardList'

interface SidebarButtonAttachmentsProps {
  type: ButtonType
  cardlistId: string
  cardId: string
  currentCard: Card
  setCurrentCard: (newState: Card) => void
}

export function SidebarButtonAttachments({
  type,
  cardlistId,
  cardId,
  currentCard,
  setCurrentCard
}: SidebarButtonAttachmentsProps) {
  const boxRef = useRef(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLDivElement>(null)
  const [isOpenModal, setIsOpenModal] = useState(false)

  function handleOpenModal() {
    setIsOpenModal(true)
  }

  function handleCloseModal() {
    setIsOpenModal(false)
  }

  return (
    <Box ref={boxRef}>
      <SidebarButton
        icon={buttonTypeIconMap[type]}
        title={type}
        onClick={() => {
          setAnchorEl(boxRef.current)
          handleOpenModal()
        }}
      />
      {/* Modals */}
      {isOpenModal && (
        <CardAttachmentModal
          anchorEl={anchorEl}
          cardlistId={cardlistId}
          cardId={cardId}
          currentCard={currentCard}
          setCurrentCard={setCurrentCard}
          handleClose={handleCloseModal}
        />
      )}
    </Box>
  )
}
