import { Box, Checkbox, FormGroup } from '@mui/material'
import { TbBrandTrello } from 'react-icons/tb'
import { FaTable } from 'react-icons/fa'
import { GrFormSchedule } from 'react-icons/gr'
import { MdOutlineViewTimeline } from 'react-icons/md'
import { useTheme } from '../Theme/themeContext'

export default function CustomizeViews() {
  const { colors } = useTheme()
  return (
    <Box
      sx={{
        width: '304px',
        bgcolor: colors.backgroundSecond
      }}
    >
      <Box className='mb-1' sx={{ color: colors.text }}>
        <h3 className='flex justify-center'>Upgrade for veiws</h3>
      </Box>
      <Box>
        <FormGroup>
          <Box
            sx={{
              color: colors.text,
              cursor: 'pointer',
              display: 'flex',
              borderRadius: '5px',
              alignItems: 'center',
              '&:hover': {
                bgcolor: 'rgba(72, 72, 78, 0.3)'
              }
            }}
          >
            <Checkbox sx={{ color: colors.text }} />
            <TbBrandTrello color={colors.text} className='mr-1 text-[22px] text-black' />
            <p className='font-normal  '>Board</p>
          </Box>
          <Box
            sx={{
              cursor: 'pointer',
              display: 'flex',
              borderRadius: '5px',
              alignItems: 'center',
              '&:hover': {
                bgcolor: 'rgba(72, 72, 78, 0.3)'
              }
            }}
          >
            <Checkbox sx={{ color: colors.text }} />
            <FaTable color={colors.text} className='ml-[4px] mr-2 text-lg font-semibold text-black' />
            <p className='font-normal' style={{ color: colors.text }}>
              Table
            </p>
          </Box>

          <Box
            sx={{
              cursor: 'pointer',
              display: 'flex',
              borderRadius: '5px',
              alignItems: 'center',
              '&:hover': {
                bgcolor: 'rgba(72, 72, 78, 0.3)'
              }
            }}
          >
            <Checkbox sx={{ color: colors.text }} />
            <GrFormSchedule size='25px' color={colors.text} className='mr-[2px] text-[20px] text-black' />
            <p className='font-normal' style={{ color: colors.text }}>
              Calender
            </p>
          </Box>

          <Box
            sx={{
              cursor: 'pointer',
              display: 'flex',
              borderRadius: '5px',
              alignItems: 'center',
              '&:hover': {
                bgcolor: 'rgba(72, 72, 78, 0.3)'
              }
            }}
          >
            <Checkbox sx={{ color: colors.text }} />
            <MdOutlineViewTimeline
              size={20}
              color={colors.text}
              className='ml-[3px] mr-[2px] text-lg font-black text-black'
            />
            <p className='font-normal' style={{ color: colors.text }}>
              TimeLine
            </p>
          </Box>
        </FormGroup>
      </Box>
    </Box>
  )
}
