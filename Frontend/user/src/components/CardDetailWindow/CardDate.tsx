import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Tooltip } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { SelectCardDatesModal } from './modals/CardDateModal'
import dayjs, { Dayjs } from 'dayjs'
import { useTheme } from '../Theme/themeContext'
import { Card } from '@trello-v2/shared/src/schemas/CardList'
import { Feature_Date } from '@trello-v2/shared/src/schemas/Feature'
import React from 'react'

type CardStatus = 'complete' | 'overdue' | ''

interface StatusTagProps {
  cardDateStatus: CardStatus
}

function getTooltipTitle(isOpenModal: boolean, cardStatus: CardStatus): string {
  if (isOpenModal) {
    return ''
  } else {
    switch (cardStatus) {
      case 'complete':
        return 'This card is complete.'
      case 'overdue':
        return 'This card is past due.'
      default:
        return 'This card is due later.'
    }
  }
}

function StatusTag({ cardDateStatus }: StatusTagProps) {
  return (
    <Box
      sx={{
        width: 'fit-content',
        height: 16,
        padding: '0 4px',
        bgcolor: cardDateStatus === 'complete' ? '#008000' : '#fff0f5',
        color: cardDateStatus === 'complete' ? '#fff' : '#f00'
      }}
      className='flex items-center justify-center rounded text-sm font-semibold'
    >
      <p>{cardDateStatus}</p>
    </Box>
  )
}

interface CardDateProps {
  cardlistId: string
  cardId: string
  currentCard: Card
  setCurrentCard: (newState: Card) => void
}

export default function CardDate({ cardlistId, cardId, currentCard, setCurrentCard }: CardDateProps) {
  const { colors } = useTheme()
  const boxRef = useRef(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLDivElement>(null)
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const [isComplete, setIsComplete] = useState<boolean>(false)
  const [cardDateStatus, setCardDateStatus] = useState<CardStatus>('')
  const [cardDateVisible, setCardDateVisible] = useState<boolean>(true)

  function handleOpenModal() {
    setIsOpenModal(true)
  }

  function handleCloseModal() {
    setIsOpenModal(false)
  }

  function handleCheckboxClick() {
    setIsComplete(!isComplete)
  }

  function getFeatureDate(): Feature_Date | null {
    const featureDateIndex = currentCard.features.findIndex((feature) => feature.type === 'date')
    if (featureDateIndex !== -1) {
      return currentCard.features[featureDateIndex] as Feature_Date
    }
    return null
  }

  let datesText = ''
  const featureDate = getFeatureDate()
  const startDate: Dayjs | null = dayjs(featureDate?.start_date)
  const dueDate: Dayjs | null = dayjs(featureDate?.due_date)

  if (startDate || dueDate) {
    const startDateFormat = startDate ? `${startDate.format('MMM')} ${startDate.format('D')}` : ''
    const dueDateFormat = dueDate ? `${dueDate.format('MMM')} ${dueDate.format('D')}` : ''
    const timeFormat = dueDate ? ` at ${dueDate.format('h:mm A')}` : ''
    datesText = `${startDateFormat} ${startDate && dueDate ? '-' : ''} ${dueDateFormat}${timeFormat}`
  } else {
    datesText = ''
  }

  useEffect(() => {
    datesText === '' ? setCardDateVisible(false) : setCardDateVisible(true)
  }, [datesText])

  useEffect(() => {
    if (isComplete) {
      setCardDateStatus('complete')
    } else if (dueDate && dueDate.isBefore(dayjs())) {
      setCardDateStatus('overdue')
    } else {
      setCardDateStatus('')
    }
  }, [dueDate, isComplete])

  return (
    <React.Fragment>
      {currentCard.features.filter((feature) => feature.type === 'date').length !== 0 && (
        <Box>
          {cardDateVisible && (
            <Tooltip
              title={getTooltipTitle(isOpenModal, cardDateStatus)}
              placement='bottom-start'
              slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: 'offset',
                      options: {
                        offset: [18, -12]
                      }
                    }
                  ]
                }
              }}
            >
              <Box sx={{ margin: '10px 20px 0 0' }}>
                <h2 style={{ color: colors.text }} className='mb-2 text-xs font-bold'>
                  {startDate && !dueDate ? 'Start date' : 'Dates'}
                </h2>
                <Box className='flex flex-row gap-2'>
                  {!(startDate && !dueDate) && (
                    <input
                      type='checkbox'
                      style={{ background: 'transparent' }}
                      className='cursor-pointer'
                      onClick={handleCheckboxClick}
                    />
                  )}
                  <Box
                    ref={boxRef}
                    sx={{
                      boxsizing: 'content-box',
                      width: 'fit-content',
                      height: 32,
                      bgcolor: colors.button,
                      padding: '0px 12px 0 12px',
                      color: colors.text,
                      '&:hover': {
                        bgcolor: colors.button_hover
                      }
                    }}
                    className='flex cursor-pointer flex-row flex-wrap items-center gap-2 rounded'
                    onClick={() => {
                      setAnchorEl(boxRef.current)
                      handleOpenModal()
                    }}
                  >
                    <p className='text-sm font-semibold'>{datesText}</p>
                    <Box
                      sx={{ width: 'fit-content', height: 24, color: colors.text }}
                      className='flex items-center justify-center gap-2 text-sm'
                    >
                      {cardDateStatus !== '' && <StatusTag cardDateStatus={cardDateStatus} />}
                      <FontAwesomeIcon icon={faChevronDown} />
                    </Box>
                  </Box>
                </Box>
                {isOpenModal && (
                  <SelectCardDatesModal
                    anchorEl={anchorEl}
                    cardlistId={cardlistId}
                    cardId={cardId}
                    currentCard={currentCard}
                    setCurrentCard={setCurrentCard}
                    handleClose={handleCloseModal}
                  />
                )}
              </Box>
            </Tooltip>
          )}
        </Box>
      )}
    </React.Fragment>
  )
}
