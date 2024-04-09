import * as React from 'react'
import { Box, Button, Autocomplete, TextField } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faChevronLeft, faClose } from '@fortawesome/free-solid-svg-icons'
import bgHeader from '~/assets/bg_header_create_board.svg'
import { useTheme } from './../../Theme/themeContext'
// import { useNavigate } from 'react-router-dom'
// import axios from 'axios'
import { BoardApiRTQ, WorkspaceApiRTQ } from '~/api'

interface AutocompleteContainerProps {
  onClose: () => void
  onBack: () => void
}

const visibility = ['Workspace', 'Public', 'Private']

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

export default function CreateBoard(props: AutocompleteContainerProps) {
  const [createBoard] = BoardApiRTQ.BoardApiSlice.useCreateBoardMutation()
  const [getAllBoard] = BoardApiRTQ.BoardApiSlice.useLazyGetAllBoardQuery()
  const [getALlWorkspace, { data: workspaceData }] = WorkspaceApiRTQ.WorkspaceApiSlice.useLazyGetAllWorkspaceQuery()
  const [valueWorkspace, setValueWorkspace] = React.useState<string>(workspaceData?.data[0].name || '')
  const [valueVisibility, setValueVisibility] = React.useState<string>(visibility[0])
  const [inputValueWorkspace, setInputValueWorkspace] = React.useState('')
  const [inputValueVisibility, setInputValueVisibility] = React.useState('')
  const [idWorkspace, setIdWorkspace] = React.useState(workspaceData?.data[0]._id || '')
  const [boardTitle, setBoardTitle] = React.useState('')
  const [activeBg, setActiveBg] = React.useState({ check: true, index: 0, type: 'color', data: bg_color[0].color })
  const anchorRef = React.useRef<HTMLButtonElement>(null)
  const { darkMode, colors } = useTheme()

  React.useEffect(() => {
    getALlWorkspace()
  }, [getALlWorkspace])

  const handleTitleBoard = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBoardTitle(event.target.value)
  }

  const handleActiveBg = (type: string, index: number, data: string) => {
    setActiveBg({ check: true, type, index, data })
  }

  const onSubmit = () => {
    createBoard({
      name: boardTitle,
      workspace_id: idWorkspace,
      visibility: valueVisibility?.toLocaleLowerCase() as 'private' | 'public' | 'workspace'
    }).then(() => getAllBoard())
  }

  return (
    <Box sx={{ padding: '0 12px', overflowY: 'scroll' }}>
      <Box
        onClick={props.onBack}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: colors.text
        }}
      >
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
        >
          <FontAwesomeIcon icon={faChevronLeft} style={{ width: '14px', height: '14px' }} />
        </Box>
        <p style={{ fontSize: '14px', fontWeight: 500 }}>Create board</p>

        <Box
          onClick={props.onClose}
          sx={{
            lineHeight: '8px',
            padding: '8px',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '4px'
            }
          }}
        >
          <FontAwesomeIcon icon={faClose} style={{ width: '14px', height: '14px' }} />
        </Box>
      </Box>

      <Box
        sx={{
          // overflowY: 'scroll',
          maxHeight: 'calc(100vh - 240px)'
        }}
      >
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

        <Box sx={{ marginBottom: '8px' }}>
          <p style={{ fontSize: '12px', fontWeight: 700, color: colors.text, marginBottom: '4px' }}>
            Board title <span style={{ color: 'red' }}>*</span>
          </p>

          <input
            type='text'
            value={boardTitle}
            onChange={handleTitleBoard}
            style={{
              width: '100%',
              padding: '4px 8px',
              fontSize: '14px',
              color: colors.text,
              backgroundColor: colors.background,
              border: '2px solid #e34935',
              borderRadius: '4px',
              marginBottom: '4px',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.border = '2px solid #85b8ff'
            }}
            onBlur={(e) => {
              e.target.style.border = '2px solid #e34935'
            }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <span role='img' aria-label='wave'>
              👋
            </span>
            <p style={{ fontSize: '14px', color: colors.text, marginLeft: '6px' }}>Board title is required</p>
          </Box>
        </Box>

        <Box sx={{ marginBottom: '8px' }}>
          <p style={{ fontSize: '12px', fontWeight: 700, color: colors.text, marginBottom: '4px' }}>Workspace</p>

          <Autocomplete
            size='small'
            value={valueWorkspace}
            disableClearable
            onChange={(_event: React.SyntheticEvent, newValue: string) => {
              setValueWorkspace(newValue)
              const newIndex = workspaceData?.data.findIndex((workspace) => workspace.name === newValue) || 0
              if (newIndex !== -1 && workspaceData?.data[newIndex]?._id) {
                console.log('Selected index:', newIndex)
                setIdWorkspace(workspaceData?.data[newIndex]?._id)
              }
            }}
            inputValue={inputValueWorkspace}
            onInputChange={(_event: React.SyntheticEvent, newInputValue: string) => {
              setInputValueWorkspace(newInputValue)
            }}
            id='controllable-states-demo'
            options={
              workspaceData?.data
                .filter((workspace) => workspace.members.some((member) => member.role !== 'guest'))
                .map((workspace) => workspace.name) ?? []
            }
            sx={{
              width: '100%',
              '& .MuiAutocomplete-option': {
                backgroundColor: 'red !important'
              },

              '& .MuiInputBase-input': {
                fontSize: '12px',
                color: colors.text
              },
              '& .MuiSvgIcon-root': {
                color: colors.text
              },
              border: '1px solid #384148',
              borderRadius: '4px'
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </Box>

        <Box sx={{ marginBottom: '18px' }}>
          <p style={{ fontSize: '12px', fontWeight: 700, color: colors.text, marginBottom: '4px' }}>Visibility</p>

          <Autocomplete
            size='small'
            value={valueVisibility}
            disableClearable
            onChange={(_event: React.SyntheticEvent, newValue: string) => {
              setValueVisibility(newValue)
            }}
            inputValue={inputValueVisibility}
            onInputChange={(_event: React.SyntheticEvent, newInputValue: string) => {
              setInputValueVisibility(newInputValue)
            }}
            id='controllable-states-demo'
            options={visibility}
            sx={{
              width: '100%',
              '& .MuiInputBase-input': {
                fontSize: '12px',
                color: colors.text
              },
              '& .MuiSvgIcon-root': {
                color: colors.text
              },
              border: '1px solid #384148',
              borderRadius: '4px'
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </Box>

        <Button
          onClick={onSubmit}
          disabled={boardTitle.length === 0 || idWorkspace.length === 0 ? true : false}
          ref={anchorRef}
          id='composition-button'
          aria-haspopup='true'
          sx={{
            width: '100%',
            fontSize: '13px',
            textTransform: 'none',
            color: darkMode ? '#1d2125' : '#fff',
            backgroundColor: boardTitle.length === 0 || idWorkspace.length === 0 ? 'rgba(86,157,255,0.1)' : '#579dff',
            '&:hover': {
              backgroundColor: '#85b8ff'
            },
            transition: 'all 0.1s ease-in',
            lineHeight: '20px'
          }}
        >
          Create
        </Button>
      </Box>
    </Box>
  )
}
