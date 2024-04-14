import React from 'react'
import { styled } from '@mui/material/styles'
import { faTrello } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar'
import { Divider, Drawer } from '@mui/material'
import { IoMdClose } from 'react-icons/io'
import { useTheme } from '../Theme/themeContext'
import { faBoxArchive, faCheck, faCopy, faEye, faList, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import ChangeBackground from './ConponentMoreMenu/ChangeBackground'
import { BoardApiRTQ } from '~/api'
import ArchivedItems from './ConponentMoreMenu/ArchiveCard'
import Activity from './ConponentMoreMenu/Activity'
import { useParams } from 'react-router-dom'
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

const MoreMenu: React.FC<Props> = ({ open, handleDrawerClose }) => {
  const { workspaceId, boardId } = useParams()

  const { colors, darkMode } = useTheme()
  const [isWatching, setWatch] = React.useState<boolean>(true)
  const [getBoardById, { data: boardData }] = BoardApiRTQ.BoardApiSlice.useLazyGetBoardByIdQuery()
  const [addWatcherToBoard] = BoardApiRTQ.BoardApiSlice.useAddWatcherMemberMutation()
  const [removeWatcherFromBoard] = BoardApiRTQ.BoardApiSlice.useRemoveWatcherMemberMutation()
  const [removeMemberInBoardByEmail] = BoardApiRTQ.BoardApiSlice.useRemoveMemberInBoardByEmailMutation()

  const [openDrawerIndex, setOpenDrawerIndex] = React.useState(null)

  const handleDrawerOpen = (index: number | React.SetStateAction<null>) => {
    setOpenDrawerIndex(index)
  }

  const handleDetailTabClose = () => {
    setOpenDrawerIndex(null)
  }

  const storedProfile = localStorage.getItem('profile')
  const [profile, setProFile] = React.useState({ email: '', name: '' })

  React.useEffect(() => {
    const profileSave = storedProfile ? JSON.parse(storedProfile) : { email: '', name: '' }
    setProFile({ ...profileSave })
    getBoardById(boardId).then((a) => {
      // if (boardData?.data?.watcher_email.includes(profile.email)) {
      //   setWatch(true)
      // }
    })
  }, [boardData, boardId, getBoardById])

  const handleSetWatching = () => {
    setWatch(!isWatching)
    if (boardId !== undefined) {
      if (isWatching) {
        addWatcherToBoard({ _id: boardId, email: profile.email })
      } else removeWatcherFromBoard({ _id: boardId, email: profile.email })
    }
  }

  const handleLeaveBoard = () => {
    if (boardId !== undefined) {
      removeMemberInBoardByEmail({ _id: boardId, email: profile.email })
        .then((response) => {
          // Kiểm tra nếu response trả về là đúng
          if (response) {
            // Điều hướng đến trang chủ
            window.location.href = 'http://localhost:3000/'
          } else {
            // Xử lý lỗi ở đây, ví dụ thông báo cho người dùng
            console.error('Có lỗi xảy ra:', response)
          }
        })
        .catch((error) => {
          // Xử lý lỗi nếu có
          console.error('Có lỗi xảy ra khi gọi API:', error)
        })
    }
  }

  // const [activeItem, setActiveItem] = useState<string | null>(null)

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
              <h3>Menu</h3>
              <IoMdClose
                className='absolute right-3 cursor-pointer hover:text-gray-400'
                onClick={handleDrawerClose}
              ></IoMdClose>
            </div>
          </span>
        </DrawerHeader>
        <Divider />

        <Sidebar width='100%' className='overflow-hidden text-sm'>
          <Menu>
            <MenuItem
              className={`menu-item h-[50px] ${darkMode ? 'bg-[#1D2125] text-white hover:bg-slate-600' : `bg-${colors.button} text-${colors.text} hover:bg-[#DCDFE4]`}`}
              onClick={() => handleDrawerOpen(0)}
            >
              <div className='flex items-center'>
                <FontAwesomeIcon icon={faList} fontSize='small' className='mr-4' />
                Activity
              </div>
            </MenuItem>
          </Menu>
          <Menu>
            <MenuItem
              className={`menu-item h-[50px] ${darkMode ? 'bg-[#1D2125] text-white hover:bg-slate-700' : `bg-[${colors.button}] text-[${colors.text}] hover:bg-[#DCDFE4]`}`}
              onClick={() => handleDrawerOpen(1)}
            >
              <div className='flex items-center'>
                <FontAwesomeIcon icon={faBoxArchive} fontSize='small' className='mr-4' />
                Archived items
              </div>
            </MenuItem>
          </Menu>
          <Divider />
          <Menu>
            <MenuItem
              className={`menu-item h-[50px] ${darkMode ? 'bg-[#1D2125] text-white hover:bg-slate-600' : `bg-${colors.button} text-${colors.text} hover:bg-[#DCDFE4]`}`}
              // onClick={() => handleItemClick('boards')}
              onClick={() => handleDrawerOpen(2)}
            >
              <div className='flex items-center'>
                <span
                  style={{
                    width: '20px',
                    height: '20px',
                    backgroundSize: 'cover',
                    borderRadius: '3px',
                    backgroundPosition: '50%',
                    marginRight: '10px',
                    // backgroundImage: `url(${boardData?.data?.background !== undefined ? boardData?.data?.background : })`
                    backgroundImage: `url(${boardData?.data?.background || 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e'})`
                  }}
                ></span>
                ChangeBackground
              </div>
            </MenuItem>
          </Menu>
          <Menu>
            <MenuItem
              className={`menu-item h-[50px] ${darkMode ? 'bg-[#1D2125] text-white hover:bg-slate-600' : `bg-${colors.button} text-${colors.text} hover:bg-[##DCDFE4]`}`}

              // onClick={() => handleItemClick('boards')}
            >
              <div className='flex items-center'>
                <FontAwesomeIcon icon={faTrello} fontSize='small' className='mr-4' />
                Custom feilds
              </div>
            </MenuItem>
          </Menu>
          <Divider />
          <Menu>
            <MenuItem
              className={`menu-item h-[50px] ${darkMode ? 'bg-[#1D2125] text-white hover:bg-slate-600' : `bg-${colors.button} text-${colors.text} hover:bg-[##DCDFE4]`}`}

              // onClick={() => handleItemClick('boards')}
            >
              <div className='flex items-center' onClick={handleSetWatching}>
                <FontAwesomeIcon icon={faEye} fontSize='small' className='mr-4' />
                Watch
                {isWatching ? <FontAwesomeIcon icon={faCheck} fontSize='small' className='ml-5 mr-4' /> : ''}
              </div>
            </MenuItem>
          </Menu>
          <Menu>
            <MenuItem
              className={`menu-item h-[50px] ${darkMode ? 'bg-[#1D2125] text-white hover:bg-slate-600' : `bg-${colors.button} text-${colors.text} hover:bg-[##DCDFE4]`}`}

              // onClick={() => handleItemClick('boards')}
            >
              <div className='flex items-center'>
                <FontAwesomeIcon icon={faCopy} fontSize='small' className='mr-4' />
                Copy board
              </div>
            </MenuItem>
          </Menu>
          <Menu>
            <MenuItem
              className={`menu-item h-[50px] ${darkMode ? 'bg-[#1D2125] text-white hover:bg-slate-600' : `bg-${colors.button} text-${colors.text} hover:bg-[##DCDFE4]`}`}

              // onClick={() => handleItemClick('boards')}
            >
              <div className='flex items-center' onClick={handleLeaveBoard}>
                <FontAwesomeIcon icon={faRightFromBracket} fontSize='small' className='mr-4' />
                Leave board
              </div>
            </MenuItem>
          </Menu>
        </Sidebar>
      </Drawer>
      <Activity open={openDrawerIndex === 0} handleDrawerClose={handleDetailTabClose} />
      <ArchivedItems open={openDrawerIndex === 1} handleDrawerClose={handleDetailTabClose} />
      <ChangeBackground open={openDrawerIndex === 2} handleDrawerClose={handleDetailTabClose} />
    </div>
  )
}

export default MoreMenu
