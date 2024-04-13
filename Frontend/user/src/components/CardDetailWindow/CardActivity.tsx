import { faListUl } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, TextareaAutosize, Tooltip } from '@mui/material'
import { ChangeEvent, useEffect, useState } from 'react'
import moment from 'moment'
import dayjs from 'dayjs'
import { useTheme } from '../Theme/themeContext'
import { Activity } from '@trello-v2/shared/src/schemas/Activity'
import { Card } from '@trello-v2/shared/src/schemas/CardList'
import { MemberAvatar, stringToColor } from './CardMemberList'
import React from 'react'

function ShowDetailsButton() {
  const { colors } = useTheme()
  return (
    <Box
      sx={{
        bgcolor: colors.button,
        width: 'fit-content',
        height: 32,
        padding: '0 12px',
        color: colors.text,
        fontSize: 14,
        fontWeight: 500,
        '&:hover': {
          bgcolor: colors.button
        }
      }}
      className='flex cursor-pointer items-center justify-center rounded'
    >
      <p>Show details</p>
    </Box>
  )
}

interface TextAreaControlProps {
  textAreaValue: string
  setTextAreaValue: (newState: string) => void
  setTextAreaFocus: (newState: boolean) => void
  buttonEnabled: boolean
  setButtonEnabled: (newState: boolean) => void
  handleCreateComment: () => void
}

function TextAreaControl({
  setTextAreaValue,
  setTextAreaFocus,
  buttonEnabled,
  setButtonEnabled,
  handleCreateComment
}: TextAreaControlProps) {
  const { colors } = useTheme()
  const [isChecked, setIsChecked] = useState(false)

  function handleSave() {
    handleCreateComment()
    setButtonEnabled(false)
    setTextAreaValue('')
    setTextAreaFocus(false)
  }

  function handleCheckboxChange(event: ChangeEvent<HTMLInputElement>) {
    setIsChecked(event.target.checked)
  }

  return (
    <Box sx={{ height: 32 }} className='mt-2 flex flex-row items-center gap-2'>
      <button
        style={{
          width: 'fit-content',
          height: 32,
          backgroundColor: buttonEnabled ? colors.button_primary : colors.button,
          color: buttonEnabled ? colors.button_primary_text : colors.text,
          padding: '0 12px',
          cursor: buttonEnabled ? 'pointer' : 'no-drop'
        }}
        className='mt-2 flex items-center justify-center rounded pb-2'
        onClick={handleSave}
        disabled={!buttonEnabled}
      >
        <p className='text-sm font-semibold'>Save</p>
      </button>
      <Box
        sx={{ width: 'fit-content', height: 32, color: colors.text, padding: '0 6px' }}
        className='flex cursor-pointer items-center justify-center rounded'
      >
        <input style={{ width: 16, height: 16 }} type='checkbox' checked={isChecked} onChange={handleCheckboxChange} />
        <p className='ml-2 text-sm'>Watch</p>
      </Box>
      <button
        style={{
          width: 'fit-content',
          height: 32,
          backgroundColor: colors.button,
          color: colors.text,
          padding: '0 12px'
        }}
        className='mt-2 flex cursor-pointer items-center justify-center rounded pb-2'
        onClick={() => setTextAreaFocus(false)}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = colors.button_hover
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = colors.button
        }}
      >
        <p className='text-sm font-semibold'>Cancel</p>
      </button>
    </Box>
  )
}

interface CardActivityProps {
  cardlistId: string
  cardId: string
  currentCard: Card
  setCurrentCard: (newState: Card) => void
}

export default function CardActivity({ cardlistId, cardId, currentCard, setCurrentCard }: CardActivityProps) {
  const { colors } = useTheme()
  const sortedActivities = currentCard.activities
    .sort((a, b) => moment(a.create_time).diff(moment(b.create_time)))
    .reverse()
  const [textAreaMinRows, setTextAreaMinRows] = useState<number>(1)
  const [textAreaValue, setTextAreaValue] = useState('')
  const [textAreaFocus, setTextAreaFocus] = useState(false)
  const [buttonEnabled, setButtonEnabled] = useState(false)

  // function handleTextAreaBlur() {
  //   setTextAreaMinRows(1)
  //   setTextAreaValue('')
  //   setTextAreaFocus(false)
  //   setButtonEnabled(false)
  // }

  function handleTextAreaFocus() {
    setTextAreaMinRows(2)
    setTextAreaFocus(true)
  }

  function handleTextAreaChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setTextAreaValue(event.target.value)
    if (event.target.value.trim() === '') {
      setButtonEnabled(false)
    } else {
      setButtonEnabled(true)
    }
  }

  function handleCreateComment() {
    const trimmedValue = textAreaValue.replace(/\s+/g, ' ').trim()
    const newActivity: Activity = {
      workspace_id: '0',
      board_id: '0',
      cardlist_id: cardlistId,
      card_id: cardId,
      content: `vu@gmail.com commented: ${trimmedValue}`,
      create_time: new Date(),
      creator_email: 'vu@gmail.com'
    }
    const updatedCard = {
      ...currentCard,
      activities: [...currentCard.activities, newActivity]
    }
    setCurrentCard(updatedCard)
  }

  return (
    <div style={{ margin: '0 0 0 0px', color: colors.text }} className='flex flex-col gap-1'>
      {/* START: Header */}
      <div style={{ margin: '0px 0 10px 40px' }} className='flex flex-row items-center justify-between'>
        {/* Title */}
        <div className='relative flex flex-row items-center'>
          <FontAwesomeIcon icon={faListUl} style={{ width: 30, left: -40 }} className='absolute text-xl' />
          <h2 className='font-semibold'>Activities</h2>
        </div>
        {/* Show details button */}
        <ShowDetailsButton />
      </div>
      {/* END: Header */}
      {/* START: Body */}
      <div style={{ width: '100%' }} className='flex items-start'>
        <Box sx={{ width: 44, marginTop: '2px' }}>
          <MemberAvatar memberName='TA' bgColor={stringToColor('tailwindcss@gmail.com')} />
        </Box>
        <Box style={{ width: '100%', resize: 'none' }} className='flex flex-col'>
          <TextareaAutosize
            style={{
              width: '100%',
              resize: 'none',
              border: `2px solid`,
              borderColor: textAreaFocus ? colors.primary : colors.button,
              backgroundColor: textAreaFocus ? colors.background_modal_secondary : colors.background_modal_secondary
            }}
            className='rounded-lg px-3 py-2 text-sm'
            minRows={textAreaMinRows}
            value={textAreaValue}
            onChange={handleTextAreaChange}
            onFocus={handleTextAreaFocus}
            placeholder='Write a comment...'
          />
          {textAreaFocus && (
            <TextAreaControl
              textAreaValue={textAreaValue}
              setTextAreaValue={setTextAreaValue}
              setTextAreaFocus={setTextAreaFocus}
              buttonEnabled={buttonEnabled}
              setButtonEnabled={setButtonEnabled}
              handleCreateComment={handleCreateComment}
            />
          )}
        </Box>
      </div>
      <Box
        sx={{ width: '100%', height: 'fit-content', margin: '10px 0 0 0', paddingLeft: '0' }}
        className='flex flex-col items-start'
      >
        {sortedActivities.map((activity, index) => (
          <CardActivityTile key={index} activity={activity} />
        ))}
      </Box>
      {/* END: Body */}
    </div>
  )
}

interface CardActivityTileProps {
  activity: Activity
}

function CardActivityTile({ activity }: CardActivityTileProps) {
  const { colors } = useTheme()
  const [formattedTime, setFormattedTime] = useState('')

  //eslint-disable-next-line react-hooks/exhaustive-deps
  function updateFormattedTime() {
    const formatted = formatActivityTime(activity.create_time.toString())
    setFormattedTime(formatted)
  }

  useEffect(() => {
    updateFormattedTime()
    const intervalId = setInterval(updateFormattedTime, 10000)
    return () => clearInterval(intervalId)
  }, [activity.create_time, updateFormattedTime])

  return (
    <Box
      sx={{
        width: '100%',
        height: 'fit-content',
        color: colors.text
      }}
      className='flex flex-row items-center justify-between rounded-md'
    >
      {/* Avatar */}
      <MemberAvatar
        memberName={activity.creator_email.slice(0, 2).toUpperCase()}
        bgColor={stringToColor(activity.creator_email)}
      />
      {/* Activity content */}
      <Box
        sx={{
          width: '100%',
          height: 'fit-content',
          marginLeft: '10px',
          padding: '8px',
          color: colors.text
        }}
        className='flex flex-col justify-between rounded-md'
      >
        <Box sx={{ width: '100%', height: 'fit-content' }}>
          <p className='text-sm'>{formatActivityContent(activity)}</p>
        </Box>
        <Tooltip
          title={formatActivityTimeToolTip(activity.create_time.toString())}
          placement='bottom-start'
          slotProps={{
            popper: {
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [-4, -10]
                  }
                }
              ]
            }
          }}
        >
          <Box sx={{ width: 'fit-content', height: 20 }} className='cursor-pointer text-xs hover:underline'>
            <p className='text-xs'>{formattedTime}</p>
          </Box>
        </Tooltip>
      </Box>
    </Box>
  )
}

function formatActivityContent(activity: Activity) {
  const parts = activity.content.split(activity.creator_email)
  return (
    <span>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {part}
          {index < parts.length - 1 && <b>{activity.creator_email}</b>}
        </React.Fragment>
      ))}
    </span>
  )
}

function formatActivityTime(activityTime: string) {
  const now = new Date()
  const activityMoment = new Date(activityTime)
  const diffMilliseconds = now.getTime() - activityMoment.getTime()
  const diffSeconds = Math.floor(diffMilliseconds / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)

  if (diffSeconds < 10) {
    return 'just now'
  } else if (diffSeconds < 60) {
    return 'a few seconds ago'
  } else if (diffMinutes < 2) {
    return '1 minute ago'
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minutes ago`
  } else if (diffHours < 2) {
    return `1 hour ago`
  } else if (diffHours < 24) {
    return `${diffHours} hours ago`
  } else if (isSameDay(now, activityMoment)) {
    return 'today'
  } else if (isYesterday(now, activityMoment)) {
    return `yesterday at ${formatTime(activityMoment)}`
  } else {
    return `${formatDate(activityMoment)} at ${formatTime(activityMoment)}`
  }
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

function isYesterday(date1: Date, date2: Date): boolean {
  const yesterday = new Date(date1)
  yesterday.setDate(date1.getDate() - 1)
  return isSameDay(yesterday, date2)
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatDate(date: Date): string {
  return date.toLocaleDateString()
}

function formatActivityTimeToolTip(activityTime: string) {
  const formattedTime = dayjs(activityTime).format('MMMM D, YYYY h:mm A')
  return formattedTime
}
