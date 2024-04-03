import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Tooltip } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { CardLabelListModal, CreateCardLabelModal, EditCardLabelModal } from './modals/CardLabelModal'
import { useTheme } from '../Theme/themeContext'
import { Card } from '@trello-v2/shared/src/schemas/CardList'
import { Feature_CardLabel } from '@trello-v2/shared/src/schemas/Feature'
import React from 'react'
import { BoardLabel } from '@trello-v2/shared/src/schemas/Board'
import { CardApiRTQ } from '~/api'

// eslint-disable-next-line react-refresh/only-export-components
export const labelColors: string[] = [
  '#BAF3DB', //  0 - subtle green
  '#F8E6A0', //  1 - subtle yellow
  '#FEDEC8', //  2 - subtle orange
  '#FFD5D2', //  3 - subtle red
  '#DFD8FD', //  4 - subtle purple
  '#4BCE97', //  5 - green
  '#F5CD47', //  6 - yellow
  '#FEA362', //  7 - orange
  '#F87168', //  8 - red
  '#9F8FEF', //  9 - purple
  '#1F845A', // 10 - bold green
  '#946F00', // 11 - bold yellow
  '#C25100', // 12 - bold orange
  '#C9372C', // 13 - bold red
  '#CE5DC6', // 14 - bold purple
  '#CCE0FF', // 15 - subtle blue
  '#C6EDFB', // 16 - subtle sky
  '#D3F1A7', // 17 - subtle lime
  '#FDD0EC', // 18 - subtle pink
  '#DCDFE4', // 19 - subtle black
  '#579DFF', // 20 - blue
  '#6CC3E0', // 21 - sky
  '#94C748', // 22 - lime
  '#E774BB', // 23 - pink
  '#8590A2', // 24 - black
  '#0C66E4', // 25 - bold blue
  '#227D9B', // 26 - bold sky
  '#5B7F24', // 27 - bold lime
  '#AE4787', // 28 - bold pink
  '#626F86' //  29 - bold black
]

// eslint-disable-next-line react-refresh/only-export-components
export const labelColorsTitle: string[] = [
  'subtle green',
  'subtle yellow',
  'subtle orange',
  'subtle red',
  'subtle purple',
  'green',
  'yellow',
  'orange',
  'red',
  'purple',
  'bold green',
  'bold yellow',
  'bold orange',
  'bold red',
  'bold purple',
  'subtle blue',
  'subtle sky',
  'subtle lime',
  'subtle pink',
  'subtle black',
  'blue',
  'sky',
  'lime',
  'pink',
  'black',
  'bold blue',
  'bold sky',
  'bold lime',
  'bold pink',
  'bold black'
]

const getContrastColor = (hexColor: string) => {
  // Convert hex color to RGB
  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)

  // Calculate the relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  // Choose black or white based on luminance
  return luminance > 0.588 ? '#533f04' : '#ffffff'
}

interface CardLabelItemProps {
  title: string
  bgColor: string
}

export function CardLabelItem({ title, bgColor }: CardLabelItemProps) {
  const textColor = getContrastColor(bgColor)

  return (
    <Box
      sx={{
        bgcolor: bgColor,
        width: 'fit-content',
        height: 32,
        padding: '0 12px',
        color: textColor,
        '&:hover': {
          filter: 'brightness(85%)'
        }
      }}
      className='mb-1 mr-1 flex cursor-pointer items-center rounded text-sm font-semibold'
    >
      {title}
    </Box>
  )
}

interface CardLabelListProps {
  cardlistId: string
  cardId: string
  currentCard: Card
  setCurrentCard: (newState: Card) => void
  boardLabelState: BoardLabel[]
  setBoardLabelState: (newState: BoardLabel[]) => void
}

export default function CardLabelList({
  cardlistId,
  cardId,
  currentCard,
  setCurrentCard,
  boardLabelState,
  setBoardLabelState
}: CardLabelListProps) {
  const { colors } = useTheme()
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

  return (
    <React.Fragment>
      {currentCard.features.filter((feature) => feature.type === 'label').length !== 0 && (
        <Box ref={boxRef} sx={{ margin: '10px 20px 0 0' }}>
          <h2 style={{ color: colors.text }} className='mb-2 text-xs font-bold'>
            Labels
          </h2>
          <div className='flex flex-row flex-wrap'>
            {currentCard.features
              .filter((_feature) => _feature.type === 'label')
              .map((feature, index) => {
                const label = feature as Feature_CardLabel
                const boardLabel = boardLabelState.find((boardLabel) => boardLabel._id === label.label_id)
                if (boardLabel) {
                  const colorTitle = labelColorsTitle[labelColors.indexOf(boardLabel!.color || labelColors[0])]
                  return (
                    <Tooltip
                      arrow
                      key={index}
                      title={`Color: ${colorTitle}, title: ${boardLabel!.name}`}
                      placement='bottom'
                      slotProps={{
                        popper: {
                          modifiers: [
                            {
                              name: 'offset',
                              options: {
                                offset: [0, -12]
                              }
                            }
                          ]
                        }
                      }}
                    >
                      <div style={{ display: 'inline-block' }}>
                        <CardLabelItem title={boardLabel!.name} bgColor={boardLabel!.color} />
                      </div>
                    </Tooltip>
                  )
                }
              })}
            <Box
              sx={{
                bgcolor: colors.button,
                width: 32,
                height: 32,
                color: colors.text,
                fontSize: 14,
                fontWeight: 500,
                '&:hover': {
                  bgcolor: colors.button_hover
                }
              }}
              className='flex cursor-pointer items-center justify-center rounded'
              onClick={() => {
                setAnchorEl(boxRef.current)
                openModal(0)
              }}
            >
              <FontAwesomeIcon icon={faPlus} />
            </Box>
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
          </div>
        </Box>
      )}
    </React.Fragment>
  )
}
