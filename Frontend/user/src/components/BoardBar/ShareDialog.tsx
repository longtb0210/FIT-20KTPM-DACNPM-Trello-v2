import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Box from '@mui/material/Box'
import { FormControl } from '@mui/base/FormControl/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import { useTheme } from '../Theme/themeContext'

interface Props {
  open: boolean
  handleCloseShare: () => void
}

export default function ShareDialog({ open, handleCloseShare }: Props) {
  const { colors } = useTheme()
  return (
    <Dialog open={open} onClose={handleCloseShare} aria-labelledby='alert-dialog-title'>
      <DialogTitle id='alert-dialog-title'>{'Share board'}</DialogTitle>
      <DialogContent>
        <Box sx={{ width: '520px' }}>
          <FormControl className='w-[98%]'>
            <input
              type='text'
              className={`h-7 w-[342px] rounded-[3px] border-[3px] border-[#8590A2] p-2 py-5 transition-all duration-100 active:scale-[0.98]`}
              placeholder='Email address or name'
              style={{ backgroundColor: colors.backgroundSecond }}
            />
            <select
              style={{
                width: '100px',
                height: '45px',
                borderRadius: '3px',
                border: '1px solid #ccc',
                backgroundColor: 'white',
                padding: '5px 5px',
                marginLeft: '5px'
              }}
            >
              <option value='member'>Member</option>
            </select>
            <Button
              sx={{
                width: '50px',
                height: '45px',
                marginLeft: '6px',
                marginBottom: '2px',
                bgcolor: 'blue',
                color: 'white'
              }}
            >
              Share
            </Button>
            <FormHelperText id='my-helper-text' sx={{ color: colors.text }}>
              Search cards, members, labels, and more.
            </FormHelperText>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseShare} color='primary'>
          Disagree
        </Button>
      </DialogActions>
    </Dialog>
  )
}
