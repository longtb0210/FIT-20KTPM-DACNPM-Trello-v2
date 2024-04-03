import { Box, FormControl, Grid, MenuItem, Popover, Select, SelectChangeEvent, TextareaAutosize } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList, faLocationDot, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { faFlipboard } from '@fortawesome/free-brands-svg-icons'
import { useTheme } from '~/components/Theme/themeContext'
import { Card } from '@trello-v2/shared/src/schemas/CardList'

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
  currentCard: Card
  setCurrentCard: (newState: Card) => void
  handleClose: () => void
}

const boardChoices: string[] = ['Project Trello', 'Front-end', 'Back-end']
const listChoices: string[] = ['To do', 'Doing', 'Done', 'Week 1', 'Week 2']
const positionChoices: string[] = ['1', '2', '3', '4']

export function CopyCardModal({ anchorEl, currentCard, handleClose }: CopyCardModalProps) {
  const { colors } = useTheme()
  const menuItemFontSize = 14
  const [textFieldValue, setTextFieldValue] = useState('')
  const [isChecked, setIsChecked] = useState([false, false, false, false])
  const [selectedBoard, setSelectedBoard] = useState('Project Trello')
  const [selectedList, setSelectedList] = useState('Doing')
  const [selectedPosition, setSelectedPosition] = useState('3')

  function handleTextFieldChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setTextFieldValue(event.target.value)
  }

  function handleSelectBoard(event: SelectChangeEvent) {
    setSelectedBoard(event.target.value as string)
  }

  function handleSelectList(event: SelectChangeEvent) {
    setSelectedList(event.target.value as string)
  }

  function handleSelectPosition(event: SelectChangeEvent) {
    setSelectedPosition(event.target.value as string)
  }

  function handleCreateCard() {
    console.log('Card copying not implemented yet.')
  }

  function handleCheckboxChange(index: number) {
    const updatedIsChecked = [...isChecked]
    updatedIsChecked[index] = !updatedIsChecked[index]
    setIsChecked(updatedIsChecked)
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
        <p style={{ margin: '10px 0 8px 0', color: colors.text }} className='text-xs font-bold'>
          Keep...
        </p>
        <Box sx={{ width: '100%', height: 'fit-content' }} className='flex flex-col'>
          <CardElementTile
            isChecked={isChecked[0]}
            handleCheckboxChange={() => handleCheckboxChange(0)}
            elementName='Checklists'
            elementQuantity={currentCard.features.filter((feature) => feature.type === 'checklist').length}
          />
          <CardElementTile
            isChecked={isChecked[1]}
            handleCheckboxChange={() => handleCheckboxChange(1)}
            elementName='Labels'
            elementQuantity={currentCard.features.filter((feature) => feature.type === 'label').length}
          />
          <CardElementTile
            isChecked={isChecked[2]}
            handleCheckboxChange={() => handleCheckboxChange(2)}
            elementName='Members'
            elementQuantity={currentCard.watcher_email.length}
          />
          <CardElementTile
            isChecked={isChecked[3]}
            handleCheckboxChange={() => handleCheckboxChange(3)}
            elementName='Attachments'
            elementQuantity={currentCard.features.filter((feature) => feature.type === 'attachment').length}
          />
        </Box>
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
                    maxHeight: 144,
                    marginTop: 8,
                    background: colors.background_modal,
                    color: colors.text
                  }
                }
              }}
            >
              {boardChoices.map((choice, index) => (
                <MenuItem key={index} value={choice} sx={{ fontSize: menuItemFontSize }}>
                  {choice}
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
              <Select
                sx={{
                  width: '100%',
                  height: 36,
                  margin: '0 0 8px 0',
                  fontSize: 14,
                  background: colors.background_modal,
                  color: colors.text
                }}
                value={selectedList}
                onChange={handleSelectList}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 144,
                      marginTop: 8,
                      background: colors.background_modal,
                      color: colors.text
                    }
                  }
                }}
              >
                {listChoices.map((choice, index) => (
                  <MenuItem key={index} value={choice} sx={{ fontSize: menuItemFontSize }}>
                    {choice}
                  </MenuItem>
                ))}
              </Select>
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
              <Select
                sx={{
                  height: 36,
                  margin: '0 0 8px 0',
                  fontSize: 14,
                  background: colors.background_modal,
                  color: colors.text
                }}
                value={selectedPosition}
                onChange={handleSelectPosition}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 144,
                      marginTop: 8,
                      background: colors.background_modal,
                      color: colors.text
                    }
                  }
                }}
              >
                {positionChoices.map((choice, index) => (
                  <MenuItem key={index} value={choice} sx={{ fontSize: menuItemFontSize }}>
                    {choice}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* END: Select position */}
        </Grid>
        {/* END: Select list and position */}
        {/* Button */}
        <Box
          sx={{
            bgcolor: colors.button_primary,
            width: 'fit-content',
            height: 32,
            margin: '10px 0 10px 0',
            padding: '0 20px',
            color: colors.button_primary_text,
            fontSize: 14,
            fontWeight: 500,
            '&:hover': {
              filter: 'brightness(90%)'
            }
          }}
          className='flex cursor-pointer items-center justify-center rounded'
          onClick={() => {
            handleCreateCard()
            handleClose()
          }}
        >
          <p>Create card</p>
        </Box>
      </Box>
    </Popover>
  )
}
