import { faEllipsis, faSquareCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, LinearProgress, LinearProgressProps, TextareaAutosize, Typography } from '@mui/material'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { ChecklistItemModal, DeleteChecklistModal } from './modals/CardChecklistModal'
import { useTheme } from '../Theme/themeContext'
import { Feature_Checklist } from '@trello-v2/shared/src/schemas/Feature'
import { Card } from '@trello-v2/shared/src/schemas/CardList'
import { CardApiRTQ } from '~/api'

interface ChecklistAddTextAreaProps {
  cardlistId: string
  cardId: string
  isInputFocused: boolean
  setIsInputFocused: (newState: boolean) => void
  checklistId: string
  currentCard: Card
  setCurrentCard: (newState: Card) => void
}

function ChecklistAddTextArea({
  cardlistId,
  cardId,
  isInputFocused,
  setIsInputFocused,
  checklistId,
  currentCard,
  setCurrentCard
}: ChecklistAddTextAreaProps) {
  const { colors } = useTheme()
  const [textAreaValue, setTextAreaValue] = useState('')

  //API
  const [updateCardFeatureAPI] = CardApiRTQ.CardApiSlice.useUpdateCardFeatureMutation()

  const handleTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setTextAreaValue(event.target.value)
  }

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isInputFocused && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isInputFocused])

  function handleSave() {
    // Remove unnecessary white space
    const trimmedValue = textAreaValue.replace(/\s+/g, ' ').trim()
    // Check if new checkitem title is empty
    if (trimmedValue.trim() !== '') {
      // Get current checklist data
      const currentChecklist = currentCard.features.find(
        (feature) => feature.type === 'checklist' && feature._id === checklistId
      ) as Feature_Checklist
      // Call API
      updateCardFeatureAPI({
        cardlist_id: cardlistId,
        card_id: cardId,
        feature: {
          _id: checklistId,
          type: 'checklist',
          name: currentChecklist.name,
          items: [...currentChecklist.items, { name: trimmedValue, is_check: false }]
        }
      })
      // Update checklist table
      const updatedCard: Card = {
        ...currentCard,
        features: currentCard.features
          .filter((feature) => feature.type === 'checklist')
          .map((checklist) =>
            checklist._id === currentChecklist._id
              ? {
                  ...checklist,
                  items: [...currentChecklist.items, { name: trimmedValue, is_check: false }]
                }
              : checklist
          )
      }
      setCurrentCard(updatedCard)
    }
    // Close textarea
    handleClose()
  }

  function handleClose() {
    setIsInputFocused(false)
  }

  return (
    <div
      style={{
        width: '100%',
        height: 'fit-content',
        padding: '4px 0',
        whiteSpace: isInputFocused ? 'normal' : 'wrap',
        resize: 'none'
      }}
      className='flex flex-col'
    >
      <TextareaAutosize
        style={{
          width: '100%',
          padding: '4px 4px',
          whiteSpace: isInputFocused ? 'normal' : 'wrap',
          resize: 'none',
          background: colors.background_modal_secondary
        }}
        minRows={2}
        placeholder='Add an item'
        value={textAreaValue}
        onChange={handleTextAreaChange}
        ref={textareaRef}
        onFocus={() => setIsInputFocused(true)}
        className='flex text-sm font-semibold'
      />
      {/* Title textarea control */}
      <Box className='mt-2 flex flex-row items-center gap-2'>
        <Box
          sx={{
            width: 'fit-content',
            height: 32,
            bgcolor: colors.button_primary,
            color: colors.button_primary_text,
            padding: '0 12px'
          }}
          className='flex cursor-pointer items-center justify-center rounded'
          onClick={handleSave}
        >
          <p className='text-sm font-semibold'>Save</p>
        </Box>
        <Box
          sx={{
            width: 'fit-content',
            height: 32,
            color: colors.text,
            padding: '0 12px',
            '&:hover': {
              bgcolor: colors.button_hover
            }
          }}
          className='flex cursor-pointer items-center justify-center rounded'
          onClick={handleClose}
        >
          <p className='text-sm font-semibold'>Cancel</p>
        </Box>
      </Box>
    </div>
  )
}

interface ChecklistAddButtonProps {
  cardlistId: string
  cardId: string
  checklistId: string
  currentCard: Card
  setCurrentCard: (newState: Card) => void
}

function ChecklistAddButton({ cardlistId, cardId, checklistId, currentCard, setCurrentCard }: ChecklistAddButtonProps) {
  const { colors } = useTheme()
  const [isInputFocused, setIsInputFocused] = useState(false)

  return (
    <Box sx={{ width: '100%', height: 'fit-content', margin: '10px 0 0 40px' }} className='flex flex-wrap'>
      <div></div>
      {!isInputFocused && (
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
              bgcolor: colors.button_hover
            }
          }}
          className='flex cursor-pointer items-center justify-center rounded'
          onClick={() => setIsInputFocused(true)}
        >
          <p>Add an item</p>
        </Box>
      )}
      {isInputFocused && (
        <ChecklistAddTextArea
          cardlistId={cardlistId}
          cardId={cardId}
          isInputFocused={isInputFocused}
          setIsInputFocused={setIsInputFocused}
          checklistId={checklistId}
          currentCard={currentCard}
          setCurrentCard={setCurrentCard}
        />
      )}
    </Box>
  )
}

interface ChecklistDeleteButtonProps {
  currentChecklistName: string
  handleDelete: () => void
}

function ChecklistDeleteButton({ currentChecklistName, handleDelete }: ChecklistDeleteButtonProps) {
  const { colors } = useTheme()
  const [anchorEl, setAnchorEl] = useState<null | HTMLDivElement>(null)
  const [isOpenDeleteChecklistModal, setIsOpenDeleteChecklistModal] = useState(false)

  function openDeleteChecklistModal(event: React.MouseEvent<HTMLDivElement>) {
    setAnchorEl(event.currentTarget)
    setIsOpenDeleteChecklistModal(true)
  }

  function handleDeleteAndClose() {
    handleDelete()
    handleClose()
  }

  function handleClose() {
    setIsOpenDeleteChecklistModal(false)
  }

  return (
    <Box
      sx={{
        bgcolor: colors.button,
        width: 'fit-content',
        height: 32,
        padding: '0 12px',
        margin: '4px 0 0 10px',
        color: colors.text,
        fontSize: 14,
        fontWeight: 500,
        '&:hover': {
          bgcolor: colors.button_hover
        }
      }}
      className='flex cursor-pointer items-center justify-center rounded'
      onClick={openDeleteChecklistModal}
    >
      <p>Delete</p>
      {isOpenDeleteChecklistModal && (
        <DeleteChecklistModal
          checklistName={currentChecklistName}
          anchorEl={anchorEl}
          handleDelete={handleDeleteAndClose}
          handleClose={handleClose}
        />
      )}
    </Box>
  )
}

interface ChecklistNameFieldProps {
  checklistNameState: string
  setChecklistNameState: (newState: string) => void
  updateChecklistName: () => void
  isInputFocused: boolean
  setIsInputFocused: (newState: boolean) => void
}

function ChecklistNameField({
  checklistNameState,
  setChecklistNameState,
  updateChecklistName,
  isInputFocused,
  setIsInputFocused
}: ChecklistNameFieldProps) {
  const { colors } = useTheme()
  const [initialValue, setInitialValue] = useState(checklistNameState)

  function handleTextAreaChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setChecklistNameState(event.target.value)
  }

  function handleSave() {
    const trimmedValue = checklistNameState.replace(/\s+/g, ' ').trim()
    if (trimmedValue !== initialValue.trim()) {
      setInitialValue(checklistNameState)
      updateChecklistName()
    }
  }

  function handleOpen() {
    setIsInputFocused(true)
  }

  function handleClose() {
    if (checklistNameState.trim() !== initialValue.trim()) {
      setChecklistNameState(initialValue)
    }
    setIsInputFocused(false)
  }

  return (
    <div
      style={{
        width: '100%',
        padding: '4px 0',
        whiteSpace: isInputFocused ? 'normal' : 'wrap',
        resize: 'none'
      }}
      className='flex flex-col'
    >
      <TextareaAutosize
        style={{
          width: '100%',
          padding: '0 4px',
          whiteSpace: isInputFocused ? 'normal' : 'wrap',
          resize: 'none',
          background: isInputFocused ? colors.background_modal_tertiary : colors.background_modal
        }}
        minRows={1}
        value={checklistNameState}
        onChange={handleTextAreaChange}
        onBlur={handleClose}
        onFocus={handleOpen}
        className='flex cursor-pointer font-semibold'
      />
      {/* Title textarea control */}
      {isInputFocused && <TextAreaControl handleSave={handleSave} handleClose={handleClose} />}
    </div>
  )
}

interface TextAreaControlProps {
  handleSave: () => void
  handleClose: () => void
}

export function TextAreaControl({ handleSave, handleClose }: TextAreaControlProps) {
  const { colors } = useTheme()
  return (
    <Box className='mt-2 flex flex-row items-center gap-2'>
      <Box
        sx={{
          width: 'fit-content',
          height: 32,
          bgcolor: colors.button_primary,
          color: colors.button_primary_text,
          padding: '0 12px'
        }}
        className='flex cursor-pointer items-center justify-center rounded'
        onMouseDown={handleSave}
      >
        <p className='text-sm font-semibold'>Save</p>
      </Box>
      <Box
        sx={{ width: 'fit-content', height: 32, color: colors.text, padding: '0 6px' }}
        className='flex cursor-pointer items-center justify-center rounded'
        onMouseDown={handleClose}
      >
        <FontAwesomeIcon icon={faXmark} className='text-xl' />
      </Box>
    </Box>
  )
}

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  const { colors } = useTheme()
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', margin: '4px 0 10px 0' }}>
      <Box sx={{ width: 40, color: colors.text }} className='flex items-center justify-center text-xs'>
        <Typography variant='body2' color={colors.text}>{`${Math.round(props.value)}%`}</Typography>
      </Box>
      <Box sx={{ width: '100%', margin: '0 0 0 4px' }}>
        <LinearProgress
          sx={{ height: 8, bgcolor: colors.button }}
          className='rounded'
          variant='determinate'
          {...props}
        />
      </Box>
    </Box>
  )
}

interface ChecklistItemNameFieldProps {
  checklistItemNameState: string
  setChecklistItemNameState: (newState: string) => void
  updateChecklistItemName: () => void
  isInputFocused: boolean
  setIsInputFocused: (newState: boolean) => void
}

function ChecklistItemNameField({
  checklistItemNameState,
  setChecklistItemNameState,
  updateChecklistItemName,
  isInputFocused,
  setIsInputFocused
}: ChecklistItemNameFieldProps) {
  const { colors } = useTheme()
  const [initialValue, setInitialValue] = useState(checklistItemNameState)

  function handleTextAreaChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setChecklistItemNameState(event.target.value)
  }

  function handleSave() {
    const trimmedValue = checklistItemNameState.replace(/\s+/g, ' ').trim()
    if (trimmedValue !== initialValue.trim()) {
      setInitialValue(trimmedValue)
      updateChecklistItemName()
    }
  }

  function handleOpen() {
    setIsInputFocused(true)
  }

  function handleClose() {
    if (checklistItemNameState.trim() !== initialValue.trim()) {
      setChecklistItemNameState(initialValue)
    }
    setIsInputFocused(false)
  }

  return (
    <div
      style={{
        width: '100%',
        padding: '4px 0',
        margin: '0 10px 0 0',
        whiteSpace: isInputFocused ? 'normal' : 'wrap',
        resize: 'none'
      }}
      className='flex flex-col'
    >
      <TextareaAutosize
        autoFocus
        style={{
          width: '100%',
          padding: '8px 8px',
          whiteSpace: isInputFocused ? 'normal' : 'wrap',
          resize: 'none',
          background: colors.background_modal_secondary
        }}
        minRows={3}
        value={checklistItemNameState}
        onChange={handleTextAreaChange}
        onBlur={handleClose}
        onFocus={handleOpen}
        className='flex text-sm'
      />
      {/* Title textarea control */}
      {isInputFocused && <TextAreaControl handleSave={handleSave} handleClose={handleClose} />}
    </div>
  )
}

interface ChecklistItemProps {
  cardlistId: string
  cardId: string
  checklistId: string
  checkitemId: number
  currentCheckitem: { name: string; is_check: boolean }
  currentCard: Card
  setCurrentCard: (newState: Card) => void
  setProgress: (newState: number) => void
}

function ChecklistItem({
  cardlistId,
  cardId,
  checklistId,
  checkitemId,
  currentCheckitem,
  currentCard,
  setCurrentCard,
  setProgress
}: ChecklistItemProps) {
  const { colors } = useTheme()
  const [onFocus, setOnFocus] = useState(false)

  // API
  const [updateCardFeatureAPI] = CardApiRTQ.CardApiSlice.useUpdateCardFeatureMutation()

  function handleCheckbox() {
    const currentChecklist = currentCard.features.find(
      (feature) => feature.type === 'checklist' && feature._id === checklistId
    ) as Feature_Checklist
    // Call API
    updateCardFeatureAPI({
      cardlist_id: cardlistId,
      card_id: cardId,
      feature: {
        _id: checklistId,
        type: 'checklist',
        name: currentChecklist.name,
        items: currentChecklist.items.map((checkitem, index) =>
          index === checkitemId ? { ...checkitem, is_check: !checkitem.is_check } : checkitem
        )
      }
    })
    const updatedCard: Card = {
      ...currentCard,
      features: currentCard.features.map((feature) =>
        feature.type === 'checklist' && feature._id === checklistId
          ? {
              ...feature,
              items: feature.items.map((checkitem, index) =>
                index === checkitemId ? { ...checkitem, is_check: !checkitem.is_check } : checkitem
              )
            }
          : feature
      )
    }
    setCurrentCard(updatedCard)
  }

  const [openChecklistItemNameField, setOpenChecklistItemNameField] = useState(false)
  const [checklistItemNameState, setChecklistItemNameState] = useState(currentCheckitem.name)

  function updateChecklistItemName() {
    // Remove unnecessary white space
    const trimmedValue = checklistItemNameState.replace(/\s+/g, ' ').trim()
    // Check if new checkitem name is empty
    if (trimmedValue !== '') {
      const updatedCard: Card = {
        ...currentCard,
        features: currentCard.features.map((feature) =>
          feature.type === 'checklist'
            ? {
                ...feature,
                items: feature.items.map((checkitem, index) =>
                  index === checkitemId ? { ...checkitem, name: trimmedValue } : checkitem
                )
              }
            : feature
        )
      }
      setCurrentCard(updatedCard)
    }
  }

  // useEffect to ensure setProgress is called after setChecklist
  useEffect(() => {
    const cardChecklist = currentCard.features.find(
      (feature) => feature.type === 'checklist' && feature._id === checklistId
    ) as Feature_Checklist
    const count = cardChecklist.items.reduce((count: number, checkitem) => (checkitem.is_check ? count + 1 : count), 0)
    const progress = (count / cardChecklist.items.length) * 100
    setProgress(progress)
  }, [checklistId, currentCard.features, setProgress])

  const [anchorEl, setAnchorEl] = useState<null | SVGSVGElement>(null)
  const [isOpenChecklistItemModal, setIsOpenChecklistItemModal] = useState(false)

  function openChecklistItemModal(event: React.MouseEvent<SVGSVGElement>) {
    setAnchorEl(event.currentTarget)
    setIsOpenChecklistItemModal(true)
  }

  function closeChecklistItemModal() {
    setIsOpenChecklistItemModal(false)
    setOnFocus(false)
  }

  function deleteChecklistItem() {
    const currentChecklist = currentCard.features.find((feature) => feature._id === checklistId) as Feature_Checklist
    updateCardFeatureAPI({
      cardlist_id: cardlistId,
      card_id: cardId,
      feature: {
        _id: checklistId,
        type: 'checklist',
        name: currentChecklist.name,
        items: currentChecklist.items.filter((_checkitem) => _checkitem.name !== currentCheckitem.name)
      }
    })
    const updatedCard: Card = {
      ...currentCard,
      features: currentCard.features.map((feature) =>
        feature.type === 'checklist' && feature._id === checklistId
          ? {
              ...feature,
              items: feature.items.filter((_checkitem) => _checkitem.name !== currentCheckitem.name)
            }
          : feature
      )
    }
    setCurrentCard(updatedCard)
  }

  return (
    <Box sx={{ width: '100%', height: 'fit-content' }} className='flex flex-row'>
      <Box sx={{ width: 36, marginTop: '12px' }} className='flex justify-center'>
        <input
          style={{ width: 16, height: 16, background: colors.background_modal_secondary }}
          type='checkbox'
          checked={currentCheckitem.is_check}
          onChange={handleCheckbox}
        />
      </Box>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          padding: '4px 0 4px 10px',
          bgcolor: openChecklistItemNameField ? colors.button : 'none',
          '&:hover': {
            bgcolor: colors.button
          }
        }}
        className='flex cursor-pointer items-center justify-between rounded-xl'
        onMouseEnter={() => setOnFocus(true)}
        onMouseLeave={() => setOnFocus(false)}
      >
        {!openChecklistItemNameField && (
          <p
            style={{ height: 32 }}
            className={`text-sm ${currentCheckitem.is_check ? 'line-through' : ''} flex items-center`}
            onClick={() => setOpenChecklistItemNameField(true)}
          >
            {currentCheckitem.name}
          </p>
        )}
        {openChecklistItemNameField && (
          <ChecklistItemNameField
            checklistItemNameState={checklistItemNameState}
            setChecklistItemNameState={setChecklistItemNameState}
            updateChecklistItemName={updateChecklistItemName}
            isInputFocused={openChecklistItemNameField}
            setIsInputFocused={setOpenChecklistItemNameField}
          />
        )}
        {onFocus && !openChecklistItemNameField && (
          <Box
            sx={{
              width: 24,
              height: 24,
              margin: '0 10px 0 0',
              padding: '0 0 0 2px',
              bgcolor: colors.button_hover,
              borderRadius: 200,
              '&:hover': {
                bgcolor: colors.button_hover_hover
              }
            }}
            className='flex items-center justify-center'
          >
            <FontAwesomeIcon
              icon={faEllipsis}
              className='flex items-center justify-center text-sm'
              onClick={(event) => openChecklistItemModal(event)}
              onBlur={closeChecklistItemModal}
            />
            {isOpenChecklistItemModal && onFocus && anchorEl != null && (
              <ChecklistItemModal
                anchorEl={anchorEl}
                handleDelete={deleteChecklistItem}
                handleClose={closeChecklistItemModal}
              />
            )}
          </Box>
        )}
      </Box>
    </Box>
  )
}

interface CardChecklistProps {
  cardlistId: string
  cardId: string
  currentChecklist: Feature_Checklist
  currentCard: Card
  setCurrentCard: (newState: Card) => void
}

export default function CardChecklist({
  cardlistId,
  cardId,
  currentChecklist,
  currentCard,
  setCurrentCard
}: CardChecklistProps) {
  const { colors } = useTheme()
  // START: Handle edit Checklist name
  const [checklistNameState, setChecklistNameState] = useState<string>(currentChecklist.name)
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)

  // API
  const [updateCardFeatureAPI] = CardApiRTQ.CardApiSlice.useUpdateCardFeatureMutation()
  const [deleteCardFeatureAPI] = CardApiRTQ.CardApiSlice.useDeleteCardFeatureMutation()

  function updateChecklistName() {
    // Remove unnecessary white space
    const trimmedValue = checklistNameState.replace(/\s+/g, ' ').trim()
    // Check if new checklist name is empty
    if (trimmedValue !== '') {
      updateCardFeatureAPI({
        cardlist_id: cardlistId,
        card_id: cardId,
        feature: {
          _id: currentChecklist._id!,
          type: 'checklist',
          name: trimmedValue,
          items: [...currentChecklist.items]
        }
      })
      // Update checklist name
      const updatedCard: Card = {
        ...currentCard,
        features: currentCard.features
          .filter((feature) => feature.type === 'checklist')
          .map((checklist) =>
            checklist._id === currentChecklist._id
              ? {
                  ...checklist,
                  name: trimmedValue
                }
              : checklist
          )
      }
      setChecklistNameState(trimmedValue)
      setCurrentCard(updatedCard)
    }
    closeChecklistField()
  }

  function closeChecklistField() {
    setIsInputFocused(false)
  }
  // END: Handle edit Checklist name

  function deleteChecklist() {
    deleteCardFeatureAPI({
      cardlist_id: cardlistId,
      card_id: cardId,
      feature_id: currentChecklist._id!
    })
      .unwrap()
      .then((response) => {
        setCurrentCard(response.data)
      })
      .catch((error) => {
        console.log('ERROR: delete checklist from card - ', error)
      })
  }

  return (
    <div style={{ margin: '30px 0 40px 0', color: colors.text }} className='flex flex-col flex-wrap gap-1'>
      {/* START: Header */}
      <div style={{ height: 'fit-content' }} className='flex flex-row justify-between'>
        {/* Title */}
        <div style={{ padding: '4px 0 0 0' }} className='relative flex flex-grow flex-row'>
          {/* Title icon */}
          <FontAwesomeIcon icon={faSquareCheck} style={{ width: 40, margin: '4px 0 0 0' }} className='text-xl' />
          {/* Title textarea */}
          <ChecklistNameField
            checklistNameState={checklistNameState}
            setChecklistNameState={setChecklistNameState}
            updateChecklistName={updateChecklistName}
            isInputFocused={isInputFocused}
            setIsInputFocused={setIsInputFocused}
          />
        </div>
        {/* Delete button */}
        {!isInputFocused && (
          <ChecklistDeleteButton currentChecklistName={currentChecklist.name} handleDelete={deleteChecklist} />
        )}
      </div>
      {/* END: Header */}
      {/* START: Body */}
      <Box sx={{ width: '100%' }} className='flex flex-col'>
        <LinearProgressWithLabel value={progress} />
        {currentChecklist.items.map((checkitem, index) => (
          <ChecklistItem
            key={index}
            cardlistId={cardlistId}
            cardId={cardId}
            checklistId={currentChecklist._id!}
            checkitemId={index}
            currentCheckitem={checkitem}
            currentCard={currentCard}
            setCurrentCard={setCurrentCard}
            setProgress={setProgress}
          />
        ))}
        <ChecklistAddButton
          cardlistId={cardlistId}
          cardId={cardId}
          checklistId={currentChecklist._id!}
          currentCard={currentCard}
          setCurrentCard={setCurrentCard}
        />
      </Box>
      {/* END: Body */}
    </div>
  )
}
