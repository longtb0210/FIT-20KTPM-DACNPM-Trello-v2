import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCreditCard, faEye, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Backdrop, Box, CircularProgress, Grid, Stack } from '@mui/material'
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
import { testBoardLabels, testBoardMembers, testCard } from './test_data'
import { BoardLabel } from '@trello-v2/shared/src/schemas/Board'
import { CardApiRTQ, CardlistApiRTQ } from '~/api'

const focusInputColor = '#0ff'

// interface CardDetailWindowProps {
//   cardlistId: string
//   cardId: string
// }

export default function CardDetailWindow() {
  const cardlistId: string = '660cc2ceb0660ac999e0de8d'
  const cardId: string = '660cc2e5b0660ac999e0de90'
  const { colors } = useTheme()

  // Card data (MOCK UP)
  const [_currentCardState, _setCurrentCardState] = useState<Card>(testCard)

  // Card states
  const [currentCardState, setCurrentCardState] = useState<Card | null>()
  const [cardNameFieldValue, setCardNameFieldValue] = useState<string>('')
  const [initialCardNameFieldValue, setInitialCardNameFieldValue] = useState<string>('')
  const [isWatching, setIsWatching] = useState<boolean>(false)

  // Cardlist states
  const [currentCardlistNameState, setCurrentCardlistNameState] = useState<string>('')

  // Board states
  const [boardLabelState, setBoardLabelState] = useState<BoardLabel[]>(testBoardLabels)

  // API
  const [getAllCardlistAPI] = CardlistApiRTQ.CardListApiSlice.useLazyGetAllCardlistQuery()
  const [getCardDetailAPI] = CardApiRTQ.CardApiSlice.useLazyGetCardDetailQuery()
  const [updateCardDetailAPI] = CardApiRTQ.CardApiSlice.useUpdateCardDetailMutation()

  const fetchCardlistName = async () => {
    try {
      const { data: allCardlistData } = await getAllCardlistAPI()
      const currentCardlist = allCardlistData?.data.find((cardlist) => cardlist._id === cardlistId)
      setCurrentCardlistNameState(currentCardlist!.name)
    } catch (err) {
      console.error('Error fetching card data:', err)
    }
  }

  const fetchCardData = async () => {
    try {
      const { data: cardData } = await getCardDetailAPI({
        cardlist_id: cardlistId,
        card_id: cardId
      })
      setCurrentCardState(cardData?.data)
    } catch (err) {
      console.error('Error fetching card data:', err)
    }
  }

  // Fetch card data
  useEffect(() => {
    fetchCardData()
    fetchCardlistName()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update other states after fetch data
  useEffect(() => {
    if (currentCardState) {
      setCardNameFieldValue(currentCardState!.name)
      setInitialCardNameFieldValue(currentCardState!.name)
      setIsWatching(false)
    }
  }, [currentCardState])

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

  function handleNotification() {
    setIsWatching(!isWatching)
  }

  return (
    <Backdrop sx={{ bgcolor: 'rgba(0, 0, 0, 0.64)', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
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
                      cardlistId={cardlistId}
                      cardId={cardId}
                      currentCard={currentCardState!}
                      setCurrentCard={setCurrentCardState!}
                      boardMembers={testBoardMembers}
                    />
                    <CardLabelList
                      cardlistId={cardlistId}
                      cardId={cardId}
                      currentCard={currentCardState!}
                      setCurrentCard={setCurrentCardState}
                      boardLabelState={boardLabelState}
                      setBoardLabelState={setBoardLabelState}
                    />
                    <CardNotification isWatching={isWatching} setIsWatching={handleNotification} />
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
                  <CardActivity currentCard={currentCardState!} setCurrentCard={setCurrentCardState} />
                </Grid>
                <Grid item xs={3} sx={{ padding: '0 16px 8px 8px' }}>
                  <Stack sx={{ padding: '10px 0 0 0' }}>
                    <h2 style={{ color: colors.text }} className='mb-2 text-xs font-bold'>
                      Add to card
                    </h2>
                    <SidebarButtonMembers
                      type={ButtonType.Members}
                      cardlistId={cardlistId}
                      cardId={cardId}
                      currentCard={currentCardState}
                      setCurrentCard={setCurrentCardState}
                      boardMembers={testBoardMembers}
                    />
                    <SidebarButtonLabels
                      type={ButtonType.Labels}
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
                      currentCard={_currentCardState}
                      setCurrentCard={_setCurrentCardState}
                    />
                    <SidebarButtonCopy
                      type={ButtonType.Copy}
                      currentCard={_currentCardState}
                      setCurrentCard={_setCurrentCardState}
                    />
                    <Box sx={{ width: '100%', height: 2, padding: '0 0 10px 0' }}>
                      <Box sx={{ width: '100%', height: 2, bgcolor: colors.button }}></Box>
                    </Box>
                    <SidebarButtonArchive
                      type={ButtonType.Archive}
                      currentCard={_currentCardState}
                      setCurrentCard={_setCurrentCardState}
                    />
                  </Stack>
                </Grid>
              </Grid>
              {/* END: Body */}
            </>
          ) : (
            <Box sx={{ width: '100%', marginTop: '20px' }} className='flex items-center justify-center'>
              <CircularProgress />
            </Box>
          )}
        </Box>
      </Box>
    </Backdrop>
  )
}
