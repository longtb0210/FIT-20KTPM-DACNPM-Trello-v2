import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Grid, Popover, styled } from '@mui/material'
import { useState } from 'react'
import { useTheme } from '~/components/Theme/themeContext'
import { Card } from '@trello-v2/shared/src/schemas/CardList'
import { Feature_Attachment } from '@trello-v2/shared/src/schemas/Feature'
import { Activity } from '@trello-v2/shared/src/schemas/Activity'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

interface CardAttachmentModalProps {
  anchorEl: (EventTarget & HTMLDivElement) | null
  currentCard: Card
  setCurrentCard: (newState: Card) => void
  handleClose: () => void
}

export function CardAttachmentModal({ anchorEl, currentCard, setCurrentCard, handleClose }: CardAttachmentModalProps) {
  const { colors } = useTheme()
  const [attachmentLinkValue, setAttachmentLinkValue] = useState<string>('')
  const [attachmentTitleValue, setAttachmentTitleValue] = useState<string>('')

  function handleLinkValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    setAttachmentLinkValue(event.target.value)
  }

  function handleTitleValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    setAttachmentTitleValue(event.target.value)
  }

  function createAttachment() {
    if (attachmentLinkValue.trim() !== '') {
      const newAttachment: Feature_Attachment = {
        type: 'attachment',
        link: attachmentLinkValue
      }
      const newActivity: Activity = {
        workspace_id: '0',
        board_id: '0',
        cardlist_id: '0',
        card_id: '0',
        content: `TrelloUser attached ${attachmentLinkValue} to this card`
      }
      const updatedCard: Card = {
        ...currentCard,
        features: [...currentCard.features, newAttachment],
        activities: [...currentCard.activities, newActivity]
      }
      setCurrentCard(updatedCard)
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
            <h2 className='overflow-hidden overflow-ellipsis whitespace-nowrap text-sm font-semibold'>Attach</h2>
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
        {/* Attach file from computer */}
        <p style={{ margin: '12px 0 12px 0', color: colors.text }} className='text-sm font-semibold'>
          Attach a file from your computer
        </p>
        <Box
          component='label'
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
          tabIndex={-1}
        >
          <h2 className='text-sm font-semibold'>Choose a file</h2>
          <VisuallyHiddenInput type='file' />
        </Box>
        {/* Line */}
        <Box sx={{ width: '100%', height: 2, margin: '12px 0 12px 0' }}>
          <Box sx={{ width: '100%', height: 2, bgcolor: colors.button }}></Box>
        </Box>
        {/* Attach link */}
        <p style={{ margin: '0 0 8px 0', color: colors.text }} className='text-sm font-semibold'>
          Search or paste a link
        </p>
        <input
          autoFocus
          style={{
            width: '100%',
            height: 36,
            margin: '0 0 20px 0',
            padding: '4px 6px',
            color: colors.text,
            border: `2px solid ${colors.button_hover}`,
            background: colors.background
          }}
          className='flex items-center rounded-sm text-sm'
          value={attachmentLinkValue}
          onChange={(e) => handleLinkValueChange(e)}
          placeholder='Find recent links or paste a new link'
        />
        {/* Display text */}
        <p style={{ margin: '0 0 8px 0', color: colors.text }} className='text-sm font-semibold'>
          Display text (optional)
        </p>
        <input
          autoFocus
          style={{
            width: '100%',
            height: 36,
            margin: '0 0 20px 0',
            padding: '4px 6px',
            color: colors.text,
            border: `2px solid ${colors.button_hover}`,
            background: colors.background
          }}
          className='flex items-center rounded-sm text-sm'
          value={attachmentTitleValue}
          onChange={(e) => handleTitleValueChange(e)}
          placeholder='Text to display'
        />
        {/* Buttons */}
        <Box sx={{ width: '100%', height: 'fit-content' }} className='flex flex-row justify-end'>
          <Box
            sx={{
              bgcolor: colors.button,
              width: 'fit-content',
              height: 32,
              margin: '0 8px 10px 0',
              padding: '0 12px',
              color: colors.text,
              fontSize: 14,
              fontWeight: 500,
              '&:hover': {
                backgroundColor: colors.button_hover
              }
            }}
            className='flex cursor-pointer items-center justify-center rounded'
            onClick={() => {
              handleClose()
            }}
          >
            <p>Cancel</p>
          </Box>
          <Box
            sx={{
              bgcolor: colors.button_primary,
              width: 'fit-content',
              height: 32,
              margin: '0 0 10px 0',
              padding: '0 12px',
              color: colors.button_primary_text,
              fontSize: 14,
              fontWeight: 500,
              '&:hover': {
                filter: 'brightness(90%)'
              }
            }}
            className='flex cursor-pointer items-center justify-center rounded'
            onClick={() => {
              createAttachment()
              handleClose()
            }}
          >
            <p>Insert</p>
          </Box>
        </Box>
      </Box>
    </Popover>
  )
}

interface RemoveAttachmentModalProps {
  anchorEl: (EventTarget & HTMLDivElement) | null
  handleRemove: () => void
  handleClose: () => void
}

export function RemoveAttachmentModal({ anchorEl, handleRemove, handleClose }: RemoveAttachmentModalProps) {
  const { colors } = useTheme()
  function handleDeleteAndClose() {
    handleRemove()
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
              Remove attachment?
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
        <p className='mb-4 mt-1 text-sm'>Remove this attachment? There is no undo.</p>
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
          <h2 className='text-sm font-semibold text-white'>Remove</h2>
        </Box>
      </Box>
    </Popover>
  )
}
