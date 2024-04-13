// components/Header.tsx
import { Avatar, Box, Typography } from '@mui/material'
import { User } from '@trello-v2/shared/src/schemas/User'
import React, { useEffect, useState } from 'react'

import { RxAvatar } from 'react-icons/rx'
import { useTheme } from '~/components/Theme/themeContext'
import { stringAvatar } from '~/utils/StringAvatar'
import { stringToColor } from '~/utils/StringToColor'

interface HeaderProps {
  currentTab: string
  userInfo: User | undefined
  onSelectTab: (selectedTab: string) => void
}

export const Header: React.FC<HeaderProps> = ({ currentTab, userInfo, onSelectTab }) => {
  const { colors, darkMode } = useTheme()
  const [selectedTab, setSelectedTab] = useState<string>('')
  const [profile, setProfile] = React.useState({ email: '', name: '' })

  const storedProfile = localStorage.getItem('profile')
  React.useEffect(() => {
    const profileSave = storedProfile ? JSON.parse(storedProfile) : { email: '', name: '' }
    setProfile({ ...profileSave })
  }, [storedProfile])
  useEffect(() => {
    const profileSave = storedProfile ? JSON.parse(storedProfile) : { email: '', name: '' }
    const userIn4 = { email: userInfo?.email, name: userInfo?.username }
    // console.log('userInfo: ', profileSave)
    setProfile(!userIn4.name ? { ...profileSave } : { ...userIn4 })
  }, [userInfo, storedProfile])
  useEffect(() => {
    setSelectedTab(currentTab)
  }, [currentTab])
  const handleTabClick = (tab: string) => {
    setSelectedTab(tab)
    onSelectTab(tab)
  }

  const getFirstTwoCharsOfLastWord = (inputString: string) => {
    if (inputString) {
      const words = inputString.split(' ')

      if (words.length >= 2) {
        const secondToLastWord = words[words.length - 2]
        const lastWord = words[words.length - 1]

        let firstLetters = `${secondToLastWord.charAt(0)}${lastWord.charAt(0)}`
        console.log(firstLetters)

        firstLetters = firstLetters.toUpperCase()

        return firstLetters
      } else {
        return inputString[0].toUpperCase()
      }
    } else {
      return null
    }
  }

  return (
    <header className='left-0 mx-14  py-2'>
      <div className='mt-9 flex max-w-2xl items-center space-x-4'>
        {/* <img

          src={avtPath} // Replace with your avatar image source
          alt='Avatar'
          className=' h-[65px] w-[65px] rounded-full border'
        /> */}
        {/* <RxAvatar size={`70px`} /> */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
            padding: '0 20px'
          }}
        >
          <Typography variant='h4' className='text-center'>
            <Avatar {...stringAvatar(profile.name, '20px', 68, 68)} className={`font-bold`} />
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              variant='body1'
              sx={{ fontSize: '18px', fontWeight: 500, color: colors.text, marginLeft: '12px' }}
            >
              {profile.name}
            </Typography>
            <Typography variant='body1' sx={{ fontSize: '12px', color: colors.text, marginLeft: '12px' }}>
              {profile.email}
            </Typography>
          </Box>
        </Box>
      </div>
      <div className='mt-9 flex'>
        <p
          className={`cursor-pointer border-b-[2px] pb-2 font-bold ${selectedTab === 'profile' ? (!darkMode ? 'border-blue-600 text-blue-600' : 'border-blue-400 text-blue-400') : !darkMode ? 'border-gray-300  hover:text-blue-600' : 'border-gray-700  hover:text-blue-400'}`}
          onClick={() => handleTabClick('profile')}
        >
          Profile and visibility
        </p>
        <div
          className={` w-[20px] border-b-[2px] ${!darkMode ? 'border-gray-300  hover:text-blue-600' : 'border-gray-700  hover:text-blue-600'}`}
        ></div>
        <p
          className={`cursor-pointer border-b-[2px] pb-2 font-bold ${selectedTab === 'activity' ? (!darkMode ? 'border-blue-600 text-blue-600' : 'border-blue-400 text-blue-400') : !darkMode ? 'border-gray-300  hover:text-blue-600' : 'border-gray-700  hover:text-blue-400'}`}
          onClick={() => handleTabClick('activity')}
        >
          Activity
        </p>

        <div
          className={`flex-grow border-b-[2px] ${!darkMode ? 'border-gray-300  hover:text-blue-600' : 'border-gray-700  hover:text-blue-600'}`}
        ></div>
      </div>
    </header>
  )
}
