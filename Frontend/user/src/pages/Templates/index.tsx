import React from 'react'
import SidebarTemplate from '../../components/SidebarTemplate'
import { useTheme } from '../../components/Theme/themeContext'
import { Box, Grid } from '@mui/material'

interface PageWithSidebarProps {
  children: React.ReactNode;
}

const PageWithSidebar: React.FC<PageWithSidebarProps> = ({ children }) => {
  const { darkMode, colors } = useTheme()
  return (
    <Box sx={{ bgcolor: colors.background }} className='flex items-center justify-center'>
      <Grid container>
        <Grid item xs={3} style={{ paddingLeft: '15vw' }}>
          <SidebarTemplate />
        </Grid>
        <Grid item xs={9} style={{ overflowY: 'auto', paddingLeft: '5vw' }}>
          {children}
        </Grid>
      </Grid>
    </Box>
  )
}

export default PageWithSidebar
