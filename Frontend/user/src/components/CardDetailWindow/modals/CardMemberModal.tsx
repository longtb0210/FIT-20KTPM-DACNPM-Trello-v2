import { useEffect, useState } from 'react'
import { Box, Grid, Popover } from '@mui/material'
import { MemberAvatar, bgColors } from '../CardMemberList'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '~/components/Theme/themeContext'
import { Card } from '@trello-v2/shared/src/schemas/CardList'
import { Activity } from '@trello-v2/shared/src/schemas/Activity'
import { CardApiRTQ } from '~/api'

interface MemberAvatarAndNameProps {
  email: string
  bgColor: string
  onClick: (email: string) => void
}

function MemberAvatarAndName({ email, bgColor, onClick }: MemberAvatarAndNameProps) {
  const { colors } = useTheme()
  return (
    <Grid
      container
      sx={{ width: '100%', height: 40, padding: '4px', '&:hover': { bgcolor: colors.button } }}
      className='flex cursor-pointer items-center'
      onClick={() => onClick(email)}
    >
      <Grid item xs={2} sx={{ height: '100%' }}>
        <MemberAvatar memberName={email ? email.slice(0, 2).toUpperCase() : ''} bgColor={bgColor} />
      </Grid>
      <Grid item xs={10} sx={{ height: '100%' }} className='flex items-center'>
        <p className='text-sm'>{email}</p>
      </Grid>
    </Grid>
  )
}

interface CardMemberModalProps {
  anchorEl: (EventTarget & HTMLDivElement) | null
  cardlistId: string
  cardId: string
  currentCard: Card
  setCurrentCard: (newState: Card) => void
  boardMembers: string[]
  handleClose: () => void
}

export function CardMemberModal({
  anchorEl,
  cardlistId,
  cardId,
  currentCard,
  setCurrentCard,
  boardMembers,
  handleClose
}: CardMemberModalProps) {
  const { colors } = useTheme()
  const [searchValue, setSearchValue] = useState('')
  // Card member emails
  const [cardMemberListState, setCardMemberListState] = useState(currentCard.watcher_email)
  // Board member emails
  const [boardMemberListState, setBoardMemberListState] = useState(
    boardMembers.filter((member) => !currentCard.watcher_email.includes(member))
  )

  // API
  const [addCardWatcherAPI] = CardApiRTQ.CardApiSlice.useAddCardWatcherMutation()
  const [deleteCardWatcherAPI] = CardApiRTQ.CardApiSlice.useDeleteCardWatcherMutation()

  function filterMemberLists(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchValue(event.currentTarget.value)
    // Filter card member list
    setCardMemberListState(
      currentCard.watcher_email.filter((email) => email.toLowerCase().includes(event.currentTarget.value.toLowerCase()))
    )
    // Filter board member list
    setBoardMemberListState(
      boardMembers
        .filter((member) => !currentCard.watcher_email.includes(member))
        .filter((email) => email.toLowerCase().includes(event.currentTarget.value.toLowerCase()))
    )
  }

  function addMemberToCard(member: string) {
    const newActivity: Activity = {
      workspace_id: '0',
      board_id: '0',
      cardlist_id: '0',
      card_id: '0',
      content: `TrelloUser added ${member} to this card`
      //time: moment().format()
    }
    const updatedCard: Card = {
      ...currentCard,
      watcher_email: [...currentCard.watcher_email, member],
      activities: [...currentCard.activities, newActivity]
    }
    setCurrentCard(updatedCard)
    addCardWatcherAPI({
      cardlist_id: cardlistId,
      card_id: cardId,
      watcher_email: member
    })
  }

  function removeMemberFromCard(member: string) {
    const newActivity: Activity = {
      workspace_id: '0',
      board_id: '0',
      cardlist_id: '0',
      card_id: '0',
      content: `TrelloUser removed ${member} from this card`
      //time: moment().format()
    }
    const updatedCard = {
      ...currentCard,
      watcher_email: currentCard.watcher_email.filter((email) => email !== member),
      activities: [...currentCard.activities, newActivity]
    }
    setCurrentCard(updatedCard)
    deleteCardWatcherAPI({
      cardlist_id: cardlistId,
      card_id: cardId,
      watcher_email: member
    })
  }

  useEffect(() => {
    setCardMemberListState(currentCard.watcher_email)
    setBoardMemberListState(boardMembers.filter((member) => !currentCard.watcher_email.includes(member)))
  }, [boardMembers, currentCard])

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
            <h2 className='overflow-hidden overflow-ellipsis whitespace-nowrap text-sm font-semibold'>Members</h2>
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
        {/* Search bar */}
        <input
          autoFocus
          style={{
            width: '100%',
            height: 36,
            margin: '0 0 20px 0',
            padding: '4px 6px',
            color: colors.text,
            background: colors.background_modal_secondary,
            border: `2px solid ${colors.button_hover}`
          }}
          className='flex items-center rounded-sm text-sm'
          value={searchValue}
          onChange={(e) => filterMemberLists(e)}
          placeholder='Search members'
        />
        {/* Card member list */}
        {cardMemberListState.length != 0 && (
          <div>
            <p style={{ margin: '10px 0', color: colors.text }} className='text-xs font-semibold'>
              Card members
            </p>
            <Box className='flex flex-col'>
              {cardMemberListState.map((email, index) => (
                <MemberAvatarAndName
                  key={index}
                  email={email}
                  bgColor={bgColors[index]}
                  onClick={() => removeMemberFromCard(email)}
                />
              ))}
            </Box>
          </div>
        )}
        {/* Board member list */}
        {boardMemberListState.length != 0 && (
          <div>
            <p style={{ margin: '20px 0 10px 0', color: colors.text }} className='text-xs font-semibold'>
              Board members
            </p>
            <Box className='flex flex-col'>
              {boardMemberListState.map((email, index) => (
                <MemberAvatarAndName
                  key={index}
                  email={email}
                  bgColor={bgColors[index]}
                  onClick={() => addMemberToCard(email)}
                />
              ))}
            </Box>
          </div>
        )}
      </Box>
    </Popover>
  )
}
