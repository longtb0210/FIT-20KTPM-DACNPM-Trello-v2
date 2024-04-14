import SidebarCateWorkSpace from './component/SidebarCateWorkspace'
import React from 'react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import BoardBar from './../../components/BoardBar/BoardBar'
import { Board } from '../Board'

const drawerWidth = 250

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}))

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

export function CategoryWorkspace() {
  const [open, setOpen] = React.useState(true)

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  return (
    <div className={`overflow-auto`}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
          position='fixed'
          open={open}
          className='mt-[51px]'
          sx={{ backgroundColor: 'rgba(54, 55, 61, 0.9)', zIndex: 100 }}
        >
          <Toolbar sx={{ backgroundColor: 'transparent' }}>
            <IconButton
              color='inherit'
              aria-label='open drawer'
              onClick={handleDrawerOpen}
              edge='start'
              sx={{ mr: 2, ...(open && { display: 'none' }) }}
            >
              <div className='relative'>
                <div
                  style={{
                    borderRadius: '50%',
                    border: '2px solid #888',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <ChevronRightIcon className='h-6 w-6' />
                </div>
              </div>
            </IconButton>
            <BoardBar />
          </Toolbar>
        </AppBar>
        <SidebarCateWorkSpace open={open} handleDrawerClose={handleDrawerClose} />
        <Main open={open} sx={{ padding: 0 }}>
          <Board />
        </Main>
      </Box>
    </div>
  )
}
