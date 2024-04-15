import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCreditCard, faEye, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Backdrop, Box, CircularProgress, Dialog, Grid, Stack } from '@mui/material'
import CardMemberList from './CardMemberList'
import CardLabelList from './CardLabelList'
import CardNotification from './CardNotification'
import { useEffect, useState } from 'react'
import CardDate from './CardDate'
import CardDescription from './CardDescription'
import CardChecklist from './CardChecklist'
import CardActivity from './CardActivity'
import { ButtonType } from './sidebar/CardSidebarButton'
import { SidebarButtonLabels } from './sidebar/CardLabelSidebar'
import { SidebarButtonMembers } from './sidebar/CardMemberSidebar'
import { SidebarButtonChecklist } from './sidebar/CardChecklistSidebar'
import { SidebarButtonDates } from './sidebar/CardDateSidebar'
import { SidebarButtonAttachments } from './sidebar/CardAttachmentSidebar'
import { CardAttachment } from './CardAttachment'
import { SidebarButtonMove } from './sidebar/CardMoveSidebar'
import { SidebarButtonCopy } from './sidebar/CardCopySidebar'
import { SidebarButtonArchive } from './sidebar/CardArchiveSidebar'
import { useTheme } from '../Theme/themeContext'
import { Card } from '@trello-v2/shared/src/schemas/CardList'
import { Feature_Checklist } from '@trello-v2/shared/src/schemas/Feature'
import { BoardLabel } from '@trello-v2/shared/src/schemas/Board'
import { BoardApiRTQ, CardApiRTQ, CardlistApiRTQ } from '~/api'
import { SidebarButtonUnArchive } from './sidebar/CardUnArchiveSidebar'
import { SidebarButtonJoin } from './sidebar/CardJoinSidebar'

const focusInputColor = '#0ff'

interface CardDetailWindowProps {
  boardId: string
  cardlistId: string
  cardId: string
  isOpenCDW: boolean
  handleCloseCDW: () => void
}

export default function CardDetailWindow({
  boardId,
  cardlistId,
  cardId,
  isOpenCDW,
  handleCloseCDW
}: CardDetailWindowProps) {
  const [profile, setProfile] = useState({ email: '', name: '' })
  useEffect(() => {
    const storedProfile = localStorage.getItem('profile')
    const profileSave = storedProfile ? JSON.parse(storedProfile) : { email: '', name: '' }
    setProfile({ ...profileSave })
  }, [])
  const { colors } = useTheme()

  // Card states
  const [currentCardState, setCurrentCardState] = useState<Card | null>()
  const [cardNameFieldValue, setCardNameFieldValue] = useState<string>('')
  const [initialCardNameFieldValue, setInitialCardNameFieldValue] = useState<string>('')
  const [haveJoinedCard, setHaveJoinedCard] = useState<boolean>(false)
  const [isWatching, setIsWatching] = useState<boolean>(false)
  const [isArchived, setIsArchived] = useState<boolean>(false)

  // Cardlist states
  const [currentCardlistNameState, setCurrentCardlistNameState] = useState<string>('')

  // Board states
  const [boardLabelState, setBoardLabelState] = useState<BoardLabel[]>([])

  // API
  const [addCardMemberAPI] = CardApiRTQ.CardApiSlice.useAddCardMemberMutation()
  const [getBoardLabelAPI] = BoardApiRTQ.BoardApiSlice.useLazyGetBoardLabelQuery()
  const [getAllCardlistAPI] = CardlistApiRTQ.CardListApiSlice.useLazyGetAllCardlistQuery()
  const [getCardDetailAPI] = CardApiRTQ.CardApiSlice.useLazyGetCardDetailQuery()
  const [updateCardDetailAPI] = CardApiRTQ.CardApiSlice.useUpdateCardDetailMutation()
  const [archiveCardAPI] = CardApiRTQ.CardApiSlice.useArchiveCardMutation()
  const [unArchiveCardAPI] = CardApiRTQ.CardApiSlice.useUnArchiveCardMutation()
  const [addCardWatcherAPI] = CardApiRTQ.CardApiSlice.useAddCardWatcherMutation()
  const [deleteCardWatcherAPI] = CardApiRTQ.CardApiSlice.useDeleteCardWatcherMutation()
  const [getCardlistByBoardIdAPI] = CardlistApiRTQ.CardListApiSlice.useLazyGetCardlistByBoardIdQuery()

  function fetchBoardLabel() {
    getBoardLabelAPI({
      boardId: boardId
    })
      .unwrap()
      .then((response) => {
        setBoardLabelState(response.data)
      })
      .catch((error) => {
        console.log('ERROR: fetch board labels', error)
      })
  }

  function fetchCardlistName() {
    getAllCardlistAPI()
      .unwrap()
      .then((response) => {
        const currentCardlist = response.data.find((cardlist) => cardlist._id === cardlistId)
        setCurrentCardlistNameState(currentCardlist!.name)
      })
      .catch((error) => {
        console.log('ERROR: fetch cardlist name - ', error)
      })
  }

  function fetchCardData() {
    getCardDetailAPI({
      cardlist_id: cardlistId,
      card_id: cardId
    })
      .unwrap()
      .then((response) => {
        setCurrentCardState(response.data)
        const tempIsWatching: boolean = response.data?.watcher_email.includes(profile.email) ?? false
        setIsWatching(tempIsWatching)
        setHaveJoinedCard(response.data?.member_email.includes(profile.email) ?? false)
      })
      .catch((error) => {
        console.log('ERROR: fetch card data - ', error)
      })
  }

  // Fetch card data
  useEffect(() => {
    fetchBoardLabel()
    fetchCardData()
    fetchCardlistName()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

  // Update other states after fetch data
  useEffect(() => {
    if (currentCardState) {
      setCardNameFieldValue(currentCardState!.name)
      setInitialCardNameFieldValue(currentCardState!.name)
    }
  }, [currentCardState])

  function handleJoinCard() {
    const updatedCard: Card = {
      ...currentCardState!,
      member_email: [...currentCardState!.member_email, profile.email]
    }
    setCurrentCardState(updatedCard)
    addCardMemberAPI({
      cardlist_id: cardlistId,
      card_id: cardId,
      member_email: profile.email
    })
  }

  function handleCardNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setCardNameFieldValue(event.target.value)
    const trimmedValue = event.target.value.replace(/\s+/g, ' ').trim()
    if (trimmedValue !== initialCardNameFieldValue.trim()) {
      setCurrentCardState({
        ...currentCardState!,
        name: trimmedValue
      })
      updateCardDetailAPI({
        cardlist_id: cardlistId,
        card_id: cardId,
        name: trimmedValue
      })
      setInitialCardNameFieldValue(trimmedValue)
      getCardlistByBoardIdAPI({
        id: boardId
      })
    }
  }

  function handleCardNameFieldBlur() {
    const trimmedValue = cardNameFieldValue.replace(/\s+/g, ' ').trim()
    if (trimmedValue !== initialCardNameFieldValue.trim()) {
      setCurrentCardState({
        ...currentCardState!,
        name: trimmedValue
      })
      setInitialCardNameFieldValue(trimmedValue)
    } else {
      setCardNameFieldValue(initialCardNameFieldValue)
    }
  }

  function handleWatching() {
    // Add watcher
    if (isWatching === false) {
      addCardWatcherAPI({
        cardlist_id: cardlistId,
        card_id: cardId,
        watcher_email: profile.email
      })
        .then(() => {
          const updatedCard: Card = {
            ...currentCardState,
            watcher_email: [...(currentCardState?.watcher_email || []), profile.email]
          }
          setCurrentCardState(updatedCard)
          setIsWatching((prevState) => !prevState)
          getCardlistByBoardIdAPI({
            id: boardId
          })
        })
        .catch((error) => {
          console.log('ERROR: add card watcher - ', error)
        })
    } else if (isWatching === true) {
      deleteCardWatcherAPI({
        cardlist_id: cardlistId,
        card_id: cardId,
        watcher_email: profile.email
      })
        .then(() => {
          const updatedCard: Card = {
            ...currentCardState,
            watcher_email: currentCardState?.watcher_email.filter((email) => email !== profile.email) || []
          }
          setCurrentCardState(updatedCard)
          setIsWatching((prevState) => !prevState)
          getCardlistByBoardIdAPI({
            id: boardId
          })
        })
        .catch((error) => {
          console.log('ERROR: delete card watcher - ', error)
        })
    }
  }

  function handleArchive() {
    archiveCardAPI({
      cardlist_id: cardlistId,
      card_id: cardId
    }).then(() => {
      setIsArchived(true)
    })
  }

  function handleUnArchive() {
    unArchiveCardAPI({
      cardlist_id: cardlistId,
      card_id: cardId,
      archive_at: undefined
    }).then(() => {
      setIsArchived(false)
    })
  }

  return (
    <Dialog open={isOpenCDW}>
      <Backdrop sx={{ bgcolor: 'rgba(0, 0, 0, 0.64)' }} open={isOpenCDW}>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            overflowY: 'auto'
          }}
          className='flex items-start justify-center'
        >
          <Box
            sx={{
              width: 768,
              minHeight: 'calc(100vh - 78px)',
              height: 'fit-content',
              margin: '52px 0 52px 0',
              paddingBottom: '40px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
              backgroundColor: colors.background_modal,
              color: colors.text
            }}
            className='m-auto rounded-2xl'
          >
            {currentCardState ? (
              <>
                {/* START: Header */}
                <Box sx={{ width: '100%', height: 89, padding: '8px 0' }} className='flex flex-row'>
                  <Box sx={{ width: 46 }}>
                    <Box sx={{ padding: '14px 0 0 20px' }}>
                      <FontAwesomeIcon icon={faCreditCard} style={{ color: colors.text, width: 20, height: 20 }} />
                    </Box>
                  </Box>
                  <Box sx={{ width: 660, padding: '6px 0' }}>
                    <input
                      type='text'
                      style={{
                        width: '100%',
                        height: '37px',
                        padding: '6px 10px',
                        backgroundColor: colors.background_modal
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = focusInputColor
                        e.currentTarget.style.backgroundColor = colors.background_modal_secondary
                      }}
                      onBlur={(e) => {
                        handleCardNameFieldBlur
                        e.currentTarget.style.backgroundColor = colors.background_modal
                      }}
                      value={cardNameFieldValue}
                      onChange={(e) => handleCardNameChange(e)}
                      className='text-xl font-semibold'
                    />
                    <Box
                      sx={{ height: '20px', padding: '0 0 0 10px', color: colors.text }}
                      className='flex flex-row items-center text-sm'
                    >
                      <p style={{ marginRight: '4px' }}>in list</p>
                      <p style={{ marginRight: '16px' }} className='cursor-pointer font-medium underline'>
                        {currentCardlistNameState}
                      </p>
                      {isWatching && <FontAwesomeIcon icon={faEye} />}
                    </Box>
                  </Box>
                  <Box sx={{ width: 52, padding: '7px 6px 0 0' }} className='flex items-start justify-end'>
                    <Box
                      sx={{ width: 40, height: 40, '&:hover': { bgcolor: colors.button_hover } }}
                      className='flex cursor-pointer items-center justify-center rounded-full'
                      onClick={handleCloseCDW}
                    >
                      <FontAwesomeIcon icon={faTimes} style={{ color: colors.text, width: 20, height: 20 }} />
                    </Box>
                  </Box>
                </Box>
                {/* END: Header */}
                {/* START: Body */}
                <Grid container>
                  <Grid item xs={9} sx={{ padding: '0 8px 8px 16px' }}>
                    {/* START: Hero */}
                    <div style={{ padding: '0 0 0 40px' }} className='flex flex-row flex-wrap gap-1'>
                      <CardMemberList
                        boardId={boardId}
                        cardlistId={cardlistId}
                        cardId={cardId}
                        currentCard={currentCardState!}
                        setCurrentCard={setCurrentCardState!}
                      />
                      <CardLabelList
                        boardId={boardId}
                        cardlistId={cardlistId}
                        cardId={cardId}
                        currentCard={currentCardState!}
                        setCurrentCard={setCurrentCardState}
                        boardLabelState={boardLabelState}
                        setBoardLabelState={setBoardLabelState}
                      />
                      <CardNotification isWatching={isWatching} handleWatching={handleWatching} />
                      <CardDate
                        cardlistId={cardlistId}
                        cardId={cardId}
                        currentCard={currentCardState!}
                        setCurrentCard={setCurrentCardState}
                      />
                    </div>
                    {/* END: Hero */}
                    {/* START: Description */}
                    <CardDescription
                      cardlistId={cardlistId}
                      cardId={cardId}
                      currentCard={currentCardState!}
                      setCurrentCard={setCurrentCardState}
                    />
                    {/* END: Description */}
                    {/* START: Attachment */}
                    <CardAttachment
                      cardlistId={cardlistId}
                      cardId={cardId}
                      currentCard={currentCardState!}
                      setCurrentCard={setCurrentCardState}
                    />
                    {/* END: Attachment */}
                    {/* START: Checklist */}
                    {currentCardState.features
                      .filter((_feature) => _feature.type === 'checklist')
                      .map((feature, index) => {
                        const checklist = feature as Feature_Checklist
                        return (
                          <CardChecklist
                            key={index}
                            cardlistId={cardlistId}
                            cardId={cardId}
                            currentChecklist={checklist}
                            currentCard={currentCardState!}
                            setCurrentCard={setCurrentCardState}
                          />
                        )
                      })}
                    {/* END: Checklist */}
                    <CardActivity
                      cardlistId={cardlistId}
                      cardId={cardId}
                      currentCard={currentCardState!}
                      setCurrentCard={setCurrentCardState}
                    />
                  </Grid>
                  <Grid item xs={3} sx={{ padding: '0 16px 8px 8px' }}>
                    <Stack sx={{ padding: '10px 0 0 0' }}>
                      {!haveJoinedCard && (
                        <>
                          <h2 style={{ color: colors.text }} className='mb-2 text-xs font-bold'>
                            Suggested
                          </h2>
                          <SidebarButtonJoin
                            type={ButtonType.Join}
                            handleJoinCard={() => {
                              handleJoinCard()
                              setHaveJoinedCard(true)
                            }}
                          />
                          <div className='mb-3'></div>
                        </>
                      )}
                      <h2 style={{ color: colors.text }} className='mb-2 text-xs font-bold'>
                        Add to card
                      </h2>
                      <SidebarButtonMembers
                        type={ButtonType.Members}
                        boardId={boardId}
                        cardlistId={cardlistId}
                        cardId={cardId}
                        currentCard={currentCardState}
                        setCurrentCard={setCurrentCardState}
                      />
                      <SidebarButtonLabels
                        type={ButtonType.Labels}
                        boardId={boardId}
                        cardlistId={cardlistId}
                        cardId={cardId}
                        currentCard={currentCardState!}
                        setCurrentCard={setCurrentCardState}
                        boardLabelState={boardLabelState}
                        setBoardLabelState={setBoardLabelState}
                      />
                      <SidebarButtonChecklist
                        type={ButtonType.Checklists}
                        cardlistId={cardlistId}
                        cardId={cardId}
                        currentCard={currentCardState!}
                        setCurrentCard={setCurrentCardState}
                      />
                      <SidebarButtonDates
                        type={ButtonType.Dates}
                        cardlistId={cardlistId}
                        cardId={cardId}
                        currentCard={currentCardState!}
                        setCurrentCard={setCurrentCardState}
                      />
                      <SidebarButtonAttachments
                        type={ButtonType.Attachments}
                        cardlistId={cardlistId}
                        cardId={cardId}
                        currentCard={currentCardState!}
                        setCurrentCard={setCurrentCardState}
                      />
                      <h2 style={{ color: colors.text }} className='mb-2 mt-6 text-xs font-bold'>
                        Actions
                      </h2>
                      <SidebarButtonMove
                        type={ButtonType.Move}
                        currentCard={currentCardState!}
                        setCurrentCard={setCurrentCardState}
                      />
                      <SidebarButtonCopy
                        type={ButtonType.Copy}
                        boardId={boardId}
                        cardlistId={cardlistId}
                        cardId={cardId}
                        currentCard={currentCardState!}
                        setCurrentCard={setCurrentCardState}
                      />
                      <Box sx={{ width: '100%', height: 2, padding: '0 0 10px 0' }}>
                        <Box sx={{ width: '100%', height: 2, bgcolor: colors.button }}></Box>
                      </Box>
                      {!isArchived ? (
                        <SidebarButtonArchive type={ButtonType.Archive} handleArchive={handleArchive} />
                      ) : (
                        <SidebarButtonUnArchive type={ButtonType.UnArchive} handleUnArchive={handleUnArchive} />
                      )}
                    </Stack>
                  </Grid>
                </Grid>
                {/* END: Body */}
              </>
            ) : (
              <Box sx={{ width: '100%' }} className='flex items-center justify-center'>
                {/* START: Header */}
                <Box sx={{ width: '100%', height: 89, padding: '8px 0' }} className='flex flex-row'>
                  <Box sx={{ width: 46 }}>
                    <Box sx={{ padding: '14px 0 0 20px' }}>
                      <CircularProgress />
                    </Box>
                  </Box>
                  <Box sx={{ width: 660, padding: '6px 0' }}></Box>
                  <Box sx={{ width: 52, padding: '7px 6px 0 0' }} className='flex items-start justify-end'>
                    <Box
                      sx={{ width: 40, height: 40, '&:hover': { bgcolor: colors.button_hover } }}
                      className='flex cursor-pointer items-center justify-center rounded-full'
                      onClick={handleCloseCDW}
                    >
                      <FontAwesomeIcon icon={faTimes} style={{ color: colors.text, width: 20, height: 20 }} />
                    </Box>
                  </Box>
                </Box>
                {/* END: Header */}
              </Box>
            )}
          </Box>
        </Box>
      </Backdrop>
    </Dialog>
  )
}
