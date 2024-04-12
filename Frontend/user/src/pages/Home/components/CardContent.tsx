import { FaRegClock } from 'react-icons/fa'
import { IoIosMore } from 'react-icons/io'
import { MdOutlineRemoveRedEye } from 'react-icons/md'
import { useTheme } from '~/components/Theme/themeContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'

const CardContent = () => {
  const { darkMode, colors } = useTheme()
  // const [isConfirm, setStateCard]= React.useState(false)

  // const handleStateCard = (isShow: boolean) => {
  //   setStateCard(isShow)
  // }
  return (
    <>
      <div
        className='mx-auto mt-5 flex w-[420px] flex-col rounded-lg border-gray-500 shadow-md'
        style={{ backgroundColor: colors.backgroundSecond, color: colors.text }}
      >
        <div
          className='flex h-[110px] justify-center rounded-t-lg'
          style={{
            backgroundSize: '100% 36px, cover',
            backgroundImage:
              'linear-gradient(0deg, rgba(33, 36, 37, 0.7) 50%, rgba(33, 36, 37, 0.7) 0%), url("https://trello-backgrounds.s3.amazonaws.com/SharedBackground/256x144/09b457ee43a8833c515e9d3d5796f59f/photo-1698859858637-9aa64302f629.jpg")'
          }}
        >
          <Link to={'/workspace/123'}>
            <div
              className={`mt-3 h-[70px] w-[404px] cursor-pointer rounded-lg bg-white px-3 py-[10px]   hover:bg-slate-200 ${darkMode ? 'hover:bg-gray-700 dark:bg-[#23262A]' : ''}`}
            >
              <div className='flex items-center justify-between'>
                <h4 className='mb-1 text-[14px]' style={{ color: colors.text }}>
                  test
                </h4>
              </div>

              <div className='flex justify-between'>
                <div className='mb-4 flex items-center text-xs'>
                  <MdOutlineRemoveRedEye size={16} className='ml-1 mr-3' />
                  <div className='flex text-[12px]'>
                    <FaRegClock size={13} className='mr-1 mt-[2px]' /> Mar 24
                  </div>
                </div>
                <div className='mb-4 flex items-center justify-between'>
                  <span className='rounded-full bg-blue-500 px-2 py-1 text-xs font-bold text-white'>N</span>
                </div>
              </div>

              <div className='relative -left-3 -top-0 flex'>
                <label className='text-[12px] font-bold text-white'>Kiểm thử phần mềm:</label>
                <h3 className='ml-[2px] text-[12px] text-white'> To Do</h3>
              </div>
            </div>
          </Link>
        </div>

        <div
          className='flex h-[120px] flex-col items-center rounded-b-lg text-sm '
          style={{ backgroundColor: colors.backgroundSecond }}
        >
          <div className='mb-3 px-4 pt-4'>
            <div className='flex h-[40px] w-[388px] content-between'>
              <div className='mt-1 flex'>
                <FaRegClock fontSize={20} className='mr-[5px]' />
                <span>Due tomorrow at 11:32 PM</span>
              </div>
              <div className='ml-auto mt-1'>
                <IoIosMore />
              </div>
            </div>
          </div>
          <div className='flex'>
            <Link to={'/workspace/123'}>
              <button
                className='mr-1 flex rounded border-[1px] border-solid border-[#384148] px-[60px] py-1 transition-colors duration-200 hover:bg-[#dcdfe439]'
                style={{ paddingBottom: '12px' }}
              >
                <FontAwesomeIcon icon={faCheck} className='mr-1 mt-[5px]' /> Complete
              </button>
            </Link>

            <Link to={'/workspace/123'}>
              <button className='ml-1 flex rounded border-[1px] border-solid border-[#384148] px-[60px] transition-colors duration-200 hover:bg-[#dcdfe439]'>
                <FontAwesomeIcon icon={faXmark} className='mr-1 mt-[5px]' />
                <span className='mt-[2px]'>Dismiss</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
export default CardContent
