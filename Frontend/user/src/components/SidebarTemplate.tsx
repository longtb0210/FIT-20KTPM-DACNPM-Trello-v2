import React, { useState } from 'react'
import { Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import { Box, Typography } from '@mui/material'
import { faTrello } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, useLocation } from 'react-router-dom'
import { WorkspaceApiRTQ } from '~/api'
import { faChessBoard, faGear, faTableCells, faUserGroup, faHome } from '@fortawesome/free-solid-svg-icons'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import { useTheme } from './Theme/themeContext'
import { handleWorkspaceName } from '../utils/handleWorkspaceName'
import { stringToColor } from '~/utils/StringToColor'

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
]

const SidebarTemplate = () => {
  const [getAllWorkspace, { data: workspaceData }] = WorkspaceApiRTQ.WorkspaceApiSlice.useLazyGetAllUserWorkspaceQuery()
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const { colors } = useTheme()
  const location = useLocation()

  const handleMouseEnter = (itemKey: string) => {
    setHoveredItem(itemKey)
  }

  const handleMouseLeave = () => {
    setHoveredItem(null)
  }

  const menuItemsJSX = menuItems.map((item, index) => (
    <MenuItem
      key={index}
      style={{
        height: '32px',
        backgroundColor:
          hoveredItem === item
            ? colors.bg_button_hover
            : activeItem === `/template/item`
              ? colors.bg_button_active_hover
              : colors.background
      }}
      onMouseEnter={() => handleMouseEnter(item)}
      onMouseLeave={() => handleMouseLeave()}
    >
      {item}
    </MenuItem>
  ))

  React.useEffect(() => {
    const targetPaths = [`/boards`, `/template`, `/template/item`, `/`]

    if (targetPaths.includes(location.pathname)) {
      setActiveItem(location.pathname)
    }
    getAllWorkspace()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  return (
    <div className='detail-sidebar-container max-h-95vh fixed max-h-screen overflow-y-auto pt-2 text-sm'>
      <Menu style={{ backgroundColor: colors.background, color: colors.text }}>
        <MenuItem
          className='menu-item rounded-md font-bold'
          style={{
            height: '32px',
            backgroundColor:
              hoveredItem === 'boards'
                ? colors.bg_button_hover
                : activeItem === `/boards`
                  ? colors.bg_button_active_hover
                  : colors.background
          }}
          onMouseEnter={() => handleMouseEnter('boards')}
          onMouseLeave={() => handleMouseLeave()}
        >
          <Link to={'/boards'}>
            <div className='flex items-center'>
              <FontAwesomeIcon icon={faTrello} fontSize='small' className='mr-2' />
              Boards
            </div>
          </Link>
        </MenuItem>
        <SubMenu
          label={
            <span className='menu-item rounded-md font-bold'>
              <Link to={'/template'}>
                <div className='flex items-center'>
                  <FontAwesomeIcon icon={faChessBoard} fontSize='small' className='mr-2' />
                  Templates
                </div>
              </Link>
            </span>
          }
          style={{
            height: '32px',
            backgroundColor:
              hoveredItem === 'templates'
                ? colors.bg_button_hover
                : activeItem === `/template`
                  ? colors.bg_button_active_hover
                  : colors.background
          }}
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
              hoveredItem === 'home'
                ? colors.bg_button_hover
                : activeItem === `/`
                  ? colors.bg_button_active_hover
                  : colors.background
          }}
          onMouseEnter={() => handleMouseEnter('home')}
          onMouseLeave={() => handleMouseLeave()}
        >
          <Link to={'/'}>
            <div className='flex items-center'>
              <FontAwesomeIcon icon={faHome} fontSize='small' className='mr-2' />
              Home
            </div>
          </Link>
        </MenuItem>
      </Menu>
      <h2
        className='text-ds-text my-2 overflow-hidden whitespace-nowrap pl-5 text-sm font-medium leading-6'
        style={{ color: colors.text }}
      >
        Workspaces
      </h2>

      <div
        className='workspaces'
        style={{ backgroundColor: colors.background, color: colors.text, marginBottom: '100px' }}
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
                          cursor: 'pointer'
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
                            backgroundColor: stringToColor(w.name),
                            width: '40px',
                            height: '40px',
                            textAlign: 'center',
                            color: colors.foreColor
                          }}
                        >
                          {w.name.charAt(0).toLocaleUpperCase()}
                        </Typography>
                      </Box>
                      {handleWorkspaceName(w.name)}
                    </div>
                  </span>
                }
                style={{
                  marginBottom: '4px',
                  height: '50px',
                  backgroundColor: colors.background
                }}
                onMouseEnter={() => handleMouseEnter('workspace')}
                onMouseLeave={() => handleMouseLeave()}
              >
                <Link to={`/workspaceboard/${w._id}`}>
                  <MenuItem
                    style={{
                      height: '32px',
                      paddingLeft: '50px',
                      backgroundColor:
                        hoveredItem === 'board'
                          ? colors.bg_button_hover
                          : activeItem === 'board'
                            ? colors.bg_button_active_hover
                            : colors.background
                    }}
                    onMouseEnter={() => handleMouseEnter('board')}
                    onMouseLeave={() => handleMouseLeave()}
                  >
                    <div className='flex items-center'>
                      <FontAwesomeIcon icon={faTrello} fontSize='small' className='mr-2' />
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
                        hoveredItem === 'highlights'
                          ? colors.bg_button_hover
                          : activeItem === 'highlights'
                            ? colors.bg_button_active_hover
                            : colors.background
                    }}
                    onMouseEnter={() => handleMouseEnter('highlights')}
                    onMouseLeave={() => handleMouseLeave()}
                  >
                    <div className='flex items-center'>
                      <FontAwesomeIcon icon={faHeart} fontSize='small' className='mr-2' />
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
                        hoveredItem === 'views'
                          ? colors.bg_button_hover
                          : activeItem === 'views'
                            ? colors.bg_button_active_hover
                            : colors.background
                    }}
                    onMouseEnter={() => handleMouseEnter('views')}
                    onMouseLeave={() => handleMouseLeave()}
                  >
                    <div className='flex items-center'>
                      <FontAwesomeIcon icon={faTableCells} fontSize='small' className='mr-2' />
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
                        hoveredItem === 'members'
                          ? colors.bg_button_hover
                          : activeItem === 'members'
                            ? colors.bg_button_active_hover
                            : colors.background
                    }}
                    onMouseEnter={() => handleMouseEnter('members')}
                    onMouseLeave={() => handleMouseLeave()}
                  >
                    <div className='flex items-center'>
                      <FontAwesomeIcon icon={faUserGroup} fontSize='small' className='mr-2' />
                      Members
                    </div>
                  </MenuItem>
                </Link>
                <Link to={`/workspaceSetting/${w._id}`}>
                  <MenuItem
                    style={{
                      height: '32px',
                      paddingLeft: '50px',
                      backgroundColor:
                        hoveredItem === 'setting'
                          ? colors.bg_button_hover
                          : activeItem === 'setting'
                            ? colors.bg_button_active_hover
                            : colors.background
                    }}
                    onMouseEnter={() => handleMouseEnter('setting')}
                    onMouseLeave={() => handleMouseLeave()}
                  >
                    <div className='flex items-center'>
                      <FontAwesomeIcon icon={faGear} fontSize='small' className='mr-2' />
                      Setting
                    </div>
                  </MenuItem>
                </Link>
              </SubMenu>
            </Menu>
          </div>
        ))}

        {workspaceData?.data?.member.map((w, index) => (
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
                          cursor: 'pointer'
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
                  backgroundColor: colors.background
                }}
                onMouseEnter={() => handleMouseEnter('workspace')}
                onMouseLeave={() => handleMouseLeave()}
              >
                <Link to={`/workspaceboard/${w._id}`}>
                  <MenuItem
                    style={{
                      height: '32px',
                      paddingLeft: '50px',
                      backgroundColor:
                        hoveredItem === 'board'
                          ? colors.bg_button_hover
                          : activeItem === 'board'
                            ? colors.bg_button_active_hover
                            : colors.background
                    }}
                    onMouseEnter={() => handleMouseEnter('board')}
                    onMouseLeave={() => handleMouseLeave()}
                  >
                    <div className='flex items-center'>
                      <FontAwesomeIcon icon={faTrello} fontSize='small' className='mr-2' />
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
                        hoveredItem === 'highlights'
                          ? colors.bg_button_hover
                          : activeItem === 'highlights'
                            ? colors.bg_button_active_hover
                            : colors.background
                    }}
                    onMouseEnter={() => handleMouseEnter('highlights')}
                    onMouseLeave={() => handleMouseLeave()}
                  >
                    <div className='flex items-center'>
                      <FontAwesomeIcon icon={faHeart} fontSize='small' className='mr-2' />
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
                        hoveredItem === 'views'
                          ? colors.bg_button_hover
                          : activeItem === 'views'
                            ? colors.bg_button_active_hover
                            : colors.background
                    }}
                    onMouseEnter={() => handleMouseEnter('views')}
                    onMouseLeave={() => handleMouseLeave()}
                  >
                    <div className='flex items-center'>
                      <FontAwesomeIcon icon={faTableCells} fontSize='small' className='mr-2' />
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
                        hoveredItem === 'members'
                          ? colors.bg_button_hover
                          : activeItem === 'members'
                            ? colors.bg_button_active_hover
                            : colors.background
                    }}
                    onMouseEnter={() => handleMouseEnter('members')}
                    onMouseLeave={() => handleMouseLeave()}
                  >
                    <div className='flex items-center'>
                      <FontAwesomeIcon icon={faUserGroup} fontSize='small' className='mr-2' />
                      Members
                    </div>
                  </MenuItem>
                </Link>
                <Link to={`/workspaceSetting/${w._id}`}>
                  <MenuItem
                    style={{
                      height: '32px',
                      paddingLeft: '50px',
                      backgroundColor:
                        hoveredItem === 'setting'
                          ? colors.bg_button_hover
                          : activeItem === 'setting'
                            ? colors.bg_button_active_hover
                            : colors.background
                    }}
                    onMouseEnter={() => handleMouseEnter('setting')}
                    onMouseLeave={() => handleMouseLeave()}
                  >
                    <div className='flex items-center'>
                      <FontAwesomeIcon icon={faGear} fontSize='small' className='mr-2' />
                      Setting
                    </div>
                  </MenuItem>
                </Link>
              </SubMenu>
            </Menu>
          </div>
        ))}

        {workspaceData?.data?.guest.map((w, index) => (
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
                          cursor: 'pointer'
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
                            backgroundImage: 'linear-gradient(to bottom, #E774BB, #943D73)',
                            width: '45px',
                            height: '40px',
                            textAlign: 'center'
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
                  backgroundColor: colors.background
                }}
                onMouseEnter={() => handleMouseEnter('workspace')}
                onMouseLeave={() => handleMouseLeave()}
              >
                <Link to={`/workspaceboard/${w._id}`}>
                  <MenuItem
                    style={{
                      height: '32px',
                      paddingLeft: '50px',
                      backgroundColor:
                        hoveredItem === 'board'
                          ? colors.bg_button_hover
                          : activeItem === 'board'
                            ? colors.bg_button_active_hover
                            : colors.background
                    }}
                    onMouseEnter={() => handleMouseEnter('board')}
                    onMouseLeave={() => handleMouseLeave()}
                  >
                    <div className='flex items-center'>
                      <FontAwesomeIcon icon={faTrello} fontSize='small' className='mr-2' />
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
                        hoveredItem === 'highlights'
                          ? colors.bg_button_hover
                          : activeItem === 'highlights'
                            ? colors.bg_button_active_hover
                            : colors.background
                    }}
                    onMouseEnter={() => handleMouseEnter('highlights')}
                    onMouseLeave={() => handleMouseLeave()}
                  >
                    <div className='flex items-center'>
                      <FontAwesomeIcon icon={faHeart} fontSize='small' className='mr-2' />
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
                        hoveredItem === 'views'
                          ? colors.bg_button_hover
                          : activeItem === 'views'
                            ? colors.bg_button_active_hover
                            : colors.background
                    }}
                    onMouseEnter={() => handleMouseEnter('views')}
                    onMouseLeave={() => handleMouseLeave()}
                  >
                    <div className='flex items-center'>
                      <FontAwesomeIcon icon={faTableCells} fontSize='small' className='mr-2' />
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
                        hoveredItem === 'members'
                          ? colors.bg_button_hover
                          : activeItem === 'members'
                            ? colors.bg_button_active_hover
                            : colors.background
                    }}
                    onMouseEnter={() => handleMouseEnter('members')}
                    onMouseLeave={() => handleMouseLeave()}
                  >
                    <div className='flex items-center'>
                      <FontAwesomeIcon icon={faUserGroup} fontSize='small' className='mr-2' />
                      Members
                    </div>
                  </MenuItem>
                </Link>
                <Link to={`/workspaceSetting/${w._id}`}>
                  <MenuItem
                    style={{
                      height: '32px',
                      paddingLeft: '50px',
                      backgroundColor:
                        hoveredItem === 'setting'
                          ? colors.bg_button_hover
                          : activeItem === 'setting'
                            ? colors.bg_button_active_hover
                            : colors.background
                    }}
                    onMouseEnter={() => handleMouseEnter('setting')}
                    onMouseLeave={() => handleMouseLeave()}
                  >
                    <div className='flex items-center'>
                      <FontAwesomeIcon icon={faGear} fontSize='small' className='mr-2' />
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
