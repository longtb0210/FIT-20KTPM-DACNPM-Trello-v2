import { useRef, useState } from 'react'
import { CardLabelListModal, CreateCardLabelModal, EditCardLabelModal } from '../modals/CardLabelModal'
import { ButtonType, SidebarButton, buttonTypeIconMap } from './CardSidebarButton'
import { Box } from '@mui/material'
import { Card } from '@trello-v2/shared/src/schemas/CardList'
import { Feature_CardLabel } from '@trello-v2/shared/src/schemas/Feature'
import { BoardLabel } from '@trello-v2/shared/src/schemas/Board'
import { BoardApiRTQ, CardApiRTQ, CardlistApiRTQ } from '~/api'

interface SidebarButtonLabelsProps {
  type: ButtonType
  boardId: string
  cardlistId: string
  cardId: string
  currentCard: Card
  setCurrentCard: (newState: Card) => void
  boardLabelState: BoardLabel[]
  setBoardLabelState: (newState: BoardLabel[]) => void
}

export function SidebarButtonLabels({
  type,
  boardId,
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
  const [addBoardLabelAPI] = BoardApiRTQ.BoardApiSlice.useAddBoardLabelMutation()
  const [removeBoardLabelAPI] = BoardApiRTQ.BoardApiSlice.useRemoveBoardLabelMutation()
  const [addCardFeatureAPI] = CardApiRTQ.CardApiSlice.useAddCardFeatureMutation()
  const [deleteCardFeatureAPI] = CardApiRTQ.CardApiSlice.useDeleteCardFeatureMutation()
  const [getCardlistByBoardIdAPI] = CardlistApiRTQ.CardListApiSlice.useLazyGetCardlistByBoardIdQuery()

  function openModal(modalIndex: number) {
    const updatedOpenModal = modalState.map((state, index) => (index === modalIndex ? true : state))
    setModalState(updatedOpenModal)
  }

  function addBoardLabel(color: string, name: string) {
    addBoardLabelAPI({
      boardId: boardId,
      color: color,
      name: name
    })
      .unwrap()
      .then((response) => {
        const newBoardLabel: BoardLabel = {
          _id: response.data._id,
          color: color,
          name: name
        }
        setBoardLabelState([...boardLabelState, newBoardLabel])
      })
      .catch((error) => {
        console.log('ERROR: add board label', error)
      })
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
    removeBoardLabelAPI({
      boardId: boardId,
      _id: selectedLabel._id!
    })
    // Remove label from Board
    const updatedBoardLabelList = boardLabelState.filter((label) => label._id !== selectedLabel._id)
    setBoardLabelState(updatedBoardLabelList)
    // Remove label from Card as well
    if (isLabelIncluded(selectedLabel)) {
      handleExcludeLabel(selectedLabel)
    }
  }

  function handleIncludeLabel(boardLabel: BoardLabel) {
    addCardFeatureAPI({
      cardlist_id: cardlistId,
      card_id: cardId,
      feature: {
        type: 'label',
        label_id: boardLabel._id!
      }
    })
      .unwrap()
      .then((response) => {
        const updatedCard: Card = {
          ...currentCard,
          features: [...currentCard.features, response.data]
        }
        setCurrentCard(updatedCard)
        getCardlistByBoardIdAPI({
          id: boardId
        })
      })
      .catch((error) => {
        console.log('ERROR: add label to card - ', error)
      })
  }

  function handleExcludeLabel(boardLabel: BoardLabel) {
    const featureToDelete: Feature_CardLabel = currentCard.features.find(
      (feature) => feature.type === 'label' && feature.label_id === boardLabel._id
    ) as Feature_CardLabel
    deleteCardFeatureAPI({
      cardlist_id: cardlistId,
      card_id: cardId,
      feature_id: featureToDelete._id!
    })
      .unwrap()
      .then((response) => {
        setCurrentCard(response.data)
        getCardlistByBoardIdAPI({
          id: boardId
        })
      })
      .catch((error) => {
        console.log('ERROR: remove card from label - ', error)
      })
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
          boardId={boardId}
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
