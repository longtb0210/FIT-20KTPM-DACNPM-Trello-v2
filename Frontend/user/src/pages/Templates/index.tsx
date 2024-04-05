import SidebarTemplate from '../../components/SidebarTemplate'
import CardTemplate from '../Templates/component/CardTemplate'
import { useTheme } from '../../components/Theme/themeContext'
import { Box, Grid } from '@mui/material'

export function Templates() {
  const { darkMode, colors } = useTheme();
  return (
    <Box sx={{ bgcolor: colors.background }} className='flex items-center justify-center'>
      <Grid container sx={{ maxWidth: 1152 }}>
        <Grid xs={3} sx={{ paddingLeft: '28px' }}>
          <SidebarTemplate />
        </Grid>
        <Grid xs={9} sx={{ paddingLeft: '25px' }}>
          <CardTemplate />
        </Grid>
      </Grid>
    </Box>
  )
}
