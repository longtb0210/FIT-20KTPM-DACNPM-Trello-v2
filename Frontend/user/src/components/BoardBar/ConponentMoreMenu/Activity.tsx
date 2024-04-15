import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import { Avatar, Box, Divider, Drawer, ListItem } from '@mui/material'
import { IoMdClose } from 'react-icons/io'
import { useTheme } from '~/components/Theme/themeContext'
import { CardlistApiRTQ } from '~/api'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import { stringToColor } from '~/utils/StringToColor'
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

interface Activity {
  _id: string
  workspace_id: string
  content: string
  create_time: string
  creator_email: string
}

function stringAvatar(name: string) {
  let abbreviation = ''

  if (name.includes(' ')) {
    abbreviation = name
      .split(' ')
      .map((word) => word[0])
      .join('')
  } else {
    abbreviation = name[0].toUpperCase()
  }

  return {
    sx: {
      width: 30,
      height: 30,
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

const Activity: React.FC<Props> = ({ open, handleDrawerClose }) => {
  const { workspaceId, boardId } = useParams()

  const { colors } = useTheme()

  const [getCardlistByBoardId] = CardlistApiRTQ.CardListApiSlice.useLazyGetCardlistByBoardIdQuery()

  const [activityData, setActivityData] = useState<Activity[]>([])

  useEffect(() => {
    getCardlistByBoardId({ id: boardId }).then((response) => {
      const activities: Activity[] = []
      if (response.data !== undefined) {
        response.data.data.forEach((cardlist: { cards: any[] }) => {
          cardlist.cards.forEach((card) => {
            if (card.activities && card.activities.length > 0) {
              activities.push(...card.activities)
            }
          })
        })
      }
      setActivityData(activities)
    })
  }, [getCardlistByBoardId, boardId])

  return (
    <div style={{ position: 'absolute' }}>
      <style>
        {`
          .react-tabs__tab--selected {
            background: #E9F2FF;
            border-color: #aaa;
            color: black;
            border-radius: 5px 5px 0 0;
          }
        `}
      </style>
      <Drawer
        sx={{
          ...(open && { width: drawerWidth }),
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
              <h3>Activity</h3>
              <IoMdClose
                className='absolute right-3 cursor-pointer hover:text-gray-400'
                onClick={handleDrawerClose}
              ></IoMdClose>
            </div>
          </span>
        </DrawerHeader>
        <Divider variant='middle' />
        <Box
          sx={{
            flexFlow: 'row wrap',
            marginTop: '15px'
          }}
        >
          <Tabs>
            <TabList className={`mb-3 flex`}>
              <Tab className={`ml-3 mr-2 w-[45%] cursor-pointer rounded-lg border-0 py-2 text-center`}>All</Tab>
              <Tab className={`w-[45%] cursor-pointer rounded-lg border-0  py-2 text-center`}>Comments</Tab>
            </TabList>

            <Divider variant='middle' />

            <TabPanel className={`w-[100%]`}>
              {activityData.length > 0 ? (
                activityData.map((activity) => (
                  <ListItem key={activity._id} className='w-[100%]'>
                    <Box sx={{ marginRight: '10px' }}>
                      <Avatar {...stringAvatar(activity.creator_email)} />
                    </Box>
                    <Box>
                      <Box sx={{ fontSize: '13px', fontWeight: '300x', display: 'flex' }}>
                        <span dangerouslySetInnerHTML={{ __html: activity.content }} />
                      </Box>
                      <Box sx={{ fontSize: '12px', fontWeight: '300x' }}>{activity.create_time}</Box>
                    </Box>
                  </ListItem>
                ))
              ) : (
                <ListItem className='w-[100%]'>
                  <Box sx={{ marginRight: '10px' }}>
                    <Avatar {...stringAvatar('kine')} />
                  </Box>
                  <Box>
                    <Box sx={{ fontSize: '13px', fontWeight: '300x', display: 'flex' }}>
                      <h3 className='mr-1 font-bold'>Nguyeenkieen141 </h3>
                      archive card list name
                    </Box>
                    <Box sx={{ fontSize: '12px', fontWeight: '300x' }}>yesterday</Box>
                  </Box>
                </ListItem>
              )}
            </TabPanel>

            <TabPanel>
              <h2></h2>
            </TabPanel>
          </Tabs>
        </Box>
      </Drawer>
    </div>
  )
}

export default Activity
