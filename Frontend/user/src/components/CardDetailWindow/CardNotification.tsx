import { faCheck, faEye } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Tooltip } from '@mui/material'
import { useTheme } from '../Theme/themeContext'

interface CardNotificationProps {
  isWatching: boolean
  handleWatching: () => void
}

export default function CardNotification({ isWatching, handleWatching }: CardNotificationProps) {
  const { colors } = useTheme()
  const tipIsWatching = 'You are receiving notifactions for updates on this card (click to stop watching)'
  const tipNotWatching = 'Watch to get notifactions for updates on this card'

  function handleCheckboxClick() {
    handleWatching()
  }

  return (
    <Tooltip
      title={isWatching ? tipIsWatching : tipNotWatching}
      placement='bottom-start'
      slotProps={{
        popper: {
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, -10]
              }
            }
          ]
        }
      }}
    >
      <Box sx={{ margin: '10px 20px 0 0' }}>
        <h2 style={{ color: colors.text }} className='mb-2 text-xs font-bold'>
          Notifications
        </h2>
        <Box
          sx={{
            width: 'fit-content',
            height: 32,
            bgcolor: colors.button,
            padding: '0px 4px 0 12px',
            color: colors.text,
            '&:hover': {
              bgcolor: colors.button_hover
            }
          }}
          className='flex cursor-pointer flex-row flex-wrap items-center gap-2 rounded'
          onClick={handleCheckboxClick}
        >
          <FontAwesomeIcon icon={faEye} style={{ width: 16, height: 16 }} />
          <p style={{ marginRight: 8 }} className='text-sm font-semibold'>
            {isWatching === true ? 'Watching' : 'Watch'}
          </p>
          {isWatching === true && (
            <Box
              sx={{ width: 28, height: 24, bgcolor: '#626f86', color: '#fff' }}
              className='flex items-center justify-center rounded'
            >
              <FontAwesomeIcon icon={faCheck} />
            </Box>
          )}
        </Box>
      </Box>
    </Tooltip>
  )
}
