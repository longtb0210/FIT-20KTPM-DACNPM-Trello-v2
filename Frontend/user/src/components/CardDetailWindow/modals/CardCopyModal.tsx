import { Box, FormControl, Grid, MenuItem, Popover, Select, SelectChangeEvent, TextareaAutosize } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList, faLocationDot, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import { faFlipboard } from '@fortawesome/free-brands-svg-icons'
import { useTheme } from '~/components/Theme/themeContext'
import { Card, CardList } from '@trello-v2/shared/src/schemas/CardList'
import { BoardApiRTQ, CardApiRTQ, CardlistApiRTQ, WorkspaceApiRTQ } from '~/api'
import { Board } from '@trello-v2/shared/src/schemas/Board'

interface CardElementTileProps {
  isChecked: boolean
  handleCheckboxChange: () => void
  elementName: string
  elementQuantity: number
}

function CardElementTile({ isChecked, handleCheckboxChange, elementName, elementQuantity }: CardElementTileProps) {
  const { colors } = useTheme()
  return (
    <Box sx={{ marginBottom: '4px' }} className='flex flex-row items-center' onClick={() => handleCheckboxChange()}>
      <input
        type='checkbox'
        style={{ width: 16, height: 16, margin: '0 16px 0 8px', border: `1px solid ${colors.button}` }}
        checked={isChecked}
        onChange={handleCheckboxChange}
      />
      <p className='text-sm'>
        {elementName} ({elementQuantity})
      </p>
    </Box>
  )
}

interface CopyCardModalProps {
  anchorEl: (EventTarget & HTMLDivElement) | null
  boardId: string
  cardlistId: string
  cardId: string
  currentCard: Card
  setCurrentCard: (newState: Card) => void
  handleClose: () => void
}

export function CopyCardModal({ anchorEl, boardId, cardlistId, cardId, currentCard, handleClose }: CopyCardModalProps) {
  const { colors } = useTheme()
  const menuItemFontSize = 14
  const [textFieldValue, setTextFieldValue] = useState('')
  const [isChecked, setIsChecked] = useState([false, false, false, false])
  const [selectedBoard, setSelectedBoard] = useState<string>(boardId)
  const [selectedCardlist, setSelectedCardlist] = useState<string>(cardlistId)
  const [selectedPosition, setSelectedPosition] = useState(1)
  const [allBoards, setAllBoards] = useState<Board[]>([])
  const [allCardlists, setAllCardlists] = useState<CardList[] | null>([])
  const [cardlistLength, setCardlistLength] = useState<number>(0)
  const [canSubmit, setCanSubmit] = useState<boolean>(false)

  //API
  const [getAllWorkspacesAPI] = WorkspaceApiRTQ.WorkspaceApiSlice.useLazyGetAllWorkspaceQuery()
  const [getBoardsByWorkspaceIdAPI] = BoardApiRTQ.BoardApiSlice.useLazyGetBoardsByWorkspaceIDQuery()
  const [getCardlistByBoardIdAPI] = CardlistApiRTQ.CardListApiSlice.useLazyGetCardlistByBoardIdQuery()
  const [getCardsOfCardlistAPI] = CardApiRTQ.CardApiSlice.useLazyGetCardsOfCardlistQuery()

  async function fetchAllBoards() {
    await getAllWorkspacesAPI()
      .unwrap()
      .then((response) => {
        let tempAllBoards: Board[] = []
        const ownerPromises = response.data.owner.map((workspace) => {
          return getBoardsByWorkspaceIdAPI({
            workspace_id: workspace._id!
          })
            .then((response1) => {
              tempAllBoards = [...tempAllBoards, ...response1.data.data]
            })
            .catch((error) => {
              console.log('ERROR: fetch boards in Card Move Modal - ', error)
            })
        })
        const adminPromises = response.data.admin.map((workspace) => {
          return getBoardsByWorkspaceIdAPI({
            workspace_id: workspace._id!
          })
            .then((response2) => {
              tempAllBoards = [...tempAllBoards, ...response2.data.data]
            })
            .catch((error) => {
              console.log('ERROR: fetch boards in Card Move Modal - ', error)
            })
        })
        Promise.all([...ownerPromises, ...adminPromises]).then(() => {
          setAllBoards(tempAllBoards)
        })
      })
      .catch((error) => {
        console.log('ERROR: fetch all boards in Card Move Modal - ', error)
      })
  }

  function fetchAllCardlists() {
    getCardlistByBoardIdAPI({
      id: selectedBoard
    })
      .unwrap()
      .then((response) => {
        setAllCardlists(response.data)
      })
      .catch((error) => {
        console.log('ERROR: fetch cardlists in Card Move Modal - ', error)
      })
  }

  function fetchCardlistLength() {
    getCardsOfCardlistAPI({
      cardlist_id: selectedCardlist!
    })
      .unwrap()
      .then((response) => {
        setCardlistLength(response.data.cards.length)
      })
      .catch((error) => {
        console.log('ERROR: fetch cardlist length - ', error)
      })
  }

  useEffect(() => {
    fetchAllBoards()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    fetchAllCardlists()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBoard])

  useEffect(() => {
    fetchCardlistLength()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCardlist])

  function handleTextFieldChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setTextFieldValue(event.target.value)
  }

  function handleSelectBoard(event: SelectChangeEvent) {
    setSelectedBoard(event.target.value as string)
  }

  function handleSelectCardlist(event: SelectChangeEvent) {
    setSelectedCardlist(event.target.value as string)
  }

  function handleSelectPosition(event: SelectChangeEvent) {
    setSelectedPosition(Number(event.target.value))
  }

  function handleCreateCard() {
    console.log('Card copying not implemented yet.')
  }

  function handleCheckboxChange(index: number) {
    const updatedIsChecked = [...isChecked]
    updatedIsChecked[index] = !updatedIsChecked[index]
    setIsChecked(updatedIsChecked)
  }

  function handleCanSubmit() {
    if (textFieldValue.trim() === '' || selectedCardlist === '' || allCardlists!.length === 0) {
      console.log(allCardlists)
      setCanSubmit(false)
    } else {
      setCanSubmit(true)
    }
  }

  useEffect(() => {
    handleCanSubmit()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textFieldValue, selectedBoard, allCardlists, selectedPosition])

  return (
    <Popover
      open={true}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left'
      }}
      transformOrigin={{
        vertical: 'center',
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
            <h2 className='overflow-hidden overflow-ellipsis whitespace-nowrap text-sm font-semibold'>Copy card</h2>
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
        {/* Input card title */}
        <p style={{ margin: '10px 0 8px 0', color: colors.text }} className='text-xs font-bold'>
          Title
        </p>
        <TextareaAutosize
          autoFocus
          minRows={3}
          style={{
            width: '100%',
            margin: '0 0 8px 0',
            padding: '4px 6px',
            color: colors.text,
            background: colors.background_modal_tertiary,
            border: `2px solid ${colors.button_hover}`
          }}
          className='flex items-center rounded-sm text-sm'
          value={textFieldValue}
          onChange={(e) => handleTextFieldChange(e)}
          placeholder='Title of new card'
        />
        {/* Select card elements to keep */}
        {(currentCard.features.filter((feature) => feature.type === 'checklist').length !== 0 ||
          currentCard.features.filter((feature) => feature.type === 'label').length !== 0 ||
          currentCard.watcher_email.length !== 0 ||
          currentCard.features.filter((feature) => feature.type === 'attachment').length !== 0) && (
          <>
            <p style={{ margin: '10px 0 8px 0', color: colors.text }} className='text-xs font-bold'>
              Keep...
            </p>
            <Box sx={{ width: '100%', height: 'fit-content' }} className='flex flex-col'>
              {currentCard.features.filter((feature) => feature.type === 'checklist').length !== 0 && (
                <CardElementTile
                  isChecked={isChecked[0]}
                  handleCheckboxChange={() => handleCheckboxChange(0)}
                  elementName='Checklists'
                  elementQuantity={currentCard.features.filter((feature) => feature.type === 'checklist').length}
                />
              )}
              {currentCard.features.filter((feature) => feature.type === 'label').length !== 0 && (
                <CardElementTile
                  isChecked={isChecked[1]}
                  handleCheckboxChange={() => handleCheckboxChange(1)}
                  elementName='Labels'
                  elementQuantity={currentCard.features.filter((feature) => feature.type === 'label').length}
                />
              )}
              {currentCard.watcher_email.length !== 0 && (
                <CardElementTile
                  isChecked={isChecked[2]}
                  handleCheckboxChange={() => handleCheckboxChange(2)}
                  elementName='Members'
                  elementQuantity={currentCard.watcher_email.length}
                />
              )}
              {currentCard.features.filter((feature) => feature.type === 'attachment').length !== 0 && (
                <CardElementTile
                  isChecked={isChecked[3]}
                  handleCheckboxChange={() => handleCheckboxChange(3)}
                  elementName='Attachments'
                  elementQuantity={currentCard.features.filter((feature) => feature.type === 'attachment').length}
                />
              )}
            </Box>
          </>
        )}
        {/* Select card move destination */}
        <p style={{ margin: '20px 0 8px 0', color: colors.text }} className='text-xs font-bold'>
          Copy to destination...
        </p>
        {/* START: Select board */}
        <Box sx={{ width: 'fit-content', height: 20, marginBottom: '4px' }} className='flex flex-row items-center'>
          <FontAwesomeIcon icon={faFlipboard} style={{ fontSize: 12 }} />
          <p style={{ marginLeft: '6px', color: colors.text }} className='text-xs font-semibold'>
            Board
          </p>
        </Box>
        <FormControl fullWidth className='flex flex-col'>
          <Box sx={{ width: '100%', height: 'fit-content' }}>
            <Select
              sx={{
                width: '100%',
                height: 36,
                margin: '0 0 8px 0',
                fontSize: 14,
                background: colors.background_modal,
                color: colors.text
              }}
              value={selectedBoard}
              onChange={handleSelectBoard}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 148,
                    marginTop: 8,
                    background: colors.background_modal,
                    color: colors.text
                  }
                }
              }}
            >
              {allBoards.map((board, index) => (
                <MenuItem key={index} value={board._id} sx={{ fontSize: menuItemFontSize }}>
                  {board.name}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </FormControl>
        {/* END: Select board */}
        {/* START: Select list and position */}
        <Grid container spacing={1}>
          {/* START: Select list */}
          <Grid item xs={7}>
            <Box sx={{ width: 'fit-content', height: 20, marginBottom: '4px' }} className='flex flex-row items-center'>
              <FontAwesomeIcon icon={faList} style={{ fontSize: 12 }} />
              <p style={{ marginLeft: '6px', color: colors.text }} className='text-xs font-semibold'>
                List
              </p>
            </Box>
            <FormControl fullWidth className='flex flex-col'>
              {allCardlists!.length === 0 ? (
                <Box
                  sx={{
                    width: '100%',
                    height: 36,
                    margin: '0 0 8px 0',
                    paddingLeft: '12px',
                    fontSize: 14,
                    background: colors.button_hover,
                    color: colors.text
                  }}
                  className='flex items-center rounded-sm'
                >
                  <p className='font-semibold italic'>No Lists</p>
                </Box>
              ) : (
                <Select
                  sx={{
                    width: '100%',
                    height: 36,
                    margin: '0 0 8px 0',
                    fontSize: 14,
                    background: colors.background_modal,
                    color: colors.text
                  }}
                  value={selectedCardlist}
                  onChange={handleSelectCardlist}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 148,
                        marginTop: 8,
                        background: colors.background_modal,
                        color: colors.text
                      }
                    }
                  }}
                >
                  {allCardlists!.map((cardlist, index) => (
                    <MenuItem key={index} value={cardlist._id} sx={{ fontSize: menuItemFontSize }}>
                      {cardlist.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </FormControl>
          </Grid>
          {/* END: Select list */}
          {/* START: Select position */}
          <Grid item xs={5}>
            <Box sx={{ width: 'fit-content', height: 20, marginBottom: '4px' }} className='flex flex-row items-center'>
              <FontAwesomeIcon icon={faLocationDot} style={{ fontSize: 12 }} />
              <p style={{ marginLeft: '6px', color: colors.text }} className='text-xs font-semibold'>
                Position
              </p>
            </Box>
            <FormControl fullWidth className='flex flex-col'>
              {allCardlists!.length === 0 ? (
                <Box
                  sx={{
                    width: '100%',
                    height: 36,
                    margin: '0 0 8px 0',
                    paddingLeft: '12px',
                    fontSize: 14,
                    background: colors.button_hover,
                    color: colors.text
                  }}
                  className='flex items-center rounded-sm'
                >
                  <p className='font-semibold italic'>N/A</p>
                </Box>
              ) : (
                <Select
                  sx={{
                    height: 36,
                    margin: '0 0 8px 0',
                    fontSize: 14,
                    background: colors.background_modal,
                    color: colors.text
                  }}
                  value={selectedPosition!.toString()}
                  onChange={handleSelectPosition}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 148,
                        marginTop: 8,
                        background: colors.background_modal,
                        color: colors.text
                      }
                    }
                  }}
                >
                  {Array.from({ length: cardlistLength + 1 }, (_, index) => index).map((choice, index) => (
                    <MenuItem key={index} value={choice} sx={{ fontSize: menuItemFontSize }}>
                      {choice + 1}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </FormControl>
          </Grid>
          {/* END: Select position */}
        </Grid>
        {/* END: Select list and position */}
        {/* Button */}
        <Box
          sx={{
            bgcolor: canSubmit ? colors.button_primary : colors.button_hover,
            width: 'fit-content',
            height: 32,
            margin: '10px 0 10px 0',
            padding: '0 20px',
            color: canSubmit ? colors.button_primary_text : colors.text,
            fontSize: 14,
            fontWeight: 500,
            '&:hover': {
              filter: 'brightness(90%)'
            },
            ...(canSubmit ? { cursor: 'pointer' } : {})
          }}
          className='flex items-center justify-center rounded'
          onClick={() => {
            if (canSubmit) {
              handleCreateCard()
              handleClose()
            }
          }}
        >
          <p>Create card</p>
        </Box>
      </Box>
    </Popover>
  )
}
