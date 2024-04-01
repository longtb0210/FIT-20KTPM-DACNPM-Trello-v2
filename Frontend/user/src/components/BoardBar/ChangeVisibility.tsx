import { Box, Card, Stack, Typography } from '@mui/material'
import { MdOutlineLock } from 'react-icons/md'
import { MdGroups2 } from 'react-icons/md'
import { MdPublic } from 'react-icons/md'
import { useTheme } from '../Theme/themeContext'

interface ChangeVisibilityProps {
  onVisibilityChange: (visibility: string) => void
}

export default function ChangeVisibility({ onVisibilityChange }: ChangeVisibilityProps) {
  const { colors } = useTheme()
  return (
    <Box
      sx={{
        color: colors.text,
        bgcolor: colors.backgroundSecond,
        width: '384px'
      }}
    >
      <Box>
        <h3 className='flex justify-center'>Change Visibility</h3>
      </Box>
      <Box>
        <Card
          sx={{
            color: colors.text,
            bgcolor: colors.backgroundSecond,
            width: '100%',
            border: 'none',
            boxShadow: 'none',
            cursor: 'pointer',
            marginTop: '10px',
            '&:hover': {
              bgcolor: 'rgba(72, 72, 78, 0.3)'
            }
          }}
          onClick={() => onVisibilityChange('private')}
        >
          <Box sx={{ px: 1, py: 1, color: colors.text }}>
            <Stack direction='row' alignItems='center'>
              <MdOutlineLock className='mr-1' />
              <Typography component='div' sx={{ fontWeight: '400', fontSize: '14px' }}>
                Private
              </Typography>
            </Stack>
            <Typography color='text.secondary' variant='body2' sx={{ fontSize: '13px', color: colors.text }}>
              Only board members can see and edit this board.
            </Typography>
          </Box>
        </Card>
        <Card
          sx={{
            width: '100%',
            border: 'none',
            boxShadow: 'none',
            color: colors.text,
            bgcolor: colors.backgroundSecond,
            cursor: 'pointer',
            '&:hover': {
              bgcolor: 'rgba(72, 72, 78, 0.3)'
            }
          }}
          onClick={() => onVisibilityChange('workspace')}
        >
          <Box sx={{ px: 1, py: 1 }}>
            <Stack direction='row' alignItems='center'>
              <MdGroups2 className='mr-1' />
              <Typography component='div' sx={{ fontWeight: '400', fontSize: '14px', color: colors.text }}>
                WorkSpace
              </Typography>
            </Stack>
            <Typography color='text.secondary' variant='body2' sx={{ fontSize: '13px', color: colors.text }}>
              All members of the Âu Hồng Minh's workspace Workspace can see and edit this board.
            </Typography>
          </Box>
        </Card>
        <Card
          sx={{
            width: '100%',
            border: 'none',
            boxShadow: 'none',
            cursor: 'pointer',
            color: colors.text,
            bgcolor: colors.backgroundSecond,
            '&:hover': {
              bgcolor: 'rgba(72, 72, 78, 0.3)'
            }
          }}
          onClick={() => onVisibilityChange('public')}
        >
          <Box sx={{ px: 1, py: 1 }}>
            <Stack direction='row' alignItems='center'>
              <MdPublic className='mr-1' />
              <Typography component='div' sx={{ fontWeight: '400', fontSize: '14px' }}>
                Public
              </Typography>
            </Stack>
            <Typography color='text.secondary' variant='body2' sx={{ fontSize: '13px', color: colors.text }}>
              Anyone on the internet can see this board. Only board members can edit.
            </Typography>
          </Box>
        </Card>
      </Box>
    </Box>
  )
}
