import React, { useEffect, useState } from 'react'

import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import WorkspacesIcon from '@mui/icons-material/Workspaces'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import { faTrello } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from '@mui/base'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { WorkspaceApiRTQ } from '~/api'
import { faChessBoard, faGear, faTableCells, faUserGroup, faHome } from '@fortawesome/free-solid-svg-icons'
import { faHeart } from '@fortawesome/free-regular-svg-icons'

interface WorkspaceData {
  _id: string
  name: string
  short_name: string
  description: string
  website: string
  logo: string
  type_id: string
  visibility: string
  members: []
}

function SidebarTemplate() {
  const [getALlWorkspace, { data: workspaceData }] = WorkspaceApiRTQ.WorkspaceApiSlice.useLazyGetAllWorkspaceQuery()

  React.useEffect(() => {
    getALlWorkspace().then((v) => console.log(v))
  }, [])

  console.log(workspaceData)

  return (
    <div className='detail-sidebar-container w-100px fixed ml-20 mt-2 max-h-90vh max-h-screen overflow-y-auto text-sm'>
      <Sidebar>
        <Menu>
          <MenuItem
            className='menu-item rounded-md bg-white font-bold hover:border-0 hover:text-blue-500'
            style={{ marginBottom: '4px', padding: '8px', height: '32px', width: '200px' }}
          >
            <Link to={'/workspace/1'}>
              <div className='flex items-center'>
                <FontAwesomeIcon icon={faTrello} fontSize='small' className='mr-2' />
                Boards
              </div>
            </Link>
          </MenuItem>
          <SubMenu
            label={
              <span className='menu-item rounded-md bg-white font-bold hover:border-0 hover:text-blue-500'>
                <Link to={'/template'}>
                  <div className='flex items-center'>
                    <FontAwesomeIcon icon={faChessBoard} fontSize='small' className='mr-2' />
                    Templates
                  </div>
                </Link>
              </span>
            }
            defaultOpen={true}
            style={{ marginBottom: '4px', padding: '8px', height: '32px', width: '200px' }}
          >
            <MenuItem style={{ height: '32px', width: '200px' }}>Business</MenuItem>
            <MenuItem style={{ height: '32px', width: '200px' }}>Design</MenuItem>
            <MenuItem style={{ height: '32px', width: '200px' }}>Education</MenuItem>
            <MenuItem style={{ height: '32px', width: '200px' }}>Engineering</MenuItem>
            <MenuItem style={{ height: '32px', width: '200px' }}>Marketing</MenuItem>
            <MenuItem style={{ height: '32px', width: '200px' }}>HR & Operations</MenuItem>
            <MenuItem style={{ height: '32px', width: '200px' }}>Personal</MenuItem>
            <MenuItem style={{ height: '32px', width: '200px' }}>Productivity</MenuItem>
            <MenuItem style={{ height: '32px', width: '200px' }}>Product management</MenuItem>
            <MenuItem style={{ height: '32px', width: '200px' }}>Project management</MenuItem>
            <MenuItem style={{ height: '32px', width: '200px' }}>Remote work</MenuItem>
            <MenuItem style={{ height: '32px', width: '200px' }}>Sales</MenuItem>
            <MenuItem style={{ height: '32px', width: '200px' }}>Support</MenuItem>
            <MenuItem style={{ height: '32px', width: '200px' }}>Team management</MenuItem>
          </SubMenu>
          <MenuItem
            className='menu-item home border-b-3 rounded-md border-blue-500 bg-white font-bold hover:border-0 hover:text-blue-500 '
            style={{ marginBottom: '4px', padding: '8px', height: '32px', width: '200px' }}
          >
            <Link to={'/'}>
              <div className='flex items-center'>
                <FontAwesomeIcon icon={faHome} fontSize='small' className='mr-2' />
                Home
              </div>
            </Link>
          </MenuItem>
        </Menu>
      </Sidebar>
      <h1 className='mb-2 pl-5 pt-2 text-gray-700'>Workspaces</h1>
      <Sidebar className='workspaces mb-10'>
        <div>
          {workspaceData?.data
            .filter((item) => item.members.some((member) => member.role !== 'guest'))
            .map((w, index) => (
              <div key={index}>
                <Menu>
                  <SubMenu
                    label={
                      <span className='rounded-md font-bold hover:border-0 hover:bg-blue-500 hover:text-blue-500'>
                        <div className='flex items-center'>
                          <WorkspacesIcon fontSize='small' className='mr-2' />
                          {w.name}
                        </div>
                      </span>
                    }
                    style={{ marginBottom: '4px', padding: '8px', height: '32px', width: '200px' }}
                  >
                    <Link to={`/workspace/${w._id}`}>
                      <MenuItem style={{ height: '32px', width: '200px' }}>
                        <div className='flex items-center'>
                          <FontAwesomeIcon icon={faTrello} fontSize='small' className='mr-2' />
                          Boards
                        </div>
                      </MenuItem>
                    </Link>
                    <MenuItem style={{ height: '32px', width: '200px' }}>
                      <div className='flex items-center'>
                        <FontAwesomeIcon icon={faHeart} fontSize='small' className='mr-2' />
                        Highlights
                      </div>
                    </MenuItem>
                    <MenuItem style={{ height: '32px', width: '200px' }}>
                      <div className='flex items-center'>
                        <FontAwesomeIcon icon={faTableCells} fontSize='small' className='mr-2' />
                        Views
                      </div>
                    </MenuItem>
                    <MenuItem style={{ height: '32px', width: '200px' }}>
                      <div className='flex w-full items-center justify-between'>
                        <div className='flex items-center'>
                          <FontAwesomeIcon icon={faUserGroup} fontSize='small' className='mr-2' />
                          Members
                        </div>
                        <div>
                          <Button>
                            <AddOutlinedIcon fontSize='small' />
                          </Button>
                        </div>
                      </div>
                    </MenuItem>
                    <MenuItem style={{ height: '32px', width: '200px' }}>
                      <div className='flex items-center'>
                        <FontAwesomeIcon icon={faGear} fontSize='small' className='mr-2' />
                        Setting
                      </div>
                    </MenuItem>
                  </SubMenu>
                </Menu>
              </div>
            ))}
        </div>
      </Sidebar>
    </div>
  )
}

export default SidebarTemplate
