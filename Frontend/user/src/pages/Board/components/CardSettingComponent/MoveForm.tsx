import React from 'react'
import { BsPencil } from 'react-icons/bs'
import { HiSparkles } from 'react-icons/hi2'
import { IoIosArrowRoundForward, IoMdClose } from 'react-icons/io'
import { useTheme } from '~/components/Theme/themeContext'

interface LabelModalProps {
  closeOpenFeature: () => void
}

const MoveForm: React.FC<LabelModalProps> = ({ closeOpenFeature }) => {
  const { colors, darkMode } = useTheme()
  return (
    <div
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        borderWidth: '1px',
        borderColor: darkMode ? '#2c3e50' : ''
      }}
      className={`absolute left-0 top-full z-10  flex w-[300px] flex-col items-center rounded-lg px-1   py-2  shadow-lg`}
    >
      <div className={`relative w-full`}>
        <div className={`mb-2 flex items-center justify-between p-2`}>
          <div></div>
          <div>
            <p className={`ml-7 font-bold`}>Move</p>
          </div>
          <div className='mr-2 cursor-pointer rounded-lg p-1 hover:bg-gray-100' onClick={() => closeOpenFeature()}>
            <IoMdClose className={``} size={'20px'} />
          </div>
        </div>
      </div>
      <div className={`w-full px-2`}>
        <div>
          <p className={`mb-2 mt-3 flex flex-row items-center text-sm font-normal `}>
            {' '}
            <HiSparkles className={`mr-2`} />
            Suggested Board
          </p>

          <div className={`mb-3 mt-1 space-y-1`}>
            <div
              className={`flex flex-row items-center rounded px-2 py-1 ${
                darkMode ? 'bg-[#282e33] hover:bg-[#333c43]' : 'bg-gray-100 hover:bg-[#dcdfe4]'
              }`}
            >
              <IoIosArrowRoundForward className={`mr-2`} size={`30px`} />
              CardList Name
            </div>
          </div>
        </div>
        <div>
          <p className={`mb-2 mt-3 flex flex-row items-center text-sm font-normal `}>Select destination</p>

          <div className={`mb-3  mt-1 space-y-1`}>
            <div
              className={`flex cursor-pointer flex-col  justify-center rounded px-2 py-1 ${
                darkMode ? 'bg-[#282e33] hover:bg-[#333c43]' : 'bg-gray-100 hover:bg-[#dcdfe4]'
              }`}
            >
              <p className={`text-sm font-normal`}>Board</p>
              <p className='font-semibold'>My Board</p>
            </div>
          </div>
          <div className={`mb-3 mt-1 flex flex-row space-x-1 `}>
            <div
              className={`flex h-auto w-9/12 cursor-pointer flex-col justify-center rounded px-2 py-1 ${
                darkMode ? 'bg-[#282e33] hover:bg-[#333c43]' : 'bg-gray-100 hover:bg-[#dcdfe4]'
              }`}
            >
              <p className={`text-sm font-normal`}>List</p>
              <p className='font-semibold'>Done</p>
            </div>
            <div
              className={`flex h-auto cursor-pointer flex-col justify-center rounded px-2 py-1 ${
                darkMode ? 'bg-[#282e33] hover:bg-[#333c43]' : 'bg-gray-100 hover:bg-[#dcdfe4]'
              }`}
            >
              <p className={`text-sm font-normal`}>Position</p>
              <p className='font-semibold'>1</p>
            </div>
          </div>
          <button
            style={{
              color: darkMode ? 'black' : 'white',
              zIndex: 10
            }}
            className={`${darkMode ? 'bg-[#579dff] hover:bg-[bg-[#7bb0f9]]' : 'bg-[#0c66e4] hover:bg-[#0e5bc7]'}  mt-1 w-fit rounded-md px-6 py-2`}
            onClick={() => {
              alert('move')
            }}
          >
            Move
          </button>
        </div>
        <div className='my-2 flex justify-center'>
          <hr className={`h-[1px] w-full border-0 ${darkMode ? 'bg-gray-500' : 'bg-gray-300'}`}></hr>
        </div>
      </div>
    </div>
  )
}

export default MoveForm
