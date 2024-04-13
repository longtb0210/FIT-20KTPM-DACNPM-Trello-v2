import React from 'react'
import { useTheme } from '~/components/Theme/themeContext'

interface CardFeatureProps {
  icon: JSX.Element
  title: string
  onClick?: () => void
}

export const CardFeature: React.FC<CardFeatureProps> = ({ icon, title, onClick }) => {
  const { colors, darkMode } = useTheme()
  return (
    <div
      onClick={onClick}
      className={`relative flex cursor-pointer flex-row items-center rounded px-3   py-2 shadow-md   hover:opacity-80`}
      style={{ backgroundColor: darkMode ? '#1d2125' : '#f5f6fa', color: colors.text }}
    >
      {icon}
      <span className='ml-2'>{title}</span>
    </div>
  )
}
