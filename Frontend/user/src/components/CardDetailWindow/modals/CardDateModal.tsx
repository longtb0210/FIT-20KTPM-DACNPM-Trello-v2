import { useEffect, useState } from 'react'
import { Box, FormControl, Grid, MenuItem, Popover, Select, SelectChangeEvent } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import dayjs, { Dayjs } from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { useTheme } from '~/components/Theme/themeContext'
import { Card } from '@trello-v2/shared/src/schemas/CardList'
import { Feature_Date } from '@trello-v2/shared/src/schemas/Feature'
import { CardApiRTQ, CardlistApiRTQ } from '~/api'

const reminderDateChoices: string[] = [
  'None',
  'At time of due date',
  '5 Minutes before',
  '10 Minutes before',
  '15 Minutes before',
  '1 Hour before',
  '2 Hours before',
  '1 Day before',
  '2 Days before'
]

interface SelectCardDatesModalProps {
  anchorEl: (EventTarget & HTMLDivElement) | null
  cardlistId: string
  cardId: string
  currentCard: Card
  setCurrentCard: (newState: Card) => void
  handleClose: () => void
}

export function SelectCardDatesModal({
  anchorEl,
  cardlistId,
  cardId,
  currentCard,
  setCurrentCard,
  handleClose
}: SelectCardDatesModalProps) {
  const { colors } = useTheme()
  const menuItemFontSize = 14
  const [startDateEnabled, setStartDateEnabled] = useState(true)
  const [dueDateEnabled, setDueDateEnabled] = useState(true)
  const [startDateValue, setStartDateValue] = useState<Dayjs | null>(null)
  const [dueDateValue, setDueDateValue] = useState<Dayjs | null>(null)
  const [reminderDateValue, setReminderDateValue] = useState('None')

  //API
  const [addCardFeatureAPI] = CardApiRTQ.CardApiSlice.useAddCardFeatureMutation()
  const [updateCardFeatureAPI] = CardApiRTQ.CardApiSlice.useUpdateCardFeatureMutation()
  const [deleteCardFeatureAPI] = CardApiRTQ.CardApiSlice.useDeleteCardFeatureMutation()
  const [getCardlistByBoardIdAPI] = CardlistApiRTQ.CardListApiSlice.useLazyGetCardlistByBoardIdQuery()

  useEffect(() => {
    const featureDate = currentCard.features.find((feature) => feature.type === 'date') as Feature_Date
    if (featureDate) {
      setStartDateValue(dayjs(featureDate.start_date))
      setDueDateValue(dayjs(featureDate.due_date))
    } else {
      setStartDateValue(dayjs())
      setDueDateValue(dayjs().add(1, 'day'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSelectStartDate(startDate: Dayjs) {
    setStartDateValue(startDate)
    if (startDate.isAfter(dueDateValue)) {
      setDueDateValue(startDate.add(1, 'day'))
    }
  }

  function handleSelectDueDate(dueDate: Dayjs) {
    setDueDateValue(dueDate)
    if (dueDate.isBefore(startDateValue)) {
      setStartDateValue(dueDate.subtract(1, 'day'))
    }
  }

  function handleSelectReminderDate(event: SelectChangeEvent) {
    setReminderDateValue(event.target.value as string)
  }

  function updateCardDates() {
    const featureDateIndex = currentCard.features.findIndex((feature) => feature.type === 'date')
    if (featureDateIndex === -1) {
      addCardFeatureAPI({
        cardlist_id: cardlistId,
        card_id: cardId,
        feature: {
          type: 'date',
          start_date: startDateValue!.toDate(),
          due_date: dueDateValue!.toDate()
        }
      })
        .unwrap()
        .then((response) => {
          const updatedCard = {
            ...currentCard,
            features: [...currentCard.features, response.data]
          }
          setCurrentCard(updatedCard)
          getCardlistByBoardIdAPI({
            id: boardId
          })
        })
        .catch((error) => {
          console.log('ERROR: add card dates - ', error)
        })
    } else {
      const featureDate = currentCard.features[featureDateIndex] as Feature_Date
      updateCardFeatureAPI({
        cardlist_id: cardlistId,
        card_id: cardId,
        feature: {
          _id: featureDate._id!,
          type: 'date',
          start_date: startDateValue!.toDate(),
          due_date: dueDateValue!.toDate()
        }
      })
      const updatedCard: Card = {
        ...currentCard,
        features: currentCard.features.map((feature) =>
          feature.type === 'date' && feature._id === featureDate._id
            ? {
                ...feature,
                start_date: startDateValue!.toDate(),
                due_date: dueDateValue!.toDate()
              }
            : feature
        )
      }
      setCurrentCard(updatedCard)
      getCardlistByBoardIdAPI({
        id: boardId
      })
    }
  }

  function handleRemoveCardDate() {
    const featureDateIndex = currentCard.features.findIndex((feature) => feature.type === 'date')
    if (featureDateIndex === -1) {
      return
    } else {
      const featureDate = currentCard.features[featureDateIndex] as Feature_Date
      deleteCardFeatureAPI({
        cardlist_id: cardlistId,
        card_id: cardId,
        feature_id: featureDate._id!
      })
        .unwrap()
        .then((response) => {
          setCurrentCard(response.data)
        })
        .catch((error) => {
          console.log('ERROR: remove card dates - ', error)
        })
    }
  }

  return (
    <Popover
      open={true}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left'
      }}
      onClose={handleClose}
      sx={{ margin: '8px 0 0 0' }}
    >
      <Box
        sx={{
          width: 304,
          height: 'fit-content',
          padding: '4px 8px',
          color: colors.text,
          backgroundColor: colors.background_modal_secondary
        }}
        className='flex flex-col'
      >
        {/* START: Modal heading */}
        <Grid container sx={{ width: '100%', margin: '4px 0 8px 0' }}>
          <Grid item xs={2}></Grid>
          <Grid item xs={8} className='flex items-center justify-center'>
            <h2 className='overflow-hidden overflow-ellipsis whitespace-nowrap text-sm font-semibold'>Dates</h2>
          </Grid>
          <Grid item xs={2} className='flex items-center justify-end'>
            <Box
              sx={{ width: 32, height: 32, '&:hover': { bgcolor: colors.button_hover } }}
              className='flex cursor-pointer items-center justify-center rounded-lg'
              onMouseDown={handleClose}
            >
              <FontAwesomeIcon icon={faXmark} />
            </Box>
          </Grid>
        </Grid>
        {/* END: Modal heading */}
        <Box sx={{ width: '100%', height: 20 }}></Box>
        {/* START: Select card dates */}
        <p style={{ margin: '0 0 12px 0', color: colors.text }} className='text-xs font-bold'>
          Select dates
        </p>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
            {/* Select start date */}
            <Box sx={{ width: '100%' }} className='flex flex-row items-center'>
              <input
                type='checkbox'
                style={{ width: 18, height: 18, marginRight: 8 }}
                checked={startDateEnabled}
                onChange={() => setStartDateEnabled(!startDateEnabled)}
              />
              <DateTimePicker
                disabled={!startDateEnabled}
                label='Start date'
                value={startDateValue}
                onChange={(newValue) => handleSelectStartDate(newValue!)}
                sx={{
                  width: '100%',
                  background: colors.background_modal,
                  '& .MuiOutlinedInput-input': { color: colors.text },
                  '& .MuiInputLabel-root': { color: colors.text, fontWeight: 500 },
                  '& .MuiSvgIcon-root': startDateEnabled ? { color: colors.text } : null,
                  '& .MuiDateCalendar-root': { bgcolor: colors.background }
                }}
              />
            </Box>
            {/* Select due date */}
            <Box sx={{ width: '100%' }} className='flex flex-row items-center'>
              <input
                type='checkbox'
                style={{ width: 18, height: 18, marginRight: 8 }}
                checked={dueDateEnabled}
                onChange={() => setDueDateEnabled(!dueDateEnabled)}
              />
              <DateTimePicker
                disabled={!dueDateEnabled}
                label='Due date'
                value={dueDateValue}
                onChange={(newValue) => handleSelectDueDate(newValue!)}
                sx={{
                  width: '100%',
                  background: colors.background_modal,
                  '& .MuiOutlinedInput-input': { color: colors.text },
                  '& .MuiInputLabel-root': { color: colors.text, fontWeight: 500 },
                  '& .MuiSvgIcon-root': dueDateEnabled ? { color: colors.text } : null,
                  '& .MuiDateCalendar-root': { bgcolor: colors.background }
                }}
              />
            </Box>
          </DemoContainer>
        </LocalizationProvider>
        {/* END: Select card dates */}
        <Box sx={{ width: '100%', height: 20 }}></Box>
        {/* Due date reminder */}
        <p style={{ margin: '12px 0 8px 0', color: colors.text }} className='text-xs font-bold'>
          Set due date reminder
        </p>
        <FormControl fullWidth>
          <Select
            sx={{
              height: 36,
              margin: '0 0 8px 0',
              fontSize: 14,
              background: colors.background_modal,
              color: colors.text
            }}
            value={reminderDateValue}
            onChange={handleSelectReminderDate}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 144,
                  marginTop: 8,
                  background: colors.background_modal,
                  color: colors.text
                }
              }
            }}
          >
            {reminderDateChoices.map((choice, index) => (
              <MenuItem key={index} value={choice} sx={{ fontSize: menuItemFontSize }}>
                {choice}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <p style={{ margin: '0 0 20px 0', color: colors.text }} className='text-xs font-semibold'>
          Reminders will be sent to all members and watchers of this card.
        </p>
        {/* Button save */}
        <Box
          sx={{
            width: '100%',
            height: 32,
            margin: '0 0 8px 0',
            padding: '0 8px',
            color: colors.button_primary_text,
            bgcolor: colors.button_primary,
            '&:hover': {
              filter: 'brightness(90%)'
            }
          }}
          className='flex cursor-pointer items-center justify-center rounded'
          onClick={() => {
            updateCardDates()
            handleClose()
          }}
        >
          <h2 className='text-sm font-semibold text-white'>Save</h2>
        </Box>
        {/* Button remove */}
        <Box
          sx={{
            width: '100%',
            height: 32,
            margin: '0 0 8px 0',
            padding: '0 8px',
            color: colors.text,
            bgcolor: colors.button,
            '&:hover': {
              bgcolor: colors.button_hover
            }
          }}
          className='flex cursor-pointer items-center justify-center rounded'
          onClick={() => {
            handleRemoveCardDate()
            handleClose()
          }}
        >
          <h2 className='text-sm font-semibold'>Remove</h2>
        </Box>
      </Box>
    </Popover>
  )
}
