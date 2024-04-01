import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Card,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Stack,
  Typography
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SelectMembers from './SelectMembers'
import { useTheme } from '../Theme/themeContext'

export default function Filter() {
  const { colors } = useTheme()
  return (
    <Box
      sx={{
        width: '384px',
        bgcolor: colors.backgroundSecond,
        color: colors.text,
        padding: '0'
      }}
    >
      <Box>
        <h3 className='flex justify-center'>Filter</h3>
      </Box>
      <Box>
        <Card
          sx={{
            width: '100%',
            bgcolor: colors.backgroundSecond,
            color: colors.text,
            border: 'none',
            boxShadow: 'none',
            marginTop: '10px',
            maxHeight: '75vh',
            overflowY: 'auto'
          }}
        >
          <Box>
            <Stack direction='row' alignItems='center'>
              <Typography component='div' sx={{ fontWeight: '400', fontSize: '14px', color: colors.text }}>
                Keyword
              </Typography>
            </Stack>
            <FormControl sx={{ width: '98%' }}>
              <input
                type='text'
                className={` rounded-[3px] border-[3px] border-[#8590A2] p-2 transition-all duration-100 active:scale-[0.98]`}
                placeholder='Enter key word...'
                style={{ backgroundColor: colors.backgroundSecond }}
              />
              <FormHelperText id='my-helper-text' sx={{ color: colors.text }}>
                Search cards, members, labels, and more.
              </FormHelperText>
            </FormControl>
          </Box>

          <Box className='mt-3'>
            <Stack direction='row' alignItems='center'>
              <Typography
                component='div'
                sx={{ fontWeight: '400', fontSize: '14px', color: colors.text, marginLeft: '10px' }}
              >
                Members
              </Typography>
            </Stack>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                flexDirection: 'column'
              }}
            >
              <Stack direction='row' alignItems='center'>
                <FormControlLabel
                  value='end'
                  control={<Checkbox sx={{ color: colors.text, marginLeft: '18px' }} />}
                  label=''
                  labelPlacement='end'
                />
                <Avatar sx={{ width: 24, height: 24, marginRight: 1 }} />
                <Typography
                  component='div'
                  sx={{ fontWeight: '400', fontSize: '14px', color: colors.text, marginLeft: '10px' }}
                >
                  No members
                </Typography>
              </Stack>
              <Stack direction='row' alignItems='center'>
                <FormControlLabel
                  value='end'
                  control={<Checkbox sx={{ color: colors.text, marginLeft: '18px' }} />}
                  label=''
                  labelPlacement='end'
                />
                <Avatar
                  alt='Remy Sharp'
                  src='/static/images/avatar/1.jpg'
                  sx={{ width: 24, height: 24, marginRight: 1 }}
                />
                <Typography
                  component='div'
                  sx={{ fontWeight: '400', fontSize: '14px', color: colors.text, marginLeft: '10px' }}
                >
                  Card assigned to me
                </Typography>
              </Stack>
              <Stack direction='row' alignItems='center' marginTop='3px'>
                <FormControlLabel
                  sx={{ marginRight: '0' }}
                  value='end'
                  control={<Checkbox sx={{ color: colors.text, marginLeft: '18px' }} />}
                  label=''
                  labelPlacement='end'
                />
                <SelectMembers />
              </Stack>
            </Box>
          </Box>

          <Box className='mt-3'>
            <Stack direction='row' alignItems='center'>
              <Typography
                component='div'
                sx={{ fontWeight: '400', fontSize: '14px', color: colors.text, marginLeft: '10px' }}
              >
                Due date
              </Typography>
            </Stack>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                flexDirection: 'column'
              }}
            >
              <FormControlLabel
                value='end'
                control={<Checkbox sx={{ color: colors.text, marginLeft: '18px' }} />}
                label='No dates'
                labelPlacement='end'
              />
              <FormControlLabel
                value='end'
                control={<Checkbox sx={{ color: colors.text, marginLeft: '18px' }} />}
                label='Overdue'
                labelPlacement='end'
              />
              <FormControlLabel
                value='end'
                control={<Checkbox sx={{ color: colors.text, marginLeft: '18px' }} />}
                label='Due in the next day'
                labelPlacement='end'
              />

              <Accordion sx={{ width: '100%', bgcolor: colors.backgroundSecond, color: colors.text }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1-content' id='panel1-header'>
                  <Typography className='w-[230px]'>Show more options</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FormControlLabel
                    value='end'
                    control={<Checkbox sx={{ color: colors.text }} />}
                    label='Due in the next week'
                    labelPlacement='end'
                  />
                  <FormControlLabel
                    value='end'
                    control={<Checkbox sx={{ color: colors.text }} />}
                    label='Due in the next month'
                    labelPlacement='end'
                  />
                  <FormControlLabel
                    value='end'
                    control={<Checkbox sx={{ color: colors.text }} />}
                    label='Marked as complete'
                    labelPlacement='end'
                  />
                  <FormControlLabel
                    value='end'
                    control={<Checkbox sx={{ color: colors.text }} />}
                    label='Not marked as complete'
                    labelPlacement='end'
                  />
                </AccordionDetails>
              </Accordion>
            </Box>
          </Box>
        </Card>
      </Box>
    </Box>
  )
}
