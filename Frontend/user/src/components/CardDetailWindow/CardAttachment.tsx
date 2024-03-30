import { Box } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperclip, faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { useRef, useState } from 'react'
import { CardAttachmentModal, RemoveAttachmentModal } from './modals/CardAttachmentModal'
import { useTheme } from '../Theme/themeContext'
import { Card } from '@trello-v2/shared/src/schemas/CardList'
import { Feature_Attachment } from '@trello-v2/shared/src/schemas/Feature'
import React from 'react'

type AttachmentType = 'file' | 'link'

interface CardAttachmentProps {
  currentCard: Card
  setCurrentCard: (newState: Card) => void
}

export function CardAttachment({ currentCard, setCurrentCard }: CardAttachmentProps) {
  const { colors } = useTheme()
  const boxRef = useRef(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLDivElement>(null)
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)

  function handleOpenModal() {
    setIsOpenModal(true)
  }

  function handleCloseModal() {
    setIsOpenModal(false)
  }

  return (
    <React.Fragment>
      {currentCard.features.filter((feature) => feature.type === 'attachment').length !== 0 && (
        <Box sx={{ width: '100%', height: 'fit-content', margin: '30px 0 40px 0' }} className='flex flex-col'>
          <Box
            sx={{ width: '100%', height: 32, marginBottom: '16px', color: colors.text }}
            className='flex flex-row items-center justify-between'
          >
            {/* Title */}
            <Box sx={{ width: 'fit-content', height: 32 }} className='flex flex-row items-center'>
              <FontAwesomeIcon icon={faPaperclip} style={{ width: 36, marginRight: '6px' }} className='text-xl' />
              <h2 className='font-semibold'>Attachments</h2>
            </Box>
            {/* Button */}
            <Box
              ref={boxRef}
              sx={{
                bgcolor: colors.button,
                width: 'fit-content',
                height: 32,
                padding: '0 12px',
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
                handleOpenModal()
              }}
            >
              <p>Add</p>
            </Box>
          </Box>
          <Box sx={{ width: '100%', height: 'fit-content', paddingLeft: '42px' }} className='flex flex-col'>
            {currentCard.features
              .filter((_feature) => _feature.type === 'attachment')
              .map((feature, index) => {
                const attachment = feature as Feature_Attachment
                return (
                  <CardAttachmentTile
                    key={index}
                    type='link'
                    attachment={attachment}
                    currentCard={currentCard}
                    setCurrentCard={setCurrentCard}
                  />
                )
              })}
          </Box>
          {isOpenModal && (
            <CardAttachmentModal
              anchorEl={anchorEl}
              currentCard={currentCard}
              setCurrentCard={setCurrentCard}
              handleClose={handleCloseModal}
            />
          )}
        </Box>
      )}
    </React.Fragment>
  )
}

interface CardAttachmentTileProps {
  type: AttachmentType
  attachment: Feature_Attachment
  currentCard: Card
  setCurrentCard: (newState: Card) => void
}

function CardAttachmentTile({ type, attachment, currentCard, setCurrentCard }: CardAttachmentTileProps) {
  const { colors } = useTheme()
  const boxRef = useRef(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLDivElement>(null)
  const [isOpenModal, setIsOpenModal] = useState<boolean[]>([false, false])

  function handleRemove() {
    const updatedCard: Card = {
      ...currentCard,
      features: currentCard.features.filter(
        (feature) => feature.type === 'attachment' && feature._id === attachment._id
      )
    }
    setCurrentCard(updatedCard)
  }

  return (
    <React.Fragment>
      <Box
        sx={{
          width: '100%',
          height: 'fit-content',
          padding: '2px 0',
          marginBottom: '6px',
          bgcolor: colors.background_modal,
          color: colors.text,
          '&:hover': { bgcolor: colors.button }
        }}
        className='flex cursor-pointer flex-row items-center'
        onClick={() => {
          window.open(attachment.link, '_blank')
        }}
      >
        {/* Left box */}
        <Box
          sx={{ width: 112, height: 80, bgcolor: colors.button }}
          className='flex items-center justify-center rounded'
        >
          {type === 'file' ? (
            <h1 className='text-lg font-bold'>exe</h1>
          ) : (
            <FontAwesomeIcon icon={faPaperclip} style={{ width: 36, marginRight: '6px' }} className='text-xl' />
          )}
        </Box>
        {/* Content */}
        <Box sx={{ flex: 1, height: 'fit-content', padding: '8px 20px' }} className='flex flex-col justify-start'>
          <Box className='flex flex-row items-center'>
            <h2 className='text-sm font-bold'>{attachment.link}</h2>
            <FontAwesomeIcon icon={faUpRightFromSquare} style={{ marginLeft: '12px' }} className='text-xs' />
          </Box>
          <Box sx={{ marginTop: '4px' }} className='flex flex-row items-center'>
            {/* Attachment creation time */}
            <p className='text-sm'>Added 5 minutes ago</p>
            {/* Divider dot */}
            <p
              className='flex items-center justify-center text-2xl font-bold'
              style={{ width: 16, position: 'relative' }}
            >
              <span style={{ position: 'absolute', left: 8, top: -8, transform: 'translate(-50%, -50%)' }}>.</span>
            </p>
            {/* Button remove */}
            <p
              ref={boxRef}
              className='text-sm underline'
              onClick={(event) => {
                event.stopPropagation()
                setAnchorEl(boxRef.current)
                setIsOpenModal([true, false])
              }}
            >
              Remove
            </p>
          </Box>
        </Box>
      </Box>
      {isOpenModal[0] === true && (
        <RemoveAttachmentModal
          anchorEl={anchorEl}
          handleRemove={handleRemove}
          handleClose={() => setIsOpenModal([false, false])}
        />
      )}
    </React.Fragment>
  )
}
