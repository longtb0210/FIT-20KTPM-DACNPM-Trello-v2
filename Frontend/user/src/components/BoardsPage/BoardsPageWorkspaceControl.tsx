import { Box } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrello } from '@fortawesome/free-brands-svg-icons'
import GridViewIcon from '@mui/icons-material/GridView'
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import { useTheme } from '../Theme/themeContext'
import { Workspace } from '@trello-v2/shared/src/schemas/Workspace'

interface BoardsPageWorkspaceControlProps {
  currentWorkspace: Workspace
}

export default function BoardsPageWorkspaceControl({ currentWorkspace }: BoardsPageWorkspaceControlProps) {
  const { colors } = useTheme()
  return (
    <Box className='flex flex-row items-center'>
      <Box
        sx={{
          width: 'fit-content',
          height: 32,
          backgroundColor: colors.button,
          '&:hover': { backgroundColor: colors.button_hover },
          color: colors.text,
          textTransform: 'none',
          padding: '0 12px',
          marginRight: '12px'
        }}
        className='flex cursor-pointer items-center justify-center rounded-md'
      >
        <FontAwesomeIcon icon={faTrello} style={{ fontSize: 14, marginRight: '10px' }} />
        <p style={{ fontSize: 14, marginBottom: '2px' }} className='font-semibold'>
          Boards
        </p>
      </Box>
      <Box
        sx={{
          width: 'fit-content',
          height: 32,
          backgroundColor: colors.button,
          '&:hover': { backgroundColor: colors.button_hover },
          color: colors.text,
          textTransform: 'none',
          padding: '0 12px',
          marginRight: '12px'
        }}
        className='flex cursor-pointer items-center justify-center rounded-md'
      >
        <GridViewIcon style={{ fontSize: 16, marginRight: '8px' }} />
        <p style={{ fontSize: 14, marginBottom: '2px' }} className='font-semibold'>
          Views
        </p>
      </Box>
      <Box
        sx={{
          width: 'fit-content',
          height: 32,
          backgroundColor: colors.button,
          '&:hover': { backgroundColor: colors.button_hover },
          color: colors.text,
          textTransform: 'none',
          padding: '0 12px',
          marginRight: '12px'
        }}
        className='flex cursor-pointer items-center justify-center rounded-md'
      >
        <Person2OutlinedIcon style={{ fontSize: 16, marginRight: '8px' }} />
        <p style={{ fontSize: 14, marginBottom: '2px' }} className='font-semibold'>
          Members ({currentWorkspace.members.length})
        </p>
      </Box>
      <Box
        sx={{
          width: 'fit-content',
          height: 32,
          backgroundColor: colors.button,
          '&:hover': { backgroundColor: colors.button_hover },
          color: colors.text,
          textTransform: 'none',
          padding: '0 12px 0 8px'
        }}
        className='flex cursor-pointer items-center justify-center rounded-md'
      >
        <SettingsOutlinedIcon style={{ fontSize: 16, marginRight: '8px' }} />
        <p style={{ fontSize: 14, marginBottom: '2px' }} className='font-semibold'>
          Settings
        </p>
      </Box>
    </Box>
  )
}
