import { Avatar, AvatarGroup, Box, Chip } from '@mui/material'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import { MdOutlineLock } from 'react-icons/md'
import GroupTrelloIcon from '~/assets/GroupTrelloIcon.svg'
import Tooltip from '@mui/material/Tooltip'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FilterListIcon from '@mui/icons-material/FilterList'
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup'
import * as React from 'react'
import ShareIcon from '@mui/icons-material/Share'
import CustomizeViews from './CustomizeViews'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import Filter from './Filter'
import { useTheme } from '../Theme/themeContext'
import More from './MoreMenu'
import { useRef, useState } from 'react'
import { MdGroups2 } from 'react-icons/md'
import { MdPublic } from 'react-icons/md'
import { BoardApiRTQ, WorkspaceApiRTQ } from '~/api'
import ChangeVisibility from './ChangeVisibility'

// UserApiRTQ

function stringToColor(string: string) {
  let hash = 0
  let i

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.slice(-2)
  }
  /* eslint-enable no-bitwise */

  return color
}

function stringAvatar(name: string) {
  return {
    sx: {
      width: 24,
      height: 24,
      fontSize: '14px',
      '&:hover': {
        bgcolor: 'primary.90',
        cursor: 'pointer'
      },
      bgcolor: stringToColor(name)
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`
  }
}

// interface Props {
//   open: boolean
//   handleDrawerClose: () => void
// }

function BoardBar() {
  //get id
  const url = window.location.href
  const workspaceIndex = url.indexOf('workspace/')
  const idsPart = url.substring(workspaceIndex + 'workspace/'.length)
  const [workspaceId, boardId] = idsPart.split('&')

  console.log('Workspace ID:', workspaceId)
  console.log('Board ID:', boardId)

  //theme
  const { darkMode } = useTheme()

  //get api board
  const [getBoardById, { data: boardData }] = BoardApiRTQ.BoardApiSlice.useLazyGetBoardByIdQuery()
  // const [getUserById] = UserApiRTQ.UserApiSlice.useLazyGetUserByIdQuery()
  React.useEffect(() => {
    getBoardById(boardId).then((a) => console.log(a))
  }, [boardId, getBoardById])

  console.log(boardData?.data)
  //khai bao useState isStar
  const [starred, setStarred] = useState<boolean>(
    boardData?.data?.is_star !== undefined ? boardData?.data?.is_star : false
  )

  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null)
  const [popupContent, setPopupContent] = useState(<div>Kine</div>)
  const handleClick = (event: React.MouseEvent<HTMLElement>, customPopupContent: JSX.Element) => {
    setPopupContent(customPopupContent)
    setAnchor(anchor ? null : event.currentTarget)
  }

  const open = Boolean(anchor)
  const [openMore, setOpen] = React.useState(false)
  const id = open ? 'simple-popup' : undefined
  const [ChangeVisibilityApi] = WorkspaceApiRTQ.WorkspaceApiSlice.useChangeWorkspaceVisibilityMutation()
  const [editBoardById] = BoardApiRTQ.BoardApiSlice.useEditBoardByIdMutation()

  const [visibility, setVisibility] = useState('private')

  const handleVisibilityChange = (newVisibility: string) => {
    console.log('newVisibility: ' + newVisibility)
    setVisibility(newVisibility)
    ChangeVisibilityApi({ visibility: newVisibility, _id: workspaceId }).then(() => console.log('Updated'))
    setAnchor(null)
  }

  let Icon: React.ReactNode
  switch (visibility) {
    case 'private':
      Icon = <MdOutlineLock color='white' className='absolute left-[3px]' />
      break
    case 'workspace':
      Icon = <MdGroups2 color='white' className='absolute left-[3px]' />
      break
    case 'public':
      Icon = <MdPublic color='white' className='absolute left-[3px]' />
      break
    default:
      Icon = <MdOutlineLock color='white' className='absolute left-[3px]' />
  }

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const inputRef = useRef<HTMLInputElement>(null)

  const handleChangeName = (event: React.KeyboardEvent) => {
    if (event.key == 'Enter') {
      event.preventDefault()
      const updatedName = inputRef.current?.value
      console.log(updatedName)
      if (updatedName) {
        editBoardById({
          _id: boardId,
          name: updatedName
        })
          .unwrap()
          .then((response) => {
            console.log(response)
            alert('Thay đổi thành công')
            window.location.reload()
          })
          .catch((error) => {
            console.error('Lỗi khi chỉnh sửa bảng:', error)
            alert('Đã xảy ra lỗi khi thay đổi tên bảng')
          })
      }
    }
  }

  const handleClickToStar = () => {
    setStarred(!starred)
    console.log(starred)
    editBoardById({
      _id: boardId,
      is_star: !boardData?.data?.is_star
    }).then((response) => {
      console.log(response)
      alert('Thay đổi thành công')
    })
  }

  return (
    <>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 10
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '2' }}>
          <Box>
            <input
              defaultValue={boardData?.data?.name}
              id='text'
              ref={inputRef}
              className='mr-1 flex h-9 cursor-pointer content-center rounded-md border-none bg-[rgba(58,58,75,0.1)] px-1 py-1 text-[18px] font-bold leading-9 text-white hover:bg-[rgba(58,58,75,0.4)]'
              onKeyDown={handleChangeName}
              style={{
                width: `${Math.max(boardData?.data?.name.length !== undefined ? boardData?.data?.name.length : 5, 1) * 10}px`
              }}
            />
          </Box>
          <Tooltip title='Click to star or unstar this board'>
            <Chip
              sx={{
                width: '32px',
                height: '32px',
                fontSize: '18px',
                fontWeight: 'bold',
                color: 'white',
                bgcolor: 'rgba(54, 55, 61, 0)',
                borderRadius: '8px',
                paddingLeft: '12px',
                marginRight: '4px',
                '& .MuiSvgIcon-root': {
                  color: starred ? '#FF991F' : 'white' // Điều chỉnh màu của icon
                },
                '&:hover': {
                  bgcolor: 'rgba(160, 160, 160, 0.25)'
                }
              }}
              icon={
                <StarBorderIcon
                  sx={{
                    fontSize: '18px',
                    '&:hover': {
                      color: '#FF991F',
                      fontSize: '20px'
                    },
                    '&:active': {
                      color: '#FF991F'
                    }
                  }}
                />
              }
              onClick={handleClickToStar}
            />
          </Tooltip>

          <Tooltip title='Change visibility'>
            <Chip
              sx={{
                fontSize: '16px',
                bgcolor: 'rgba(54, 55, 61, 0.1)',
                position: 'relative',
                // paddingLeft: '10px',
                borderRadius: '8px',
                marginRight: '4px',
                height: '32px',
                width: '32px',
                '& .MuiSvgIcon-root': {
                  color: 'white'
                },
                '&:hover': {
                  bgcolor: 'rgba(160, 160, 160, 0.25)'
                }
              }}
              icon={Icon}
              onClick={(e: React.MouseEvent<HTMLElement>) =>
                handleClick(e, <ChangeVisibility onVisibilityChange={handleVisibilityChange} />)
              }
            />
          </Tooltip>

          <Tooltip title='Board'>
            <Chip
              sx={{
                color: '#324462',
                fontWeight: '500',
                paddingX: '6px',
                fontSize: '14px',
                marginRight: '4px',
                bgcolor: '#DFE1E6',
                borderRadius: '3px',
                height: '32px',
                '& .MuiSvgIcon-root': {
                  color: ''
                },
                '&:hover': {
                  bgcolor: '#F1F2F4'
                }
              }}
              icon={<img src={GroupTrelloIcon} alt='NavBarIcon' className='h-4 w-4 rounded-md' />}
              label='Board'
              onClick={() => {}}
            />
          </Tooltip>

          <Tooltip title='Customize views'>
            <Chip
              sx={{
                color: '#cccc',
                fontSize: '18px',
                bgcolor: 'rgba(54, 55, 61, 0.1)',
                paddingLeft: '12px',
                fontWeight: 'bold',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                marginRight: '2px',
                '& .MuiSvgIcon-root': {
                  color: 'white'
                },
                '&:hover': {
                  bgcolor: 'rgba(160, 160, 160, 0.25)'
                }
              }}
              icon={
                <ExpandMoreIcon
                  sx={{
                    fontSize: '18px',
                    '&:hover': {
                      fontSize: '20px'
                    }
                  }}
                />
              }
              onClick={(e) => handleClick(e, <CustomizeViews />)}
            />
          </Tooltip>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '2' }}>
          <Tooltip title='Filter'>
            <Chip
              sx={{
                color: '#cccc',
                fontSize: '14px',
                bgcolor: 'rgba(54, 55, 61, 0.1)',
                // paddingX: '5px',
                fontWeight: 'bold',
                borderRadius: '8px',
                marginRight: '3px',
                height: '32px',
                '& .MuiSvgIcon-root': {
                  color: 'white'
                },
                '&:hover': {
                  bgcolor: 'rgba(160, 160, 160, 0.25)'
                }
              }}
              icon={
                <FilterListIcon
                  sx={{
                    fontSize: '18px'
                  }}
                />
              }
              label='Filters'
              onClick={(e) => handleClick(e, <Filter />)}
            />
          </Tooltip>

          <AvatarGroup
            max={5}
            sx={{
              marginRight: '5px',
              '& .MuiAvatar-root': {
                width: '24px',
                height: '24px',
                fontSize: '14px',
                padding: '2px',
                marginRight: '5px',
                border: 'none'
              },
              padding: '0'
            }}
          >
            {/* {boardData &&
              boardData.data &&
                boardData.data.members_email.map(async (email) => {

                })
              } */}
            <Tooltip title='Trung kien'>
              <Avatar {...stringAvatar('Trần Khương')} />
            </Tooltip>
            <Tooltip title='Hữu Chính'>
              <Avatar {...stringAvatar('Hữu Chính')} />
            </Tooltip>
            <Tooltip title='Bảo Long'>
              <Avatar {...stringAvatar('Bảo Long')} />
            </Tooltip>
            <Tooltip title='Trung kien'>
              <Avatar {...stringAvatar('Trung Kien')} />
            </Tooltip>
            <Tooltip title='Trung kien'>
              <Avatar {...stringAvatar('Trung Kien')} />
            </Tooltip>
            <Tooltip title='Trung kien'>
              <Avatar {...stringAvatar('Trung Kien')} />
            </Tooltip>
            <Tooltip title='Bảo Long'>
              <Avatar {...stringAvatar('Bảo Long')} />
            </Tooltip>
          </AvatarGroup>
          <Tooltip title='Share'>
            <Chip
              sx={{
                color: '#cccc',
                fontSize: '18px',
                bgcolor: 'rgba(54, 55, 61, 0.1)',
                paddingLeft: '12px',
                fontWeight: 'bold',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                '& .MuiSvgIcon-root': {
                  color: 'white'
                },
                '&:hover': {
                  bgcolor: 'rgba(160, 160, 160, 0.25)'
                }
              }}
              icon={
                <ShareIcon
                  sx={{
                    fontSize: '18px',
                    '&:hover': {
                      fontSize: '20px'
                    }
                  }}
                />
              }
            />
          </Tooltip>
          <Tooltip title='More'>
            <Chip
              sx={{
                color: '#cccc',
                fontSize: '18px',
                bgcolor: 'rgba(54, 55, 61, 0.1)',
                paddingLeft: '12px',
                fontWeight: 'bold',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                '& .MuiSvgIcon-root': {
                  color: 'white'
                },
                '&:hover': {
                  bgcolor: 'rgba(160, 160, 160, 0.25)'
                },
                ...(openMore && { display: 'none' })
              }}
              icon={
                <MoreHorizIcon
                  sx={{
                    fontSize: '18px',
                    '&:hover': {
                      fontSize: '20px'
                    }
                  }}
                />
              }
              onClick={handleDrawerOpen}
            />
          </Tooltip>
        </Box>
      </Box>
      <BasePopup
        id={id}
        open={open}
        anchor={anchor}
        placement={'bottom-start'}
        disablePortal
        className={`z-50 mt-2 rounded-lg border border-solid border-slate-200 bg-white p-3 font-sans text-sm font-medium shadow-md ${darkMode ? 'dark:bg-[#23262A]' : ''}`}
      >
        {popupContent}
      </BasePopup>
      <More open={openMore} handleDrawerClose={handleDrawerClose} />
    </>
  )
}

export default BoardBar
