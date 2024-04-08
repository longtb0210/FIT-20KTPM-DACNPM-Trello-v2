// pages/account-management.tsx
import React, { useEffect, useState } from 'react'
import { ActivityComponent, Header, Profile } from './components'
import { useTheme } from '../../components/Theme/themeContext'
import { User } from '@trello-v2/shared/src/schemas/User'
import { UserApiRTQ } from '~/api'

type AccountManagementProps = {
  page: string
}

export const AccountManagement: React.FC<AccountManagementProps> = ({ page }) => {
  const [selectedTab, setSelectedTab] = useState<string>('')
  const [userInfo, setUserInfo] = useState<User>()
  const [getUserInfo, { data: userInfoRes }] = UserApiRTQ.UserApiSlice.useLazyGetUserByEmailQuery()
  const [resetManually, setResetManually] = useState<boolean>()
  const { colors } = useTheme()
  useEffect(() => {
    setUserInfo(userInfoRes?.data)
  }, [userInfoRes])
  useEffect(() => {
    getUserInfo({
      email: 'tuitenteo1212@gmail.com'
    })
  }, [resetManually])
  useEffect(() => {
    setSelectedTab(page)
    console.log(page)
  }, [page])
  const handleTabSelect = (tab: string) => {
    setSelectedTab(tab)
  }
  const darkLightMode = {
    backgroundColor: colors.background,
    color: colors.text
  }
  return (
    <div style={darkLightMode} className='font-sans'>
      <Header userInfo={userInfo} onSelectTab={handleTabSelect} currentTab={selectedTab} />
      {selectedTab === 'profile' ? (
        <>
          <Profile
            userInfo={userInfo}
            handleUpdateProfile={() => {
              setResetManually(!resetManually)
            }}
          />
        </>
      ) : (
        <>
          <ActivityComponent userInfo={userInfo} />
        </>
      )}
    </div>
  )
}
