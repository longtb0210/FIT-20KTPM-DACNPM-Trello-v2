import React, { useEffect, useState } from 'react'

import { Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import { Box, Typography } from '@mui/material'
import {faTrello } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom'
import { WorkspaceApiRTQ } from '~/api'
import {faChessBoard, faGear, faTableCells, faUserGroup, faHome } from '@fortawesome/free-solid-svg-icons'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import { useTheme } from './Theme/themeContext'

const menuItems = [
  'Business',
  'Design',
  'Education',
  'Engineering',
  'Marketing',
  'HR & Operations',
  'Personal',
  'Productivity',
  'Product management',
  'Project management',
  'Remote work',
  'Sales',
  'Support',
  'Team management'
];

function SidebarTemplate() {
  const [getAllWorkspace, { data: workspaceData }] = WorkspaceApiRTQ.WorkspaceApiSlice.useLazyGetAllWorkspaceQuery()

  const [activeItem, setActiveItem] = useState<string | null>(null)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const { darkMode, colors } = useTheme()

  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  const handleMouseEnter = (itemKey: string) => {
    setHoveredItem(itemKey);
  };
  
  const handleMouseLeave = () => {
    setHoveredItem(null);
  };
  
  const menuItemsJSX = menuItems.map((item, index) => (
    <MenuItem
      key={index}
      style={{ 
        height: '32px', 
        backgroundColor: 
          hoveredItem === item ? colors.bg_button_hover :
          activeItem === item ? colors.bg_button_active_hover : colors.background,
      }}
      onClick={() => handleItemClick(item)}
      onMouseEnter={() => handleMouseEnter(item)}
      onMouseLeave={() => handleMouseLeave()}
    >
      {item}
    </MenuItem>
  ));

  React.useEffect(() => {
    getAllWorkspace().then((v) => console.log(v))
  }, [])

  return (
    <div 
    className='detail-sidebar-container fixed pl-20 pt-2 max-h-95vh max-h-screen overflow-y-auto text-sm' style={{ width: '20vw' }}>
      <Menu  style={{backgroundColor: colors.background, color: colors.text}}>
        <MenuItem
          className='menu-item rounded-md font-bold'
          style={{
            height: '32px', 
            backgroundColor: 
              hoveredItem === 'boards' ? colors.bg_button_hover :
              activeItem === 'boards' ? colors.bg_button_active_hover : colors.background
          }}
          onClick={() => handleItemClick('boards')}
          onMouseEnter={() => handleMouseEnter('boards')}
          onMouseLeave={() => handleMouseLeave()}
        >
          <Link to={'/board/1'}>
            <div className='flex items-center'>
              <FontAwesomeIcon icon={faTrello} fontSize='small' className='mr-2'/>
              Boards
            </div>
          </Link>
        </MenuItem>
        <SubMenu
          label={
            <span className='menu-item rounded-md font-bold'>
              <Link to={'/template'}>
                <div className='flex items-center'>
                  <FontAwesomeIcon icon={faChessBoard} fontSize='small' className='mr-2'/>
                  Templates
                </div>
              </Link>
            </span>
          }
          style={{
             height: '32px',
            backgroundColor: 
              hoveredItem === 'templates' ? colors.bg_button_hover :
              activeItem === 'templates' ? colors.bg_button_active_hover : colors.background
          }}
          onClick={() => handleItemClick('templates')}
          onMouseEnter={() => handleMouseEnter('templates')}
          onMouseLeave={() => handleMouseLeave()}
        >
          {menuItemsJSX}
        </SubMenu>
        <MenuItem
          className='menu-item home border-b-3 rounded-md font-bold'
          style={{
            height: '32px',
            backgroundColor: 
              hoveredItem === 'home' ? colors.bg_button_hover :
              activeItem === 'home' ? colors.bg_button_active_hover : colors.background
        }}
          onClick={() => handleItemClick('home')}
          onMouseEnter={() => handleMouseEnter('home')}
          onMouseLeave={() => handleMouseLeave()}
        >
          <Link to={'/'}>
            <div className='flex items-center'>
            <FontAwesomeIcon icon={faHome} fontSize='small' className='mr-2'/>
              Home
            </div>
          </Link>
        </MenuItem>
      </Menu>
      <h2 
        className='my-2 pl-5 text-sm font-medium leading-6 text-ds-text overflow-hidden whitespace-nowrap'
        style={{color: colors.text}}
      >
        Workspaces
      </h2>
    
      <div 
        className='workspaces' 
        style={{backgroundColor: colors.background, color: colors.text, marginBottom: '100px'}}
      >
        {workspaceData?.data?.owner.map((w, index) => (
          <div key={index}>
            <Menu>
              <SubMenu
                label={
                  <span className='rounded-md font-bold'>
                    <div className='flex items-center'>
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
                        {w.name.charAt(0)}
                      </Typography>
                    </Box>
                      {w.name}
                    </div>
                  </span>
                }
                style={{ 
                  marginBottom: '4px',
                  height: '50px',
                  backgroundColor:
                    hoveredItem === 'workspace' ? colors.bg_button_hover : 
                    activeItem === 'workspace' ? colors.bg_button_active_hover : colors.background
                }}
                onClick={() => handleItemClick('workspace')}
                onMouseEnter={() => handleMouseEnter('workspace')}
                onMouseLeave={() => handleMouseLeave()}
              >
                <Link to={`/workspaceboard`}>
                  <MenuItem 
                    style={{
                      height: '32px', 
                      paddingLeft: '50px',
                      backgroundColor: 
                        hoveredItem === 'board' ? colors.bg_button_hover : 
                        activeItem === 'board' ? colors.bg_button_active_hover : colors.background 
                    }}
                    onClick={() => handleItemClick('board')}
                    onMouseEnter={() => handleMouseEnter('board')}
                    onMouseLeave={() => handleMouseLeave()}
                  >
                    <div className='flex items-center'>
                      <FontAwesomeIcon icon={faTrello} fontSize='small' className='mr-2'/>
                      Boards
                    </div>
                  </MenuItem>
                </Link>
                <Link to={`/`}>
                  <MenuItem 
                    style={{
                      height: '32px', 
                      paddingLeft: '50px',
                      backgroundColor: 
                        hoveredItem === 'highlights' ? colors.bg_button_hover : 
                        activeItem === 'highlights' ? colors.bg_button_active_hover : colors.background 
                    }}
                    onClick={() => handleItemClick('highlights')}
                    onMouseEnter={() => handleMouseEnter('highlights')}
                    onMouseLeave={() => handleMouseLeave()}
                  >
                    <div className='flex items-center'>
                      <FontAwesomeIcon icon={faHeart} fontSize='small' className='mr-2'/>
                      Highlights
                    </div>
                  </MenuItem>
                </Link>
                <Link to={`/`}>
                  <MenuItem 
                    style={{
                      height: '32px', 
                      paddingLeft: '50px',
                      backgroundColor: 
                        hoveredItem === 'views' ? colors.bg_button_hover : 
                        activeItem === 'views' ? colors.bg_button_active_hover : colors.background 
                    }}
                    onClick={() => handleItemClick('views')}
                    onMouseEnter={() => handleMouseEnter('views')}
                    onMouseLeave={() => handleMouseLeave()}
                  >
                    <div className='flex items-center'>
                      <FontAwesomeIcon icon={faTableCells} fontSize='small' className='mr-2'/>
                      Views
                    </div>
                  </MenuItem>
                </Link>
                <Link to={`/workspace/${w._id}/members`}>
                  <MenuItem 
                    style={{
                      height: '32px', 
                      paddingLeft: '50px',
                      backgroundColor: 
                        hoveredItem === 'members' ? colors.bg_button_hover : 
                        activeItem === 'members' ? colors.bg_button_active_hover : colors.background 
                    }}
                    onClick={() => handleItemClick('members')}
                    onMouseEnter={() => handleMouseEnter('members')}
                    onMouseLeave={() => handleMouseLeave()}
                  >
                    <div className='flex items-center'>
                      <FontAwesomeIcon icon={faUserGroup} fontSize='small' className='mr-2'/>
                      Members
                    </div>
                  </MenuItem>
                </Link>
                <Link to={`/workspaceSetting`}>
                  <MenuItem 
                    style={{
                      height: '32px', 
                      paddingLeft: '50px',
                      backgroundColor: 
                        hoveredItem === 'setting' ? colors.bg_button_hover : 
                        activeItem === 'setting' ? colors.bg_button_active_hover : colors.background 
                    }}
                    onClick={() => handleItemClick('setting')}
                    onMouseEnter={() => handleMouseEnter('setting')}
                    onMouseLeave={() => handleMouseLeave()}
                  >
                    <div className='flex items-center'>
                      <FontAwesomeIcon icon={faGear} fontSize='small' className='mr-2'/>
                      Setting
                    </div>
                  </MenuItem>
                </Link>
              </SubMenu>
            </Menu>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SidebarTemplate
