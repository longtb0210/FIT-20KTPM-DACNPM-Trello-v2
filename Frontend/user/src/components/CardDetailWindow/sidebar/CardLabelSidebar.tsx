import { useRef, useState } from 'react'
import { CardLabelListModal, CreateCardLabelModal, EditCardLabelModal } from '../modals/CardLabelModal'
import { ButtonType, SidebarButton, buttonTypeIconMap } from './CardSidebarButton'
import { Box } from '@mui/material'
import { Card } from '@trello-v2/shared/src/schemas/CardList'
import { Feature_CardLabel } from '@trello-v2/shared/src/schemas/Feature'
import { BoardLabel } from '@trello-v2/shared/src/schemas/Board'
import { CardApiRTQ } from '~/api'

interface SidebarButtonLabelsProps {
  type: ButtonType
  cardlistId: string
  cardId: string
  currentCard: Card
  setCurrentCard: (newState: Card) => void
  boardLabelState: BoardLabel[]
  setBoardLabelState: (newState: BoardLabel[]) => void
}

export function SidebarButtonLabels({
  type,
  cardlistId,
  cardId,
  currentCard,
  setCurrentCard,
  boardLabelState,
  setBoardLabelState
}: SidebarButtonLabelsProps) {
  const boxRef = useRef(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLDivElement>(null)
  const [modalState, setModalState] = useState<boolean[]>([false, false, false])
  const [selectedLabel, setSelectedLabel] = useState<BoardLabel>(boardLabelState[0])

  // API
  const [addCardFeatureAPI] = CardApiRTQ.CardApiSlice.useAddCardFeatureMutation()

  function openModal(modalIndex: number) {
    const updatedOpenModal = modalState.map((state, index) => (index === modalIndex ? true : state))
    setModalState(updatedOpenModal)
  }

  function addBoardLabel(color: string, name: string) {
    const newBoardLabel: BoardLabel = {
      _id: (parseInt(boardLabelState.slice(-1)[0]._id || '0', 10) + 1).toString(),
      color: color,
      name: name
    }
    setBoardLabelState([...boardLabelState, newBoardLabel])
  }

  function isLabelIncluded(boardLabel: BoardLabel): boolean {
    return currentCard.features.some((feature) => {
      if (feature.type === 'label' && feature.label_id === boardLabel._id) {
        return true
      }
      return false
    })
  }

  function removeBoardLabel() {
    // Remove label from Board
    const updatedBoardLabelList = boardLabelState.filter((label) => label._id !== selectedLabel._id)
    setBoardLabelState(updatedBoardLabelList)
    // Remove label from Card as well
    if (isLabelIncluded(selectedLabel)) {
      const updatedCard = {
        ...currentCard,
        labels: currentCard.features.filter(
          (feature) => feature.type === 'label' && feature.label_id !== selectedLabel._id
        )
      }
      setCurrentCard(updatedCard)
    }
  }

  function handleIncludeLabel(boardLabel: BoardLabel) {
    const newCardLabel: Feature_CardLabel = {
      type: 'label',
      label_id: boardLabel._id!
    }
    const updatedCard: Card = {
      ...currentCard,
      features: [...currentCard.features, newCardLabel]
    }
    setCurrentCard(updatedCard)
    addCardFeatureAPI({
      cardlist_id: cardlistId,
      card_id: cardId,
      feature: {
        type: 'label',
        label_id: boardLabel._id!
      }
    })
  }

  function handleExcludeLabel(boardLabel: BoardLabel) {
    const updatedCard: Card = {
      ...currentCard,
      features: currentCard.features.filter(
        (feature) => feature.type === 'label' && feature.label_id !== boardLabel._id
      )
    }
    setCurrentCard(updatedCard)
  }

  return (
    <Box ref={boxRef}>
      <SidebarButton
        icon={buttonTypeIconMap[type]}
        title={type}
        onClick={() => {
          setAnchorEl(boxRef.current)
          openModal(0)
        }}
      />
      {/* Modals */}
      {modalState[0] && (
        <CardLabelListModal
          anchorEl={anchorEl}
          setModalState={setModalState}
          currentCard={currentCard}
          boardLabels={boardLabelState}
          setSelectedLabel={setSelectedLabel}
          handleIncludeLabel={handleIncludeLabel}
          handleExcludeLabel={handleExcludeLabel}
        />
      )}
      {modalState[1] && (
        <CreateCardLabelModal anchorEl={anchorEl} setModalState={setModalState} addBoardLabel={addBoardLabel} />
      )}
      {modalState[2] && (
        <EditCardLabelModal
          anchorEl={anchorEl}
          setModalState={setModalState}
          currentCard={currentCard}
          setCurrentCard={setCurrentCard}
          currentLabel={selectedLabel}
          boardLabelState={boardLabelState}
          setBoardLabelState={setBoardLabelState}
          removeBoardLabel={removeBoardLabel}
        />
      )}
    </Box>
  )
}
