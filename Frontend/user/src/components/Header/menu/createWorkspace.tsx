import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { WorkspaceApiRTQ } from '~/api'
import workspace from '~/assets/workspace_img.svg'

import { faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Autocomplete, Box, Button, TextField } from '@mui/material'

import { useTheme } from '../../Theme/themeContext'

interface AutocompleteContainerProps {
  onClose: () => void
}

const type = [
  'Choose...',
  'Marketing',
  'Engineering-IT',
  'Operations',
  'Human Resouces',
  'Sales CRM',
  'Education',
  'Other'
]

export default function CreateWorkspace(props: AutocompleteContainerProps) {
  const [createWorkspace] = WorkspaceApiRTQ.WorkspaceApiSlice.useCreateWorkspaceMutation()
  const [getAllWorkspace] = WorkspaceApiRTQ.WorkspaceApiSlice.useLazyGetAllWorkspaceQuery()
  const [valueWorkspace, setValueWorkspace] = React.useState<string | undefined>(type[0])
  const [inputValueWorkspace, setInputValueWorkspace] = React.useState('')
  const [workspaceName, setWorkspaceName] = React.useState('')
  const [workspaceDescription, setWorkspaceDescription] = React.useState('')
  const { darkMode, colors } = useTheme()
  const navigator = useNavigate()

  const onSubmit = async () => {
    // const data = {
    //   name: workspaceName,
    //   description: workspaceDescription
    // }
    // try {
    //   const response = await axios.post('http://localhost:3333/api/worspace', data)

    //   if (response && response.statusText === 'OK') {
    //     navigator(`/workspace/${response.data.data._id}`)
    //     props.onClose()
    //   }
    // } catch (error) {
    //   console.error('Error fetching data:', error)
    // }

    createWorkspace({
      name: workspaceName || '',
      description: workspaceDescription || ''
    }).then(() => getAllWorkspace())
  }

  const handleWorkspaceName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWorkspaceName(event.target.value)
  }

  const handleWorkspaceDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setWorkspaceDescription(event.target.value)
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.4)',
        color: colors.text,
        zIndex: 1001
      }}
    >
      <Box
        sx={{
          backgroundColor: colors.background,
          display: 'flex',
          alignItems: 'stretch',
          borderRadius: '4px',
          position: 'relative'
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            margin: '50px 100px 24px',
            padding: '0 24px',
            width: '388px'
          }}
        >
          <h2 style={{ fontSize: '24px', fontWeight: 600, lineHeight: '28px', marginBottom: '12px' }}>
            Let's build a Workspace
          </h2>
          <p style={{ fontSize: '18px', lineHeight: '28px', margin: '12px auto 0px' }}>
            Boost your productivity by making it easier for everyone to access boards in one location.
          </p>

          <Box>
            <p
              style={{
                fontSize: '12px',
                fontWeight: 700,
                lineHeight: '16px',
                marginBottom: '4px',
                marginTop: '24px'
              }}
            >
              Workspace name
            </p>

            <input
              type='text'
              value={workspaceName}
              onChange={handleWorkspaceName}
              placeholder='Tacos Co.'
              style={{
                width: '100%',
                padding: '8px 10px',
                fontSize: '14px',
                color: colors.text,
                backgroundColor: colors.background,
                border: '3px solid #384148',
                borderColor: colors.text,
                borderRadius: '4px',
                marginBottom: '6px',
                outline: 'none',
                transition: 'all 0.1s ease-in'
              }}
              onFocus={(e) => {
                e.target.style.border = '3px solid #85b8ff'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#384148'
              }}
            />

            <p style={{ fontSize: '12px', marginBottom: '12px' }}>
              This is the name of your company, team or organization.
            </p>
          </Box>

          <Box>
            <p
              style={{
                fontSize: '12px',
                fontWeight: 700,
                lineHeight: '16px',
                marginBottom: '4px',
                marginTop: '24px'
              }}
            >
              Workspace type
            </p>

            <Autocomplete
              size='small'
              value={valueWorkspace}
              disableClearable
              onChange={(_event: React.SyntheticEvent, newValue: string | undefined) => {
                setValueWorkspace(newValue)
              }}
              inputValue={inputValueWorkspace}
              onInputChange={(_event: React.SyntheticEvent, newInputValue: string) => {
                setInputValueWorkspace(newInputValue)
              }}
              id='controllable-states-demo'
              options={type}
              sx={{
                width: '100%',
                '& .MuiInputBase-input': {
                  fontSize: '14px',
                  color: colors.text
                },
                '& .MuiSvgIcon-root': {
                  color: colors.text
                },
                borderRadius: '4px',
                fontSize: '14px',
                color: colors.text,
                backgroundColor: colors.background,
                border: '3px solid #384148',
                borderColor: colors.text,
                marginBottom: '6px',
                outline: 'none',
                transition: 'all 0.1s ease-in'
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </Box>

          <Box>
            <p
              style={{
                fontSize: '12px',
                fontWeight: 700,
                lineHeight: '16px',
                marginBottom: '4px',
                marginTop: '24px'
              }}
            >
              Workspace description <span style={{ fontWeight: 300 }}>Optional</span>
            </p>

            <textarea
              value={workspaceDescription}
              onChange={handleWorkspaceDescription}
              placeholder='Tacos Co.'
              style={{
                width: '100%',
                padding: '8px 10px',
                fontSize: '14px',
                color: colors.text,
                backgroundColor: colors.background,
                border: '3px solid #384148',
                borderColor: colors.text,
                borderRadius: '4px',
                marginBottom: '6px',
                outline: 'none',
                transition: 'all 0.1s ease-in',
                height: '100px'
              }}
              onFocus={(e) => {
                e.target.style.border = '3px solid #85b8ff'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#384148'
              }}
            ></textarea>

            <p style={{ fontSize: '12px', marginBottom: '12px' }}>
              Get your members on board with a few words about your Workspace.
            </p>
          </Box>

          <Button
            onClick={onSubmit}
            disabled={workspaceName.length === 0 || valueWorkspace === 'Choose...' ? true : false}
            sx={{
              width: '100%',
              fontSize: '14px',
              textTransform: 'none',
              color: darkMode ? '#1d2125' : '#fff',
              padding: '12px 0',
              backgroundColor:
                workspaceName.length === 0 || valueWorkspace === 'Choose...' ? 'rgba(86,157,255,0.1)' : '#579dff',
              '&:hover': {
                backgroundColor: '#85b8ff'
              },
              transition: 'all 0.1s ease-in',
              lineHeight: '20px'
            }}
          >
            Continue
          </Button>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '0 120px',
            paddingTop: '112px',
            backgroundImage: `url(${'https://trello.com/assets/df0d81969c6394b61c0d.svg'})` // Thay đổi đường dẫn ở đây
          }}
        >
          <Box sx={{}}>
            <img src={workspace} alt='' style={{ backgroundSize: 'cover', width: '100%' }} />
          </Box>
        </Box>

        <FontAwesomeIcon
          onClick={props.onClose}
          icon={faClose}
          style={{
            position: 'absolute',
            top: '2rem',
            right: '1.4rem',
            color: colors.text,
            fontSize: '24px',
            padding: '4px',
            cursor: 'pointer'
          }}
        />
      </Box>
    </Box>
  )
}
