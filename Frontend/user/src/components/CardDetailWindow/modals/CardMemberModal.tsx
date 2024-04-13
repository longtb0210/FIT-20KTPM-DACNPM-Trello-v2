import { useEffect, useState } from 'react'
import { Box, Grid, Popover } from '@mui/material'
import { MemberAvatar, stringToColor } from '../CardMemberList'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '~/components/Theme/themeContext'
import { Card } from '@trello-v2/shared/src/schemas/CardList'
import { Activity } from '@trello-v2/shared/src/schemas/Activity'
import { BoardApiRTQ, CardApiRTQ, WorkspaceApiRTQ } from '~/api'
import { useParams } from 'react-router-dom'

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
  boardId: string
  cardlistId: string
  cardId: string
  currentCard: Card
  setCurrentCard: (newState: Card) => void
  handleClose: () => void
}

export function CardMemberModal({
  anchorEl,
  boardId,
  cardlistId,
  cardId,
  currentCard,
  setCurrentCard,
  handleClose
}: CardMemberModalProps) {
  const { workspaceId } = useParams()
  const [profile, setProfile] = useState({ email: '', name: '' })
  const storedProfile = localStorage.getItem('profile')
  useEffect(() => {
    const profileSave = storedProfile ? JSON.parse(storedProfile) : { email: '', name: '' }
    setProfile({ ...profileSave })
  }, [storedProfile])
  const { colors } = useTheme()
  const [searchValue, setSearchValue] = useState('')
  // Card member emails
  const [cardMemberListState, setCardMemberListState] = useState(currentCard.member_email)
  // Board member emails
  const [boardMemberListState, setBoardMemberListState] = useState<string[] | undefined>([])
  const [filteredBoardMemberListState, setFilteredBoardMemberListState] = useState<string[] | undefined>([])
  // Workspace member emails
  const [workspaceMemberListState, setWorkspaceMemberListState] = useState<string[] | undefined>([])
  const [filteredWorkspaceMemberListState, setFilteredWorkspaceMemberListState] = useState<string[] | undefined>([])

  // API
  const [addCardMemberAPI] = CardApiRTQ.CardApiSlice.useAddCardMemberMutation()
  const [deleteCardMemberAPI] = CardApiRTQ.CardApiSlice.useDeleteCardMemberMutation()
  const [getBoardByIdAPI] = BoardApiRTQ.BoardApiSlice.useLazyGetBoardByIdQuery()
  const [addBoardMemberAPI] = BoardApiRTQ.BoardApiSlice.useAddMemberToBoardMutation()
  const [getWorkspaceByIdAPI] = WorkspaceApiRTQ.WorkspaceApiSlice.useLazyGetWorkspaceInfoQuery()

  function filterMemberLists(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchValue(event.currentTarget.value)
    // Filter card member list
    setCardMemberListState(
      currentCard.member_email.filter((email) => email.toLowerCase().includes(event.currentTarget.value.toLowerCase()))
    )
    // Filter board member list
    setFilteredBoardMemberListState(
      boardMemberListState!
        .filter((member) => !currentCard.member_email.includes(member))
        .filter((email) => email.toLowerCase().includes(event.currentTarget.value.toLowerCase()))
    )
    // Filter workspace member list
    setFilteredWorkspaceMemberListState(
      workspaceMemberListState!
        .filter((member) => !currentCard.member_email.includes(member) && !boardMemberListState?.includes(member))
        .filter((email) => email.toLowerCase().includes(event.currentTarget.value.toLowerCase()))
    )
  }

  function addMemberFromWorkspaceToCard(member: string) {
    addBoardMemberAPI({
      _id: boardId,
      email: member
    })
      .then(() => {
        addMemberToCard(member)
      })
      .catch((error) => {
        console.log('ERROR: add member to Card from Workspace - ', error)
      })
  }

  function addMemberToCard(member: string) {
    const newActivity: Activity = {
      workspace_id: '0',
      board_id: '0',
      cardlist_id: cardlistId,
      card_id: cardId,
      content: `<b>${profile.email}</b> added ${member} to this card`,
      create_time: new Date(),
      creator_email: profile.email
    }
    const updatedCard: Card = {
      ...currentCard,
      member_email: [...currentCard.member_email, member],
      activities: [...currentCard.activities, newActivity]
    }
    setCurrentCard(updatedCard)
    addCardMemberAPI({
      cardlist_id: cardlistId,
      card_id: cardId,
      member_email: member
    })
  }

  function removeMemberFromCard(member: string) {
    const newActivity: Activity = {
      workspace_id: '0',
      board_id: '0',
      cardlist_id: cardlistId,
      card_id: cardId,
      content: `<b>${profile.email}</b> removed ${member} from this card`,
      create_time: new Date(),
      creator_email: profile.email
    }
    const updatedCard = {
      ...currentCard,
      member_email: currentCard.member_email.filter((email) => email !== member),
      activities: [...currentCard.activities, newActivity]
    }
    setCurrentCard(updatedCard)
    deleteCardMemberAPI({
      cardlist_id: cardlistId,
      card_id: cardId,
      member_email: member
    })
  }

  function fetchBoardMembers() {
    getBoardByIdAPI(boardId)
      .unwrap()
      .then((response) => {
        setBoardMemberListState(response.data?.members_email)
        setFilteredBoardMemberListState(
          response.data?.members_email.filter((member) => !currentCard.member_email.includes(member))
        )
      })
      .catch((error) => {
        console.log('ERROR: fetch board members - ', error)
      })
  }

  function fetchWorkspaceMembers() {
    getWorkspaceByIdAPI(workspaceId!)
      .unwrap()
      .then((response) => {
        setWorkspaceMemberListState(response.data.members.map((member) => member.email!))
      })
      .catch((error) => {
        console.log('ERROR: fetch workspace members - ', error)
      })
  }

  useEffect(() => {
    fetchBoardMembers()
    fetchWorkspaceMembers()
  })

  useEffect(() => {
    setCardMemberListState(currentCard.member_email)
    setFilteredBoardMemberListState(
      boardMemberListState!.filter((member) => !currentCard.member_email.includes(member))
    )
    setFilteredWorkspaceMemberListState(
      workspaceMemberListState!.filter(
        (member) => !currentCard.member_email.includes(member) && !boardMemberListState?.includes(member)
      )
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardMemberListState, currentCard])

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
                  bgColor={stringToColor(email)}
                  onClick={() => removeMemberFromCard(email)}
                />
              ))}
            </Box>
          </div>
        )}
        {/* Board member list */}
        {filteredBoardMemberListState!.length != 0 && (
          <div>
            <p style={{ margin: '20px 0 10px 0', color: colors.text }} className='text-xs font-semibold'>
              Board members
            </p>
            <Box className='flex flex-col'>
              {filteredBoardMemberListState!.map((email, index) => (
                <MemberAvatarAndName
                  key={index}
                  email={email}
                  bgColor={stringToColor(email)}
                  onClick={() => addMemberToCard(email)}
                />
              ))}
            </Box>
          </div>
        )}
        {/* Workspace member list */}
        {filteredWorkspaceMemberListState!.length != 0 && (
          <div>
            <p style={{ margin: '20px 0 10px 0', color: colors.text }} className='text-xs font-semibold'>
              Workspace members
            </p>
            <Box className='flex flex-col'>
              {filteredWorkspaceMemberListState!.map((email, index) => (
                <MemberAvatarAndName
                  key={index}
                  email={email}
                  bgColor={stringToColor(email)}
                  onClick={() => addMemberFromWorkspaceToCard(email)}
                />
              ))}
            </Box>
          </div>
        )}
      </Box>
    </Popover>
  )
}
