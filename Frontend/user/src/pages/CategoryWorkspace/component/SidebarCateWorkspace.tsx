import React, { useState } from 'react'
import { styled, useTheme as useMuiTheme} from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Box, Button, Typography } from '@mui/material'
import {faTrello } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faGear, faUserGroup, faTableCellsLarge, faTableColumns } from '@fortawesome/free-solid-svg-icons'
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar'
import { Divider, Drawer } from '@mui/material'
import { faCalendarDays } from '@fortawesome/free-regular-svg-icons'
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useTheme as useCustomTheme } from '~/components/Theme/themeContext'
import { Link } from 'react-router-dom'

const drawerWidth = 250

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

const SidebarCateWorkSpace: React.FC<Props> = ({ open, handleDrawerClose }) => {
  const theme = useMuiTheme()
  const { darkMode, colors } = useCustomTheme()

  const [activeItem, setActiveItem] = useState<string | null>(null);

  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  return (
    <div className='sidebar-cate-workspace' style={{ position: 'relative', height: 'calc(100vh - 64px)'}}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            marginTop: '51px',
            backgroundColor: colors.background,
            color: colors.text
          }
        }}
        variant='persistent'
        anchor='left'
        open={open}
      >
        <DrawerHeader>
          <div className='flex items-center'>
            <span className='rounded-md font-bold'>
              <div className='flex items-center text-sm'>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px',
                  cursor: 'pointer',
                }}
              >
                <Typography
                  variant='h4'
                  sx={{
                    display: 'inline-block',
                    fontSize: '20px',
                    fontWeight: 700,
                    padding: '8px 14px',
                    borderRadius: '6px',
                    backgroundImage: 'linear-gradient(to bottom, #E774BB, #943D73)'
                  }}
                >
                  Â
                </Typography>
              </Box>
                <div className='cursor-pointer'>
                  Âu Hồng Minh's workspace
                  <div className='text-xs font-normal'>Free</div>
                </div>
              </div>
            </span>
          </div>
          <IconButton 
            onClick={handleDrawerClose}
            sx={{color: colors.text}}
          >
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <Sidebar className='text-sm'>
          <Menu>
            <Link to={'/workspaceboard'}>
              <MenuItem className='menu-item rounded-md' 
                style={{ height: '40px', backgroundColor: activeItem === 'boards' ? colors.bg_button_active_hover : colors.background }}
                onClick={() => handleItemClick('boards')}>
                  <div className='flex items-center'>
                    <FontAwesomeIcon icon={faTrello} fontSize='small' className='mr-2'/>
                    Boards
                  </div>
              </MenuItem>
            </Link>
            <Link to={'/workspace/1/members'}>
              <MenuItem 
                style={{ height: '40px', backgroundColor: activeItem === 'members' ? colors.bg_button_active_hover : colors.background }}
                onClick={() => handleItemClick('members')}
              >
                <div className='flex w-full items-center justify-between'>
                    <div className='flex items-center'>
                      <FontAwesomeIcon icon={faUserGroup} fontSize='small' className='mr-2'/>
                      Members
                    </div>
                </div>
              </MenuItem>
            </Link>
            <Link to={'/workspaceSetting'}>
              <MenuItem 
                style={{ height: '40px', backgroundColor: activeItem === 'settings' ? colors.bg_button_active_hover : colors.background }}
                onClick={() => handleItemClick('settings')}
              >
                  <div className='flex items-center'>
                    <FontAwesomeIcon icon={faGear} fontSize='small' className='mr-2'/>
                    <div>Workspace settings</div>
                  </div>
              </MenuItem>
            </Link>
          </Menu>
        </Sidebar>

        <h2 className='my-2 pl-5 text-sm font-medium leading-6 text-ds-text overflow-hidden whitespace-nowrap'>
          Workspaces
        </h2>

        <Sidebar className='workspaces text-sm'>
          <div>
            <Menu>
              <MenuItem
                className='menu-item'
                style={{ height: '40px', fontStyle: 'italic', backgroundColor: activeItem === 'table' ? colors.bg_button_active_hover : colors.background }}
                onClick={() => handleItemClick('table')}
              >
                <div className='flex items-center'>
                  <FontAwesomeIcon icon={faTableCellsLarge} fontSize='small' className='mr-2'/>
                  Table
                </div>
              </MenuItem>

              <MenuItem
                className='menu-item'
                style={{ height: '40px', fontStyle: 'italic', backgroundColor: activeItem === 'calendar' ? colors.bg_button_active_hover : colors.background }}
                onClick={() => handleItemClick('calendar')}
              >
                <div className='flex items-center'>
                  <FontAwesomeIcon icon={faCalendarDays} fontSize='small' className='mr-2'/>
                  Calendar
                </div>
              </MenuItem>
            </Menu>
          </div>
        </Sidebar>

        <div
          className='flex w-full items-center justify-between'
        >
          <h2 className='my-2 pl-5 text-sm font-medium leading-6 text-ds-text overflow-hidden whitespace-nowrap'>
            Your boards
          </h2>
        </div>

        <Sidebar className='workspaces mb-10 text-sm'>
          <div>
            <Menu>
              <MenuItem
                className='menu-item'
                style={{ height: '40px', backgroundColor: activeItem === 'board' ? colors.bg_button_active_hover : colors.background }}
                onClick={() => handleItemClick('board')}
              >
                <div className='flex items-center'>
                <FontAwesomeIcon icon={faTableColumns} fontSize='small' className='mr-2'/>
                  Project
                </div>
              </MenuItem>
            </Menu>
          </div>
        </Sidebar>

        <div 
          className='p-3 flex justify-center items-end border-t border-grey-50'
          style={{ zIndex: 100, position: 'absolute', bottom: 40, left: 0, right: 0 }}
        >
          <Button 
            className='flex w-full'
            sx={{
              backgroundImage: 'linear-gradient(97.78deg, var(--ds-background-accent-purple-bolder, #5a3aad) 10.5%, var(--ds-background-accent-magenta-subtle, #c36dd1) 113.39%)',
              transition: 'background-color 0.3s',
              color: colors.white,
              fontSize: '0.8rem',
              alignItems: 'left',
              justifyContent: 'flex-start',
              '&:hover': {
                backgroundImage: 'linear-gradient(97.78deg, #1e3a8a 10.5%, #8e24aa 113.39%)',
              }
            }}
          >
          <FileUploadIcon className='mr-2' fontSize='small'/>
          <div className='font-sans leading-5'>
            <span className="capitalize">upgrade </span> 
            <span className="lowercase">to</span>
            <span className="capitalize"> premium</span>
          </div>
          </Button>
        </div>
      </Drawer>
    </div>
  )
}

export default SidebarCateWorkSpace
