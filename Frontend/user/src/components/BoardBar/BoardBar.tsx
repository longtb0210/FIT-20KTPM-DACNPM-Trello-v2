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
import { BoardApiRTQ, UserApiRTQ } from '~/api'
import ChangeVisibility from './ChangeVisibility'
import { stringAvatar } from '~/utils/StringAvatar'
import ShareDialog from './ShareDialog'
import { useParams } from 'react-router-dom'

function BoardBar() {
  //get id
  const { workspaceId, boardId } = useParams()

  // console.log('Workspace ID:', workspaceId)
  // console.log('Board ID:', boardId)
  const [openShare, setOpenShare] = React.useState(false)

  const handleClickOpenShare = () => {
    setOpenShare(true)
  }

  const handleCloseShare = () => {
    setOpenShare(false)
  }

  //theme
  const { darkMode } = useTheme()

  //get api board
  const [getBoardById, { data: boardData }] = BoardApiRTQ.BoardApiSlice.useLazyGetBoardByIdQuery()
  const [getUserByEmail] = UserApiRTQ.UserApiSlice.useLazyGetUserByEmailQuery()
  //khai bao useState isStar
  const [starred, setStarred] = useState<boolean>()
  const [visibility, setVisibility] = useState<string>()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [boardMembers, setBoardMembers] = useState<any[]>([])
  const storedProfile = localStorage.getItem('profile')
  const [profile, setProFile] = React.useState({ email: '', name: '' })
  React.useEffect(() => {
    const profileSave = storedProfile ? JSON.parse(storedProfile) : { email: '', name: '' }
    setProFile({ ...profileSave })

    getBoardById(boardId).then(() => {
      // console.log(boardData?.data?.visibility[0])
      setStarred(boardData?.data?.is_star)
      setVisibility(boardData?.data?.visibility[0])
    })
  }, [boardData?.data?.is_star, boardData?.data?.visibility, boardId, getBoardById])

  React.useEffect(() => {
    if (boardData && boardData.data && boardData.data.members_email) {
      const fetchBoardMembers = async () => {
        const members = []
        // eslint-disable-next-line no-unsafe-optional-chaining
        for (const emailValue of boardData.data?.members_email !== undefined ? boardData.data?.members_email : '') {
          const userData = await getUserByEmail({ email: emailValue })
          members.push(userData.data)
        }
        setBoardMembers(members)
      }
      fetchBoardMembers()
    }
  }, [boardData, getUserByEmail])

  // console.log(boardMembers)
  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null)
  const [popupContent, setPopupContent] = useState(<div>Kine</div>)
  const handleClick = (event: React.MouseEvent<HTMLElement>, customPopupContent: JSX.Element) => {
    setPopupContent(customPopupContent)
    setAnchor(anchor ? null : event.currentTarget)
  }

  const open = Boolean(anchor)
  const [openMore, setOpen] = React.useState(false)
  const id = open ? 'simple-popup' : undefined
  const [ChangeVisibilityApi] = BoardApiRTQ.BoardApiSlice.useEditBoardByIdMutation()
  const [editBoardById] = BoardApiRTQ.BoardApiSlice.useEditBoardByIdMutation()

  const handleVisibilityChange = (newVisibility: string) => {
    if (newVisibility === 'private' || newVisibility === 'workspace' || newVisibility === 'public') {
      // console.log('newVisibility: ' + newVisibility)
      setVisibility(newVisibility)
      if (boardId !== undefined) {
        ChangeVisibilityApi({ visibility: newVisibility as 'private' | 'workspace' | 'public', _id: boardId }).then(
          () => console.log('Updated Visibility')
        )
      }
      setAnchor(null)
    } else {
      // Xử lý trường hợp `newVisibility` không hợp lệ tại đây
    }
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
      // console.log(updatedName)
      if (updatedName && boardId !== undefined) {
        editBoardById({
          _id: boardId,
          name: updatedName
        })
          .unwrap()
          .then((response) => {
            // console.log(response)
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

  async function handleClickToStar() {
    await editBoardById({
      _id: boardId !== undefined ? boardId : '',
      is_star: !starred
    }).then((response) => {
      // console.log(response)
      setStarred(!starred)
      alert('Thay đổi thành công')
      // window.location.reload()
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
            {boardMembers &&
              boardMembers.map((infoUser) => {
                if (infoUser !== undefined) {
                  return (
                    <Tooltip title={infoUser.data.username}>
                      <Avatar {...stringAvatar(infoUser.data.username)} />
                    </Tooltip>
                  )
                }
              })}
            <Tooltip title={profile.name}>
              <Avatar {...stringAvatar(profile.name)} />
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
              onClick={handleClickOpenShare}
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
      {boardId !== undefined ? (
        <ShareDialog open={openShare} handleCloseShare={handleCloseShare} boardID={boardId} />
      ) : (
        ''
      )}
      {/* <ShareDialog open={openShare} handleCloseShare={handleCloseShare} boardID={boardId} /> */}
    </>
  )
}

export default BoardBar
