import { Box, Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrello } from '@fortawesome/free-brands-svg-icons'
import WorkSpaces from './menu/workspaces'
import Recent from './menu/recent'
import Starred from './menu/starred'
import Templates from './menu/template'
import Create from './menu/create'
import SearchMenu from './menu/search'
import Help from './menu/help'
import Notification from './menu/notification'
import Account from './menu/account'

import { Link } from 'react-router-dom'

import { useTheme } from './../Theme/themeContext'

const Header = () => {
  const { darkMode, colors } = useTheme()

  return (
    <Box
      sx={{
        position: 'fixed',
        width: '100%',
        backgroundColor: colors.background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: '1px',
        borderColor: '#9fadbc',
        borderStyle: 'solid',
        padding: '8px',
        color: colors.text,
        zIndex: '1201',
        transition: darkMode ? 'all 0.2s ease-in' : 'all 0.2s ease-in'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Link to={'/'}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginRight: '2px',
              padding: '2px 8px',
              cursor: 'pointer',
              color: colors.text,
              '&:hover': {
                backgroundColor: colors.bg_button_hover,
                borderRadius: '4px'
              }
            }}
          >
            <FontAwesomeIcon icon={faTrello} />

            <Typography variant='body1' sx={{ fontSize: '20px', fontWeight: 700, marginLeft: '4px' }}>
              Trello
            </Typography>
          </Box>
        </Link>

        <Box sx={{ padding: '0 5px' }}>
          <WorkSpaces />
        </Box>

        <Box sx={{ padding: '0 5px' }}>
          <Recent />
        </Box>

        <Box sx={{ padding: '0 5px' }}>
          <Starred />
        </Box>

        <Box sx={{ padding: '0 5px' }}>
          <Templates />
        </Box>

        <Create />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <SearchMenu />
        <Notification />
        <Help />
        <Account />
      </Box>
    </Box>
  )
}

export default Header
