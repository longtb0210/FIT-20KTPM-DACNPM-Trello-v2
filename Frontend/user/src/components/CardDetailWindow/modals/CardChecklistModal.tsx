import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Grid, Popover } from '@mui/material'
import { useState } from 'react'
// import moment from 'moment'
import { useTheme } from '~/components/Theme/themeContext'
import { Card } from '@trello-v2/shared/src/schemas/CardList'
import { Activity } from '@trello-v2/shared/src/schemas/Activity'
import { CardApiRTQ } from '~/api'

interface CreateCardChecklistModalProps {
  anchorEl: (EventTarget & HTMLDivElement) | null
  cardlistId: string
  cardId: string
  currentCard: Card
  setCurrentCard: (newState: Card) => void
  handleClose: () => void
}

export function CreateCardChecklistModal({
  anchorEl,
  cardlistId,
  cardId,
  currentCard,
  setCurrentCard,
  handleClose
}: CreateCardChecklistModalProps) {
  const { colors } = useTheme()
  const [textFieldValue, setTextFieldValue] = useState('')

  function handleTextFieldChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTextFieldValue(event.target.value)
  }

  // API
  const [addCardFeatureAPI] = CardApiRTQ.CardApiSlice.useAddCardFeatureMutation()

  function createChecklist() {
    const trimmedValue = textFieldValue.replace(/\s+/g, ' ').trim()
    if (trimmedValue !== '') {
      addCardFeatureAPI({
        cardlist_id: cardlistId,
        card_id: cardId,
        feature: {
          type: 'checklist',
          name: trimmedValue,
          items: []
        }
      })
        .unwrap()
        .then((response) => {
          const newActivity: Activity = {
            workspace_id: '0',
            board_id: '0',
            cardlist_id: cardlistId,
            card_id: cardId,
            content: `vu@gmail.com added ${trimmedValue} to this card`,
            create_time: new Date(),
            creator_email: 'vu@gmail.com'
          }
          const updatedCard: Card = {
            ...currentCard,
            features: [...currentCard.features, response.data],
            activities: [...currentCard.activities, newActivity]
          }
          setCurrentCard(updatedCard)
        })
        .catch((error) => {
          console.log('ERROR: create checklist - ', error)
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
            <h2 className='overflow-hidden overflow-ellipsis whitespace-nowrap text-sm font-semibold'>Add checklist</h2>
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
        {/* Input checklist title */}
        <p style={{ margin: '10px 0 4px 0', color: colors.text }} className='text-xs font-bold'>
          Title
        </p>
        <input
          autoFocus
          style={{
            width: '100%',
            height: 36,
            margin: '0 0 20px 0',
            padding: '4px 6px',
            color: colors.text,
            background: colors.background_modal_tertiary,
            border: `2px solid ${colors.button_hover}`
          }}
          className='flex items-center rounded-sm text-sm'
          value={textFieldValue}
          onChange={(e) => handleTextFieldChange(e)}
          placeholder='Checklist title'
        />
        {/* Button */}
        <Box
          sx={{
            bgcolor: colors.button_primary,
            width: 'fit-content',
            height: 32,
            margin: '0 0 10px 0',
            padding: '0 20px',
            color: colors.background,
            fontSize: 14,
            fontWeight: 500,
            '&:hover': {
              filter: 'brightness(90%)'
            }
          }}
          className='flex cursor-pointer items-center justify-center rounded'
          onClick={() => {
            if (textFieldValue.trim() !== '') {
              createChecklist()
              handleClose()
            }
          }}
        >
          <p>Add</p>
        </Box>
      </Box>
    </Popover>
  )
}

interface DeleteChecklistModalProps {
  checklistName: string
  anchorEl: (EventTarget & HTMLDivElement) | null
  handleDelete: () => void
  handleClose: () => void
}

export function DeleteChecklistModal({
  checklistName,
  anchorEl,
  handleDelete,
  handleClose
}: DeleteChecklistModalProps) {
  const { colors } = useTheme()
  function handleDeleteAndClose() {
    handleDelete()
    handleClose()
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
      sx={{ margin: '6px 0 0 0' }}
    >
      <Box
        sx={{
          width: 304,
          height: 'fit-content',
          padding: '4px 8px 12px 8px',
          color: colors.text,
          backgroundColor: colors.background_modal_secondary
        }}
        className='flex flex-col'
      >
        {/* START: Modal heading */}
        <Grid container sx={{ width: '100%', margin: '4px 0 8px 0' }}>
          <Grid item xs={2}></Grid>
          <Grid item xs={8} className='flex items-center justify-center'>
            <h2 className='overflow-hidden overflow-ellipsis whitespace-nowrap text-sm font-semibold'>
              Delete {checklistName}
            </h2>
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
        {/* Warning */}
        <p className='mb-4 mt-1 text-sm'>Deleting a checklist is permanent and there is no way to get it back.</p>
        {/* Button */}
        <Box
          sx={{
            width: '100%',
            height: 32,
            padding: '0 8px',
            bgcolor: '#f00',
            '&:hover': {
              filter: 'brightness(90%)'
            }
          }}
          className='flex cursor-pointer items-center justify-center rounded'
          onClick={handleDeleteAndClose}
        >
          <h2 className='text-sm font-semibold text-white'>Delete checklist</h2>
        </Box>
      </Box>
    </Popover>
  )
}

interface ChecklistItemModalProps {
  anchorEl: (EventTarget & SVGSVGElement) | null
  handleDelete: () => void
  handleClose: () => void
}

export function ChecklistItemModal({ anchorEl, handleDelete, handleClose }: ChecklistItemModalProps) {
  const { colors } = useTheme()
  function handleDeleteAndClose() {
    handleDelete()
    handleClose()
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
    >
      <Box
        sx={{
          width: 304,
          height: 'fit-content',
          padding: '4px 0px 8px 0px',
          color: colors.text,
          backgroundColor: colors.background_modal_secondary
        }}
        className='flex flex-col'
      >
        {/* START: Modal heading */}
        <Grid container sx={{ width: '100%', margin: '4px 0px 8px 0px', padding: '0 8px' }}>
          <Grid item xs={2}></Grid>
          <Grid item xs={8} className='flex items-center justify-center'>
            <h2 className='overflow-hidden overflow-ellipsis whitespace-nowrap text-sm font-semibold'>Item actions</h2>
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
        <Box
          sx={{
            width: '100%',
            height: 32,
            padding: '0 12px',
            '&:hover': {
              bgcolor: colors.button
            }
          }}
          className='flex cursor-pointer items-center'
          onClick={handleDeleteAndClose}
        >
          <h2 className='text-sm'>Delete</h2>
        </Box>
      </Box>
    </Popover>
  )
}
