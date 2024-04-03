// components/Header.tsx
import { User } from '@trello-v2/shared/src/schemas/User'
import React, { useEffect, useState } from 'react'

import { RxAvatar } from 'react-icons/rx'
import { useTheme } from '~/components/Theme/themeContext'

interface HeaderProps {
  currentTab: string
  userInfo: User | undefined
  onSelectTab: (selectedTab: string) => void
}

export const Header: React.FC<HeaderProps> = ({ currentTab, userInfo, onSelectTab }) => {
  const { colors, darkMode } = useTheme()
  const [selectedTab, setSelectedTab] = useState<string>('')
  useEffect(() => {
    setSelectedTab(currentTab)
  }, [currentTab])
  const handleTabClick = (tab: string) => {
    setSelectedTab(tab)
    onSelectTab(tab)
  }

  return (
    <header className='left-0 mx-14  py-2'>
      <div className='mt-9 flex max-w-2xl items-center space-x-4'>
        {/* <img

          src={avtPath} // Replace with your avatar image source
          alt='Avatar'
          className=' h-[65px] w-[65px] rounded-full border'
        /> */}
        <RxAvatar size={`70px`} />
        <div>
          <h1 className='text-xl font-bold'>{userInfo?.username ? userInfo.username : 'No Name is set'}</h1>
          <p className='text-sm font-light '>{userInfo?.username ? `@${userInfo.username}` : '@name123'}</p>
        </div>
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
