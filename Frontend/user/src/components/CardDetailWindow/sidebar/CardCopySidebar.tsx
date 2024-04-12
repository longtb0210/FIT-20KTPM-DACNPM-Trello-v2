import { useRef, useState } from 'react'
import { ButtonType, SidebarButton, buttonTypeIconMap } from './CardSidebarButton'
import { Box } from '@mui/material'
import { CopyCardModal } from '../modals/CardCopyModal'
import { Card } from '@trello-v2/shared/src/schemas/CardList'

interface SidebarButtonCopyProps {
  type: ButtonType
  boardId: string
  cardlistId: string
  cardId: string
  currentCard: Card
  setCurrentCard: (newState: Card) => void
}

export function SidebarButtonCopy({
  type,
  boardId,
  cardlistId,
  cardId,
  currentCard,
  setCurrentCard
}: SidebarButtonCopyProps) {
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
        <CopyCardModal
          anchorEl={anchorEl}
          boardId={boardId}
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
