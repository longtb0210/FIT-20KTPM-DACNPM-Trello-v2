import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import { faTrello } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar'
import { Divider, Drawer } from '@mui/material'
import { IoMdClose } from 'react-icons/io'
import { useTheme } from '../Theme/themeContext'
import { faBoxArchive, faCopy, faEye, faList, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import ChangeBackground from './ConponentMoreMenu/ChangeBackground'

const drawerWidth =320

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

const MoreMenu: React.FC<Props> = ({ open, handleDrawerClose }) => {
  const { darkMode, colors } = useTheme()
  const [isOpenChangeBg, setOpenBg] = React.useState(false)
  const handleChangeBgClose = () => {
    setOpenBg(false)
  }
  const handleChangeBgOpen = () => {
    setOpenBg(true)
  }
  
  const [activeItem, setActiveItem] = useState<string | null>(null)

  // const handleItemClick = (item: string) => {
  //   setActiveItem(item)
  // }

  return (
    <div style={{ position: 'relative' }}>
      <Drawer
        sx={{
          ...(open && { width: drawerWidth, paddingX: '20px' }),
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            marginTop: '53px',
            color: colors.text,
            backgroundColor: colors.background,
          },
          color: colors.text,
          backgroundColor: colors.background,
        }}
        variant='persistent'
        anchor='right'
        open={open}
      >
        <DrawerHeader>
          <span className='text- w-[100%] rounded-md font-bold'>
            <div className='flex justify-center'>
              <h3>Menu</h3>
              <IoMdClose
                className='absolute right-3 cursor-pointer hover:text-gray-400'
                onClick={handleDrawerClose}
              ></IoMdClose>
            </div>
          </span>
        </DrawerHeader>
        <Divider />

        <Sidebar width='100%' className='text-sm'>
          <Menu>
            <MenuItem
              className={`menu-item h-10 bg-[${colors.background}] text-[${colors.text}] hover:bg-gray-500`}
              // onClick={() => handleItemClick('boards')}
            >
              <div className='flex items-center'>
                <FontAwesomeIcon icon={faList} fontSize='small' className='mr-2' />
                Activity
              </div>
            </MenuItem>
          </Menu>
          <Menu>
            <MenuItem
              className={`menu-item h-10 bg-[${colors.background}] text-[${colors.text}] hover:bg-gray-500`}
            >
              <div className='flex items-center'>
                <FontAwesomeIcon icon={faBoxArchive} fontSize='small' className='mr-2'/>
                Archived items
              </div>
            </MenuItem>
          </Menu>
          <Divider />
          <Menu>
            <MenuItem
              className={`menu-item h-10 bg-[${colors.background}] text-[${colors.text}] hover:bg-gray-500`}
              // onClick={() => handleItemClick('boards')}
              onClick={handleChangeBgOpen}
            >
              <div className='flex items-center'>
                <span style={{width: '20px', height: '20px',backgroundSize: 'cover', borderRadius: '3px', backgroundPosition:'50%' , backgroundImage: 'url(	https://trello-backgrounds.s3.amazonaws.com/Shared…3a8a56e787a3/photo-1707588883437-9b3709880e3b.jpg)'}}>
                </span>
                ChangeBackground
              </div>
            </MenuItem>
          </Menu>
          <Menu>
            <MenuItem
              className={`menu-item h-10 bg-[${colors.background}] text-[${colors.text}] hover:bg-gray-500`}
              // onClick={() => handleItemClick('boards')}
            >
              <div className='flex items-center'>
                <FontAwesomeIcon icon={faTrello} fontSize='small' className='mr-2' />
                Custom feilds
              </div>
            </MenuItem>
          </Menu>
          <Divider />
          <Menu>
            <MenuItem
              className={`menu-item h-10 bg-[${colors.background}] text-[${colors.text}] hover:bg-gray-500`}
              // onClick={() => handleItemClick('boards')}
            >
              <div className='flex items-center'>
                <FontAwesomeIcon icon={faEye} fontSize='small' className='mr-2'/>
                Watch
              </div>
            </MenuItem>
          </Menu>
          <Menu>
            <MenuItem
              className={`menu-item h-10 bg-[${colors.background}] text-[${colors.text}] hover:bg-gray-500`}
              // onClick={() => handleItemClick('boards')}
            >
              <div className='flex items-center'>
                <FontAwesomeIcon icon={faCopy} fontSize='small' className='mr-2'/>          
                Copy board
              </div>
            </MenuItem>
          </Menu>
          <Menu>
            <MenuItem
              className={`menu-item h-10 bg-[${colors.background}] text-[${colors.text}] hover:bg-gray-500`}
              // onClick={() => handleItemClick('boards')}
            >
              <div className='flex items-center'>
                <FontAwesomeIcon icon={faRightFromBracket} fontSize='small' className='mr-2'/>
                Leave board
              </div>
            </MenuItem>
          </Menu>
        </Sidebar>
      </Drawer>
      <ChangeBackground open={isOpenChangeBg} handleDrawerClose={handleChangeBgClose}/>
    </div>
  )
}

export default MoreMenu
