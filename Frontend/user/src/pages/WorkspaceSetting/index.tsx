// pages/account-management.tsx
import React, { useEffect, useState } from 'react'
import { Settings } from './components'
import SidebarCateWorkSpace from '../CategoryWorkspace/component/SidebarCateWorkspace'
import { useTheme } from '../../components/Theme/themeContext'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import IconButton from '@mui/material/IconButton'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'

const drawerWidth = 250

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  })
}))

const BackButton = styled(IconButton)({
  position: 'fixed',
  top: 10,
  left: 10,
  zIndex: 999
})


export const WorkspaceSetting: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<string>('')

  const { colors } = useTheme()

  // useEffect(() => {
  //   setSelectedTab(page)
  //   console.log(page)
  // }, [page])
  const handleTabSelect = (tab: string) => {
    setSelectedTab(tab)
  }
  const darkLightMode = {
    backgroundColor: colors.background,
    color: colors.text,
    minHeight:  'calc(100vh - 51px)'
  }

  const [open, setOpen] = React.useState(true)

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  return (
    <div style={darkLightMode} className={``}>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ position: 'fixed', top: 60, left: 10, zIndex: 999 }}>
          <CssBaseline />
          {open ? (
            <IconButton onClick={handleDrawerClose} edge="start" color="inherit" aria-label="close" sx={{ color: colors.text }}>
              <ChevronLeftIcon/>
            </IconButton>
          ) : (
            <IconButton onClick={handleDrawerOpen} edge="start" color="inherit" aria-label="open" sx={{ color: colors.text }}>
              <ChevronRightIcon />
            </IconButton>
          )}
        </Box>
        <SidebarCateWorkSpace open={open} handleDrawerClose={handleDrawerClose} />
        <Main open={open} sx={{ padding: 0 }}>
          <Settings />
        </Main>
      </Box>
    </div>
  )
}
