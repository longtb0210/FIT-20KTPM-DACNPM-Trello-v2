import SidebarTemplate from '../../components/SidebarTemplate'
import CardTemplate from '../Templates/component/CardTemplate'
import { useTheme } from '../../components/Theme/themeContext'

export function Templates() {
  const { darkMode, colors } = useTheme()
  return (
    <div className='pl-20 pt-5 grid grid-cols-4 gap-4' style={{backgroundColor: colors.background}}>
      <div className='sidebar-container'>
        <SidebarTemplate />
      </div>
      <div className='card-container col-span-3 mr-20'>
        <CardTemplate />
      </div>
    </div>
  )
}
