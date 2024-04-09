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
  const [deleteCardFeatureAPI] = CardApiRTQ.CardApiSlice.useDeleteCardFeatureMutation()

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
      handleExcludeLabel(selectedLabel)
    }
  }

  async function handleIncludeLabel(boardLabel: BoardLabel) {
    try {
      const response = await addCardFeatureAPI({
        cardlist_id: cardlistId,
        card_id: cardId,
        feature: {
          type: 'label',
          label_id: boardLabel._id!
        }
      })
      const updatedCard: Card = {
        ...currentCard,
        features: [...currentCard.features, response.data.data]
      }
      setCurrentCard(updatedCard)
    } catch (error) {
      console.error('Error while adding label to card:', error)
    }
  }

  // useEffect(() => {
  //   if (newCardLabel && newCardLabel.data) {
  //     const updatedCard: Card = {
  //       ...currentCard,
  //       features: [...currentCard.features, newCardLabel.data]
  //     }
  //     setCurrentCard(updatedCard)
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [newCardLabel])

  async function handleExcludeLabel(boardLabel: BoardLabel) {
    try {
      const featureToDelete: Feature_CardLabel = currentCard.features.find(
        (feature) => feature.type === 'label' && feature.label_id === boardLabel._id
      ) as Feature_CardLabel
      const response = await deleteCardFeatureAPI({
        cardlist_id: cardlistId,
        card_id: cardId,
        feature_id: featureToDelete._id!
      })
      setCurrentCard(response.data.data)
    } catch (error) {
      console.error('Error while removing label from card:', error)
    }
  }

  // useEffect(() => {
  //   if (updatedCardAfterDeleteFeature && updatedCardAfterDeleteFeature.data) {
  //     setCurrentCard(updatedCardAfterDeleteFeature.data)
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [updatedCardAfterDeleteFeature])

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
