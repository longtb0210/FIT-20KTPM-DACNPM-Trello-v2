import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import { Box, Chip, Divider, Drawer } from '@mui/material'
import { IoMdClose } from 'react-icons/io'
import { useTheme } from '~/components/Theme/themeContext'
import Button from '@mui/material/Button'
import { LuPlus } from 'react-icons/lu'

const drawerWidth = 320

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
  marginTop: 12
}))

interface Props {
  open: boolean
  handleDrawerClose: () => void
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

const ChangeBackground: React.FC<Props> = ({ open, handleDrawerClose }) => {
  const { darkMode, colors } = useTheme()

  const [activeItem, setActiveItem] = useState<string | null>(null)

  // const handleItemClick = (item: string) => {
  //   setActiveItem(item)
  // }

  return (
    <div style={{ position: 'absolute' }}>
      <Drawer
        sx={{
          ...(open && { width: drawerWidth }),
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            marginTop: '53px',
            color: colors.text,
            paddingX: '20px',
            backgroundColor: colors.background
          },
          color: colors.text,
          backgroundColor: colors.background
        }}
        variant='persistent'
        anchor='right'
        open={open}
      >
        <DrawerHeader>
          <span className='text- w-[100%] rounded-md font-bold'>
            <div className='flex justify-center'>
              <h3>Change background</h3>
              <IoMdClose
                className='absolute right-3 cursor-pointer hover:text-gray-400'
                onClick={handleDrawerClose}
              ></IoMdClose>
            </div>
          </span>
        </DrawerHeader>
        <Divider />
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '20px' }}>Custom</h3>
        <Button
          component='label'
          startIcon={<LuPlus className='ml-2 text-[#69768C]' />}
          sx={{
            width: '157px',
            height: '96px',
            cursor: 'pointer',
            backgroundColor: '#F1F2F4',
            '&hover': {
              backgroundColor: '#C4C9D2'
            }
          }}
        >
          <VisuallyHiddenInput type='file' />
        </Button>
      </Drawer>
    </div>
  )
}

export default ChangeBackground
