import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Avatar, Box, Tooltip } from '@mui/material'
import { useState } from 'react'
import { CardMemberModal } from './modals/CardMemberModal'
import { useTheme } from '../Theme/themeContext'
import { Card } from '@trello-v2/shared/src/schemas/CardList'
import React from 'react'

// eslint-disable-next-line react-refresh/only-export-components
export function stringToColor(string: string) {
  let hash = 0
  let i
  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }
  let color = '#'
  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.slice(-2)
  }
  /* eslint-enable no-bitwise */
  return color
}

const getContrastColor = (hexColor: string) => {
  if (!hexColor) {
    return '#ffffff'
  }
  // Convert hex color to RGB
  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)

  // Calculate the relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  // Choose black or white based on luminance
  return luminance > 0.5 ? '#44546F' : '#ffffff'
}

interface MemberAvatarProps {
  memberName: string
  bgColor: string
}

export function MemberAvatar({ memberName, bgColor }: MemberAvatarProps) {
  const textColor = getContrastColor(bgColor)

  return (
    <Avatar
      sx={{
        bgcolor: bgColor,
        width: 32,
        height: 32,
        color: textColor,
        fontSize: 14,
        fontWeight: 500,
        '&:hover': {
          filter: 'brightness(85%)'
        }
      }}
      className='cursor-pointer'
    >
      {memberName}
    </Avatar>
  )
}

interface AddMemberButtonProps {
  cardlistId: string
  cardId: string
  currentCard: Card
  setCurrentCard: (newState: Card) => void
  boardMembers: string[]
}

function AddMemberButton({ cardlistId, cardId, currentCard, setCurrentCard, boardMembers }: AddMemberButtonProps) {
  const { colors } = useTheme()
  const [anchorEl, setAnchorEl] = useState<null | HTMLDivElement>(null)
  const [isOpenCardMemberModal, setIsOpenCardMemberModal] = useState(false)

  function openCardMemberModal(event: React.MouseEvent<HTMLDivElement>) {
    setAnchorEl(event.currentTarget)
    setIsOpenCardMemberModal(true)
  }

  function handleClose() {
    setIsOpenCardMemberModal(false)
  }

  return (
    <div>
      <Avatar
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
        className='cursor-pointer'
        onBlur={handleClose}
        onClick={(e) => openCardMemberModal(e)}
      >
        <FontAwesomeIcon icon={faPlus} />
      </Avatar>
      {isOpenCardMemberModal && (
        <CardMemberModal
          anchorEl={anchorEl}
          cardlistId={cardlistId}
          cardId={cardId}
          currentCard={currentCard}
          setCurrentCard={setCurrentCard}
          boardMembers={boardMembers}
          handleClose={handleClose}
        />
      )}
    </div>
  )
}

interface CardMemberListProps {
  cardlistId: string
  cardId: string
  currentCard: Card
  setCurrentCard: (newState: Card) => void
  boardMembers: string[]
}

export default function CardMemberList({
  cardlistId,
  cardId,
  currentCard,
  setCurrentCard,
  boardMembers
}: CardMemberListProps) {
  const { colors } = useTheme()
  return (
    <React.Fragment>
      {currentCard.watcher_email.length !== 0 && (
        <Box sx={{ margin: '10px 16px 0 0' }}>
          <h2 style={{ color: colors.text }} className='mb-2 text-xs font-bold'>
            Members
          </h2>
          <div className='flex flex-row space-x-1'>
            {currentCard!.watcher_email.map((email, index) => (
              <Tooltip
                arrow
                key={index}
                title={email}
                placement='bottom'
                slotProps={{
                  popper: {
                    modifiers: [
                      {
                        name: 'offset',
                        options: {
                          offset: [0, -8]
                        }
                      }
                    ]
                  }
                }}
              >
                <div style={{ display: 'inline-block' }}>
                  <MemberAvatar memberName={email.slice(0, 2).toUpperCase()} bgColor={stringToColor(email)} />
                </div>
              </Tooltip>
            ))}
            <AddMemberButton
              cardlistId={cardlistId}
              cardId={cardId}
              currentCard={currentCard}
              setCurrentCard={setCurrentCard}
              boardMembers={boardMembers}
            />
          </div>
        </Box>
      )}
    </React.Fragment>
  )
}
