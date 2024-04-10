import { Box, Grid, Popover } from '@mui/material'
import { labelColors } from '../CardLabelList'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faPen, faXmark } from '@fortawesome/free-solid-svg-icons'
import { ChangeEvent, useState } from 'react'
import { useTheme } from '~/components/Theme/themeContext'
import { Card } from '@trello-v2/shared/src/schemas/CardList'
import { BoardLabel } from '@trello-v2/shared/src/schemas/Board'
import { BoardApiRTQ } from '~/api'

interface CardLabelListTileProps {
  currentLabel: BoardLabel
  setSelectedLabel: (newState: BoardLabel) => void
  isChecked: boolean
  handleIncludeLabel: (label: BoardLabel) => void
  handleExcludeLabel: (label: BoardLabel) => void
  openEditLabelModal: () => void
}

export function CardLabelListTile({
  currentLabel,
  setSelectedLabel,
  isChecked,
  handleIncludeLabel,
  handleExcludeLabel,
  openEditLabelModal
}: CardLabelListTileProps) {
  const { colors } = useTheme()
  const labelColor: string = currentLabel.color
  const [isIncluded, setIsIncluded] = useState<boolean>(isChecked)

  function handleToggleLabel() {
    setIsIncluded(!isIncluded)
    if (!isIncluded) {
      handleIncludeLabel(currentLabel)
    } else {
      handleExcludeLabel(currentLabel)
    }
  }

  return (
    <Box sx={{ width: '100%', height: 36, padding: '0 0 4px 4px' }} className='flex cursor-pointer'>
      <Box sx={{ width: 28, height: 32 }} className='flex items-center justify-start'>
        <input
          type='checkbox'
          style={{ width: 16, height: 16 }}
          className='cursor-pointer'
          checked={isIncluded}
          onChange={handleToggleLabel}
        />
      </Box>
      <Box
        sx={{
          bgcolor: labelColor,
          flex: 1,
          height: 32,
          padding: '0 12px',
          color: getContrastColor(labelColor),
          '&:hover': {
            filter: 'brightness(85%)'
          }
        }}
        className='mb-1 mr-1 flex items-center rounded text-sm font-semibold'
        onClick={handleToggleLabel}
      >
        {currentLabel.name}
      </Box>
      <Box
        sx={{ width: 32, height: 32, '&:hover': { bgcolor: colors.button_hover } }}
        className='flex items-center justify-center'
        onClick={() => {
          setSelectedLabel(currentLabel)
          openEditLabelModal()
        }}
      >
        <FontAwesomeIcon icon={faPen} style={{ width: 16, height: 16, fontSize: 4 }} className='fa-light' />
      </Box>
    </Box>
  )
}

interface CardLabelListModalProps {
  anchorEl: null | HTMLDivElement
  setModalState: (newState: boolean[]) => void
  currentCard: Card
  boardLabels: BoardLabel[]
  setSelectedLabel: (newState: BoardLabel) => void
  handleIncludeLabel: (card: BoardLabel) => void
  handleExcludeLabel: (card: BoardLabel) => void
}

export function CardLabelListModal({
  anchorEl,
  setModalState,
  currentCard,
  boardLabels,
  setSelectedLabel,
  handleIncludeLabel,
  handleExcludeLabel
}: CardLabelListModalProps) {
  const { colors } = useTheme()
  const [searchValue, setSearchValue] = useState<string>('')
  const [boardLabelState, setBoardLabelState] = useState<BoardLabel[]>(boardLabels)

  function filterLabelList(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchValue(event.currentTarget.value)
    // Filter board label list
    setBoardLabelState(
      boardLabels.filter((label) => label.name.toLowerCase().includes(event.currentTarget.value.toLowerCase()))
    )
  }

  function handleClose() {
    setModalState([false, false, false])
  }

  function openCreateLabelModal() {
    setModalState([false, true, false])
  }

  function openEditLabelModal() {
    setModalState([false, false, true])
  }

  function isLabelIncluded(boardLabel: BoardLabel): boolean {
    return currentCard.features.some((feature) => {
      if (feature.type === 'label' && feature.label_id === boardLabel._id) {
        return true
      }
      return false
    })
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
      sx={{ margin: '10px 0 0 0' }}
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
            <h2 className='overflow-hidden overflow-ellipsis whitespace-nowrap text-sm font-semibold'>Labels</h2>
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
            margin: '0 0 10px 0',
            padding: '4px 6px',
            color: colors.text,
            background: colors.background_modal_tertiary,
            border: `2px solid ${colors.button}`
          }}
          className='flex items-center rounded-sm text-sm'
          value={searchValue}
          onChange={(e) => filterLabelList(e)}
          placeholder='Search labels'
        />
        {/* Card member list */}
        <p style={{ margin: '10px 0', color: colors.text }} className='text-xs font-semibold'>
          Labels
        </p>
        {boardLabelState.map((label, index) => (
          <CardLabelListTile
            key={index}
            currentLabel={label}
            setSelectedLabel={setSelectedLabel}
            isChecked={isLabelIncluded(label)}
            handleIncludeLabel={(label) => handleIncludeLabel(label)}
            handleExcludeLabel={(label) => handleExcludeLabel(label)}
            openEditLabelModal={openEditLabelModal}
          />
        ))}
        {/* Line */}
        <Box sx={{ width: '100%', height: 2, margin: '10px 0 4px 0', padding: '0 12px' }}>
          <Box sx={{ width: '100%', height: 2, bgcolor: colors.button }}></Box>
        </Box>
        {/* Button */}
        <Box
          sx={{
            width: '100%',
            height: 32,
            margin: '10px 0',
            padding: '0 8px',
            bgcolor: colors.button,
            '&:hover': {
              bgcolor: colors.button_hover
            }
          }}
          className='flex cursor-pointer items-center justify-center rounded'
          onClick={openCreateLabelModal}
        >
          <h2 style={{ color: colors.text }} className='text-sm font-semibold'>
            Create label
          </h2>
        </Box>
      </Box>
    </Popover>
  )
}

interface LabelColorTileProps {
  color: string
  isSelected: boolean
  setSelectedColor: (newState: string) => void
}

function LabelColorTile({ color, isSelected, setSelectedColor }: LabelColorTileProps) {
  function handleSelectColor() {
    setSelectedColor(color)
  }

  return (
    <Grid item xs={2.4}>
      <Box
        sx={{
          width: '100%',
          height: 32,
          padding: '1px',
          border: isSelected ? '2px solid #0C66E4' : 'none'
        }}
        className='flex items-center justify-center rounded-sm'
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            bgcolor: color,
            '&:hover': { filter: 'brightness(90%)' }
          }}
          className='cursor-pointer rounded-sm'
          onClick={handleSelectColor}
        ></Box>
      </Box>
    </Grid>
  )
}

function getContrastColor(hexColor: string) {
  // Convert hex color to RGB
  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)
  // Calculate the relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  // Choose black or white based on luminance
  return luminance > 0.588 ? '#533f04' : '#ffffff'
}

interface CreateCardLabelModalProps {
  anchorEl: (EventTarget & HTMLDivElement) | null
  setModalState: (newState: boolean[]) => void
  addBoardLabel: (color: string, name: string) => void
}

export function CreateCardLabelModal({ anchorEl, setModalState, addBoardLabel }: CreateCardLabelModalProps) {
  const { colors } = useTheme()
  const [labelNameFieldValue, setLabelNameFieldValue] = useState('')
  const [selectedColor, setSelectedColor] = useState(labelColors[0])

  function handleLabelNameFieldChange(event: ChangeEvent<HTMLInputElement>) {
    setLabelNameFieldValue(event.currentTarget.value)
  }

  function handleReturn() {
    setModalState([true, false])
  }

  function handleClose() {
    setModalState([false, false])
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
          <Grid item xs={2} className='flex items-center justify-start'>
            <Box
              sx={{ width: 32, height: 32, '&:hover': { bgcolor: colors.button_hover } }}
              className='flex cursor-pointer items-center justify-center rounded-lg'
              onMouseDown={handleReturn}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </Box>
          </Grid>
          <Grid item xs={8} className='flex items-center justify-center'>
            <h2 className='overflow-hidden overflow-ellipsis whitespace-nowrap text-sm font-semibold'>Create label</h2>
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
        {/* Label preview area */}
        <Box
          sx={{
            width: '100%',
            height: 'fit-content',
            padding: '30px 20px',
            margin: '0 0 20px 0',
            bgcolor: colors.background_modal_secondary
          }}
          className='flex items-center justify-center'
        >
          <Box
            sx={{
              bgcolor: selectedColor,
              width: '100%',
              height: 32,
              padding: '0 12px',
              color: getContrastColor(selectedColor)
            }}
            className='flex items-center rounded text-sm font-semibold'
          >
            <p className='overflow-hidden overflow-ellipsis whitespace-nowrap'>{labelNameFieldValue}</p>
          </Box>
        </Box>
        {/* Input label name */}
        <Box sx={{ width: '100%', height: 'fit-content', padding: '0 12px' }}>
          <p style={{ margin: '0 0 12px 0' }} className='text-xs font-semibold'>
            Title
          </p>
          <input
            autoFocus
            style={{
              width: '100%',
              height: 32,
              margin: '0 0 20px 0',
              padding: '4px 6px',
              color: colors.text,
              background: colors.background_modal_tertiary,
              border: '1px solid',
              borderColor: colors.button_hover
            }}
            className='flex items-center rounded-sm text-sm'
            placeholder='Label name'
            value={labelNameFieldValue}
            onChange={(e) => handleLabelNameFieldChange(e)}
          />
        </Box>
        {/* Select color */}
        <Box sx={{ width: '100%', height: 'fit-content', padding: '0 12px' }}>
          <p style={{ margin: '0 0 12px 0' }} className='text-xs font-semibold'>
            Select a color
          </p>
          <Grid container spacing={1}>
            {labelColors.map((color, index) => (
              <LabelColorTile
                key={index}
                color={color}
                isSelected={selectedColor === color}
                setSelectedColor={setSelectedColor}
              />
            ))}
          </Grid>
        </Box>
        {/* Line */}
        <Box sx={{ width: '100%', height: 2, margin: '10px 0 10px 0', padding: '0 12px' }}>
          <Box sx={{ width: '100%', height: 2, bgcolor: colors.button }}></Box>
        </Box>
        {/* Create button */}
        <Box
          sx={{
            bgcolor: colors.button_primary,
            width: 'fit-content',
            height: 32,
            margin: '0 0 10px 12px',
            padding: '0 12px',
            color: colors.button_primary_text,
            fontSize: 14,
            fontWeight: 500,
            '&:hover': {
              filter: 'brightness(90%)'
            }
          }}
          className='flex cursor-pointer items-center justify-center rounded'
          onClick={() => {
            addBoardLabel(selectedColor, labelNameFieldValue)
            handleReturn()
          }}
        >
          <p>Create</p>
        </Box>
      </Box>
    </Popover>
  )
}

interface EditCardLabelModalProps {
  anchorEl: (EventTarget & HTMLDivElement) | null
  boardId: string
  setModalState: (newState: boolean[]) => void
  currentCard: Card
  setCurrentCard: (newState: Card) => void
  currentLabel: BoardLabel
  boardLabelState: BoardLabel[]
  setBoardLabelState: (newState: BoardLabel[]) => void
  removeBoardLabel: () => void
}

export function EditCardLabelModal({
  anchorEl,
  boardId,
  setModalState,
  currentCard,
  setCurrentCard,
  currentLabel,
  boardLabelState,
  setBoardLabelState,
  removeBoardLabel
}: EditCardLabelModalProps) {
  const { colors } = useTheme()
  const [labelNameFieldValue, setLabelNameFieldValue] = useState<string>(currentLabel.name)
  const [selectedColor, setSelectedColor] = useState<string>(currentLabel.color)

  const [editBoardLabelAPI] = BoardApiRTQ.BoardApiSlice.useEditBoardLabelMutation()

  function handleLabelNameFieldChange(event: ChangeEvent<HTMLInputElement>) {
    setLabelNameFieldValue(event.currentTarget.value)
  }

  function handleEditBoardLabel() {
    editBoardLabelAPI({
      boardId: boardId,
      _id: currentLabel._id!,
      color: selectedColor,
      name: labelNameFieldValue
    })
    // Update Board label list
    const updatedBoardLabel: BoardLabel[] = boardLabelState.map((label) => {
      return label._id === currentLabel._id ? { ...label, color: selectedColor, name: labelNameFieldValue } : label
    })
    setBoardLabelState(updatedBoardLabel)
    // Update Card
    const updatedCard = {
      ...currentCard,
      labels: currentCard.features
        .filter((feature) => feature.type === 'label')
        .map((label) => {
          return label._id === currentLabel._id
            ? { _id: labelColors.indexOf(selectedColor).toString(), name: labelNameFieldValue }
            : label
        })
    }
    setCurrentCard(updatedCard)
  }

  function handleReturn() {
    setModalState([true, false])
  }

  function handleClose() {
    setModalState([false, false])
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
      sx={{ margin: '0 0 0 0' }}
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
          <Grid item xs={2} className='flex items-center justify-start'>
            <Box
              sx={{ width: 32, height: 32, '&:hover': { bgcolor: colors.button_hover } }}
              className='flex cursor-pointer items-center justify-center rounded-lg'
              onMouseDown={handleReturn}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </Box>
          </Grid>
          <Grid item xs={8} className='flex items-center justify-center'>
            <h2 className='overflow-hidden overflow-ellipsis whitespace-nowrap text-sm font-semibold'>Edit label</h2>
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
        {/* Label preview area */}
        <Box
          sx={{
            width: '100%',
            height: 'fit-content',
            padding: '30px 20px',
            margin: '0 0 20px 0',
            bgcolor: colors.background_modal_secondary
          }}
          className='flex items-center justify-center'
        >
          <Box
            sx={{
              bgcolor: selectedColor,
              width: '100%',
              height: 32,
              padding: '0 12px',
              color: getContrastColor(selectedColor)
            }}
            className='flex items-center rounded text-sm font-semibold'
          >
            <p className='overflow-hidden overflow-ellipsis whitespace-nowrap'>{labelNameFieldValue}</p>
          </Box>
        </Box>
        {/* Input label name */}
        <Box sx={{ width: '100%', height: 'fit-content', padding: '0 12px' }}>
          <p style={{ margin: '0 0 12px 0' }} className='text-xs font-semibold'>
            Title
          </p>
          <input
            autoFocus
            style={{
              width: '100%',
              height: 32,
              margin: '0 0 20px 0',
              padding: '4px 6px',
              color: colors.text,
              background: colors.background_modal_tertiary,
              border: '1px solid',
              borderColor: colors.button_hover
            }}
            className='flex items-center rounded-sm text-sm'
            placeholder='Label name'
            value={labelNameFieldValue}
            onChange={(e) => handleLabelNameFieldChange(e)}
          />
        </Box>
        {/* Select color */}
        <Box sx={{ width: '100%', height: 'fit-content', padding: '0 12px' }}>
          <p style={{ margin: '0 0 12px 0' }} className='text-xs font-semibold'>
            Select a color
          </p>
          <Grid container spacing={1}>
            {labelColors.map((color, index) => (
              <LabelColorTile
                key={index}
                color={color}
                isSelected={selectedColor === color}
                setSelectedColor={setSelectedColor}
              />
            ))}
          </Grid>
        </Box>
        {/* Line */}
        <Box sx={{ width: '100%', height: 2, margin: '10px 0 10px 0', padding: '0 12px' }}>
          <Box sx={{ width: '100%', height: 2, bgcolor: colors.button }}></Box>
        </Box>
        {/* Buttons */}
        <Box sx={{ width: '100%', height: 'fit-content' }} className='flex flex-row justify-between'>
          <Box
            sx={{
              bgcolor: colors.button_primary,
              width: 'fit-content',
              height: 32,
              margin: '0 0 10px 12px',
              padding: '0 12px',
              color: colors.button_primary_text,
              fontSize: 14,
              fontWeight: 500,
              '&:hover': {
                filter: 'brightness(90%)'
              }
            }}
            className='flex cursor-pointer items-center justify-center rounded'
            onClick={() => {
              handleEditBoardLabel()
              handleReturn()
            }}
          >
            <p>Save</p>
          </Box>
          <Box
            sx={{
              bgcolor: '#C9372C',
              width: 'fit-content',
              height: 32,
              margin: '0 12px 10px 0',
              padding: '0 12px',
              color: '#fff',
              fontSize: 14,
              fontWeight: 500,
              '&:hover': {
                filter: 'brightness(90%)'
              }
            }}
            className='flex cursor-pointer items-center justify-center rounded'
            onClick={() => {
              removeBoardLabel()
              handleReturn()
            }}
          >
            <p>Delete</p>
          </Box>
        </Box>
      </Box>
    </Popover>
  )
}
