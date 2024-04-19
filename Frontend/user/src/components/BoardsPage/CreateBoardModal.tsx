import { faCheck, faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, FormControl, MenuItem, Popover, Select, SelectChangeEvent } from '@mui/material'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import bgHeader from '~/assets/bg_header_create_board.svg'
import React from 'react'
import { useTheme } from '../Theme/themeContext'
import { BoardApiRTQ, WorkspaceApiRTQ } from '~/api'
import { Workspace } from '@trello-v2/shared/src/schemas/Workspace'
import { useNavigate } from 'react-router-dom'

const bg_image = [
  {
    img: 'https://images.unsplash.com/photo-1709374601273-57d0a44c9437?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MDY2fDB8MXxjb2xsZWN0aW9ufDF8MzE3MDk5fHx8fHwyfHwxNzEwMDQzNDc1fA&ixlib=rb-4.0.3&q=80&w=400'
  },
  {
    img: 'https://images.unsplash.com/photo-1708913156538-7c5fcbd22db5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MDY2fDB8MXxjb2xsZWN0aW9ufDJ8MzE3MDk5fHx8fHwyfHwxNzEwMDQzNDc1fA&ixlib=rb-4.0.3&q=80&w=400'
  },
  {
    img: 'https://images.unsplash.com/photo-1709480955041-274cfe798bb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MDY2fDB8MXxjb2xsZWN0aW9ufDN8MzE3MDk5fHx8fHwyfHwxNzEwMDQzNDc1fA&ixlib=rb-4.0.3&q=80&w=400'
  },
  {
    img: 'https://images.unsplash.com/photo-1706661849307-9f0ff8155bc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MDY2fDB8MXxjb2xsZWN0aW9ufDR8MzE3MDk5fHx8fHwyfHwxNzEwMDQzNDc1fA&ixlib=rb-4.0.3&q=80&w=400'
  }
]

const bg_color = [
  {
    color: 'linear-gradient(to bottom right, #E774BB, #943D73)'
  },
  {
    color: 'linear-gradient(to right bottom, rgb(134, 239, 172), rgb(59, 130, 246), rgb(147, 51, 234))'
  },
  {
    color: 'linear-gradient(to right bottom, rgb(249, 168, 212), rgb(216, 180, 254), rgb(129, 140, 248))'
  },
  {
    color: 'linear-gradient(to right bottom, rgb(254, 240, 138), rgb(187, 247, 208), rgb(34, 197, 94))'
  },
  {
    color: 'linear-gradient(to right bottom, rgb(165, 180, 252), rgb(192, 132, 252))'
  },
  {
    color: 'linear-gradient(to right bottom, rgb(15, 23, 42), rgb(88, 28, 135), rgb(15, 23, 42))'
  }
]

const visibilityOptions = ['Private', 'Workspace', 'Public']
type VisibilityType = 'private' | 'public' | 'workspace'

interface CreateBoardModalProps {
  anchorEl: HTMLDivElement | null
  workspaceId: string
  isOpen: boolean
  handleCloseDialog: () => void
}

export default function CreateBoardModal({ anchorEl, workspaceId, isOpen, handleCloseDialog }: CreateBoardModalProps) {
  const navigate = useNavigate()
  const { colors } = useTheme()
  const anchorRef = React.useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [textFieldValue, setTextFieldValue] = useState('')
  const [isRequired, setIsRequired] = useState(true)
  const [allWorkspaces, setAllWorkspaces] = useState<Workspace[]>([])
  const [selectedWorkspace, setSelectedWorkspace] = useState('')
  const [selectedVisibility, setSelectedVisibility] = useState<VisibilityType>('private')
  const [activeBg, setActiveBg] = useState({ check: true, index: 0, type: 'color', data: bg_color[0].color })

  //API
  const [getAllWorkspacesAPI] = WorkspaceApiRTQ.WorkspaceApiSlice.useLazyGetAllWorkspaceQuery()
  const [createBoardAPI] = BoardApiRTQ.BoardApiSlice.useCreateBoardMutation()

  function fetchAllWorkspaces() {
    getAllWorkspacesAPI()
      .unwrap()
      .then((response) => {
        setAllWorkspaces([...response.data.owner, ...response.data.member])
      })
      .catch((error) => {
        console.log('ERROR: get all workspaces', error)
      })
  }

  useEffect(() => {
    inputRef.current?.focus()
    fetchAllWorkspaces()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSubmit() {
    if (textFieldValue.trim() !== '') {
      createBoardAPI({
        name: textFieldValue.trim(),
        workspace_id: selectedWorkspace,
        visibility: selectedVisibility,
        background: activeBg.data
      })
        .unwrap()
        .then((response) => {
          handleCloseDialog()
          setTextFieldValue('')
          navigate(`/workspace/${workspaceId}/board/${response.data._id}`)
        })
    }
  }

  function handleChangeTitle(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target
    value.trim() === '' ? setIsRequired(true) : setIsRequired(false)
    setTextFieldValue(value)
  }

  function handleSelectWorkspace(event: SelectChangeEvent) {
    setSelectedWorkspace(event.target.value as string)
  }

  function handleSelectVisibility(event: SelectChangeEvent) {
    setSelectedVisibility(event.target.value as VisibilityType)
  }

  const handleActiveBg = (type: string, index: number, data: string) => {
    setActiveBg({ check: true, type, index, data })
  }

  return (
    <Popover
      open={isOpen}
      anchorEl={anchorEl}
      onClose={handleCloseDialog}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: -10
      }}
    >
      <Box
        sx={{
          width: 300,
          height: 'fit-content',
          padding: '12px 12px',
          backgroundColor: colors.background_modal_secondary,
          color: colors.text
        }}
        boxShadow={3}
      >
        {/* START: Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: colors.secondary
          }}
        >
          {/* Button back */}
          <Box
            sx={{
              lineHeight: '8px',
              padding: '8px',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '4px'
              }
            }}
          ></Box>
          {/* Title */}
          <p style={{ fontSize: '14px', fontWeight: 500 }}>Create board</p>
          {/* Button close */}
          <Box
            sx={{
              lineHeight: '8px',
              padding: '8px',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: colors.button,
                borderRadius: '4px'
              }
            }}
            onClick={handleCloseDialog}
          >
            <FontAwesomeIcon icon={faClose} style={{ width: '14px', height: '14px' }} />
          </Box>
        </Box>
        {/* END: Header */}
        {/* START: Body */}
        <Box sx={{ height: 'fit-content' }}>
          {/* ----- */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '12px auto',
              backgroundImage: activeBg.type === 'image' ? `url("${activeBg.data}")` : activeBg.data,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '200px',
              height: '120px',
              borderRadius: '4px'
            }}
          >
            <img src={bgHeader} alt='' />
          </Box>

          <p style={{ fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: colors.text }}>Background</p>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {bg_image &&
              bg_image.map((item, index) => (
                <Box
                  onClick={() => handleActiveBg('image', index, item.img)}
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundImage: `url("${item.img}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    flex: 1,
                    height: '40px',
                    borderRadius: '4px',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover::before': {
                      content: '""',
                      cursor: 'pointer',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(255, 255, 255, 0.2)'
                    }
                  }}
                >
                  {activeBg.check && activeBg.type === 'image' && activeBg.index === index && (
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      <FontAwesomeIcon icon={faCheck} style={{ fontSize: '12px' }} />
                    </Box>
                  )}
                </Box>
              ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', marginBottom: '12px' }}>
            {[
              bg_color &&
                bg_color.map((item, index) => (
                  <Box
                    onClick={() => handleActiveBg('color', index, item.color)}
                    key={index}
                    sx={{
                      flex: 1,
                      height: '32px',
                      borderRadius: '4px',
                      backgroundImage: item.color,
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      '&:hover::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(255, 255, 255, 0.2)'
                      }
                    }}
                  >
                    {activeBg.check && activeBg.type === 'color' && activeBg.index === index && (
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgba(255, 255, 255, 0.2)'
                        }}
                      >
                        <FontAwesomeIcon icon={faCheck} style={{ fontSize: '12px' }} />
                      </Box>
                    )}
                  </Box>
                ))
            ]}
          </Box>
          {/* ------ */}

          {/* Input board title */}
          <Box sx={{ marginBottom: '8px' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: colors.text, marginBottom: '4px' }}>
              Board title <span style={{ color: 'red' }}>*</span>
            </p>
            <input
              ref={inputRef}
              autoFocus={true}
              onChange={handleChangeTitle}
              type='text'
              style={{
                width: '100%',
                padding: '4px 8px',
                fontSize: '14px',
                color: colors.text,
                background: colors.background_modal_tertiary,
                border: `1px solid ${isRequired ? 'red' : colors.text}`,
                borderRadius: '4px',
                marginBottom: '4px'
              }}
            />
            {/* Alert */}
            <Box sx={{ display: 'flex', alignItems: 'center', visibility: isRequired ? 'visible' : 'hidden' }}>
              <span role='img' aria-label='wave'>
                👋
              </span>
              <p
                style={{
                  fontSize: '14px',
                  color: colors.secondary,
                  marginLeft: '6px'
                }}
              >
                Board title is required
              </p>
            </Box>
          </Box>
          {/* Select workspace */}
          <Box sx={{ marginBottom: '8px' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: colors.secondary, marginBottom: '4px' }}>Workspace</p>
            <FormControl fullWidth>
              <Select
                sx={{
                  height: 36,
                  margin: '0 0 8px 0',
                  fontSize: 14,
                  background: colors.background_modal,
                  color: colors.text
                }}
                value={selectedWorkspace}
                onChange={handleSelectWorkspace}
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
                {allWorkspaces.map((workspace, index) => (
                  <MenuItem key={index} value={workspace._id} sx={{ fontSize: 14 }}>
                    {workspace.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          {/* Select visibility */}
          <Box sx={{ marginBottom: '18px' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: colors.secondary, marginBottom: '4px' }}>
              Visibility
            </p>
            <FormControl fullWidth>
              <Select
                sx={{
                  height: 36,
                  margin: '0 0 8px 0',
                  fontSize: 14,
                  background: colors.background_modal,
                  color: colors.text
                }}
                value={selectedVisibility}
                onChange={handleSelectVisibility}
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
                {visibilityOptions.map((visibility, index) => (
                  <MenuItem key={index} value={visibility.toLowerCase()} sx={{ fontSize: 14 }}>
                    {visibility}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          {/* Button submit */}
          <Box
            ref={anchorRef}
            id='composition-button'
            aria-haspopup='true'
            sx={{
              width: '100%',
              height: 32,
              padding: '6px',
              fontSize: '14px',
              color: colors.button_primary_text,
              backgroundColor: colors.button_primary,
              '&:hover': {
                filter: 'brightness(90%)'
              }
            }}
            className='flex items-center justify-center'
            onClick={handleSubmit}
          >
            <p className='font-semibold'>Create</p>
          </Box>
        </Box>
        {/* END: Body */}
      </Box>
    </Popover>
  )
}
