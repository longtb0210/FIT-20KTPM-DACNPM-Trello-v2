import { Box } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperclip, faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { useRef, useState } from 'react'
import { CardAttachmentModal, EditAttachmentModal, RemoveAttachmentModal } from './modals/CardAttachmentModal'
import { useTheme } from '../Theme/themeContext'
import { Card } from '@trello-v2/shared/src/schemas/CardList'
import { Feature_Attachment } from '@trello-v2/shared/src/schemas/Feature'
import React from 'react'
import { CardApiRTQ } from '~/api'

type AttachmentType = 'file' | 'link'

interface CardAttachmentProps {
  cardlistId: string
  cardId: string
  currentCard: Card
  setCurrentCard: (newState: Card) => void
}

export function CardAttachment({ cardlistId, cardId, currentCard, setCurrentCard }: CardAttachmentProps) {
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
                    cardlistId={cardlistId}
                    cardId={cardId}
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
              cardlistId={cardlistId}
              cardId={cardId}
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
  cardlistId: string
  cardId: string
  attachment: Feature_Attachment
  currentCard: Card
  setCurrentCard: (newState: Card) => void
}

function CardAttachmentTile({
  type,
  cardlistId,
  cardId,
  attachment,
  currentCard,
  setCurrentCard
}: CardAttachmentTileProps) {
  const { colors } = useTheme()
  const boxRef = useRef(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLDivElement>(null)
  const [isOpenModal, setIsOpenModal] = useState<boolean[]>([false, false])
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null)

  // async function fetchFaviconUrl(url: string) {
  //   try {
  //     let link = url
  //     if (!link.startsWith('http://') && !link.startsWith('https://')) {
  //       link = 'https://' + link
  //     }
  //     const response = await fetch(`https://s2.googleusercontent.com/s2/favicons?domain_url=${link}`)
  //     if (response) {
  //       console.log(response)
  //       setFaviconUrl(response.data)
  //     }
  //   } catch (error) {
  //     console.error('Error fetching favicon:', error)
  //   }
  // }
  // useEffect(() => {
  //   fetchFaviconUrl(attachment.link)
  // }, [])

  function getWebsiteName(url: string): string {
    let link = url
    if (!link.startsWith('http://') && !link.startsWith('https://')) {
      link = 'https://' + link
    }
    const parsedUrl = new URL(link)
    const parts = parsedUrl.hostname.split('.')
    const hasSubdomain = parts.length > 2 // Check if there is a subdomain
    if (hasSubdomain) {
      return parts[parts.length - 2].charAt(0).toUpperCase() + parts[parts.length - 2].slice(1)
    } else {
      return parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
    }
  }

  //API
  const [deleteCardFeatureAPI] = CardApiRTQ.CardApiSlice.useDeleteCardFeatureMutation()

  async function handleRemove() {
    const response = await deleteCardFeatureAPI({
      cardlist_id: cardlistId,
      card_id: cardId,
      feature_id: attachment._id!
    })
    setCurrentCard(response.data.data)
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
          let link = attachment.link
          if (!link.startsWith('http://') && !link.startsWith('https://')) {
            link = 'https://' + link
          }
          window.open(link, '_blank')
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
            <div>
              {faviconUrl ? (
                <img src={faviconUrl} alt='Favicon' style={{ width: 36, marginRight: '6px' }} />
              ) : (
                <FontAwesomeIcon icon={faPaperclip} style={{ width: 36, marginRight: '6px' }} className='text-xl' />
              )}
            </div>
          )}
        </Box>
        {/* Content */}
        <Box sx={{ flex: 1, height: 'fit-content', padding: '8px 20px' }} className='flex flex-col justify-start'>
          <Box className='flex flex-row items-center'>
            <h2 className='text-sm font-bold'>{getWebsiteName(attachment.link)}</h2>
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
            {/* Divider dot */}
            <p
              className='flex items-center justify-center text-2xl font-bold'
              style={{ width: 16, position: 'relative' }}
            >
              <span style={{ position: 'absolute', left: 8, top: -8, transform: 'translate(-50%, -50%)' }}>.</span>
            </p>
            {/* Button edit */}
            <p
              ref={boxRef}
              className='text-sm underline'
              onClick={(event) => {
                event.stopPropagation()
                setAnchorEl(boxRef.current)
                setIsOpenModal([false, true])
              }}
            >
              Edit
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
      {isOpenModal[1] === true && (
        <EditAttachmentModal
          anchorEl={anchorEl}
          cardlistId={cardlistId}
          cardId={cardId}
          currentCard={currentCard}
          setCurrentCard={setCurrentCard}
          attachment={attachment}
          handleClose={() => setIsOpenModal([false, false])}
        />
      )}
    </React.Fragment>
  )
}
