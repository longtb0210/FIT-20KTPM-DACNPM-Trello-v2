import * as React from 'react'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import ListItemText from '@mui/material/ListItemText'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Checkbox from '@mui/material/Checkbox'
import Avatar from '@mui/material/Avatar'
import { useTheme } from '../Theme/themeContext'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder'
]

export default function SelectMembers() {
  const [personName, setPersonName] = React.useState<Array<string>>([])
  const { colors } = useTheme()

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value }
    } = event
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    )
  }

  return (
    <div>
      <FormControl sx={{ m: 1, width: '320px', bgcolor: colors.background }}>
        <InputLabel id='demo-multiple-checkbox-label' sx={{ fontSize: '14px', top: '-5px', color: colors.text }}>
          Select members
        </InputLabel>
        <Select
          labelId='demo-multiple-checkbox-label'
          id='demo-multiple-checkbox'
          multiple
          size='small'
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput sx={{}} label='Select members' />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
          style={{ backgroundColor: colors.backgroundSecond, color: colors.text }}
        >
          {names.map((name: string) => (
            <MenuItem
              sx={{ height: '36px', backgroundColor: colors.backgroundSecond, color: colors.text }}
              key={name}
              value={name}
            >
              <Checkbox sx={{ color: colors.text }} checked={personName.indexOf(name) > -1} />
              <Avatar alt={name} src='/static/images/avatar/1.jpg' sx={{ width: 24, height: 24, marginRight: 1 }} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}
