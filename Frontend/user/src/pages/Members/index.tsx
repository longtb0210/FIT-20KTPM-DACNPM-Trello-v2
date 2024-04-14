import React from 'react'
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import { FaLink } from 'react-icons/fa6'
import { IoIosWarning, IoMdClose } from 'react-icons/io'
import { IoPersonAddOutline } from 'react-icons/io5'
import { MdLockOutline, MdOutlineKeyboardDoubleArrowUp } from 'react-icons/md'
import { WorkspaceApiRTQ } from '~/api'
import { useTheme } from '~/components/Theme/themeContext'

import { Button } from '@mui/base/Button/Button'
import { FormControl } from '@mui/base/FormControl'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Box, CssBaseline, Divider, Grid, IconButton } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

import SidebarCateWorkSpace from '../CategoryWorkspace/component/SidebarCateWorkspace'
import AddMemberDialog from './AddMemberDialog'
import { useParams } from 'react-router-dom'

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
  let abbreviation = ''
  if (name.includes(' ')) {
    // Nếu tên có ít nhất một khoảng trắng, lấy hai chữ cái đầu tiên từ các từ
    abbreviation = name
      .split(' ')
      .map((word) => word[0])
      .join('')
  } else {
    // Nếu tên chỉ có một từ, lấy chữ cái đầu tiên của từ đó
    abbreviation = name[0].toUpperCase()
  }

  return {
    sx: {
      width: 35,
      height: 35,
      fontSize: '14px',
      '&:hover': {
        bgcolor: 'primary.90',
        cursor: 'pointer'
      },
      bgcolor: stringToColor(name)
    },
    children: abbreviation
  }
}
const drawerWidth = 250

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  })
}))

export default function PageMembers() {
  const { workspaceId } = useParams()
  const { colors, darkMode } = useTheme()
  // const [getUserByEmail] = UserApiRTQ.UserApiSlice.useLazyGetUserByEmailQuery()
  const [getWorkspaceById, { data: workspaceData }] = WorkspaceApiRTQ.WorkspaceApiSlice.useLazyGetWorkspaceInfoQuery()
  const [openShare, setOpenShare] = React.useState(false)
  const [open, setOpen] = React.useState(true)

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const handleClickOpenShare = () => {
    setOpenShare(true)
  }

  const handleCloseShare = () => {
    setOpenShare(false)
  }
  React.useEffect(() => {
    if (workspaceId !== undefined) {
      getWorkspaceById(workspaceId)
    }
  }, [])

  console.log(workspaceData)

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ position: 'fixed', top: 60, left: 10, zIndex: 999 }}>
          <CssBaseline />
          {open ? (
            <IconButton
              onClick={handleDrawerClose}
              edge='start'
              color='inherit'
              aria-label='close'
              sx={{ color: colors.text }}
            >
              <ChevronLeftIcon />
            </IconButton>
          ) : (
            <IconButton
              onClick={handleDrawerOpen}
              edge='start'
              color='inherit'
              aria-label='open'
              sx={{ color: colors.text }}
            >
              <ChevronRightIcon />
            </IconButton>
          )}
        </Box>
        <SidebarCateWorkSpace open={open} handleDrawerClose={handleDrawerClose} />
        <Main open={open} sx={{ padding: 0 }}>
          <Box sx={{ width: '100%', bgcolor: colors.background, color: colors.text }}>
            {/* head content */}
            <Box sx={{ width: '100%', height: '125px', display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  maxWidth: '850px',
                  width: '100%',
                  height: '60px',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '32px',
                  position: 'relative'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                  }}
                >
                  <Box>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: '#A1467F',
                            width: '60px',
                            height: '60px',
                            fontSize: '35px',
                            fontWeight: 'bold',
                            marginRight: '10px'
                          }}
                          variant='square'
                        >
                          N
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary='Trello Workspace'
                        secondary={
                          <Box className='flex flex-row' sx={{ color: colors.text }}>
                            <MdLockOutline className='mr-1 mt-[2px]' />
                            Private
                          </Box>
                        }
                      />
                    </ListItem>
                  </Box>
                  <Box>
                    <Button
                      className={`mt-4 box-border h-8 bg-[#F1F2F4] font-semibold  ${darkMode ? 'text-[#1D2125] hover:bg-slate-600 dark:bg-blue-500' : 'hover:bg-slate-300'}`}
                    >
                      <Box className='flex flex-row'>
                        <IoPersonAddOutline size={15} className='mr-[5px] mt-[2.5px] text-right' />
                        Invite Workspace members
                      </Box>
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
            {/* <WorkspaceHeader visibility={workspaceInfo?.visibility} /> */}
            <Divider variant='middle' sx={{ bgcolor: '#E5E7EB' }} />
            {/* end head content */}
            {/* content */}
            <Box
              sx={{
                width: '100%',
                padding: '32px'
              }}
            >
              {/* title content */}
              <Typography variant='h5' gutterBottom>
                Collaborators (11)
              </Typography>
              {/* main content */}
              <Box
                sx={{
                  display: 'flex',
                  // alignItems: 'end'
                  position: 'relative'
                }}
              >
                {/* nav left bar */}
                <Box
                  sx={{
                    maxWidth: '240px',
                    height: '872px',
                    flex: '0 0 240px',
                    margin: '0',
                    paddingRight: '32px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  <Button
                    className={`w-[100%] text-left  ${darkMode ? 'text-[#b4bec8] hover:bg-slate-600' : 'hover:bg-slate-300'}`}
                  >
                    Workspace members (11)
                  </Button>
                  <Button
                    className={`w-[100%] text-left  ${darkMode ? 'text-[#b4bec8] hover:bg-slate-600' : 'hover:bg-slate-300'}`}
                  >
                    Guests (0)
                  </Button>
                  <hr className='my-3 border' />
                  <Button
                    className={`w-[100%] text-left ${darkMode ? 'text-[#b4bec8] hover:bg-slate-600' : 'hover:bg-slate-300'}`}
                  >
                    Join request (0)
                  </Button>
                </Box>
                {/* end nav left bar */}
                {/* main content */}
                <Box
                  sx={{
                    // bgcolor: 'green',
                    width: '100%',
                    display: 'block',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: colors.background
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '1075px'
                    }}
                  >
                    <Box>
                      <Typography variant='h6' gutterBottom>
                        Workspace members (11)
                      </Typography>
                      <Typography sx={{ fontSize: '14px', fontWeight: '400' }}>
                        Workspace members can view and join all Workspace visible boards and create new boards in the
                        Workspace.
                      </Typography>
                      {/* title */}
                      <Box
                        sx={{
                          maxWidth: '1075px',
                          bgcolor: colors.backgroundWarning,
                          padding: '16px',
                          boxSizing: 'border-box',
                          display: 'flex',
                          flexDirection: 'row',
                          marginTop: '15px'
                        }}
                      >
                        {/* div icon */}
                        <Box
                          sx={{
                            width: '100px',
                            height: '100%',
                            marginLeft: '10px',
                            marginTop: '5px'
                            // bgcolor: 'gray'
                          }}
                        >
                          <IoIosWarning size={25} />
                        </Box>
                        {/* end div icon */}

                        <Box>
                          <h2 className='pb-1 text-[16px] font-semibold'>
                            This Workspace will be at or over the 10 collaborator limit starting April 8, 2024.
                          </h2>
                          <span>
                            <div>
                              <p>
                                Free Workspaces will soon be limited to 10 members, guests, and pending invitations.
                              </p>
                              <ul className='ml-5 list-disc'>
                                <li>
                                  On April 8, 2024, you won't be able to invite new collaborators to free Workspaces
                                  that are at or over the limit.
                                </li>
                                <li>
                                  On May 20, 2024, boards in free Workspaces that are over the limit will become view
                                  only.
                                </li>
                              </ul>
                              <p>
                                To help with this change, on April 8, 2024 this Workspace will be eligible for an
                                extended, 30-day free trial of Trello Premium, with no credit card required. Trello
                                Standard and Premium Workspaces can have unlimited collaborators.
                              </p>
                              <p className='py-3'>
                                To manage collaborators, check the members and guests sections of this page.
                              </p>
                              <div className='text-[blue]'>
                                <a
                                  href='https://support.atlassian.com/trello/docs/workspace-user-limit/'
                                  target='_blank'
                                >
                                  Learn more
                                </a>
                              </div>
                            </div>
                          </span>
                        </Box>
                      </Box>
                      {/* end title */}
                    </Box>
                    <hr className='my-5' />
                    <Box>
                      <Grid container spacing={2}>
                        <Grid item xs={8}>
                          <Typography variant='h6'>Invite members to join you</Typography>
                          <p className='mt-3 w-[70%]'>
                            Anyone with an invite link can join this free Workspace. You can also disable and create a
                            new invite link for this Workspace at any time. Pending invitations count toward the 10
                            collaborator limit.
                          </p>
                        </Grid>
                        <Grid className='flex flex-col items-center justify-end text-right' item xs={4}>
                          <Button
                            className={`flex h-10 flex-row items-center bg-[#F1F2F4] p-2 text-left text-[14px] font-semibold  ${darkMode ? 'hover:bg-slate-600 dark:bg-slate-800' : 'hover:bg-slate-300'}`}
                            onClick={handleClickOpenShare}
                          >
                            <FaLink className='mr-1 mt-1' size={14} />
                            Invite with link
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                    <hr className='my-5' />
                    {/* filter */}
                    <FormControl className='h-[36px] w-[250px]'>
                      <input
                        type='text'
                        className={` w-[100%] rounded-[3px] border-[3px] border-[#8590A2] px-3 py-2 text-[14px] transition-all duration-100 active:scale-[0.98]`}
                        placeholder='Filter by name'
                      />
                    </FormControl>
                    <hr className='mt-5' />
                    {/* end filter */}
                    {/* LIST CARD MEMBERS */}
                    <Box sx={{ flexGrow: 1, maxWidth: 1075 }}>
                      <Grid item xs={12}>
                        <List dense={true}>
                          {workspaceData &&
                            workspaceData.data &&
                            workspaceData.data.members.map((member) => {
                              if (member !== undefined) {
                                return (
                                  <>
                                    <ListItem
                                      secondaryAction={
                                        <Box>
                                          <Button className='mr-2 h-8 px-[9px] py-[7px] text-[14px] font-semibold text-blue-600 hover:underline'>
                                            On 1 board
                                          </Button>
                                          <Button
                                            disabled
                                            className={`mr-2 w-[95px] bg-[#F1F2F4] px-3 py-1 py-2 text-[14px] font-semibold ${darkMode ? 'text-gray-600 dark:bg-slate-800' : 'bg-slate-300'}`}
                                          >
                                            <Box className='flex flex-row'>
                                              {member.role}
                                              <AiOutlineQuestionCircle size={15} className='ml-[5px] mt-[2.5px]' />
                                            </Box>
                                          </Button>

                                          <Button
                                            className={`mt-2 box-border w-[115px] bg-[#F1F2F4] py-2 text-[14px] font-semibold  ${darkMode ? 'hover:bg-slate-600 dark:bg-slate-800' : 'hover:bg-slate-300'}`}
                                          >
                                            <Box className='flex flex-row'>
                                              <IoMdClose size={15} className='ml-4' />
                                              <p>Remove</p>
                                            </Box>
                                          </Button>
                                        </Box>
                                      }
                                    >
                                      <ListItemAvatar>
                                        <Badge
                                          overlap='circular'
                                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                          badgeContent={
                                            <MdOutlineKeyboardDoubleArrowUp className='border-gray-50  text-[14px] text-blue-700' />
                                          }
                                        >
                                          {member.email !== null ? (
                                            <Avatar {...stringAvatar(member.email)} />
                                          ) : (
                                            <Avatar {...stringAvatar('Trung Kien')} />
                                          )}
                                        </Badge>
                                      </ListItemAvatar>
                                      <ListItemText
                                        className={`${darkMode ? 'text-[#fffff]' : ''}`}
                                        primary={member.email}
                                        secondary={
                                          <p style={{ color: colors.text, fontWeight: '300' }}>{member.status}</p>
                                        }
                                      />
                                    </ListItem>
                                    <hr className='my-1' />
                                  </>
                                )
                              }
                            })}
                        </List>
                      </Grid>
                    </Box>
                    {/* END LIST CARD MEMBER */}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Main>
        <AddMemberDialog
          open={openShare}
          handleCloseShare={handleCloseShare}
          boardID={workspaceId !== undefined ? workspaceId : ''}
        />
        {/* end content */}
      </Box>
    </>
  )
}
